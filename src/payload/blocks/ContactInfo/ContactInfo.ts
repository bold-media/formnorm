import { textEditor } from '@/payload/fields/lexical/textEditor'
import { link } from '@/payload/fields/link'
import { en } from '@/payload/i18n/en'
import { ru } from '@/payload/i18n/ru'
import { Block } from 'payload'

export const ContactInfoBlock: Block = {
  slug: 'contactInfo',
  interfaceName: 'ContactInfoBlockType',
  labels: {
    singular: {
      en: 'Contact Info',
      ru: 'Контактная информация',
    },
    plural: {
      en: 'Contact Info',
      ru: 'Контактная информация',
    },
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: {
        en: en.common.image.singular,
        ru: ru.common.image.singular,
      },
    },
    {
      name: 'text',
      label: {
        en: 'Text',
        ru: 'Текст',
      },
      type: 'richText',
      editor: textEditor({ headings: ['h2', 'h3'], align: false }),
    },
    {
      name: 'links',
      type: 'group',
      fields: [
        link({
          appearances: false,
          disableLabel: true,
          overrides: {
            name: 'whatsapp',
            label: 'WhatsApp',
          },
        }),
        link({
          appearances: false,
          disableLabel: true,
          overrides: {
            name: 'telegram',
            label: 'Telegram',
          },
        }),
        link({
          appearances: false,
          disableLabel: true,
          overrides: {
            name: 'email',
            label: 'Email',
          },
        }),
      ],
    },
  ],
}
