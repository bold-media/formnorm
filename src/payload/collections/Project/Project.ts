// import { postEditor } from '@/payload/fields/lexical'
import { slug } from '@/payload/fields/slug'
import { en } from '@/payload/i18n/en'
import { ru } from '@/payload/i18n/ru'
import { generatePreviewPath } from '@/utils/generatePreviewPath'
import { CollectionConfig } from 'payload'
import { access } from '@/payload/access'
import { seoFields } from '@/payload/fields/seo'
import { revalidateProject, revalidateProjectDelete } from './hooks/revalidateProject'
import { blocksEditor } from '@/payload/fields/lexical/blocksEditor'

export const Project: CollectionConfig = {
  slug: 'project',
  labels: {
    singular: {
      en: 'Project',
      ru: 'Проект',
    },
    plural: {
      en: 'Projects',
      ru: 'Проекты',
    },
  },
  orderable: true,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'pathname', 'publishedAt', 'updatedAt'],
    livePreview: {
      url: ({ data }) =>
        generatePreviewPath({
          collection: 'project',
          pathname: typeof data?.slug === 'string' ? `/project/${data?.slug}` : '',
          slug: data?.slug,
        }),
    },
    preview: (data) =>
      generatePreviewPath({
        collection: 'project',
        pathname: typeof data?.slug === 'string' ? `/project/${data?.slug}` : '',
        slug: data?.slug as string,
      }),
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 50,
  },
  access: {
    read: access({ roles: { editor: true }, type: 'published' }),
    create: access({ roles: { editor: true } }),
    update: access({ roles: { editor: true } }),
    delete: access({ roles: { editor: true } }),
    readVersions: access({ roles: { editor: true } }),
  },
  hooks: {
    afterChange: [revalidateProject],
    afterDelete: [revalidateProjectDelete],
  },
  fields: [
    slug(),

    {
      type: 'tabs',
      tabs: [
        {
          label: {
            en: 'Main',
            ru: 'Main',
          },
          fields: [
            {
              name: 'title',
              label: {
                en: en.common.title.singular,
                ru: ru.common.title.singular,
              },
              type: 'text',
              required: true,
            },
            {
              name: 'suffix',
              label: {
                en: en.common.suffix,
                ru: ru.common.suffix,
              },
              type: 'text',
            },
            {
              name: 'cover',
              label: {
                en: en.common.cover,
                ru: ru.common.cover,
              },
              type: 'upload',
              relationTo: 'media',
            },

            {
              type: 'group',
              name: 'description',
              label: 'Описание',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: {
                    en: en.common.title.singular,
                    ru: ru.common.title.singular,
                  },
                },
                {
                  name: 'subtitle',
                  type: 'text',
                },
                {
                  name: 'text',
                  type: 'text',
                },
                {
                  name: 'planOne',
                  label: {
                    en: en.common.image.singular,
                    ru: ru.common.image.singular,
                  },
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'planTwo',
                  label: {
                    en: en.common.image.singular,
                    ru: ru.common.image.singular,
                  },
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
            {
              name: 'cardCover',
              label: {
                en: 'Card Cover',
                ru: 'Обложка для карточки',
              },
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: {
                  en: 'Cover image for project card preview',
                  ru: 'Изображение обложки для предпросмотра карточки проекта',
                },
              },
            },
            {
              name: 'excerpt',
              label: {
                en: en.common.excerpt,
                ru: ru.common.excerpt,
              },
              type: 'textarea',
              admin: {
                description: {
                  en: en.common.excerptDescription,
                  ru: ru.common.excerptDescription,
                },
              },
            },
          ],
        },
        {
          label: {
            en: en.common.content,
            ru: ru.common.content,
          },
          fields: [
            {
              name: 'article',
              label: {
                en: 'Content',
                ru: 'Контент',
              },
              type: 'richText',
              editor: blocksEditor({ headings: ['h2', 'h3'] }),
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: seoFields({
            titlePath: 'meta.title',
            descriptionPath: 'meta.description',
            imagePath: 'meta.image',
            hasGenerateFn: true,
            includeNoIndex: true,
          }),
        },
      ],
    },
  ],
}
