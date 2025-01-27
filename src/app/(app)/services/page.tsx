import React from 'react'
import { getAllServices } from '@/modules/service/data'
import { PreviewCard } from '@/modules/common/PreviewCard'
import { Metadata, ResolvingMetadata } from 'next'
import { getSettings } from '@/modules/common/data'
import { generateMeta } from '@/utils/generateMeta'

import { cn } from '@/utils/cn'
import { getAllTerms } from '@/modules/term/data'
import { ServiceBreadcrumbs } from '@/modules/service/ServiceBreadcrumbs'

const ServicesPage = async () => {
  // Fetch categories and posts

  const services = await getAllServices()
  const terms = await getAllTerms()

  // console.log(services)

  return (
    <div className="overflow-x-hidden">
      <div className={cn('container mt-8 sm:mt-16 min-h-svh pb-20')}>
        <h1 className="uppercase font-semibold text-[2.1rem] sm:text-[3rem] mb-12 leading-9">
          Услуги и условия
        </h1>
        <h2 className="uppercase font-semibold text-2xl sm:text-[2.5rem] leading-7 pb-24">
          Общая информация
        </h2>
        {terms && Array.isArray(terms) && (
          <div className="grid sm:grid-cols-3 gap-10 pb-24 md:pb-32">
            {terms.map((term) => (
              <PreviewCard key={term.id} data={term} type="term" />
            ))}
          </div>
        )}
        <h2 className="uppercase font-semibold text-2xl sm:text-[2.5rem] leading-7 md:leading-[2.925rem] pb-24">
          Проектирование загородных домов и коттеджей
        </h2>
        {services && Array.isArray(services) && (
          <div className="grid sm:grid-cols-3 gap-10 pb-12">
            {services.map((service) => (
              <PreviewCard key={service.id} data={service} type="service" />
            ))}
          </div>
        )}
        <ServiceBreadcrumbs />
      </div>
    </div>
  )
}

export const generateMetadata = async ({}, parentPromise: ResolvingMetadata): Promise<Metadata> => {
  const settings = await getSettings()

  const fallback = await parentPromise

  return {} //TODO
  // return generateMeta({
  //   meta: categorySlug
  //     ? { title: `Posts in ${categorySlug}`, description: `Browse posts in ${categorySlug}` }
  //     : settings?.seo?.posts,
  //   fallback,
  //   pathname: categorySlug ? `/blog/${categorySlug}` : `/blog`,
  // });
}

export default ServicesPage
