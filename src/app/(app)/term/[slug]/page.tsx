import { ServiceBreadcrumbs } from '@/modules/service/ServiceBreadcrumbs'
import { notFound } from 'next/navigation'
import React from 'react'
import { RichText } from '@/modules/common/RichText'
import { Metadata, ResolvingMetadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'
import { getPayload } from 'payload'
import config from '@payload-config'

import ServiceIcon from '@/assets/photo.svg'
import { getTermBySlug } from '@/modules/term/data'

interface Props {
  params: Promise<{
    slug: string
  }>
}

const TermPage = async ({ params }: Props) => {
  const { slug } = await params
  const term = await getTermBySlug(slug)

  if (!term) {
    notFound()
  }

  const { title, article, suffix, showHero } = term

  return (
    <div className="overflow-x-hidden mb-16">
      <div className="container relative mt-8 md:mt-header mb-16">
        {showHero ? (
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
        ) : (
          <h1 className="text-center text-3xl md:text-4xl font-semibold mt-8">{title}</h1>
        )}

        {/* <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-px bg-zinc-200" /> */}
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
  const term = await getTermBySlug(slug)

  const fallback = await parentPromise

  return generateMeta({ meta: term?.meta, fallback, pathname: `/term/${term?.slug}` })
}

export default TermPage
