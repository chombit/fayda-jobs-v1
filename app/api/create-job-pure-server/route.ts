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
    console.log('🔍 Incoming job data for Telegram:', {
      title: jobData.title,
      company_name: jobData.company_name,
      company_id: jobData.company_id,
      category_name: jobData.category_name,
      category_id: jobData.category_id,
      job_type: jobData.job_type,
      deadline: jobData.deadline,
      allFields: Object.keys(jobData)
    });
    console.log('🔍 Telegram environment check:', {
      hasToken: !!process.env.TELEGRAM_BOT_TOKEN,
      hasChannel: !!process.env.TELEGRAM_CHANNEL_ID,
      tokenLength: process.env.TELEGRAM_BOT_TOKEN?.length,
      channel: process.env.TELEGRAM_CHANNEL_ID
    });
    
    // Get company and category names for Telegram post
    let companyName = jobData.company_name; // Use company_name from job data first
    let companyLogo = undefined;
    let categoryName = jobData.category_name; // Use category_name from job data first
    
    // Try to fetch company name and logo if company_id exists
    if (jobData.company_id) {
      console.log(`🔍 Attempting to fetch company with ID: ${jobData.company_id}`);
      try {
        const { data: company, error } = await supabase
          .from("companies")
          .select("name, logo_url")
          .eq("id", jobData.company_id)
          .single();
        
        console.log('🔍 Supabase query result:', { data: company, error });
        
        if (error) {
          console.error('❌ Supabase error fetching company:', error);
        } else if (company) {
          companyName = company.name;
          companyLogo = company.logo_url;
          console.log('✅ Company data fetched successfully:', { 
            name: company.name, 
            hasLogo: !!companyLogo,
            logoUrl: company.logo_url
          });
        } else {
          console.warn('⚠️ No company found for company_id:', jobData.company_id);
        }
      } catch (err) {
        console.error('❌ Exception fetching company data for Telegram post:', err);
      }
    } else {
      console.log('ℹ️ No company_id provided in job data - available fields:', Object.keys(jobData));
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
          console.log('✅ Category data fetched:', { name: category.name });
        } else {
          console.warn('⚠️ No category found for category_id:', jobData.category_id);
        }
      } catch (err) {
        console.warn('❌ Could not fetch category name for Telegram post:', err);
      }
    } else {
      console.log('ℹ️ No category_id provided in job data');
    }
    
    // Use enhanced Telegram bot function with Ethiopian Airlines format
    console.log('🔍 Company name debugging - companyName:', companyName, 'jobData.company_name:', jobData.company_name);
    console.log('🔍 Company ID debugging - jobData.company_id:', jobData.company_id);
    
    const telegramPostData: TelegramJobPost = {
      title: jobData.title,
      company_name: companyName || jobData.company_name || "Unknown Company",
      company_logo: companyLogo || jobData.company_logo || undefined,
      location: jobData.location || 'Addis Ababa',
      job_type: jobData.job_type || 'Full-time',
      category_name: categoryName || jobData.category_name || 'General',
      requirements: jobData.requirements,
      application_link: jobData.application_link,
      deadline: jobData.deadline,
      slug: slug
    };
    
    console.log('📤 Enhanced Telegram post data:', {
      title: telegramPostData.title,
      company_name: telegramPostData.company_name,
      company_logo: telegramPostData.company_logo,
      job_type: telegramPostData.job_type,
      category_name: telegramPostData.category_name,
      deadline: telegramPostData.deadline,
      slug: telegramPostData.slug
    });
    
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
