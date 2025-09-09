import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import CalculatorResultView from '@/modules/common/Blocks/components/CalculatorResultView'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CalculatorResultPage({ params }: PageProps) {
  const { id } = await params
  const payload = await getPayload({ config })

  try {
    const result = await payload.findByID({
      collection: 'calculator-results',
      id,
    })

    if (!result) {
      notFound()
    }

    // Получаем настройки для получения формы
    const settings = await payload.findGlobal({
      slug: 'settings',
    })

    let form = null
    
    // Собираем все тексты кнопок из настроек
    const resultPageSettings = settings?.calculator?.resultPageSettings || {}
    const buttonTexts = {
      formButton: resultPageSettings.formShowButtonText || 'Заполнить форму',
      formButtonHide: resultPageSettings.formHideButtonText || 'Скрыть форму',
      downloadPdf: resultPageSettings.downloadPdfButtonText || 'Скачать PDF',
      downloadPdfLoading: resultPageSettings.downloadPdfButtonLoadingText || 'Генерация PDF...',
      share: resultPageSettings.shareButtonText || 'Поделиться',
    }
    
    if (resultPageSettings.resultForm) {
      const formId = typeof resultPageSettings.resultForm === 'string' 
        ? resultPageSettings.resultForm 
        : resultPageSettings.resultForm.id
      
      if (formId) {
        try {
          form = await payload.findByID({
            collection: 'forms',
            id: formId,
          })
        } catch (error) {
          console.error('Error loading form:', error)
        }
      }
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <CalculatorResultView result={result} form={form} buttonTexts={buttonTexts} />
      </div>
    )
  } catch (error) {
    console.error('Error loading calculation result:', error)
    notFound()
  }
}
