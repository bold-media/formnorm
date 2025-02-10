import { selectSize } from '@/payload/fields/partials/selectSize'
import { en } from '@/payload/i18n/en'
import { ru } from '@/payload/i18n/ru'
import { Block } from 'payload'
import { nestedEditor } from '../../fields/lexical/nestedEditor'
import { selectColumns } from '@/payload/fields/partials/selectColumns'

export const GridBlock: Block = {
  slug: 'grid',
  interfaceName: 'GridBlockType',
  labels: {
    singular: {
      en: 'Grid',
      ru: 'Сетка',
    },
    plural: {
      en: 'Grids',
      ru: 'Сетки',
    },
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'content',
          type: 'richText',
          editor: nestedEditor({ removeBlocks: ['grid', 'container'], headings: ['h2', 'h3'] }),
        },
        {
          type: 'collapsible',
          label: {
            en: en.common.setting.plural,
            ru: ru.common.setting.plural,
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
                    {
                      name: 'horizontalAlign',
                      type: 'select',
                      defaultValue: 'none',
                      label: {
                        en: 'Horizontal Alignment',
                        ru: 'Горизонтальное выравнивание',
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
                            en: 'Left',
                            ru: 'Слева',
                          },
                          value: 'left',
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
                            en: 'Right',
                            ru: 'Справа',
                          },
                          value: 'right',
                        },
                      ],
                    },
                    {
                      name: 'verticalAlign',
                      type: 'select',
                      label: {
                        en: 'Vertical Alignment',
                        ru: 'Вертикальное выравнивание',
                      },
                      defaultValue: 'none',
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
                            ru: 'Сверху',
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
                            ru: 'Снизу',
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
    },
    {
      type: 'collapsible',
      label: {
        en: en.common.setting.plural,
        ru: ru.common.setting.plural,
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
                    name: 'margin',
                    defaultValue: 'none',
                    label: {
                      en: en.common.margin,
                      ru: ru.common.margin,
                    },
                  },
                }),
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
              ],
            },
            {
              name: 'columns',
              type: 'group',
              label: {
                en: en.common.column.plural,
                ru: ru.common.column.plural,
              },
              admin: {
                hideGutter: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    selectColumns({
                      overrides: {
                        name: 'mobile',
                        defaultValue: '1',
                        label: {
                          en: en.common.mobile,
                          ru: ru.common.mobile,
                        },
                      },
                    }),
                    selectColumns({
                      overrides: {
                        name: 'tablet',
                        defaultValue: '2',
                        label: {
                          en: en.common.tablet,
                          ru: ru.common.tablet,
                        },
                      },
                    }),
                    selectColumns({
                      overrides: {
                        name: 'desktop',
                        defaultValue: '3',
                        label: {
                          en: en.common.desktop,
                          ru: ru.common.desktop,
                        },
                      },
                    }),
                  ],
                },
              ],
            },
            {
              type: 'group',
              name: 'fullWidth',
              label: 'Во весь экран',
              fields: [
                {
                  name: 'mobile',
                  type: 'checkbox',
                  defaultValue: false,
                },
                {
                  name: 'tablet',
                  type: 'checkbox',
                  defaultValue: false,
                },
                {
                  name: 'desktop',
                  type: 'checkbox',
                  defaultValue: false,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
