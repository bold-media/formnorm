import { revalidatePath } from 'next/cache'
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

export const revalidate: CollectionAfterChangeHook = () => {
  revalidatePath('(app)/[[...segments]]', 'page')
  return
}

export const revalidateDelete: CollectionAfterDeleteHook = () => {
  revalidatePath('(app)/[[...segments]]', 'page')
  return
}
