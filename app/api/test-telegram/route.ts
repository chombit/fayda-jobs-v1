import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing Telegram API route...');
    
    // Test environment variables
    const envVars = {
      TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN ? 'SET' : 'MISSING',
      TELEGRAM_CHANNEL_ID: process.env.TELEGRAM_CHANNEL_ID ? 'SET' : 'MISSING',
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'MISSING',
      NODE_ENV: process.env.NODE_ENV
    };
    
    console.log('📊 Environment variables in API route:', envVars);
    
    // Test posting a job using simple text format (same as working pure server API)
    const testJob = {
      title: "API Test Job",
      company_name: "Test Company",
      location: "Addis Ababa",
      job_type: "Full-time",
      category_name: "IT Jobs",
      application_link: "https://fayda-jobs-v1.vercel.app/jobs/test",
      slug: "api-test-job"
    };
    
    // Create simple text message (no Markdown formatting)
    const jobUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/jobs/${testJob.slug}`;
    
    let message = `🔥 NEW JOB OPPORTUNITY\n\n`;
    message += `📋 ${testJob.title}\n`;
    
    if (testJob.company_name) {
      message += `🏢 ${testJob.company_name}\n`;
    }
    
    message += `📍 ${testJob.location}\n`;
    message += `💼 ${testJob.job_type}\n`;
    
    if (testJob.category_name) {
      message += `📂 ${testJob.category_name}\n`;
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
    
    console.log('📤 Sending test message to Telegram:', payload);
    
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
    
    return NextResponse.json({
      success: true,
      message: 'Telegram API test completed',
      envVars,
      telegramResult,
      jobData: testJob,
      telegramResponse: result
    });
    
  } catch (error: any) {
    console.error('❌ Telegram API test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      envVars: {
        TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN ? 'SET' : 'MISSING',
        TELEGRAM_CHANNEL_ID: process.env.TELEGRAM_CHANNEL_ID ? 'SET' : 'MISSING',
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'MISSING',
      }
    }, { status: 500 });
  }
}
