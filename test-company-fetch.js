// Test script to check company fetching from database
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://your-project.supabase.co'; // Replace with your actual URL
const supabaseKey = 'your-anon-key'; // Replace with your actual anon key

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCompanyFetch() {
  console.log('🔍 Testing company fetch from database...');
  
  try {
    // First, let's see what companies exist
    const { data: companies, error } = await supabase
      .from('companies')
      .select('id, name, logo_url, logo')
      .limit(10);
    
    if (error) {
      console.error('❌ Error fetching companies:', error);
      return;
    }
    
    console.log('✅ Companies found:', companies);
    
    // Test fetching a specific company by ID
    if (companies && companies.length > 0) {
      const firstCompany = companies[0];
      console.log(`🔍 Testing fetch for company ID: ${firstCompany.id}`);
      
      const { data: company, error: fetchError } = await supabase
        .from('companies')
        .select('name, logo_url, logo')
        .eq('id', firstCompany.id)
        .single();
      
      if (fetchError) {
        console.error('❌ Error fetching specific company:', fetchError);
      } else {
        console.log('✅ Specific company fetched:', company);
      }
    }
    
  } catch (err) {
    console.error('❌ Database connection error:', err);
  }
}

testCompanyFetch();
