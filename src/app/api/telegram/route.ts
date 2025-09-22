import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // For now, just log what we receive
    console.log('Received webhook:', body);

    // Check if this is a /start command
    if (body.message?.text?.startsWith('/start')) {
      const chatId = body.message.chat.id;
      const userName = body.message.from.first_name || 'Пользователь';

      // Send a simple test message
      await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: `Привет, ${userName}! Тест работает!`
          })
        }
      );
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}