import type { Metadata } from 'next'
// import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Website built with NextJS and PayloadCMS.',
  //no default og image
  // images: [
  //     {
  //         url: `${getServerSideURL()}/website-default-OG.webp`
  //     }
  // ]
  siteName: 'Формы и нормы. Проектирование загородных домов и коттеджей.',
  title: 'Формы и нормы',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph?.images ? defaultOpenGraph.images : undefined,
  }
}
