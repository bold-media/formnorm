import {
  BlocksFeature,
  HeadingFeature,
  lexicalEditor,
  LexicalEditorProps,
} from '@payloadcms/richtext-lexical'
import { Block } from 'payload'
import { BlockKey, Blocks } from './blocks'

type Options = {
  admin?: LexicalEditorProps['admin']
  headings?: boolean | Array<'h1' | 'h2' | 'h3'>
  align?: boolean
  blocks?: Block[]
  removeBlocks?: BlockKey[]
}

export const nestedEditor = ({
  admin,
  headings = true,
  align = true,
  blocks = [],
  removeBlocks = [],
}: Options = {}) => {
  return lexicalEditor({
    admin,
    features({ rootFeatures }) {
      const filteredFeatures = rootFeatures.filter((feature) => {
        const featureName = feature?.key

        if (headings === false && featureName === 'heading') {
          return false
        }

        if (align === false && featureName === 'align') {
          return false
        }

        return true
      })

      const customizedFeatures = filteredFeatures.map((feature) => {
        const featureName = feature?.key

        if (featureName === 'heading' && Array.isArray(headings)) {
          return HeadingFeature({
            enabledHeadingSizes: headings,
          })
        }

        return feature
      })

      if (blocks && Array.isArray(blocks) && blocks?.length > 0) {
        customizedFeatures.push(BlocksFeature({ blocks }))
      } else {
        customizedFeatures.push(
          BlocksFeature({
            blocks: [
              ...Object.entries(Blocks)
                .filter(([key]) => !removeBlocks?.includes(key as BlockKey))
                .map(([_, value]) => value),
            ],
          }),
        )
      }

      return customizedFeatures
    },
  })
}
