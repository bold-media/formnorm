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
      name: 'alignment',
      type: 'select',
      options: [
        {
          label: {
            en: 'Left',
            ru: 'По левому краю',
          },
          value: 'left',
        },
        {
          label: {
            en: 'Centered',
            ru: 'По центру',
          },
          value: 'centered',
        },
        {
          label: {
            en: 'Right',
            ru: 'По правому краю',
          },
          value: 'right',
        },
      ],
    },
  ],
}
