import CalculatorBlock, {
  type CalculatorConfig,
} from '@/modules/common/Blocks/components/CalculatorBlock'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Settings } from '@/payload/payload-types'
import { getSettings } from '@/modules/common/data'
import { Metadata, ResolvingMetadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'

// Transform Payload settings to CalculatorConfig format
function transformSettingsToCalculatorConfig(settings: Settings): CalculatorConfig | null {
  if (!settings.calculator) return null

  const { calculator } = settings

  return {
    calculatorTitle: calculator.calculatorTitle || 'Калькулятор проектирования дома',
    currency: calculator.currency || '₽',
    areaSettings: {
      label: calculator.areaSettings?.label || 'Общая площадь дома',
      placeholder: calculator.areaSettings?.placeholder || 'Введите площадь в м²',
      defaultArea: calculator.areaSettings?.defaultArea || 0,
      description: calculator.areaSettings?.description || '',
      areaCoefficients: (calculator.areaSettings?.areaCoefficients || []).map((coeff) => ({
        label: coeff.label,
        minArea: coeff.minArea,
        maxArea: coeff.maxArea === null ? undefined : coeff.maxArea,
        coefficient: coeff.coefficient,
      })),
    },
    floorSettings: {
      label: calculator.floorSettings?.label || 'Этажность',
      floorOptions: (calculator.floorSettings?.floorOptions || []).map((opt) => ({
        name: opt.name,
        coefficient: opt.coefficient,
        isDefault: opt.isDefault || undefined,
      })),
    },
    servicesSections: (calculator.servicesSections || []).map((section) => ({
      title: section.title,
      services: (section.services || []).map((service) => ({
        name: service.name || undefined,
        pricePerM2: service.pricePerM2 || undefined,
        fixedPrice: service.fixedPrice || undefined,
        ignoreArea: service.ignoreArea || undefined,
        hasOptions: service.hasOptions || undefined,
        options:
          service.options?.map((opt) => ({
            name: opt.name,
            pricePerM2: opt.pricePerM2 || 0,
            description: opt.description || undefined,
          })) || undefined,
        fieldType: service.fieldType || undefined,
        radioGroup: service.radioGroup || undefined,
        isDefault: service.isDefault || undefined,
        isRequired: service.isRequired || undefined,
        description: service.description || undefined,
      })),
    })),
    additionalSections: (calculator.additionalSections || []).map((section) => ({
      title: section.title,
      fieldType: section.fieldType || ('checkbox' as const),
      elements: (section.elements || []).map((el) => ({
        name: el.name,
        price: el.price,
        isDefault: el.isDefault || undefined,
      })),
    })),
    interfaceTexts: {
      totalPriceLabel: calculator.interfaceTexts?.totalPriceLabel || 'Общая стоимость:',
      pricePerM2Label: calculator.interfaceTexts?.pricePerM2Label || 'Цена за м²:',
      resetButtonText: calculator.interfaceTexts?.resetButtonText || 'Сбросить',
      additionalElementsTitle: calculator.interfaceTexts?.additionalElementsTitle || 'Дополнительные элементы',
      submitButtonText: calculator.interfaceTexts?.submitButtonText || 'Рассчитать стоимость',
    },
    instructions: calculator.instructions ? {
      title: calculator.instructions.title || '',
      steps: (calculator.instructions.steps || []).map(step => ({
        text: step.text,
      })),
    } : undefined,
    pdfSuffixContent: calculator.pdfSuffixContent ? {
      title: calculator.pdfSuffixContent.title || '',
      content: calculator.pdfSuffixContent.content || null,
    } : undefined,
  }
}

export default async function CalculatorPage() {
  const payload = await getPayload({ config })

  // Fetch calculator settings from global settings
  const settings = await payload.findGlobal({
    slug: 'settings',
  })

  // Transform settings to calculator config format
  const calculatorConfig = transformSettingsToCalculatorConfig(settings)

  return (
    <div className="min-h-screen bg-gray-50">
      <CalculatorBlock initialConfig={calculatorConfig} />
    </div>
  )
}
export const generateMetadata = async ({}, parentPromise: ResolvingMetadata): Promise<Metadata> => {
  const settings = await getSettings()

  const fallback = await parentPromise

  return generateMeta({
    meta: settings?.seo?.calculator,
    fallback,
    pathname: `/calculator`,
  })
}
