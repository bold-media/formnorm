import {
  AlignFeature,
  BlockquoteFeature,
  BlocksFeature,
  BoldFeature,
  EXPERIMENTAL_TableFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  InlineCodeFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  StrikethroughFeature,
  UnderlineFeature,
  UnorderedListFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical'
// import { Blocks } from './blocks'
import { MutedTextFeature } from './features/MutedText/feature.server'

export const rootEditor = lexicalEditor({
  features: () => {
    return [
      MutedTextFeature(),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      StrikethroughFeature(),
      InlineCodeFeature(),
      ParagraphFeature(),
      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3'] }),
      AlignFeature(),
      IndentFeature(),
      UnorderedListFeature(),
      OrderedListFeature(),
      BlockquoteFeature(),
      HorizontalRuleFeature(),
      InlineToolbarFeature(),
      LinkFeature({
        fields: ({ defaultFields }) => {
          return [
            ...defaultFields,
            {
              name: 'variant',
              type: 'select',
              defaultValue: 'orange',
              options: [
                {
                  label: {
                    en: 'Black',
                    ru: 'Черная',
                  },
                  value: 'black',
                },
                {
                  label: {
                    en: 'Orange',
                    ru: 'Оранжевая',
                  },
                  value: 'orange',
                },
              ],
            },
          ]
        },
      }),
      EXPERIMENTAL_TableFeature(),
    ]
  },
})
