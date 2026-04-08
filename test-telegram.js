// Simple test for Telegram bot functionality
const { postJobToTelegram } = require('./src/lib/telegram-bot.ts');

async function testTelegram() {
  console.log('Testing Telegram bot...');
  
  const testData = {
    title: 'Test Job - ' + new Date().toISOString(),
    company_name: 'Test Company',
    location: 'Addis Ababa',
    job_type: 'Full-time',
    category_name: 'Technology',
    application_link: 'https://faydajobs.com',
    slug: 'test-job-' + Date.now()
  };
  
  try {
    const result = await postJobToTelegram(testData);
    console.log('Telegram test result:', result);
  } catch (error) {
    console.error('Telegram test error:', error);
  }
}

testTelegram();
