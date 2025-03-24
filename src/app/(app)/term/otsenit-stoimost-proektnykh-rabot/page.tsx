import { ServiceBreadcrumbs } from '@/modules/service/ServiceBreadcrumbs'
import { notFound } from 'next/navigation'
import React from 'react'
import { RichText } from '@/modules/common/RichText'
import { Metadata, ResolvingMetadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getTermBySlug } from '@/modules/term/data'

interface Props {
  params: {
    slug: string
  }
}

const CostEstimationPage = async () => {
  const term = await getTermBySlug('otsenit-stoimost-proektnykh-rabot')

  if (!term) {
    notFound()
  }

  const { title, article, suffix } = term

  return (
    <div className="overflow-x-hidden mb-16">
      <div className="container relative mt-8 md:mt-header mb-16">
        <div className="flex flex-col items-center text-center gap-4 mb-10 md:mb-20">
          <h1 className="font-semibold text-2xl sm:text-3xl md:text-4xl leading-tight uppercase">
            {title}
          </h1>
          <p className="text-zinc-400/80 text-base md:text-xl uppercase font-semibold">{suffix}</p>
        </div>
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

export const generateMetadata = async (
  _: Props,
  parentPromise: ResolvingMetadata,
): Promise<Metadata> => {
  const term = await getTermBySlug('otsenit-stoimost-proektnykh-rabot')
  const fallback = await parentPromise

  return generateMeta({
    meta: term?.meta,
    fallback,
    pathname: '/term/otsenit-stoimost-proektnykh-rabot',
  })
}

export default CostEstimationPage
