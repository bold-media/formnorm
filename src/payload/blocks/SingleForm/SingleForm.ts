import { Block } from 'payload'

export const SingleFormBlock: Block = {
  slug: 'singleForm',
  interfaceName: 'SingleFormBlockType',
  labels: {
    singular: {
      en: 'Single Form',
      ru: 'Одиночная форма',
    },
    plural: {
      en: 'Single Forms',
      ru: 'Одиночные формы',
    },
  },
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
  ],
}
