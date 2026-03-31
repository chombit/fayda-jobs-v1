import { NextRequest, NextResponse } from 'next/server';
import { postJobToTelegram } from '@/lib/telegram-bot';

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
    
    // Test posting a job
    const testJob = {
      title: "API Test Job",
      company_name: "Test Company",
      location: "Addis Ababa",
      job_type: "Full-time",
      category_name: "IT Jobs",
      application_link: "https://fayda-jobs-v1.vercel.app/jobs/test",
      slug: "api-test-job"
    };
    
    const result = await postJobToTelegram(testJob);
    
    return NextResponse.json({
      success: true,
      message: 'Telegram API test completed',
      envVars,
      telegramResult: result,
      jobData: testJob
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
