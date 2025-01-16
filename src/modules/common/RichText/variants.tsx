import { cva, type VariantProps } from 'class-variance-authority'
import { ComponentPropsWithRef } from 'react'
import type {
  SerializedEditorState,
  SerializedLexicalNode,
} from '@payloadcms/richtext-lexical/lexical'
import { TypographyVariantProps } from '@/styles/typography'

export const richTextVariants = cva(undefined, {
  variants: {
    container: {
      default: 'mx-auto px-4',
      post: 'max-w-[62.5rem] mx-auto px-4',
      true: 'px-4',
      false: 'max-w-none px-0',
    },
  },
  defaultVariants: {
    container: false,
  },
})

export interface RichTextProps
  extends ComponentPropsWithRef<'div'>,
    VariantProps<typeof richTextVariants> {
  data: SerializedEditorState<SerializedLexicalNode> | undefined | null
  prose?: TypographyVariantProps | false
  tag?: 'div' | 'section' | 'article' | null | undefined
  wrapperClassName?: string
}
