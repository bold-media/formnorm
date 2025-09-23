import { NextRequest, NextResponse } from 'next/server'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const ADMIN_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-1002992818151'

export async function POST(request: NextRequest) {
  try {
    const { calculationNumber, calculationId } = await request.json()

    // Send notification to admin channel
    const adminMessage =
      `📄 Клиент скачал PDF\n` +
      `📊 Расчет: №${calculationNumber}\n` +
      `🔗 ID: ${calculationId}`

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text: adminMessage,
        parse_mode: 'HTML',
      }),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending PDF download notification:', error)
    // Don't fail the download if notification fails
    return NextResponse.json({ success: false })
  }
}