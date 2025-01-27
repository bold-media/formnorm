import { Category } from '@payload-types'
import { revalidatePath, revalidateTag } from 'next/cache'
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

const revalidate = (slug: string) => {
  revalidateTag(slug)
  revalidateTag('category')
  revalidatePath('(app)/[[...segments]]', 'page')
  revalidatePath('(app)/post/[slug]', 'page')
}

export const revalidateCategory: CollectionAfterChangeHook<Category> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate && doc?.slug) {
    payload.logger.info(`Revalidating category with slug: ${doc?.slug}`)

    revalidate(doc?.slug)
  }
  return doc
}

export const revalidateCategoryDelete: CollectionAfterDeleteHook<Category> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate && doc?.slug) {
    revalidate(doc?.slug)
  }
}
