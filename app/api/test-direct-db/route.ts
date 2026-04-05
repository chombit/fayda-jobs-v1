import { NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';

export async function POST() {
  try {
    console.log('🧪 Testing direct Supabase insertion...');
    
    // Test the exact same insertion that createJob does
    const testJob = {
      title: "Direct DB Test " + Date.now(),
      description: "Test description",
      requirements: "Test requirements",
      responsibilities: "Test responsibilities",
      location: "Addis Ababa",
      slug: "direct-db-test-" + Date.now()
    };
    
    console.log('📋 Job data for insertion:', testJob);
    
    // Direct Supabase insertion (same as createJob function)
    const { data, error } = await supabase
      .from("jobs")
      .insert([testJob])
      .select();
    
    console.log('📊 Database insertion result:', { data, error });
    
    if (error) {
      console.error('❌ Database insertion error:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error,
        code: error.code,
        hint: error.hint
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Direct database insertion successful',
      data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Direct database test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
