import { textEditor } from '@/payload/fields/lexical/textEditor'
import { en } from '@/payload/i18n/en'
import { ru } from '@/payload/i18n/ru'
import { Field } from 'payload'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  interfaceName: 'PageHero',
  label: {
    en: 'Hero',
    ru: 'Первый экран',
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'standard',
      label: {
        en: 'Type',
        ru: 'Тип',
      },
      admin: {
        isClearable: false,
      },
      options: [
        {
          label: {
            en: 'Standard',
            ru: 'Стандартный',
          },
          value: 'standard',
        },
        {
          label: {
            en: 'Primary',
            ru: 'Основная',
          },
          value: 'primary',
        },
      ],
    },
    {
      name: 'primary',
      type: 'group',
      label: false,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'primary',
        hideGutter: true,
      },
      fields: [
        {
          name: 'prefix',
          type: 'text',
        },
        {
          name: 'suffix',
          type: 'text',
        },
        {
          name: 'cover',
          label: {
            en: en.common.cover,
            ru: ru.common.cover,
          },
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'images',
          type: 'upload',
          label: {
            en: en.common.image.plural,
            ru: ru.common.image.plural,
          },
          relationTo: 'media',
          hasMany: true,
          minRows: 0,
          maxRows: 3,
        },
      ],
    },
    {
      name: 'default',
      type: 'group',
      label: false,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'standard',
        hideGutter: true,
      },
      fields: [
        {
          name: 'richText',
          label: {
            en: 'Rich Text',
            ru: 'Форматированный текст',
          },
          type: 'richText',
          editor: textEditor({ headings: ['h1'] }),
        },
      ],
    },

    // {
    //   type: 'group',
    //   name: 'settings',
    //   label: {
    //     en: en.common.setting.plural,
    //     ru: ru.common.setting.plural,
    //   },
    //   admin: {
    //     condition: (_, siblingData) => siblingData?.type === 'standard',
    //   },
    //   fields: [
    //     {
    //       type: 'row',
    //       fields: [
    //         selectSize({
    //           overrides: {
    //             name: 'paddingTop',
    //             label: {
    //               en: 'Padding Top',
    //               ru: 'Отступ сверху',
    //             },
    //             admin: { width: '50%' },
    //           },
    //         }),
    //         selectSize({
    //           overrides: {
    //             name: 'paddingBottom',
    //             label: {
    //               en: 'Padding Bottom',
    //               ru: 'Отступ снизу',
    //             },
    //             admin: { width: '50%' },
    //           },
    //         }),
    //       ],
    //     },
    //   ],
    // },
  ],
}
