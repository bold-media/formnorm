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
    {
      name: 'aspectRatio',
      type: 'select',
      label: {
        en: 'Aspect ratio',
        ru: 'Соотношение сторон',
      },
      options: [
        {
          label: 'Video',
          value: 'video',
        },
        {
          label: 'Square',
          value: 'square',
        },
        {
          label: '4/3',
          value: 'fourThree',
        },
      ],
    },
    {
      name: 'format',
      type: 'select',
      defaultValue: 'cover',
      options: [
        {
          label: 'Cover',
          value: 'cover',
        },
        {
          label: 'Contain',
          value: 'contain',
        },
      ],
    },
    {
      name: 'scale',
      type: 'number',
      label: {
        en: 'Scale',
        ru: 'Размер в %',
      },
      min: 1,
      max: 100,
    },
    {
      name: 'lightbox',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
