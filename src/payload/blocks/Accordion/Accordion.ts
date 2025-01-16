import { textEditor } from '@/payload/fields/lexical/textEditor'
import { en } from '@/payload/i18n/en'
import { ru } from '@/payload/i18n/ru'
import { Block } from 'payload'

export const AccordionBlock: Block = {
  slug: 'accordion',
  interfaceName: 'AccordionBlockType',
  fields: [
    {
      name: 'items',
      type: 'array',
      label: {
        en: en.common.item.plural,
        ru: ru.common.item.plural,
      },
      labels: {
        singular: {
          en: en.common.item.singular,
          ru: ru.common.item.singular,
        },
        plural: {
          en: en.common.item.plural,
          ru: ru.common.item.plural,
        },
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: {
            en: en.common.title.singular,
            ru: ru.common.title.singular,
          },
        },
        {
          name: 'content',
          type: 'richText',
          label: {
            en: en.common.content,
            ru: ru.common.content,
          },
          editor: textEditor({ align: false, headings: false }),
        },
      ],
    },
  ],
}
