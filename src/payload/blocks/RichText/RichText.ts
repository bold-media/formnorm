import { en } from '@/payload/i18n/en'
import { ru } from '@/payload/i18n/ru'
import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { Block } from 'payload'
import { AccordionBlock } from '../Accordion'

export const RichTextBlock: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlockType',
  fields: [
    {
      name: 'data',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          BlocksFeature({ blocks: [AccordionBlock] }),
        ],
      }),
    },
    {
      type: 'collapsible',
      label: {
        en: en.common.setting.plural,
        ru: ru.common.setting.plural,
      },
      admin: {
        initCollapsed: true,
        style: {
          marginBottom: 0,
        },
      },
      fields: [
        {
          name: 'settings',
          label: false,
          type: 'group',
          admin: {
            hideGutter: true,
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'tag',
                  type: 'select',
                  defaultValue: 'div',
                  options: [
                    {
                      label: '<div>',
                      value: 'div',
                    },
                    {
                      label: '<section>',
                      value: 'section',
                    },
                    {
                      label: '<article>',
                      value: 'article',
                    },
                  ],
                },
                {
                  name: 'container',
                  type: 'select',
                  defaultValue: 'default',
                  admin: {
                    width: '50%',
                  },
                  options: [
                    {
                      label: {
                        en: 'Default',
                        ru: '...',
                      },
                      value: 'default',
                    },
                    {
                      label: {
                        en: 'Post',
                        ru: '...',
                      },
                      value: 'post',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
