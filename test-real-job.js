// Test real job creation through main API
const http = require('http');

const realJobData = {
  title: "Senior Software Developer " + Date.now(),
  company_id: null, // No specific company - will use fallback
  location: "Addis Ababa, Ethiopia",
  job_type: "Full-time",
  category_id: null, // No specific category - will use fallback
  description: "Develop and maintain web applications using modern technologies",
  application_link: "https://faydajobs.com/apply"
};

const postData = JSON.stringify(realJobData);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/create-job-pure-server',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Testing REAL job creation with Ethiopian Airlines format...');
console.log('Real job data:', realJobData);
console.log('Sending to:', `http://localhost:3000/api/create-job-pure-server`);

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response Body:', data);
    console.log('='.repeat(50));
    
    if (res.statusCode === 200) {
      console.log('REAL JOB TEST RESULT: SUCCESS');
      console.log('Check your @faydajobs Telegram channel for Ethiopian Airlines format post!');
    } else {
      console.log('REAL JOB TEST RESULT: FAILED');
      console.log('Status code:', res.statusCode);
    }
  });
});

req.on('error', (error) => {
  console.error('Request Error:', error);
  console.log('REAL JOB TEST RESULT: FAILED - Network Error');
});

req.write(postData);
req.end();

console.log('Request sent. Waiting for response...');
