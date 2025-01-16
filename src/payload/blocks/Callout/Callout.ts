import { selectSize } from '@/payload/fields/partials/selectSize'
import { en } from '@/payload/i18n/en'
import { ru } from '@/payload/i18n/ru'
import { Block } from 'payload'

export const CalloutBlock: Block = {
  slug: 'callout',
  interfaceName: 'CalloutBlockType',
  fields: [
    {
      name: 'text',
      type: 'textarea',
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
            selectSize({
              overrides: {
                name: 'margin',
                label: {
                  en: en.common.margin,
                  ru: ru.common.margin,
                },
              },
            }),
          ],
        },
      ],
    },
  ],
}
