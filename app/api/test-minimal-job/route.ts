import { NextResponse } from 'next/server';
import { createJob } from '@/lib/supabase-helpers';

export async function POST() {
  try {
    console.log('🧪 Testing minimal job creation...');
    
    // Try with minimal required fields first
    const minimalJob = {
      title: "Minimal Test Job " + Date.now(),
      description: "Test description",
      requirements: "Test requirements", 
      responsibilities: "Test responsibilities",
      location: "Addis Ababa"
    };
    
    console.log('📋 Creating minimal job:', minimalJob);
    
    const result = await createJob(minimalJob);
    
    return NextResponse.json({
      success: true,
      message: 'Minimal job creation successful',
      result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Minimal job creation error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
