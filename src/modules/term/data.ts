import { BasePayload, getPayload } from 'payload'
import config from '@payload-config'
import { cache } from '@/utils/cache'
import { draftMode } from 'next/headers'
import { ServiceSelect, TermSelect } from '@payload-types'

const getTermData = async (slug: string, draft: boolean) => {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'term',
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

export const getCachedTermData = cache(
  async (slug: string) => {
    console.log(`Cache Miss for term slug: ${slug}`)
    return getTermData(slug, false)
  },
  { tags: (slug) => [slug, 'Term'] },
)

export const getTermBySlug = async (slug: string) => {
  try {
    const { isEnabled: draft } = await draftMode()

    if (draft) {
      return getTermData(slug, true)
    }

    return getCachedTermData(slug)
  } catch (error) {
    console.error('Error fetching Term:', error)
    return null
  }
}

type TermsQueryOptions = Parameters<BasePayload['find']>[0] & {
  collection: 'term'
  select: TermSelect
}

const getRecentTermsData = async ({ limit }: { limit: number }, draft: boolean) => {
  const payload = await getPayload({ config })

  const queryOptions: TermsQueryOptions = {
    collection: 'term',
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

const getCachedRecentTermsData = cache(
  async ({ limit }: { limit: number }) => {
    console.log(`Cache miss for recent terms...`)
    return getRecentTermsData({ limit }, false)
  },
  { tags: ['term'] },
)

export const getRecentTerms = async ({ limit = 5 }) => {
  try {
    const { isEnabled: draft } = await draftMode()

    if (draft) {
      return getRecentTermsData({ limit }, true)
    }

    return getCachedRecentTermsData({ limit })
  } catch (error) {
    console.error('Error fetching recent terms:', error)
    return []
  }
}

export const getAllTermsData = async ({ draft }: { draft: boolean }) => {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'term',
    draft,
    limit: 0,
    pagination: false,
    overrideAccess: draft,
    disableErrors: true,
  })

  return docs || []
}

export const getCachedAllTermsData = cache(
  async () => {
    console.log(`Cache Miss for all terms`)
    return getAllTermsData({ draft: false })
  },
  { tags: ['term'] },
)

export const getAllTerms = async () => {
  try {
    const { isEnabled: draft } = await draftMode()

    if (draft) {
      return getAllTermsData({ draft: true })
    }

    return getCachedAllTermsData()
  } catch (error) {
    console.error('Error fetching terms:', error)
    return []
  }
}
