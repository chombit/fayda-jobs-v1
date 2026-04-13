import { NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';

export async function POST() {
  try {
    console.log('🔧 Adding how_to_apply field to jobs table...');
    
    // Try to add the column using raw SQL
    const { error } = await supabase
      .from('jobs')
      .select('how_to_apply')
      .limit(1);
    
    if (error && error.message.includes('column "how_to_apply" does not exist')) {
      // Field doesn't exist, we need to add it
      console.log('❌ Field does not exist. Please add it manually via Supabase dashboard.');
      console.log('📝 SQL to run: ALTER TABLE jobs ADD COLUMN how_to_apply text NULL;');
      
      return NextResponse.json({
        success: false,
        error: 'Field does not exist. Please run SQL manually.',
        sql: 'ALTER TABLE jobs ADD COLUMN how_to_apply text NULL;'
      }, { status: 400 });
    } else if (!error) {
      console.log('✅ how_to_apply field already exists!');
      return NextResponse.json({
        success: true,
        message: 'how_to_apply field already exists!'
      });
    } else {
      console.error('❌ Unexpected error:', error);
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Error checking field:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
