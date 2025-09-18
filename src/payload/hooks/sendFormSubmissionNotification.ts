import { CollectionAfterChangeHook } from 'payload'
import { sendTelegramNotification } from '@/payload/lib/telegram/telegram'

export const sendFormSubmissionNotification: CollectionAfterChangeHook = async ({
  doc,
  operation,
  context,
  req,
}) => {
  if (operation === 'create') {
    // Get form title if available
    let formTitle = 'Неизвестная форма'

    // Check if form is already populated
    if (typeof doc.form === 'object' && doc.form?.title) {
      formTitle = doc.form.title
    } else if (doc.form && req?.payload) {
      // If form is just an ID, fetch it
      try {
        const form = await req.payload.findByID({
          collection: 'forms',
          id: doc.form,
        })
        formTitle = form?.title || 'Неизвестная форма'
      } catch (error) {
        console.error('Error fetching form:', error)
      }
    }

    const adminUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.PAYLOAD_PUBLIC_SERVER_URL ||
      'https://formnorm.ru'
    const data: Record<string, any> = {
      Форма: formTitle,
    }

    // Try to get name or email from form submission data
    if (doc.submissionData) {
      // Common field names to check
      const nameField = doc.submissionData.find(
        (field: any) =>
          field.field &&
          (field.field.toLowerCase().includes('name') || field.field.toLowerCase().includes('имя')),
      )
      const emailField = doc.submissionData.find(
        (field: any) => field.field && field.field.toLowerCase().includes('email'),
      )
      const phoneField = doc.submissionData.find(
        (field: any) =>
          field.field &&
          (field.field.toLowerCase().includes('phone') ||
            field.field.toLowerCase().includes('телефон')),
      )

      if (nameField?.value) {
        data['Имя'] = nameField.value
      }
      if (emailField?.value) {
        data['Email'] = emailField.value
      }
      if (phoneField?.value) {
        data['Телефон'] = phoneField.value
      }
    }

    if (adminUrl) {
      data['adminLink'] = `${adminUrl}/admin/collections/form-submissions/${doc.id}`
    }

    await sendTelegramNotification({
      title: '📨 Новая заявка с формы',
      data,
    })
  }
  return doc
}
