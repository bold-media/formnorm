import { en } from '@/payload/i18n/en'
import { ru } from '@/payload/i18n/ru'
import { Block } from 'payload'

export const CarouselFullBlock: Block = {
  slug: 'carouselFull',
  interfaceName: 'CarouselFullBlockType',
  labels: {
    singular: {
      en: 'Carousel Full',
      ru: 'Карусель во весь экран',
    },
    plural: {
      en: 'Carousels Full',
      ru: 'Карусели во весь экран',
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
              name: 'enableGrid',
              type: 'checkbox',
              label: {
                en: 'Enable Grid',
                ru: 'Сетка на десктопе',
              },
            },
          ],
        },
      ],
    },
  ],
}
