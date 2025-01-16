import { en } from '@/payload/i18n/en'
import { ru } from '@/payload/i18n/ru'
import { Block } from 'payload'

export const EmbedBlock: Block = {
  slug: 'embed',
  interfaceName: 'EmbedBlockType',
  labels: {
    singular: {
      en: en.common.embed.singular,
      ru: ru.common.embed.singular,
    },
    plural: {
      en: en.common.embed.plural,
      ru: ru.common.embed.plural,
    },
  },
  fields: [
    {
      name: 'code',
      label: {
        en: en.common.code,
        ru: ru.common.code,
      },
      type: 'textarea',
      required: true,
    },
    {
      name: 'landscapeVideo',
      type: 'checkbox',
      defaultValue: false,
      label: {
        en: 'Video Aspect Ratio (16/9)',
        ru: 'Соотношение сторон видео (16/9)',
      },
    },
  ],
}
