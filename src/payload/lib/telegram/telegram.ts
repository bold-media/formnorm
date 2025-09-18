// src/utils/telegram.ts (or wherever you keep utilities)

interface TelegramNotification {
  title: string
  data: Record<string, any>
  fileUrl?: string // For PDF attachments
}

export async function sendTelegramNotification({
  title,
  data,
  fileUrl,
}: TelegramNotification): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    console.error('Telegram credentials not configured')
    return false
  }

  // Format the message with Markdown
  let message = `*🔔 ${title}*\n\n`

  // Add regular fields first, excluding adminLink
  let adminLink = ''
  Object.entries(data).forEach(([key, value]) => {
    // Save admin link for later
    if (key === 'adminLink' && value) {
      adminLink = value
      return
    }

    // Format the key nicely (contactName -> Contact Name)
    const formattedKey = key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim()

    // Handle different value types
    let displayValue = value
    if (value === null || value === undefined) {
      displayValue = 'Not provided'
    } else if (typeof value === 'boolean') {
      displayValue = value ? 'Yes' : 'No'
    } else if (typeof value === 'object') {
      displayValue = JSON.stringify(value, null, 2)
    }

    message += `*${formattedKey}:* ${displayValue}\n`
  })

  // Add admin link if available
  if (adminLink) {
    message += `\n\n[🔗 Перейти в админку](${adminLink})`
  }

  // Add timestamp
  message += `\n\n_📅 ${new Date().toLocaleString('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })}_`

  try {
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
      console.error('Telegram error:', result.description)
      return false
    }

    // If there's a PDF file URL, send it as a document
    if (fileUrl) {
      await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          document: fileUrl,
          caption: `📎 ${title} - Attachment`,
        }),
      })
    }

    console.log('✅ Telegram notification sent successfully')
    return true
  } catch (error) {
    console.error('Failed to send Telegram notification:', error)
    return false
  }
}
