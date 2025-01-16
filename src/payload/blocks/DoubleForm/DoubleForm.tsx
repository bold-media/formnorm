import { link } from '@/payload/fields/link'
import { Block } from 'payload'

export const DoubleFormBlock: Block = {
  slug: 'doubleForm',
  interfaceName: 'DoubleFormBlockType',
  labels: {
    singular: {
      en: 'Double Form',
      ru: 'Двойная форма',
    },
    plural: {
      en: 'Double Forms',
      ru: 'Двойные формы',
    },
  },
  fields: [
    {
      name: 'forms',
      type: 'array',
      label: {
        en: 'Forms',
        ru: 'Формы',
      },
      labels: {
        singular: {
          en: 'Form',
          ru: 'Форма',
        },
        plural: {
          en: 'Forms',
          ru: 'Формы',
        },
      },
      minRows: 2,
      maxRows: 2,
      fields: [
        {
          name: 'form',
          type: 'relationship',
          relationTo: 'forms',
          required: true,
        },
        link({ appearances: false }),
      ],
    },
  ],
}
