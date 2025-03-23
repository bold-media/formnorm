import { BlocksFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { LexicalEditorProps } from '@payloadcms/richtext-lexical'
import { Block } from 'payload'

type Options = {
  admin?: LexicalEditorProps['admin']
  headings?: boolean | Array<'h1' | 'h2' | 'h3'>
  align?: boolean
  blocks?: Block[]
}

export const textEditor = ({ admin, headings = true, align = true, blocks = [] }: Options = {}) => {
  return lexicalEditor({
    admin,
    features({ rootFeatures }) {
      const filteredFeatures = rootFeatures.filter((feature) => {
        const featureName = feature?.key
        const featuresToRemove = [
          // 'unorderedList',
          // 'orderedList',
          'blocks',
          'blockquote',
          'indent',
          'horizontalRule',
        ]

        if (headings === false && featureName === 'heading') {
          return false
        }

        if (align === false && featureName === 'align') {
          return false
        }

        return !featuresToRemove.includes(featureName)
      })

      const customizedFeatures = filteredFeatures.map((feature) => {
        const featureName = feature?.key

        if (featureName === 'heading' && Array.isArray(headings)) {
          return HeadingFeature({
            enabledHeadingSizes: headings,
          })
        }

        // if (featureName === 'blocks' && blocks && Array.isArray(blocks) && blocks.length > 0) {
        //   return BlocksFeature({ blocks })
        // }

        return feature
      })

      if (blocks && Array.isArray(blocks) && blocks?.length > 0) {
        customizedFeatures.push(BlocksFeature({ blocks }))
      }

      return customizedFeatures
    },
  })
}
