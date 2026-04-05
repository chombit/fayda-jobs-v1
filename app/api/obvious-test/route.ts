import { NextResponse } from 'next/server';
import { postJobToTelegram } from '@/lib/telegram-bot';

export async function POST() {
  try {
    // Create a more obvious test job
    const obviousTestJob = {
      title: "🧪 LOCAL TEST - " + new Date().toLocaleTimeString(),
      company_name: "Local Test Company",
      location: "Addis Ababa, Ethiopia",
      job_type: "Full-time",
      category_name: "Testing",
      application_link: "http://localhost:3000",
      slug: "local-test-" + Date.now()
    };
    
    console.log('🧪 Sending obvious test job to Telegram:', obviousTestJob);
    
    const result = await postJobToTelegram(obviousTestJob);
    
    return NextResponse.json({
      success: true,
      message: 'Obvious test job sent to Telegram',
      result,
      jobData: obviousTestJob,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Obvious test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
