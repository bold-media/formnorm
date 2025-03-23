import { textEditor } from '@/payload/fields/lexical/textEditor'
import { Block } from 'payload'
import { ButtonBlock } from '../Button'
import { ImageBlock } from '../Image'
import { CarouselBlock } from '../Carousel'
import { selectSize } from '@/payload/fields/partials/selectSize'
import { en } from '@/payload/i18n/en'
import { ru } from '@/payload/i18n/ru'

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
      editor: textEditor({
        headings: ['h2', 'h3'],
        align: false,
        blocks: [ButtonBlock, ImageBlock, CarouselBlock],
      }),
    },
    {
      name: 'textRight',
      label: {
        en: 'Text right',
        ru: 'Контент справа',
      },
      type: 'richText',
      editor: textEditor({
        headings: ['h2', 'h3'],
        align: false,
        blocks: [ButtonBlock, ImageBlock, CarouselBlock],
      }),
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
            en: '1/3',
            ru: '1/3',
          },
          value: 'third',
        },
        {
          label: {
            en: '2/5',
            ru: '2/5',
          },
          value: 'twofifths',
        },
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
    {
      type: 'collapsible',
      label: {
        en: 'Settings',
        ru: 'Настройки',
      },
      admin: {
        initCollapsed: true,
        style: {
          marginBottom: 0,
        },
      },
      fields: [
        {
          name: 'settings',
          label: false,
          type: 'group',
          admin: {
            hideGutter: true,
          },
          fields: [
            {
              type: 'row',
              fields: [
                selectSize({
                  overrides: {
                    name: 'gap',
                    defaultValue: 'md',
                    label: {
                      en: en.common.gap.singular,
                      ru: ru.common.gap.singular,
                    },
                  },
                }),
                {
                  name: 'verticalAlign',
                  type: 'select',
                  defaultValue: 'none',
                  label: {
                    en: 'Vertical Alignment',
                    ru: 'Вертикальное выравнивание',
                  },
                  admin: {
                    width: '50%',
                  },
                  options: [
                    {
                      label: {
                        en: 'None',
                        ru: 'Нет',
                      },
                      value: 'none',
                    },
                    {
                      label: {
                        en: 'Top',
                        ru: 'По верхнему краю',
                      },
                      value: 'top',
                    },
                    {
                      label: {
                        en: 'Center',
                        ru: 'По центру',
                      },
                      value: 'center',
                    },
                    {
                      label: {
                        en: 'Bottom',
                        ru: 'По нижнему краю',
                      },
                      value: 'bottom',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
