import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simulate the exact same process as createJob function
    console.log('🧪 Simulating admin interface job creation flow...');
    
    // Step 1: Generate slug (same as createJob)
    const title = body.title || "Test Job from Admin " + new Date().toLocaleTimeString();
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    console.log('📝 Generated slug:', slug);
    
    // Step 2: Prepare Telegram data (same as createJob function)
    const telegramJobData = {
      title: title,
      company_name: body.company_name || undefined,
      location: body.location || 'Addis Ababa',
      job_type: body.job_type || 'Full-time',
      category_name: body.category_name || undefined,
      application_link: body.application_link || undefined,
      slug: slug
    };
    
    console.log('📤 Prepared Telegram data:', telegramJobData);
    
    // Step 3: Post to Telegram (same as createJob function)
    const { postJobToTelegram } = await import('@/lib/telegram-bot');
    const telegramStart = performance.now();
    
    const telegramResult = await postJobToTelegram(telegramJobData);
    
    const telegramTime = performance.now() - telegramStart;
    
    if (telegramResult) {
      console.log(`✅ Telegram post successful (${telegramTime.toFixed(2)}ms)`);
    } else {
      console.log(`⚠️ Telegram post failed (${telegramTime.toFixed(2)}ms)`);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Admin interface flow simulation completed',
      telegramResult,
      telegramTime: `${telegramTime.toFixed(2)}ms`,
      jobData: telegramJobData,
      timestamp: new Date().toISOString(),
      note: 'This simulates the exact Telegram posting from admin interface'
    });
    
  } catch (error: any) {
    console.error('❌ Admin interface simulation error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
