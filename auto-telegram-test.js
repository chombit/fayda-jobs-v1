// Auto test Telegram posting by calling the API endpoint
const http = require('http');

const testData = {
  title: "AUTO TEST - Fayda Jobs Enhanced Posting - " + new Date().toISOString(),
  company_name: "Test Company",
  location: "Addis Ababa, Ethiopia",
  job_type: "Full-time",
  category_name: "Technology",
  application_link: "https://faydajobs.com",
  slug: "auto-test-" + Date.now()
};

const postData = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/test-admin-telegram',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Testing automatic Telegram posting...');
console.log('Test data:', testData);
console.log('Sending request to:', `http://localhost:3000/api/test-admin-telegram`);

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log('Response Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response Body:', data);
    console.log('='.repeat(50));
    
    if (res.statusCode === 200) {
      console.log('AUTO TEST RESULT: SUCCESS');
      console.log('Check your @faydajobs Telegram channel for the post!');
    } else {
      console.log('AUTO TEST RESULT: FAILED');
      console.log('Status code:', res.statusCode);
    }
  });
});

req.on('error', (error) => {
  console.error('Request Error:', error);
  console.log('AUTO TEST RESULT: FAILED - Network Error');
});

req.write(postData);
req.end();

console.log('Request sent. Waiting for response...');
