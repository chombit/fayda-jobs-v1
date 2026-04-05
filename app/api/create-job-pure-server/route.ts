import { NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';
import { postJobToTelegram } from '@/lib/telegram-bot';
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
    let companyName = jobData.company_id ? 'Unknown Company' : undefined;
    let categoryName = jobData.category_id ? 'General' : undefined;
    
    // Try to fetch company name if company_id exists
    if (jobData.company_id) {
      try {
        const { data: company } = await supabase
          .from("companies")
          .select("name")
          .eq("id", jobData.company_id)
          .single();
        if (company) {
          companyName = company.name;
        }
      } catch (err) {
        console.warn('Could not fetch company name for Telegram post:', err);
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
    
    // Create simple text message (no Markdown formatting to avoid issues)
    const jobUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/jobs/${slug}`;
    
    let message = `🔥 NEW JOB OPPORTUNITY\n\n`;
    message += `📋 ${jobData.title}\n`;
    
    if (companyName) {
      message += `🏢 ${companyName}\n`;
    }
    
    message += `📍 ${jobData.location || 'Addis Ababa'}\n`;
    message += `💼 ${jobData.job_type || 'Full-time'}\n`;
    
    if (categoryName) {
      message += `📂 ${categoryName}\n`;
    }
    
    message += `\n👇 Apply Now 👇\n\n`;
    message += `🔗 ${jobUrl}\n\n`;
    message += `📱 More jobs: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}\n`;
    message += `🌐 Join @faydajobs for more opportunities!`;
    
    const telegramApiUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const payload = {
      chat_id: process.env.TELEGRAM_CHANNEL_ID,
      text: message
      // Using simple text format instead of Markdown to avoid parsing issues
    };
    
    console.log('📤 Sending Telegram payload:', payload);
    
    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    
    console.log('📊 Telegram API response:', result);
    
    const telegramResult = result.ok;
    
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
