// Telegram Bot Integration for Automatic Job Postings

export interface TelegramJobPost {
  title: string;
  company_name?: string;
  company_logo?: string;
  location: string;
  job_type: string;
  category_name?: string;
  requirements?: string;
  application_link?: string;
  deadline?: string;
  slug: string;
}

interface TelegramConfig {
  botToken: string;
  channelId: string;
}

const TELEGRAM_CONFIG: TelegramConfig = {
  // Prevent access to environment variables in browser
  botToken: typeof window === 'undefined' ? process.env.TELEGRAM_BOT_TOKEN || '' : '',
  channelId: typeof window === 'undefined' ? process.env.TELEGRAM_CHANNEL_ID || '' : '',
};

// Debug environment variables - more detailed for Vercel
if (typeof window === 'undefined') {
  console.log('🔍 Telegram Bot Config (Runtime):', {
    hasBotToken: !!process.env.TELEGRAM_BOT_TOKEN,
    hasChannelId: !!process.env.TELEGRAM_CHANNEL_ID,
    botTokenLength: process.env.TELEGRAM_BOT_TOKEN?.length,
    channelId: process.env.TELEGRAM_CHANNEL_ID,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('TELEGRAM') || key.includes('NEXT_PUBLIC'))
  });
}

// Strip HTML tags from text for Telegram display
function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

// Format job posting for Telegram with Fayda Jobs branding
export function formatJobPostForTelegram(job: TelegramJobPost): string {
  const jobUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://faydajobs.com'}/jobs/${job.slug}`;
  
  // Create engaging message with icons and better formatting
  let message = `                           🚨 *NEW JOB OPPORTUNITY* 🚨                                         \n\n`;
  
  // Company information first (above title)
  if (job.company_name) {
    message += `📋 *Company : ${job.company_name}*\n`;
  }
  
  message += `💼 *Position : ${job.title}*\n`;
  
  if (job.requirements) {
    message += `📂 *Requirement : ${stripHtml(job.requirements)}*\n`;
  }
  
  if (job.deadline) {
    message += `📅 *Deadline : ${job.deadline}*\n`;
  }
  
  message += `\n\n*👇 Apply Now* 👇\n\n`;
  message += `▪️ *Find More Details here*\n`;
  message += `*🗝️ ${jobUrl}*\n\n`;
  message += `📱 *More jobs: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://faydajobs.com'}/*\n`;
  message += `🌐 *Join @faydajobs for more opportunities!*`;
  
  return message;
}

// Send job posting to Telegram channel
export async function postJobToTelegram(job: TelegramJobPost): Promise<boolean> {
  // Prevent execution in browser environment
  if (typeof window !== 'undefined') {
    console.warn('🚫 Telegram posting blocked in browser environment');
    return false;
  }

  // Check configuration
  if (!TELEGRAM_CONFIG.botToken || !TELEGRAM_CONFIG.channelId) {
    console.warn('⚠️ Telegram bot not configured');
    return false;
  }

  try {
    const message = formatJobPostForTelegram(job);
    const jobUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://faydajobs.com'}/jobs/${job.slug}`;
    
    console.log('📤 Posting to Telegram:', {
      title: job.title,
      slug: job.slug,
      channel: TELEGRAM_CONFIG.channelId,
      url: jobUrl
    });
    
    // If company logo exists, send as photo with caption
    if (job.company_logo) {
      return await sendPhotoWithLogo(job, message);
    } else {
      // No company logo, send text message
      return await sendTextMessage(message);
    }
    
  } catch (error) {
    console.error('❌ Error posting job to Telegram:', error);
    return false;
  }
}

// Helper function to send photo with company logo
async function sendPhotoWithLogo(job: TelegramJobPost, message: string): Promise<boolean> {
  const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendPhoto`;
  
  const payload = {
    chat_id: TELEGRAM_CONFIG.channelId,
    photo: job.company_logo,
    caption: message,
    parse_mode: 'Markdown'
  };
  
  console.log('📸 Sending Telegram photo with company logo:', JSON.stringify(payload, null, 2));
  
  const response = await fetch(telegramApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });
  
  const result = await response.json();
  console.log('📊 Telegram photo response:', result);
  
  if (result.ok) {
    console.log('✅ Telegram photo post successful!');
    return true;
  } else {
    console.error('❌ Telegram photo post failed:', result.description);
    // Fallback to text message if photo fails
    return await sendTextMessage(message);
  }
}

// Helper function to send text message
async function sendTextMessage(message: string): Promise<boolean> {
  const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
  
  const payload = {
    chat_id: TELEGRAM_CONFIG.channelId,
    text: message,
    parse_mode: 'Markdown',
    disable_web_page_preview: true // Disable Fayda Jobs preview
  };

  console.log('📝 Sending Telegram text message:', JSON.stringify(payload, null, 2));

  const response = await fetch(telegramApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  console.log('📊 Telegram text response:', result);
  
  if (result.ok) {
    console.log('✅ Telegram text post successful!');
    return true;
  } else {
    console.error('❌ Telegram text post failed:', result.description);
    return false;
  }
}

// Test Telegram bot connection
export async function testTelegramConnection(): Promise<boolean> {
  try {
    if (!TELEGRAM_CONFIG.botToken || !TELEGRAM_CONFIG.channelId) {
      console.warn('⚠️ Telegram bot not configured');
      return false;
    }

    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/getMe`;
    
    const response = await fetch(telegramApiUrl);
    const result = await response.json();
    
    if (result.ok) {
      console.log('✅ Telegram bot connection successful:', result.result.username);
      return true;
    } else {
      console.error('❌ Telegram bot connection failed:', result.description);
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing Telegram connection:', error);
    return false;
  }
}

// Create a test job post for debugging
export async function sendTestJobPost(): Promise<boolean> {
  const testJob: TelegramJobPost = {
    title: "Senior Software Engineer",
    company_name: "Tech Company Ethiopia",
    location: "Addis Ababa",
    job_type: "Full-time",
    category_name: "IT Jobs",
    application_link: "https://example.com/apply",
    slug: "senior-software-engineer-test"
  };

  return await postJobToTelegram(testJob);
}
