import type { Metadata, ResolvedMetadata } from 'next'

import type { Media, Config } from '@payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

type PayloadMetadata =
  | {
      title?: string | null
      description?: string | null
      image?: Media | string | null | undefined
      canonicalURL?: string | null
      noIndex?: boolean | null
    }
  | string
  | undefined

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image?.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image?.url
  }

  return url
}

export const generateMeta = async (args: {
  meta: PayloadMetadata
  fallback?: ResolvedMetadata
  pathname?: string
}): Promise<Metadata> => {
  const { meta: data, fallback, pathname } = args
  const seo = typeof data === 'object' ? data : undefined
  const serverUrl = getServerSideURL()

  const ogImage = getImageURL(seo?.image)

  const title = seo?.title
    ? seo?.title
    : fallback?.title
      ? fallback?.title
      : process.env.NEXT_PUBLIC_APP_NAME || ''
  const description = seo?.description
    ? seo?.description
    : fallback?.description
      ? fallback?.description
      : ''
  
  // Generate canonical URL
  let canonicalURL: string | undefined
  if (seo?.canonicalURL) {
    // If canonical URL is provided, use it
    canonicalURL = seo.canonicalURL.startsWith('http') 
      ? seo.canonicalURL 
      : `${serverUrl}${seo.canonicalURL}`
  } else if (pathname) {
    // Otherwise, use the pathname as canonical
    canonicalURL = `${serverUrl}${pathname}`
  }

  const metadata: Metadata = {
    title,
    description,
    openGraph: mergeOpenGraph({
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : fallback?.openGraph?.images,
      url: pathname || undefined,
    }),
  }

  // Add canonical URL if available
  if (canonicalURL) {
    metadata.alternates = {
      canonical: canonicalURL,
    }
  }

  // Add robots meta if noIndex is true
  if (seo?.noIndex) {
    metadata.robots = {
      index: false,
      follow: true,
    }
  }

  return metadata
}
