import { NextResponse } from 'next/server';

export async function GET() {
  // Test server-side environment variables
  const serverEnvCheck = {
    timestamp: new Date().toISOString(),
    serverSide: {
      telegramBotToken: process.env.TELEGRAM_BOT_TOKEN ? 'SET' : 'MISSING',
      telegramBotTokenLength: process.env.TELEGRAM_BOT_TOKEN?.length || 0,
      telegramChannelId: process.env.TELEGRAM_CHANNEL_ID ? 'SET' : 'MISSING',
      telegramChannelIdValue: process.env.TELEGRAM_CHANNEL_ID,
      nodeEnv: process.env.NODE_ENV,
      allEnvKeys: Object.keys(process.env).filter(k => k.includes('TELEGRAM') || k.includes('NEXT_PUBLIC'))
    },
    message: 'This is server-side environment check'
  };

  console.log('🔍 Server-side environment check:', serverEnvCheck);

  return NextResponse.json(serverEnvCheck);
}
