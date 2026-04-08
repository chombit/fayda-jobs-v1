import { NextResponse } from 'next/server';
import { postJobToTelegram } from '@/lib/telegram-bot';

export async function POST() {
  try {
    console.log('🧪 Testing Telegram posting with exact admin interface format...');
    
    // Simulate exact data that would be sent from admin interface
    const adminJobData = {
      title: "Customer Service Officer",
      company_name: "Ethiopian Airlines", 
      location: "Bole International Airport, Addis Ababa", 
      job_type: "Full-time",
      category_name: "Aviation",
      application_link: "http://localhost:3000",
      slug: "customer-service-officer-" + Date.now()
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
