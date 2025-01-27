import { getPayload } from 'payload'
import config from '@payload-config'
import { cache } from '@/utils/cache'
import { draftMode } from 'next/headers'

const getProjectData = async (slug: string, draft: boolean) => {
  const payload = await getPayload({ config })

  const { docs: projects } = await payload.find({
    collection: 'project',
    limit: 1,
    draft: draft,
    overrideAccess: draft,
    pagination: false,
    disableErrors: true,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return projects?.[0] || null
}

const getCachedProjectData = cache(
  async (slug: string) => {
    console.log(`Cache Miss at: /project/${slug}`)
    return getProjectData(slug, false)
  },
  { tags: (slug) => [slug] },
)

export const getProjectBySlug = async (slug: string) => {
  try {
    const { isEnabled: draft } = await draftMode()

    if (draft) {
      return getProjectData(slug, true)
    }

    return getCachedProjectData(slug)
  } catch (error) {
    console.error('Error fetching project:', error)
    return null
  }
}

export const getAllProjectsData = async ({
  draft,
}: {
  categorySlug?: string | undefined
  draft: boolean
}) => {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'project',
    draft,
    limit: 0,
    pagination: false,
    overrideAccess: draft,
    disableErrors: true,
  })

  return docs || []
}
export const getCachedAllProjectsData = cache(
  async (categorySlug?: string) => {
    console.log(`Cache Miss for posts with collection slug: ${categorySlug}`)
    return getAllProjectsData({ categorySlug, draft: false })
  },
  { tags: (categorySlug) => [categorySlug, 'post'].filter(Boolean) },
)

export const getAllProjects = async (categorySlug?: string) => {
  try {
    const { isEnabled: draft } = await draftMode()

    if (draft) {
      return getAllProjectsData({ categorySlug, draft: true })
    }

    return getCachedAllProjectsData(categorySlug)
  } catch (error) {
    console.error('Error fetching post:', error)
    return []
  }
}
