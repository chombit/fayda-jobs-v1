import { NextResponse } from 'next/server';
import { createJob } from '@/lib/supabase-helpers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Create a test job with the same structure as the admin interface
    const testJob = {
      title: "🧪 Admin Interface Test - " + new Date().toLocaleTimeString(),
      description: "This is a test job created to debug Telegram auto-posting from admin interface",
      requirements: "Test requirements",
      responsibilities: "Test responsibilities", 
      location: "Addis Ababa, Ethiopia",
      job_type: "Full-time",
      application_link: "http://localhost:3000",
      company_id: null, // Try without company first
      category_id: null, // Try without category first
      featured: false,
      deadline: null
    };
    
    console.log('🧪 Starting admin interface simulation...');
    console.log('📋 Test job data:', testJob);
    
    // This will trigger the same Telegram posting logic as admin interface
    const result = await createJob(testJob);
    
    return NextResponse.json({
      success: true,
      message: 'Admin interface simulation completed',
      jobResult: result,
      timestamp: new Date().toISOString(),
      note: 'Check server console for Telegram posting logs'
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
