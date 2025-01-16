import { linkGroup } from '@/payload/fields/link/linkGroup'
import { align } from '@/payload/fields/partials/align'
import { manualSpace } from '@/payload/fields/partials/manualSpace'
import { en } from '@/payload/i18n/en'
import { ru } from '@/payload/i18n/ru'
import { Block } from 'payload'

export const ButtonBlock: Block = {
  slug: 'button',
  interfaceName: 'ButtonBlockType',
  fields: [
    linkGroup(),
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
              name: 'marginTop',
              type: 'group',
              label: {
                en: en.common.marginTop,
                ru: ru.common.marginTop,
              },
              admin: {
                hideGutter: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    manualSpace({
                      overrides: {
                        name: 'mobile',
                        label: {
                          en: en.common.mobile,
                          ru: ru.common.mobile,
                        },
                      },
                    }),
                    manualSpace({
                      overrides: {
                        name: 'tablet',
                        label: {
                          en: en.common.tablet,
                          ru: ru.common.tablet,
                        },
                      },
                    }),
                    manualSpace({
                      overrides: {
                        name: 'desktop',
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
              name: 'marginBottom',
              type: 'group',
              label: {
                en: en.common.marginBottom,
                ru: ru.common.marginBottom,
              },
              admin: {
                hideGutter: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    manualSpace({
                      overrides: {
                        name: 'mobile',
                        label: {
                          en: en.common.mobile,
                          ru: ru.common.mobile,
                        },
                      },
                    }),
                    manualSpace({
                      overrides: {
                        name: 'tablet',
                        label: {
                          en: en.common.tablet,
                          ru: ru.common.tablet,
                        },
                      },
                    }),
                    manualSpace({
                      overrides: {
                        name: 'desktop',
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
              name: 'align',
              type: 'group',
              label: {
                en: 'Align',
                ru: 'Выравнивание',
              },
              admin: {
                hideGutter: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    align({
                      overrides: {
                        name: 'mobile',
                        label: {
                          en: en.common.mobile,
                          ru: ru.common.mobile,
                        },
                      },
                    }),
                    align({
                      overrides: {
                        name: 'tablet',
                        label: {
                          en: en.common.tablet,
                          ru: ru.common.tablet,
                        },
                      },
                    }),
                    align({
                      overrides: {
                        name: 'desktop',
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
          ],
        },
      ],
    },
  ],
}
