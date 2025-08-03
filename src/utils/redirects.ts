import { getPayload } from 'payload'
import config from '@payload-config'
import { cache } from '@/utils/cache'
import { redirect } from 'next/navigation'

type RedirectType = {
  id: string
  from: string
  to: {
    type: 'reference' | 'custom'
    reference?: {
      relationTo: string
      value: {
        id: string
        pathname?: string
        slug?: string
      }
    }
    url?: string
  }
  type: number
  createdAt: string
  updatedAt: string
}

const getRedirectsData = async () => {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'redirects',
    depth: 1,
    limit: 0,
    pagination: false,
  })

  return docs as RedirectType[]
}

export const getCachedRedirects = cache(
  async () => {
    console.log('Cache miss for redirects')
    return getRedirectsData()
  },
  { tags: ['redirects'] },
)

export const getRedirects = async () => {
  try {
    return getCachedRedirects()
  } catch (error) {
    console.error('Error fetching redirects:', error)
    return []
  }
}

export const checkAndRedirect = async (pathname: string): Promise<void> => {
  const redirects = await getRedirects()
  
  const matchedRedirect = redirects.find(
    (redirect) => redirect.from === pathname
  )

  if (!matchedRedirect) {
    return
  }

  let redirectTo: string | null = null

  if (matchedRedirect.to.type === 'custom' && matchedRedirect.to.url) {
    redirectTo = matchedRedirect.to.url
  } else if (
    matchedRedirect.to.type === 'reference' &&
    matchedRedirect.to.reference?.value
  ) {
    const { relationTo, value } = matchedRedirect.to.reference
    
    // Build the URL based on the collection type
    switch (relationTo) {
      case 'page':
        redirectTo = value.pathname || '/'
        break
      case 'post':
        redirectTo = `/post/${value.slug}`
        break
      case 'service':
        redirectTo = `/service/${value.slug}`
        break
      case 'project':
        redirectTo = `/project/${value.slug}`
        break
      case 'term':
        redirectTo = `/term/${value.slug}`
        break
      case 'category':
        redirectTo = `/blog/${value.slug}`
        break
      default:
        console.warn(`Unknown redirect relation: ${relationTo}`)
    }
  }

  if (redirectTo) {
    redirect(redirectTo)
  }
}