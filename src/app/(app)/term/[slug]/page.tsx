import { ServiceBreadcrumbs } from '@/modules/service/ServiceBreadcrumbs'
import { notFound } from 'next/navigation'
import React from 'react'
import { RichText } from '@/modules/common/RichText'
import { Metadata, ResolvingMetadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'
import { getPayload } from 'payload'
import config from '@payload-config'
import { checkAndRedirect } from '@/utils/redirects'
import CalculatorBlock, {
  type CalculatorConfig,
} from '@/modules/common/Blocks/components/CalculatorBlock'
import type { Settings } from '@/payload/payload-types'
import { getSettings } from '@/modules/common/data'

import ServiceIcon from '@/assets/photo.svg'
import { getTermBySlug } from '@/modules/term/data'

interface Props {
  params: Promise<{
    slug: string
  }>
}

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

const TermPage = async ({ params }: Props) => {
  const { slug } = await params

  // Check if this is the calculator page
  if (slug === 'otsenit-stoimost-proektnykh-rabot') {
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

  // Regular term page logic
  const term = await getTermBySlug(slug)

  if (!term) {
    // Check for redirects before returning 404
    await checkAndRedirect(`/term/${slug}`)
    notFound()
  }

  const { title, article, suffix, showHero } = term

  return (
    <div className="overflow-x-hidden mb-16">
      <div className="container relative mt-8 md:mt-header mb-16">
        {showHero ? (
          <div>
            <div className="grid md:grid-cols-[2fr,1fr] gap-10 mb-10 md:mb-20 items-center">
              <div className="flex flex-col gap-10">
                <h1 className="font-semibold md:font-bold text-3xl sm:text-5xl md:text-[4rem] leading-light md:leading-[4rem] uppercase mt-4">
                  {title}
                </h1>
                <p className="text-zinc-400/80 text-base md:text-xl uppercase font-semibold md:leading-8">
                  {suffix}
                </p>
              </div>
              <div className="hidden md:flex justify-center items-center px-10">
                <ServiceIcon className="w-48 h-48" />
              </div>
            </div>
            <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-px bg-zinc-200" />
          </div>
        ) : (
          <h1 className="text-center text-3xl md:text-4xl font-semibold mt-8">{title}</h1>
        )}
      </div>

      <RichText
        data={article}
        container={'default'}
        prose={{ variant: 'default' }}
        className="pb-8 xs:pb-12 sm:pb-20 mx-auto !overflow-x-visible "
        tag="article"
      />
      <ServiceBreadcrumbs title={title} />
    </div>
  )
}

export const generateStaticParams = async () => {
  try {
    const payload = await getPayload({ config })
    const term = await payload.find({
      collection: 'term',
      draft: false,
      limit: 0,
      overrideAccess: false,
      select: {
        slug: true,
      },
      where: {
        slug: {
          exists: true,
        },
      },
    })

    const params = term?.docs?.map(({ slug }) => ({ slug }))
    return params
  } catch (error) {
    return []
  }
}

export const generateMetadata = async (
  { params }: Props,
  parentPromise: ResolvingMetadata,
): Promise<Metadata> => {
  const { slug } = await params

  // For calculator page, use calculator metadata
  if (slug === 'otsenit-stoimost-proektnykh-rabot') {
    const settings = await getSettings()
    const fallback = await parentPromise

    return generateMeta({
      meta: settings?.seo?.calculator,
      fallback,
      pathname: `/term/otsenit-stoimost-proektnykh-rabot`,
    })
  }

  // Regular term metadata
  const term = await getTermBySlug(slug)
  const fallback = await parentPromise

  return generateMeta({ meta: term?.meta, fallback, pathname: `/term/${term?.slug}` })
}

export default TermPage
