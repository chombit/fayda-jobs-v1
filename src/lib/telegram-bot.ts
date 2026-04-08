// Telegram Bot Integration for Automatic Job Postings

export interface TelegramJobPost {
  title: string;
  company_name?: string;
  company_logo?: string;
  location: string;
  job_type: string;
  category_name?: string;
  application_link?: string;
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

// Format job posting for Telegram with Fayda Jobs branding
export function formatJobPostForTelegram(job: TelegramJobPost): string {
  const jobUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://faydajobs.com'}/jobs/${job.slug}`;
  
  // Create engaging message with icons and better formatting
  let message = `                           \ud83d\udea8 NEW JOB OPPORTUNITY \ud83d\udea8                                         \n\n`;
  
  // Company information first (above title)
  if (job.company_name) {
    message += `\ud83d\udccb ${job.company_name}\n`;
  }
  
  message += `\ud83d\udcbc ${job.title}\n`;
  message += `\ud83d\udccd ${job.location}\n`;
  message += `\ud83d\udcbc ${job.job_type}\n`;
  
  if (job.category_name) {
    message += `\ud83d\udcc2 ${job.category_name}\n`;
  }
  
  message += `\n\n\ud83d\udc47 Apply Now \ud83d\udc47\n\n`;
  message += `\ud83d\udd17 ${jobUrl}\n\n`;
  message += `\ud83d\udcf1 More jobs: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://faydajobs.com'}/\n`;
  message += `\ud83c\udf10 Join @faydajobs for more opportunities!`;
  
  return message;
}

// Send job posting to Telegram channel
export async function postJobToTelegram(job: TelegramJobPost): Promise<boolean> {
  // Prevent execution in browser environment
  if (typeof window !== 'undefined') {
    console.warn('🚫 Telegram posting blocked in browser environment');
    return false;
  }
  
  try {
    console.log('🚀 Starting Telegram post for job:', job.title);
    
    if (!TELEGRAM_CONFIG.botToken || !TELEGRAM_CONFIG.channelId) {
      console.warn('⚠️ Telegram bot not configured - missing bot token or channel ID');
      console.log('Available env vars:', {
        TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN ? 'SET' : 'MISSING',
        TELEGRAM_CHANNEL_ID: process.env.TELEGRAM_CHANNEL_ID ? 'SET' : 'MISSING'
      });
      return false;
    }

    const message = formatJobPostForTelegram(job);
    const jobUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://faydajobs.com'}/jobs/${job.slug}`;
    
    console.log('📤 Posting to Telegram:', {
      title: job.title,
      slug: job.slug,
      channel: TELEGRAM_CONFIG.channelId,
      url: jobUrl
    });
    
    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
    
    const payload = {
      chat_id: TELEGRAM_CONFIG.channelId,
      text: message,
      disable_web_page_preview: false
    };

    console.log('� Sending Telegram payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    
    console.log('📊 Telegram API response:', result);
    
    if (result.ok) {
      console.log('✅ Job successfully posted to Telegram:', result.result.message_id);
      return true;
    } else {
      console.error('❌ Failed to post job to Telegram:', result.description);
      console.error('Full error response:', result);
      return false;
    }
  } catch (error) {
    console.error('❌ Error posting job to Telegram:', error);
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
