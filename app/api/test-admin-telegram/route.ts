import { NextResponse } from 'next/server';
import { postJobToTelegram } from '@/lib/telegram-bot';

export async function POST() {
  try {
    console.log('🧪 Testing Telegram posting with exact admin interface format...');
    
    // Simulate the exact data that would be sent from admin interface
    const adminJobData = {
      title: "🧪 Admin Interface Test Job - " + new Date().toLocaleTimeString(),
      company_name: undefined, // No company selected
      location: "Addis Ababa, Ethiopia", 
      job_type: "Full-time",
      category_name: undefined, // No category selected
      application_link: "http://localhost:3000",
      slug: "admin-test-" + Date.now()
    };
    
    console.log('📤 Sending admin-format job to Telegram:', adminJobData);
    
    // Direct Telegram test (same as createJob function does)
    const telegramResult = await postJobToTelegram(adminJobData);
    
    console.log('📊 Telegram posting result:', telegramResult);
    
    return NextResponse.json({
      success: true,
      message: 'Admin format Telegram test completed',
      telegramResult,
      jobData: adminJobData,
      timestamp: new Date().toISOString(),
      note: 'Check Telegram channel @faydajobs for this post'
    });
    
  } catch (error: any) {
    console.error('❌ Admin format Telegram test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
