import { textEditor } from '@/payload/fields/lexical/textEditor'
import { Block } from 'payload'
import { ButtonBlock } from '../Button'

export const GeographyBlock: Block = {
  slug: 'geography',
  interfaceName: 'GeographyBlockType',
  labels: {
    singular: {
      en: 'Table 2/1',
      ru: 'Таблица 2/1',
    },
    plural: {
      en: 'Tables 2/1',
      ru: 'Таблицы 2/1',
    },
  },
  fields: [
    {
      name: 'textLeft',
      label: {
        en: 'Text left',
        ru: 'Контент слева',
      },
      type: 'richText',
      editor: textEditor({ headings: ['h2', 'h3'], align: false }),
    },
    {
      name: 'textRight',
      label: {
        en: 'Text right',
        ru: 'Контент справа',
      },
      type: 'richText',
      editor: textEditor({ headings: ['h2', 'h3'], align: false, blocks: [ButtonBlock] }),
    },
    {
      name: 'enableBorder',
      type: 'checkbox',
      label: {
        en: 'Enable Border',
        ru: 'Рамка',
      },
    },
  ],
}
