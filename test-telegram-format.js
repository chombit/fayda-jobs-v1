// Test the Telegram message format without network calls
const { formatJobPostForTelegram } = require('./src/lib/telegram-bot.ts');

// Test data
const testJob = {
  title: "Senior Software Developer",
  company_name: "Tech Company Ethiopia",
  location: "Addis Ababa",
  job_type: "Full-time",
  category_name: "Technology",
  application_link: "https://faydajobs.com/apply",
  slug: "senior-software-developer"
};

console.log('Testing Telegram message format...');
console.log('='.repeat(50));

try {
  const message = formatJobPostForTelegram(testJob);
  console.log('Generated message:');
  console.log(message);
  console.log('='.repeat(50));
  console.log('Message format test: SUCCESS');
} catch (error) {
  console.error('Error generating message:', error);
  console.log('Message format test: FAILED');
}
