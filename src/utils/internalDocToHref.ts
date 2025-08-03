import { SerializedLinkNode } from '@payloadcms/richtext-lexical'

export const internalDocToHref = ({
  linkNode,
}: {
  linkNode: SerializedLinkNode | { relationTo: string; value: any }
}): string => {
  const relationTo = 'fields' in linkNode ? linkNode.fields?.doc?.relationTo : linkNode.relationTo
  const value = 'fields' in linkNode ? linkNode.fields?.doc?.value : linkNode.value

  if (!value || typeof value !== 'object') return '/'

  switch (relationTo) {
    case 'page':
      return `${value?.pathname}`
    case 'post':
      return `/post/${value?.slug}`
    case 'term':
      return `/term/${value?.slug}`
    case 'service':
      return `/service/${value?.slug}`
    case 'category':
      return `/blog/${value?.slug}`
    case 'project':
      return `/project/${value?.slug}`
    default:
      return '/'
  }
}
