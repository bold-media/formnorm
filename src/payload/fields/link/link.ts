import type { Field } from 'payload'
import { deepMerge } from '@/utils/deepMerge'
import { selectSize } from '../partials/selectSize'

export type LinkAppearances =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'black'
  | 'white'

export const appearanceOptions: Record<
  LinkAppearances,
  { label: { en: string; ru: string }; value: string }
> = {
  default: {
    label: {
      en: 'Primary',
      ru: 'Основная',
    },
    value: 'default',
  },
  secondary: {
    label: {
      en: 'Secondary',
      ru: 'Второстепенная',
    },
    value: 'secondary',
  },
  outline: {
    label: {
      en: 'Outline',
      ru: 'Контурная',
    },
    value: 'outline',
  },
  ghost: {
    label: {
      en: 'Ghost',
      ru: 'Призрачная',
    },
    value: 'ghost',
  },
  link: {
    label: {
      en: 'Anchor',
      ru: 'Ссылка',
    },
    value: 'link',
  },
  black: {
    label: {
      en: 'Black',
      ru: 'Чёрный',
    },
    value: 'black',
  },
  white: {
    label: {
      en: 'White',
      ru: 'Белый',
    },
    value: 'white',
  },
}

type LinkType = (options?: {
  appearances?: LinkAppearances[] | false
  disableLabel?: boolean
  overrides?: Record<string, unknown>
}) => Field

export const link: LinkType = ({ appearances, disableLabel = false, overrides = {} } = {}) => {
  const linkResult: Field = {
    name: 'link',
    type: 'group',
    label: {
      en: 'Link',
      ru: 'Ссылка',
    },
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            label: {
              en: 'Type',
              ru: 'Тип',
            },
            type: 'radio',
            admin: {
              layout: 'horizontal',
              width: '50%',
            },
            defaultValue: 'reference',
            options: [
              {
                label: {
                  en: 'Internal Link',
                  ru: 'Внутренняя ссылка',
                },
                value: 'reference',
              },
              {
                label: {
                  en: 'Custom URL',
                  ru: 'Кастомный URL',
                },
                value: 'custom',
              },
            ],
          },
          {
            name: 'newTab',
            type: 'checkbox',
            admin: {
              style: {
                alignSelf: 'flex-end',
              },
              width: '50%',
            },
            label: {
              en: 'Open in new tab',
              ru: 'Открыть в новой вкладке',
            },
          },
        ],
      },
    ],
  }

  const linkTypes: Field[] = [
    {
      name: 'reference',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
        width: '50%',
      },
      label: {
        en: 'Document to link to',
        ru: 'Ссылка на',
      },
      relationTo: ['page', 'service', 'term', 'post'],
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
        width: '50%',
      },
      label: {
        en: 'Custom URL',
        ru: 'Кастомная ссылка',
      },
      required: true,
    },
  ]

  if (!disableLabel) {
    linkTypes.map((linkType) => ({
      ...linkType,
      admin: {
        ...linkType.admin,
        width: '50%',
      },
    }))

    linkResult.fields.push({
      type: 'row',
      fields: [
        ...linkTypes,
        {
          name: 'label',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: {
            en: 'Label',
            ru: 'Текст',
          },
          required: true,
        },
      ],
    })
  } else {
    linkResult.fields = [...linkResult.fields, ...linkTypes]
  }

  if (appearances !== false) {
    let appearanceOptionsToUse = [
      appearanceOptions.default,
      appearanceOptions.secondary,
      appearanceOptions.outline,
      appearanceOptions.ghost,
      appearanceOptions.link,
      appearanceOptions.black,
      appearanceOptions.white,
    ]

    if (appearances) {
      appearanceOptionsToUse = appearances.map((option) => appearanceOptions[option])
    }

    linkResult.fields.push({
      type: 'row',
      fields: [
        {
          name: 'appearance',
          label: {
            en: 'Appearance',
            ru: 'Вид',
          },
          type: 'select',
          admin: {
            width: '33.333%',
            description: {
              en: 'Choose how the link should be rendered',
              ru: 'Выберите, как ссылка будет выглядеть.',
            },
          },
          defaultValue: 'default',
          options: appearanceOptionsToUse,
        },
        selectSize({
          variants: ['sm', 'md', 'lg', 'xl'],
          overrides: {
            defaultValue: 'md',
          },
        }),
        {
          name: 'icon',
          type: 'select',
          label: {
            en: 'Icon',
            ru: 'Иконка',
          },
          admin: {
            width: '33.333%',
          },
          defaultValue: 'none',
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
                en: 'Arrow Right',
                ru: 'Стрелка вправо',
              },
              value: 'arrowRight',
            },
            {
              label: {
                en: 'Arrow Left',
                ru: 'Стрелка влево',
              },
              value: 'arrowLeft',
            },
          ],
        },
      ],
    })
  }
  return deepMerge(linkResult, overrides)
}
