import { link } from '@/payload/fields/link'
import { Block } from 'payload'

export const CardDownload: Block = {
  slug: 'cardDownload',
  interfaceName: 'CardDownloadBlockType',
  labels: {
    singular: {
      en: 'Card Download',
      ru: 'Карточка загрузки',
    },
    plural: {
      en: 'Download Card',
      ru: 'Карточки загрузки',
    },
  },
  fields: [
    // {
    //   name: 'image',
    //   type: 'upload',
    //   relationTo: 'media',
    //   label: {
    //     en: en.common.image.singular,
    //     ru: ru.common.image.singular,
    //   },
    // },
    link({
      appearances: false,
    }),
  ],
}
