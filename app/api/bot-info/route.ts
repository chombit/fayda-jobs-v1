import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botToken) {
      return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN not found' }, { status: 400 });
    }
    
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    const result = await response.json();
    
    if (result.ok) {
      return NextResponse.json({
        success: true,
        botInfo: result.result,
        message: `Bot username: @${result.result.username}. Add this bot as administrator to your channel @faydajobs`
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.description
      }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
