// Simple test to debug Telegram posting
const testUrl = 'http://localhost:3000/api/test-admin-telegram';

fetch(testUrl)
  .then(response => response.json())
  .then(data => {
    console.log('Full response:', JSON.stringify(data, null, 2));
  })
  .catch(error => {
    console.error('Error:', error);
  });
