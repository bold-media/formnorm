import { seoPlugin } from '@payloadcms/plugin-seo'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { Page, Post, Service, Project, Term, Category } from '@payload-types'

// Type for collections that have SEO fields
type SEOCollection = Page | Post | Service | Project | Term | Category

const generateTitle: GenerateTitle<SEOCollection> = ({ doc, collectionSlug }) => {
  // Category uses 'name' field instead of 'title'
  const title =
    collectionSlug === 'category'
      ? (doc as Category)?.name
      : (doc as Page | Post | Service | Project | Term)?.title

  return title
    ? `${title} | ${process.env.NEXT_PUBLIC_APP_NAME}`
    : process.env.NEXT_PUBLIC_SITE_NAME!
}

const generateURL: GenerateURL<SEOCollection> = ({
  doc,
  collectionSlug,
  globalSlug,
  preferencesKey,
}) => {
  const baseURL = process.env.NEXT_PUBLIC_APP_URL || ''

  if (collectionSlug) {
    switch (collectionSlug) {
      case 'page':
        return `${baseURL}${(doc as Page)?.pathname === '/' ? '' : (doc as Page)?.pathname}`
      case 'post':
        return `${baseURL}/post/${(doc as Post)?.slug}`
      case 'service':
        return `${baseURL}/service/${(doc as Service)?.slug}`
      case 'project':
        return `${baseURL}/project/${(doc as Project)?.slug}`
      case 'term':
        return `${baseURL}/term/${(doc as Term)?.slug}`
      case 'category':
        return `${baseURL}/blog/${(doc as Category)?.slug}`
      default:
        return baseURL
    }
  }

  // Handle globals
  if (globalSlug === 'settings') {
    // Default for settings - this will be overridden by custom preview components
    return baseURL
  }

  return baseURL
}

export const seo = seoPlugin({
  generateTitle,
  generateURL,
})
