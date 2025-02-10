import { textEditor } from '@/payload/fields/lexical/textEditor'
import { Block } from 'payload'
import { ButtonBlock } from '../Button'

export const ContainerBlock: Block = {
  slug: 'container',
  interfaceName: 'ContainerBlockType',
  labels: {
    singular: {
      en: 'Container',
      ru: 'Контейнер',
    },
    plural: {
      en: 'Containers',
      ru: 'Контейнеры',
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
      name: 'enableSize',
      label: {
        en: 'Choose the size',
        ru: 'Выбрать размер',
      },
      type: 'select',
      options: [
        {
          label: {
            en: '1/2',
            ru: '1/2',
          },
          value: 'half',
        },
        {
          label: {
            en: '2/3',
            ru: '2/3',
          },
          value: 'twothirds',
        },
        {
          label: {
            en: '3/4',
            ru: '3/4',
          },
          value: 'threefourths',
        },
        {
          label: {
            en: '4/5',
            ru: '4/5',
          },
          value: 'fourfifths',
        },
        {
          label: {
            en: '5/6',
            ru: '5/6',
          },
          value: 'fivesixths',
        },
        // {
        //   label: {
        //     en: '6/7',
        //     ru: '6/7',
        //   },
        //   value: 'sixsevenths',
        // },
        // {
        //   label: {
        //     en: '7/8',
        //     ru: '7/8',
        //   },
        //   value: 'seveneights',
        // },
      ],
    },
  ],
}
