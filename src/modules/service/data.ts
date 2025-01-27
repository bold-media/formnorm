import { BasePayload, getPayload } from 'payload'
import config from '@payload-config'
import { cache } from '@/utils/cache'
import { draftMode } from 'next/headers'
import { ServiceSelect } from '@payload-types'

const getServiceData = async (slug: string, draft: boolean) => {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'service',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    disableErrors: true,
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  return docs?.[0] || null
}

export const getCachedServiceData = cache(
  async (slug: string) => {
    console.log(`Cache Miss for service slug: ${slug}`)
    return getServiceData(slug, false)
  },
  { tags: (slug) => [slug, 'service'] },
)

export const getServiceBySlug = async (slug: string) => {
  try {
    const { isEnabled: draft } = await draftMode()

    if (draft) {
      return getServiceData(slug, true)
    }

    return getCachedServiceData(slug)
  } catch (error) {
    console.error('Error fetching service:', error)
    return null
  }
}

type ServicesQueryOptions = Parameters<BasePayload['find']>[0] & {
  collection: 'service'
  select: ServiceSelect
}

const getRecentServicesData = async ({ limit }: { limit: number }, draft: boolean) => {
  const payload = await getPayload({ config })

  const queryOptions: ServicesQueryOptions = {
    collection: 'service',
    limit,
    overrideAccess: draft,
    select: {
      title: true,
      cover: true,
      excerpt: true,
      slug: true,
    },
    disableErrors: true,
  }

  const result = await payload.find(queryOptions)
  return result?.docs ?? []
}

const getCachedRecentServicesData = cache(
  async ({ limit }: { limit: number }) => {
    console.log(`Cache miss for recent services...`)
    return getRecentServicesData({ limit }, false)
  },
  { tags: ['service'] },
)

export const getRecentServices = async ({ limit = 5 }) => {
  try {
    const { isEnabled: draft } = await draftMode()

    if (draft) {
      return getRecentServicesData({ limit }, true)
    }

    return getCachedRecentServicesData({ limit })
  } catch (error) {
    console.error('Error fetching recent services:', error)
    return []
  }
}

export const getAllServicesData = async ({ draft }: { draft: boolean }) => {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'service',
    draft,
    limit: 0,
    pagination: false,
    overrideAccess: draft,
    disableErrors: true,
  })

  return docs || []
}

export const getCachedAllServicesData = cache(
  async () => {
    console.log(`Cache Miss for all services`)
    return getAllServicesData({ draft: false })
  },
  { tags: ['service'] },
)

export const getAllServices = async () => {
  try {
    const { isEnabled: draft } = await draftMode()

    if (draft) {
      return getAllServicesData({ draft: true })
    }

    return getCachedAllServicesData()
  } catch (error) {
    console.error('Error fetching services:', error)
    return []
  }
}
