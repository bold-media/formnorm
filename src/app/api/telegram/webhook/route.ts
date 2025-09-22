// src/app/api/telegram/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received webhook:', body)

    // Check if this is a /start command
    if (body.message?.text?.startsWith('/start')) {
      const chatId = body.message.chat.id
      const userName = body.message.from.first_name || 'Пользователь'
      const startParam = body.message.text.split(' ')[1] // Gets parameter after /start

      // Check if there's a calculation ID parameter
      if (startParam && startParam.startsWith('calc_')) {
        // Extract calculation ID
        const calculationId = startParam.replace('calc_', '')

        // Send initial message
        await sendMessage(
          chatId,
          `Здравствуйте, ${userName}! 👋\n\nСейчас отправлю вам результаты расчета...`,
        )

        // TODO: Fetch your calculation from database
        // For now, sending test data
        const testCalculation = {
          number: '2025-41',
          area: 100,
          floors: '2 этажа',
          pricePerM2: 1459,
          totalCost: 145860,
          currency: '₽',
          date: new Date().toLocaleDateString('ru-RU'),
        }

        // Send calculation details
        const message =
          `📊 <b>Расчет №${testCalculation.number}</b>\n\n` +
          `📐 <b>Параметры:</b>\n` +
          `• Площадь: ${testCalculation.area} м²\n` +
          `• Этажность: ${testCalculation.floors}\n\n` +
          `💰 <b>Результаты:</b>\n` +
          `• Цена за м²: ${testCalculation.pricePerM2.toLocaleString('ru-RU')} ${
            testCalculation.currency
          }\n` +
          `• <b>Общая стоимость: ${testCalculation.totalCost.toLocaleString('ru-RU')} ${
            testCalculation.currency
          }</b>\n\n` +
          `📅 Дата расчета: ${testCalculation.date}\n\n` +
          `🔗 Подробнее: https://formnorm.ru/calculator/${calculationId}`

        await sendMessage(chatId, message, true)

        // TODO: Send PDF if available
        // await sendDocument(chatId, pdfUrl, 'Ваш расчет в PDF');
      } else {
        // Regular /start without calculation
        await sendMessage(
          chatId,
          `Добро пожаловать, ${userName}! 👋\n\n` +
            `Я бот для отправки результатов расчетов.\n\n` +
            `Чтобы получить ваш расчет, используйте кнопку "Отправить в Telegram" на странице с результатами.`,
        )
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

// Helper function to send messages
async function sendMessage(chatId: number, text: string, parseHtml = false) {
  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: parseHtml ? 'HTML' : undefined,
    }),
  })

  const result = await response.json()
  if (!result.ok) {
    console.error('Failed to send message:', result)
  }
  return result
}

// Helper function to send documents
async function sendDocument(chatId: number, documentUrl: string, caption: string) {
  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      document: documentUrl,
      caption: caption,
    }),
  })

  return response.json()
}
