// Test Supabase Connection
// Run this in browser console on your site

const supabaseUrl = 'https://rqxrfjauifzgyekrmwrz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxeHJmamF1aWZ6Z3lla3Jtd3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQwMjUwNjQsImV4cCI6MjA4ODU0OTA3NH0.sHnTZj44GSxoXsIXkzcgmc0rnC4t3V_LgufRW6w_x5Y';

// Test basic connection
fetch(`${supabaseUrl}/rest/v1/`, {
  headers: {
    'apikey': supabaseKey,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  console.log('Supabase Connection Test:', data);
})
.catch(error => {
  console.error('Supabase Connection Error:', error);
});

// Test categories table
fetch(`${supabaseUrl}/rest/v1/categories?select=*`, {
  headers: {
    'apikey': supabaseKey,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  console.log('Categories Data:', data);
})
.catch(error => {
  console.error('Categories Error:', error);
});
