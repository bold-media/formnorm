import { FieldHook } from 'payload'

export const sendToTelegramHook: FieldHook = async ({
  data,
  originalDoc,
  value,
}) => {
  // Only trigger if the field value is being set to 'send'
  if (value === 'send' && originalDoc) {
    try {
      const adminUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.PAYLOAD_PUBLIC_SERVER_URL ||
        'https://formnorm.ru'

      const botToken = process.env.TELEGRAM_BOT_TOKEN
      const adminChatId = process.env.TELEGRAM_CHAT_ID
      const clientChatId = originalDoc.contactInfo?.telegramChatId

      // Get the PDF URL if the file exists
      let pdfUrl = ''
      if (originalDoc.url) {
        pdfUrl = `${adminUrl}${originalDoc.url}`
      }

      // Send to admin
      if (adminChatId && botToken) {
        await sendTelegramMessage({
          botToken,
          chatId: adminChatId,
          title: '📄 PDF отправлен клиенту',
          data: {
            'Расчет №': originalDoc.calculationNumber || 'Н/Д',
            'Клиент': originalDoc.clientName || 'Не указан',
            'Отправлено в чат': clientChatId || 'Не указан',
            'adminLink': `${adminUrl}/admin/collections/calculator-results/${originalDoc.id}`,
          },
          pdfUrl,
        })
      }

      // Send to client if they have a Telegram chat ID
      if (clientChatId && botToken) {
        await sendTelegramMessage({
          botToken,
          chatId: clientChatId,
          title: 'Ваш расчет готов!',
          data: {
            'Номер расчета': originalDoc.calculationNumber || 'Н/Д',
            'Площадь': `${originalDoc.calculationSummary?.area || 0} м²`,
            'Стоимость': `${originalDoc.calculationSummary?.totalCost || 0} ₽`,
          },
          pdfUrl,
          isClient: true,
        })
      }

      console.log('PDF sent to Telegram successfully')
      // Return null to not actually save this value
      return null
    } catch (error) {
      console.error('Failed to send PDF to Telegram:', error)
      throw new Error('Не удалось отправить в Telegram')
    }
  }

  return null
}

// Helper function to send Telegram messages
async function sendTelegramMessage({
  botToken,
  chatId,
  title,
  data,
  pdfUrl,
  isClient = false,
}: {
  botToken: string
  chatId: string
  title: string
  data: Record<string, any>
  pdfUrl?: string
  isClient?: boolean
}) {
  // Format message
  let message = `*🔔 ${title}*\n\n`

  let adminLink = ''
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'adminLink' && value) {
      adminLink = value
      return
    }
    message += `*${key}:* ${value}\n`
  })

  if (adminLink && !isClient) {
    message += `\n[🔗 Перейти в админку](${adminLink})`
  }

  // Send text message
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    }),
  })

  const result = await response.json()
  if (!result.ok) {
    throw new Error(`Telegram API error: ${result.description}`)
  }

  // Send PDF if available
  if (pdfUrl) {
    await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        document: pdfUrl,
        caption: isClient ? '📄 Ваш расчет в PDF формате' : '📄 PDF документ',
      }),
    })
  }
}
