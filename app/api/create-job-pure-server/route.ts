import { NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';
import { postJobToTelegram, TelegramJobPost } from '@/lib/telegram-bot';
import { generateSlug } from '@/lib/supabase-helpers';

export async function POST(request: Request) {
  try {
    const jobData = await request.json();
    
    console.log('🚀 Pure server-side job creation:', jobData.title);
    
    // Step 1: Generate slug
    const slug = generateSlug(jobData.title);
    console.log('📝 Generated slug:', slug);
    
    // Step 2: Insert into database
    const { error } = await supabase
      .from("jobs")
      .insert([{ ...jobData, slug }]);

    if (error) {
      console.error('❌ Database insertion error:', error);
      throw error;
    }
    
    console.log('✅ Job created successfully!');
    
    // Step 3: Post to Telegram (server-side has access to env vars)
    console.log('📤 Posting job to Telegram channel...');
    console.log('🔍 Telegram environment check:', {
      hasToken: !!process.env.TELEGRAM_BOT_TOKEN,
      hasChannel: !!process.env.TELEGRAM_CHANNEL_ID,
      tokenLength: process.env.TELEGRAM_BOT_TOKEN?.length,
      channel: process.env.TELEGRAM_CHANNEL_ID
    });
    
    // Get company and category names for Telegram post
    let companyName = undefined;
    let companyLogo = undefined;
    let categoryName = undefined;
    
    // Try to fetch company name and logo if company_id exists
    if (jobData.company_id) {
      try {
        const { data: company } = await supabase
          .from("companies")
          .select("name, logo_url, logo")
          .eq("id", jobData.company_id)
          .single();
        if (company) {
          companyName = company.name;
          companyLogo = company.logo_url || company.logo;
        }
      } catch (err) {
        console.warn('Could not fetch company data for Telegram post:', err);
      }
    }
    
    // Try to fetch category name if category_id exists
    if (jobData.category_id) {
      try {
        const { data: category } = await supabase
          .from("categories")
          .select("name")
          .eq("id", jobData.category_id)
          .single();
        if (category) {
          categoryName = category.name;
        }
      } catch (err) {
        console.warn('Could not fetch category name for Telegram post:', err);
      }
    }
    
    // Use enhanced Telegram bot function with Ethiopian Airlines format
    const telegramPostData: TelegramJobPost = {
      title: jobData.title,
      company_name: companyName || "Unknown Company",
      company_logo: companyLogo || undefined,
      location: jobData.location || 'Addis Ababa',
      job_type: jobData.job_type || 'Full-time',
      category_name: categoryName || 'General',
      application_link: jobData.application_link,
      deadline: jobData.deadline,
      slug: slug
    };
    
    console.log('📤 Enhanced Telegram post data:', telegramPostData);
    
    // Send to Telegram with enhanced formatting
    const telegramResult = await postJobToTelegram(telegramPostData);
    
    if (telegramResult) {
      console.log('✅ Telegram post successful!');
    } else {
      console.log('⚠️ Telegram post failed - but job was created successfully');
    }
    
    return NextResponse.json({
      success: true,
      message: 'Job created and posted to Telegram successfully',
      job: {
        id: 'created-' + Date.now(),
        title: jobData.title,
        slug,
        telegramPosted: telegramResult
      }
    });
    
  } catch (error: any) {
    console.error('❌ Pure server-side job creation error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
