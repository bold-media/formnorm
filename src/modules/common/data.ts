import { getPayload, type TransformCollectionWithSelect } from 'payload'
import { Config } from '@payload-types'
import config from '@payload-config'
import { draftMode } from 'next/headers'
import { cache } from '@/utils/cache'
import { SelectFromCollectionSlug } from 'node_modules/payload/dist/collections/config/types'

export const getSettings = cache(
  async () => {
    const payload = await getPayload({ config })
    const settings = await payload
      .findGlobal({ slug: 'settings' })
      .then((res) => res)
      .catch(() => null)
    return settings
  },
  { tags: [`settings`] },
)

// Helper function to get page data without caching
const getPageData = async (pathname: string, draft: boolean) => {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'page',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    disableErrors: true,
    where: {
      pathname: {
        equals: pathname,
      },
    },
  })
  return docs?.[0] || null
}

const getCachedPageData = cache(
  async (pathname: string) => {
    console.log(`Cache Miss at: ${pathname}`)
    return getPageData(pathname, false)
  },
  { tags: (pathname) => [pathname] },
)

export const getPageByPathname = async (pathname: string) => {
  try {
    const { isEnabled: draft } = await draftMode()

    if (draft) {
      return getPageData(pathname, true)
    }

    return getCachedPageData(pathname)
  } catch (error) {
    console.error('Error fetching page:', error)
    return null
  }
}

type CollectionSelectKeys = keyof Config['collectionsSelect']

export const getArchiveData = async <T extends CollectionSelectKeys>(
  { collection }: { collection: T },
  draft: boolean,
): Promise<Config['collectionsSelect'][T][]> => {
  const payload = await getPayload({ config })

  // Provide both generic type arguments to payload.find
  const { docs } = await payload.find<
    T, // Collection slug type
    SelectFromCollectionSlug<T> // Select type
  >({
    collection: collection,
    draft,
    limit: 0,
    pagination: false,
    overrideAccess: draft,
    disableErrors: true,
  })

  // Return the docs, cast to the expected type
  return docs as Config['collectionsSelect'][T][]
}

export const getCachedArchiveData = cache(
  async <T extends CollectionSelectKeys>({
    collection,
  }: {
    collection: T
  }): Promise<Config['collectionsSelect'][T][]> => {
    console.log(`Cache Miss for Archive: ${collection}`)
    return getArchiveData({ collection }, false)
  },
  { tags: ({ collection }) => [collection] },
)

export const getArchive = async <T extends CollectionSelectKeys>({
  collection,
}: {
  collection: T
}): Promise<Config['collectionsSelect'][T][]> => {
  try {
    const { isEnabled: draft } = await draftMode()

    if (draft) {
      return getArchiveData({ collection }, true)
    }

    return getCachedArchiveData({ collection })
  } catch (error) {
    return []
  }
}
