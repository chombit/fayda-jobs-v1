const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // You'll need this for admin operations

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Service Role Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addHowToApplyField() {
  try {
    console.log('Adding how_to_apply field to jobs table...');
    
    // Execute the SQL directly
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE jobs ADD COLUMN IF NOT EXISTS how_to_apply text NULL;'
    });
    
    if (error) {
      console.error('Error adding field:', error);
      
      // Try alternative approach using raw SQL
      console.log('Trying alternative approach...');
      const { error: altError } = await supabase
        .from('jobs')
        .select('how_to_apply')
        .limit(1);
      
      if (altError && altError.message.includes('column "how_to_apply" does not exist')) {
        console.log('Field does not exist. Please add it manually via Supabase dashboard.');
        console.log('SQL to run: ALTER TABLE jobs ADD COLUMN how_to_apply text NULL;');
      } else if (!altError) {
        console.log('✅ how_to_apply field already exists!');
      } else {
        console.error('Alternative approach failed:', altError);
      }
    } else {
      console.log('✅ how_to_apply field added successfully!');
    }
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

addHowToApplyField();
