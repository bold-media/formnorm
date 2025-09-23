import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import CalculatorResultView from '@/modules/common/Blocks/components/CalculatorResultView'
import { Metadata } from 'next'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const payload = await getPayload({ config })

  try {
    const result = await payload.findByID({
      collection: 'calculator-results',
      id,
    })

    if (!result) {
      return {
        title: 'Расчет не найден',
      }
    }

    const metadata = result.metadata as any
    const calculations = metadata?.calculations || {}
    const totalCost = calculations.totalCost || 0
    const area = calculations.area || 0

    return {
      title: `Расчет №${result.calculationNumber}`,
      description: `Стоимость проектирования: ${totalCost.toLocaleString(
        'ru-RU',
      )} ₽. Площадь: ${area} м²`,
      openGraph: {
        title: `Расчет №${result.calculationNumber} - Стоимость проектирования`,
        description: `Общая стоимость: ${totalCost.toLocaleString(
          'ru-RU',
        )} ₽ | Площадь: ${area} м²`,
        type: 'website',
        locale: 'ru_RU',
      },
    }
  } catch (error) {
    return {
      title: 'Расчет стоимости проектирования',
    }
  }
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
      downloadPdfLoading: resultPageSettings.downloadPdfButtonLoading || 'Генерация PDF...',
      share: resultPageSettings.shareButtonText || 'Скопировать ссылку',
      telegram: resultPageSettings.shareToTelegramButtonText || 'Скачать в Telegram',
    }

    if (resultPageSettings.resultForm) {
      const formId =
        typeof resultPageSettings.resultForm === 'string'
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
