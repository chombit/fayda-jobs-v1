// Test Supabase Project Connection
// Run this in browser console

const testSupabase = async () => {
  const url = 'https://rqxrfjauifzgyekrmwrz.supabase.co';
  const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxeHJmamF1aWZ6Z3lla3Jtd3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQwMjUwNjQsImV4cCI6MjA4ODU0OTA3NH0.sHnTZj44GSxoXsIXkzcgmc0rnC4t3V_LgufRW6w_x5Y';
  
  try {
    // Test basic connection
    const response = await fetch(`${url}/rest/v1/`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Supabase Status:', response.status);
    
    if (response.status === 401) {
      console.error('❌ API Key Invalid - Get fresh key from Supabase dashboard');
    } else if (response.status === 200) {
      console.log('✅ Project exists, but API key might be expired');
    } else {
      console.log('🔍 Unexpected status:', response.status);
    }
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
};

testSupabase();
