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

const generateJsonLd = (args: {
  title: string | Metadata['title']
  description: string
  canonicalURL?: string
  pathname?: string
  image?: string
}) => {
  const { title, description, canonicalURL, pathname, image } = args
  const serverUrl = getServerSideURL()
  const siteName = 'Формы и нормы'
  const url = canonicalURL || `${serverUrl}${pathname || ''}`

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    description: description || siteName,
    url: serverUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${serverUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: serverUrl,
    logo: image || `${serverUrl}/logo.png`,
    description: 'Проектирование загородных домов и коттеджей',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'RU',
    },
  }

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: String(title),
    description: description,
    url: url,
    isPartOf: {
      '@id': `${serverUrl}#website`,
    },
    primaryImageOfPage: image ? { '@type': 'ImageObject', url: image } : undefined,
    dateModified: new Date().toISOString(),
  }

  const breadcrumbSchema = pathname && pathname !== '/' ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: pathname.split('/').filter(Boolean).map((segment, index, array) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      item: `${serverUrl}/${array.slice(0, index + 1).join('/')}`,
    })),
  } : null

  const schemas: any[] = [websiteSchema, organizationSchema, webPageSchema]
  if (breadcrumbSchema) schemas.push(breadcrumbSchema)

  return schemas
}

export const generateMeta = async (args: {
  meta: PayloadMetadata
  fallback?: ResolvedMetadata
  pathname?: string
}): Promise<Metadata> => {
  const { meta: data, fallback, pathname } = args
  const seo = typeof data === 'object' ? data : undefined
  const serverUrl = getServerSideURL()
  const siteName = 'Формы и нормы'

  const ogImage = getImageURL(seo?.image)

  const title = seo?.title
    ? seo?.title
    : fallback?.title
      ? fallback?.title
      : process.env.NEXT_PUBLIC_APP_NAME || siteName
  const description = seo?.description
    ? seo?.description
    : fallback?.description
      ? fallback?.description
      : 'Проектирование загородных домов и коттеджей'
  
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
    applicationName: siteName,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(serverUrl),
    openGraph: mergeOpenGraph({
      title,
      description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: String(title) }] : fallback?.openGraph?.images,
      url: canonicalURL || pathname || undefined,
      siteName,
      locale: 'ru_RU',
      type: 'website',
    }),
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
      creator: `@${siteName.replace(/\s+/g, '')}`,
      site: `@${siteName.replace(/\s+/g, '')}`,
    },
    other: {
      'theme-color': '#ffffff',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': siteName,
      'mobile-web-app-capable': 'yes',
      'msapplication-TileColor': '#ffffff',
      'msapplication-config': '/browserconfig.xml',
    },
  }

  // Add canonical URL if available
  if (canonicalURL) {
    metadata.alternates = {
      canonical: canonicalURL,
      languages: {
        'ru-RU': canonicalURL,
      },
    }
  }

  // Add robots meta
  if (seo?.noIndex) {
    metadata.robots = {
      index: false,
      follow: true,
      nocache: true,
      googleBot: {
        index: false,
        follow: true,
        noimageindex: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    }
  } else {
    metadata.robots = {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    }
  }

  // Generate JSON-LD structured data
  const jsonLdSchemas = generateJsonLd({
    title: String(title),
    description,
    canonicalURL,
    pathname,
    image: ogImage,
  })

  // Add JSON-LD scripts
  const scripts: NonNullable<Metadata['other']> = {}
  jsonLdSchemas.forEach((schema, index) => {
    scripts[`application/ld+json-${index}`] = JSON.stringify(schema)
  })
  
  metadata.other = {
    ...metadata.other,
    ...scripts,
  }

  return metadata
}
