import { sendTelegramNotification } from '@/payload/lib/telegram/telegram'
import { CollectionAfterChangeHook } from 'payload'

export const sendTelegramNotificationHook: CollectionAfterChangeHook = async ({
  doc,
  operation,
}) => {
  if (operation === 'create') {
    try {
      // Try to get URL from environment or use a default
      const adminUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.PAYLOAD_PUBLIC_SERVER_URL ||
        'https://formnorm.ru'

      const data: Record<string, any> = {
        'Расчет №': doc.calculationNumber || 'Н/Д',
      }

      if (adminUrl) {
        data['adminLink'] = `${adminUrl}/admin/collections/calculator-results/${doc.id}`
      }

      await sendTelegramNotification({
        title: '🧮 Новый результат расчета',
        data,
      })
    } catch (error) {
      // Don't let Telegram notification failure break the save operation
      console.error('Failed to send Telegram notification:', error)
    }
  }
  return doc
}
