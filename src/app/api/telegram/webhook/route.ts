// src/app/api/telegram/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const ADMIN_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-1002992818151' // Admin channel for notifications

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

        try {
          // Fetch calculation from database
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

          const response = await fetch(`${baseUrl}/api/calculator-results/${calculationId}`)

          if (!response.ok) {
            await sendMessage(chatId, '❌ Расчет не найден или недоступен')
            return NextResponse.json({ ok: true })
          }

          const result = await response.json()

          // Extract data from the calculation
          const metadata = result.metadata || {}
          const calculations = metadata.calculations || {}
          const formData = metadata.formData || {}
          const config = metadata.config || {}
          const currency = config.currency || '₽'

          // Send calculation details
          const message =
            `📊 <b>Расчет №${result.calculationNumber}</b>\n\n` +
            `📐 <b>Параметры:</b>\n` +
            `• Площадь: ${calculations.area || 0} м²\n` +
            `• Этажность: ${formData.selectedFloor || 'Не указано'}\n\n` +
            `💰 <b>Результаты:</b>\n` +
            `• Цена за м²: ${Math.round(calculations.pricePerM2 || 0).toLocaleString('ru-RU')} ${currency}\n` +
            `• <b>Общая стоимость: ${(calculations.totalCost || 0).toLocaleString('ru-RU')} ${currency}</b>\n\n` +
            `📅 Дата расчета: ${new Date(result.createdAt).toLocaleDateString('ru-RU')}\n\n` +
            `🔗 Подробнее: ${baseUrl}/calculator/${calculationId}`

          await sendMessage(chatId, message, true)

          // Send PDF if available
          if (result.url) {
            await sendDocument(chatId, `${baseUrl}${result.url}`, `Расчет №${result.calculationNumber}.pdf`)
          }

          // Save Telegram ID and username to database
          try {
            const payload = await getPayload({ config })
            await payload.update({
              collection: 'calculator-results',
              id: calculationId,
              data: {
                telegramChatId: String(chatId),
                telegramUsername: body.message.from.username ? `@${body.message.from.username}` : undefined,
              },
            })
            console.log('Updated calculation with Telegram ID and username:', chatId, body.message.from.username)
          } catch (updateError) {
            console.error('Failed to update Telegram info in database:', updateError)
            // Continue even if update fails
          }

          // Send notification to admin channel about client receiving calculation
          try {
            const adminMessage =
              `📱 Клиент получил расчет №${result.calculationNumber}\n` +
              `🆔 Telegram ID: ${chatId}\n` +
              `👤 Имя: ${body.message.from.first_name || 'Не указано'}\n` +
              `${body.message.from.username ? `📝 Username: @${body.message.from.username}` : ''}`

            await sendMessage(Number(ADMIN_CHAT_ID), adminMessage, true)
          } catch (adminError) {
            console.error('Failed to send admin notification:', adminError)
            // Don't fail the main process if admin notification fails
          }
        } catch (error) {
          console.error('Error fetching calculation:', error)
          await sendMessage(chatId, '❌ Произошла ошибка при загрузке расчета')
        }
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
