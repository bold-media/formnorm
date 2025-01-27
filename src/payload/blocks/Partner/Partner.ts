import { textEditor } from '@/payload/fields/lexical/textEditor'
import { en } from '@/payload/i18n/en'
import { ru } from '@/payload/i18n/ru'
import { Block } from 'payload'

export const PartnerBlock: Block = {
  slug: 'partner',
  interfaceName: 'PartnerBlockType',
  labels: {
    singular: {
      en: 'Partner',
      ru: 'Блок партнера',
    },
    plural: {
      en: 'Partners',
      ru: 'Блоки партнеров',
    },
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: {
        en: en.common.image.singular,
        ru: ru.common.image.singular,
      },
    },
    {
      name: 'text',
      label: {
        en: 'Text',
        ru: 'Текст',
      },
      type: 'richText',
      editor: textEditor({ headings: ['h2', 'h3'], align: false }),
    },
  ],
}
