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
      name: 'price',
      label: {
        en: 'Price',
        ru: 'Цена',
      },
      type: 'text',
    },
    {
      name: 'text',
      label: {
        en: 'Text',
        ru: 'Текст',
      },
      type: 'text',
    },
  ],
}
