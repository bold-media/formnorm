import { en } from '@/payload/i18n/en'
import { ru } from '@/payload/i18n/ru'
import { Block } from 'payload'

export const ImageBlock: Block = {
  slug: 'image',
  interfaceName: 'ImageBlockType',
  labels: {
    singular: {
      en: en.common.image.singular,
      ru: ru.common.image.plural,
    },
    plural: {
      en: en.common.image.plural,
      ru: ru.common.image.plural,
    },
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
