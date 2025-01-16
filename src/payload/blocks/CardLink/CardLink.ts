import { link } from '@/payload/fields/link'
import { en } from '@/payload/i18n/en'
import { ru } from '@/payload/i18n/ru'
import { Block } from 'payload'

export const CardLink: Block = {
  slug: 'cardLink',
  interfaceName: 'CardLinkBlockType',
  labels: {
    singular: {
      en: 'Card Link',
      ru: '',
    },
    plural: {
      en: 'Card Links',
      ru: '',
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
    link({
      appearances: false,
    }),
  ],
}
