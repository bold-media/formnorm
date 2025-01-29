import { en } from '@/payload/i18n/en'
import { ru } from '@/payload/i18n/ru'
import { Block } from 'payload'

export const PriceBlock: Block = {
  slug: 'price',
  interfaceName: 'PriceBlockType',
  labels: {
    singular: {
      en: 'Price',
      ru: 'Цена',
    },
    plural: {
      en: 'Prices',
      ru: 'Цены',
    },
  },
  fields: [
    {
      name: 'title',
      label: {
        en: en.common.title.singular,
        ru: ru.common.title.singular,
      },
      type: 'text',
    },
    {
      name: 'prices',
      label: {
        en: 'Prices',
        ru: 'Цены',
      },
      type: 'array',
      fields: [
        {
          name: 'price',
          label: {
            en: 'Price',
            ru: 'Цена',
            type: 'text',
          },
          type: 'text',
        },
        {
          name: 'text',
          label: {
            en: 'Text',
            ru: 'Текст',
            type: 'text',
          },
          type: 'text',
        },
      ],
    },

    {
      name: 'button',
      label: {
        en: 'Buttons text',
        ru: 'Текст кнопки',
      },
      type: 'text',
    },
  ],
}
