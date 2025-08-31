import { revalidateGlobal } from '@/payload/hooks/revalidateGlobal'
import { MetaDescriptionField, MetaTitleField } from '@payloadcms/plugin-seo/fields'
import { GlobalConfig } from 'payload'
import { link, linkGroup } from '@/payload/fields/link'
import { seoFields } from '@/payload/fields/seo'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: {
    en: 'Settings',
    ru: 'Настройки',
  },
  admin: {
    group: {
      en: 'Admin',
      ru: 'Админ',
    },
  },
  typescript: {
    interface: 'Settings',
  },
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'company',
          fields: [
            {
              type: 'text',
              name: 'name',
            },
          ],
        },
        {
          name: 'navigation',
          label: {
            en: 'Navigation',
            ru: 'Навигация',
          },
          fields: [
            {
              name: 'header',
              label: {
                en: 'Header',
                ru: 'Шапка',
              },
              type: 'group',
              fields: [
                linkGroup({
                  appearances: false,
                  overrides: {
                    label: {
                      en: 'Menu Items',
                      ru: 'Пункты меню',
                    },
                    labels: {
                      singular: {
                        en: 'Menu Item',
                        ru: 'Пункт меню',
                      },
                      plural: {
                        en: 'Menu Items',
                        ru: 'Пункты меню',
                      },
                    },
                  },
                }),
              ],
            },
            {
              name: 'footer',
              label: {
                en: 'Footer',
                ru: 'Подвал',
              },
              type: 'group',
              fields: [
                linkGroup({
                  appearances: false,
                  overrides: {
                    label: {
                      en: 'Menu Items',
                      ru: 'Пункты меню',
                    },
                    labels: {
                      singular: {
                        en: 'Menu Item',
                        ru: 'Пункт меню',
                      },
                      plural: {
                        en: 'Menu Items',
                        ru: 'Пункты меню',
                      },
                    },
                  },
                }),

                {
                  name: 'copyText',
                  label: {
                    en: 'Copy Text',
                    ru: 'Текст копирайта',
                  },
                  type: 'text',
                },
                linkGroup({
                  appearances: false,
                  overrides: {
                    name: 'legalLinks',
                    label: {
                      en: 'Legal Links',
                      ru: '',
                    },
                    labels: {
                      singular: {
                        en: 'Legal Link',
                        ru: '...',
                      },
                      plural: {
                        en: 'Legal Links',
                        ru: '...',
                      },
                    },
                  },
                }),
              ],
            },
          ],
        },
        {
          name: 'seo',
          label: 'SEO',
          description: {
            en: `These settings serve as a fallback for any pages that do not have SEO configured. If a page has SEO configured, these settings will be ignored.`,
            ru: `Эти настройки используются как запасные для страниц, у которых не настроен SEO. Если у страницы настроен SEO, эти настройки будут проигнорированы.`,
          },
          fields: [
            {
              name: 'default',
              type: 'group',
              fields: seoFields({
                titlePath: 'seo.default.title',
                descriptionPath: 'seo.default.description',
                imagePath: 'seo.default.image',
              }),
            },

            {
              name: 'blog',
              label: {
                en: 'Blog Posts SEO',
                ru: 'SEO для Блога',
              },
              type: 'group',
              fields: seoFields({
                titlePath: 'seo.blog.title',
                descriptionPath: 'seo.blog.description',
                imagePath: 'seo.blog.image',
                // previewSuffix: '/blog',
                includeNoIndex: true,
              }),
            },
          ],
        },
      ],
    },
  ],
}
