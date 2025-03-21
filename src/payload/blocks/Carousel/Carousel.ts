import { en } from '@/payload/i18n/en'
import { ru } from '@/payload/i18n/ru'
import { Block } from 'payload'

export const CarouselBlock: Block = {
  slug: 'carousel',
  interfaceName: 'CarouselBlockType',
  labels: {
    singular: {
      en: 'Carousel',
      ru: 'Карусель',
    },
    plural: {
      en: 'Carousels',
      ru: 'Карусели',
    },
  },
  fields: [
    {
      name: 'images',
      label: {
        en: en.common.image.singular,
        ru: ru.common.image.singular,
      },
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
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
              name: 'enableDots',
              type: 'checkbox',
              label: {
                en: 'Enable Dots',
                ru: 'Пагинация',
              },
            },
            {
              name: 'enableThumbnails',
              type: 'checkbox',
              label: {
                en: 'Enable Thumbnails',
                ru: 'Миниатюры',
              },
            },
            {
              name: 'enableLoop',
              type: 'checkbox',
              label: {
                en: 'Enable Loop',
                ru: 'Бесконечная карусель',
              },
            },
            {
              name: 'enableArrows',
              type: 'checkbox',
              label: {
                en: 'Enable Arrows',
                ru: 'Стрелочки',
              },
            },
            {
              name: 'format',
              type: 'select',
              defaultValue: 'cover',
              label: {
                en: 'Thumbnail Format',
                ru: 'Формат миниатюр',
              },
              options: [
                {
                  label: 'Cover',
                  value: 'cover',
                },
                {
                  label: 'Contain',
                  value: 'contain',
                },
              ],
            },
            {
              name: 'mainImageFormat',
              type: 'select',
              defaultValue: 'cover',
              label: {
                en: 'Main Image Format',
                ru: 'Формат основного изображения',
              },
              options: [
                {
                  label: 'Cover',
                  value: 'cover',
                },
                {
                  label: 'Contain',
                  value: 'contain',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
