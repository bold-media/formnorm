import { Project } from '@payload-types'
import { revalidatePath, revalidateTag } from 'next/cache'
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

const revalidate = (slug: string) => {
  revalidateTag(slug)
  revalidateTag('project')
  revalidatePath('(app)/project/[slug]', 'page')
  revalidatePath('(app)/[[...segments]]', 'page')
}

export const revalidateProject: CollectionAfterChangeHook<Project> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate && doc?.slug) {
    if (doc._status === 'published') {
      payload.logger.info(`Revalidating project by slug: ${doc?.slug}`)

      revalidate(doc?.slug)
    }

    if (previousDoc?._status === 'published' && doc?._status !== 'published' && previousDoc?.slug) {
      payload.logger.info(`Revalidating project by slug: ${doc.slug}`)

      revalidate(previousDoc?.slug)
    }
  }

  return doc
}

export const revalidateProjectDelete: CollectionAfterDeleteHook<Project> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate && doc?.slug) {
    revalidate(doc?.slug)
  }

  return doc
}
