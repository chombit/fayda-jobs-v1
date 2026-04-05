import { NextResponse } from 'next/server';
import { createJob } from '@/lib/supabase-helpers';

export async function POST(request: Request) {
  try {
    const jobData = await request.json();
    
    console.log('🚀 Server-side job creation:', jobData.title);
    
    // This will create the job AND post to Telegram (server-side has access to env vars)
    const result = await createJob(jobData);
    
    return NextResponse.json({
      success: true,
      message: 'Job created and posted to Telegram successfully',
      job: result
    });
    
  } catch (error: any) {
    console.error('❌ Server-side job creation error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
