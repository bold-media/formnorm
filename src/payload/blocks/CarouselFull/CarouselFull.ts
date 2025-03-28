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
      name: 'useTabs',
      type: 'checkbox',
      defaultValue: false,
      label: {
        en: 'Use Tabs',
        ru: 'Использовать табы',
      },
    },
    {
      name: 'tabs',
      type: 'array',
      admin: {
        condition: (_, siblingData) => siblingData?.useTabs === true,
        description: {
          en: 'Add tabs to organize your content',
          ru: 'Добавьте табы для организации контента',
        },
      },
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: {
            en: 'Tab Label',
            ru: 'Название таба',
          },
        },
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
      ],
    },
    {
      name: 'images',
      label: {
        en: en.common.image.singular,
        ru: ru.common.image.singular,
      },
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.useTabs !== true,
      },
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
            // {
            //   name: 'enableGrid',
            //   type: 'checkbox',
            //   label: {
            //     en: 'Enable Grid',
            //     ru: 'Сетка на десктопе',
            //   },
            // },
            {
              name: 'enableGrid',
              type: 'checkbox',
              label: {
                en: 'Enable Grid',
                ru: 'Сетка',
              },
            },
            {
              name: 'aspectRatio',
              type: 'select',
              label: {
                en: 'Aspect ratio',
                ru: 'Соотношение сторон изображения',
              },
              options: [
                {
                  label: 'Video',
                  value: 'video',
                },
                {
                  label: 'Square',
                  value: 'square',
                },
                {
                  label: '4/3',
                  value: 'fourThree',
                },
              ],
            },
            {
              name: 'gridConfig',
              type: 'group',
              label: {
                en: 'Grid Settings',
                ru: 'Настройки сетки',
              },
              admin: {
                condition: (_, siblingData) => siblingData?.enableGrid,
              },
              fields: [
                {
                  name: 'desktopColumns',
                  type: 'select',
                  required: true,
                  defaultValue: '3',
                  options: [
                    { label: '2 колонки', value: '2' },
                    { label: '3 колонки', value: '3' },
                    { label: '4 колонки', value: '4' },
                  ],
                },
                {
                  name: 'tabletColumns',
                  type: 'select',
                  required: true,
                  defaultValue: '2',
                  options: [
                    { label: '2 колонки', value: '2' },
                    { label: '3 колонки', value: '3' },
                  ],
                },
                {
                  name: 'mobileColumns',
                  type: 'select',
                  required: true,
                  defaultValue: '1',
                  options: [
                    { label: '1 колонка', value: '1' },
                    { label: '2 колонки', value: '2' },
                  ],
                },
                {
                  name: 'gap',
                  type: 'select',
                  options: [
                    {
                      label: 'Нет',
                      value: 'none',
                    },
                    {
                      label: '2',
                      value: 'two',
                    },
                    {
                      label: '4',
                      value: 'four',
                    },
                    {
                      label: '8',
                      value: 'eight',
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
