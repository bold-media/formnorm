import Link from 'next/link'
import { SerializedAutoLinkNode, SerializedLinkNode } from '@payloadcms/richtext-lexical'
import { JSXConverters } from '@payloadcms/richtext-lexical/react'
import { cn } from '@/utils/cn'

export const LinkJSXConverter: (args: {
  internalDocToHref?: (args: { linkNode: SerializedLinkNode }) => string
}) => JSXConverters<SerializedAutoLinkNode | SerializedLinkNode> = ({ internalDocToHref }) => ({
  autolink: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({
      nodes: node.children,
    })

    const rel: string | undefined = node.fields.newTab ? 'noopener noreferrer' : undefined
    const target: string | undefined = node.fields.newTab ? '_blank' : undefined

    return (
      <a
        href={node.fields.url}
        {...{ rel, target }}
        className={cn(node.fields?.variant === 'orange' && 'text-[#ff8562]')}
      >
        {children}
      </a>
    )
  },
  link: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({
      nodes: node.children,
    })

    const rel: string | undefined = node.fields.newTab ? 'noopener noreferrer' : undefined
    const target: string | undefined = node.fields.newTab ? '_blank' : undefined

    let href: string | null = '#'
    if (node.fields.linkType === 'internal') {
      if (internalDocToHref) {
        href = internalDocToHref({ linkNode: node })
      } else {
        console.error(
          'Lexical => JSX converter: Link converter: found internal link, but internalDocToHref is not provided',
        )
        href = '#' // fallback
      }
    }

    return (
      <Link
        href={href}
        className={cn(node.fields?.variant === 'orange' && 'text-[#ff8562]')}
        {...{ rel, target }}
      >
        {children}
      </Link>
    )
  },
})
