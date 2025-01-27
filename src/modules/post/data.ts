import { BasePayload, getPayload } from 'payload'
import config from '@payload-config'
import { cache } from '@/utils/cache'
import { draftMode } from 'next/headers'
import { Category, PostSelect } from '@payload-types'

const getPostData = async (slug: string, draft: boolean) => {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'post',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    disableErrors: true,
    depth: 2,
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  console.log('Post data:', docs?.[0])
  return docs?.[0] || null
}

export const getCachedPostData = cache(
  async (slug: string) => {
    console.log(`Cache Miss for article slug: ${slug}`)
    return getPostData(slug, false)
  },
  { tags: (slug) => [slug, 'post'] },
)

export const getPostBySlug = async (slug: string) => {
  try {
    const { isEnabled: draft } = await draftMode()

    if (draft) {
      return getPostData(slug, true)
    }

    return getCachedPostData(slug)
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export const getAllCategories = cache(
  async () => {
    try {
      const payload = await getPayload({ config })
      const results = await payload.find({
        collection: 'category',
        limit: 100,
        pagination: false,
      })

      return results?.docs
    } catch (error) {
      console.error('Error fetching category by slug:', error)
      return []
    }
  },
  { tags: ['category'] },
)

type PaginatedPostsProps = {
  page: number
  category: string | null
}

type PostsQueryOptions = Parameters<BasePayload['find']>[0] & {
  collection: 'post'
  select: PostSelect
}

export const getPaginatedPostsData = async ({ category, page }: PaginatedPostsProps) => {
  const payload = await getPayload({ config })

  const queryOptions: PostsQueryOptions = {
    collection: 'post',
    disableErrors: false,
    select: {
      title: true,
      cover: true,
      excerpt: true,
      slug: true,
    },
    limit: 10,
    page,
  }

  if (category) {
    return await payload.find({
      ...queryOptions,
      where: {
        categories: {
          contains: category,
        },
      },
    })
  }

  return await payload.find(queryOptions)
}

export const getCachedPaginatedPosts = cache(
  async ({ category, page }: PaginatedPostsProps) => getPaginatedPostsData({ category, page }),
  { tags: ({ category }) => ['post'].concat(category ? [category] : []) },
)

export const getPaginatedPosts = async ({ category, page }: PaginatedPostsProps) => {
  try {
    const { isEnabled: draft } = await draftMode()

    if (draft) {
      return getPaginatedPostsData({ category, page })
    }

    return getCachedPaginatedPosts({ category, page })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return null
  }
}

interface GetRecentPostsArgs {
  limit: number
  categories: (string | Category)[]
}
const getRecentPostsData = async ({ limit, categories }: GetRecentPostsArgs, draft: boolean) => {
  const payload = await getPayload({ config })

  // Base query options
  const queryOptions: PostsQueryOptions = {
    collection: 'post',
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

  // If categories are provided and it's an array, add the OR condition
  if (categories && Array.isArray(categories) && categories.length > 0) {
    const categoryConditions = categories.map((category) => ({
      categories: {
        equals: typeof category === 'string' ? category : category.id,
      },
    }))

    return payload
      .find({
        ...queryOptions,
        where: {
          or: categoryConditions,
        },
      })
      .then((result) => result?.docs ?? [])
  }

  // If no categories filter, return original query
  const result = await payload.find(queryOptions)
  return result?.docs ?? []
}

const getCachedRecentPostsData = cache(
  async ({ limit, categories }: GetRecentPostsArgs) => {
    console.log(`Cache miss for recent posts...`)
    return getRecentPostsData({ limit, categories }, false)
  },
  { tags: ['post'] },
)

export const getRecentPosts = async ({ limit = 5, categories }: GetRecentPostsArgs) => {
  try {
    const { isEnabled: draft } = await draftMode()

    if (draft) {
      return getRecentPostsData({ limit, categories }, true)
    }

    return getCachedRecentPostsData({ limit, categories })
  } catch (error) {
    console.error('Error fetching recent posts:', error)
    return []
  }
}

const getCategoryBySlug = async (slug: string) => {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'category',
    limit: 1,
    pagination: false,
    disableErrors: true,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return docs?.[0] || null
}

export const getAllPostsData = async ({
  categorySlug,
  draft,
}: {
  categorySlug?: string | undefined
  draft: boolean
}) => {
  const payload = await getPayload({ config })

  let category: Category | undefined

  if (categorySlug) {
    const result = await getCategoryBySlug(categorySlug)

    if (result) category = result
  }

  const { docs } = await payload.find({
    collection: 'post',
    draft,
    limit: 0,
    pagination: false,
    overrideAccess: draft,
    disableErrors: true,
    where: category
      ? {
          categories: {
            contains: category.id,
          },
        }
      : undefined,
  })

  return docs || []
}

export const getCachedAllPostsData = cache(
  async (categorySlug?: string) => {
    console.log(`Cache Miss for posts with collection slug: ${categorySlug}`)
    return getAllPostsData({ categorySlug, draft: false })
  },
  { tags: (categorySlug) => [categorySlug, 'post'].filter(Boolean) },
)

export const getAllPosts = async (categorySlug?: string) => {
  try {
    const { isEnabled: draft } = await draftMode()

    if (draft) {
      return getAllPostsData({ categorySlug, draft: true })
    }

    return getCachedAllPostsData(categorySlug)
  } catch (error) {
    console.error('Error fetching post:', error)
    return []
  }
}

export const getRelatedPosts = async (currentSlug: string, limit = 3) => {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'post',
    limit,
    pagination: false,
    where: {
      slug: {
        not_equals: currentSlug, // Исключает текущий пост
      },
    },
    depth: 1, // Загружаем связанные данные, если нужно
  })

  return docs
}
