import { NextResponse } from 'next/server';

export async function GET() {
  // Log ALL environment variables (without exposing sensitive data)
  const allEnvVars = Object.keys(process.env).filter(key => 
    key.includes('TELEGRAM') || 
    key.includes('NEXT_PUBLIC') ||
    key.includes('NODE_ENV')
  );
  
  const envCheck: any = {
    allTelegramVars: allEnvVars.filter(key => key.includes('TELEGRAM')),
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN ? 'SET' : 'MISSING',
    telegramBotTokenLength: process.env.TELEGRAM_BOT_TOKEN?.length || 0,
    telegramChannelId: process.env.TELEGRAM_CHANNEL_ID ? 'SET' : 'MISSING',
    telegramChannelIdValue: process.env.TELEGRAM_CHANNEL_ID,
    nextPublicSiteUrl: process.env.NEXT_PUBLIC_SITE_URL ? 'SET' : 'MISSING',
    nextPublicSiteUrlValue: process.env.NEXT_PUBLIC_SITE_URL,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    issues: [] as string[]
  };
  
  // Add issue detection
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    envCheck.issues.push('TELEGRAM_BOT_TOKEN is missing');
  }
  if (!process.env.TELEGRAM_CHANNEL_ID) {
    envCheck.issues.push('TELEGRAM_CHANNEL_ID is missing');
  }
  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    envCheck.issues.push('NEXT_PUBLIC_SITE_URL is missing');
  }
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_TOKEN.length < 10) {
    envCheck.issues.push('TELEGRAM_BOT_TOKEN looks too short');
  }
  
  return NextResponse.json(envCheck);
}
