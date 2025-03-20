// import { postEditor } from '@/payload/fields/lexical'
import { slug } from '@/payload/fields/slug'
import { en } from '@/payload/i18n/en'
import { ru } from '@/payload/i18n/ru'
import { generatePreviewPath } from '@/utils/generatePreviewPath'
import { CollectionConfig } from 'payload'
import { access } from '@/payload/access'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { revalidateTerm, revalidateTermDelete } from './hooks/revalidateTerm'
import { blocksEditor } from '@/payload/fields/lexical/blocksEditor'

export const Term: CollectionConfig = {
  slug: 'term',
  labels: {
    singular: {
      en: 'Term',
      ru: 'Условие',
    },
    plural: {
      en: 'Terms',
      ru: 'Условия',
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'pathname', 'publishedAt', 'updatedAt'],
    livePreview: {
      url: ({ data }) =>
        generatePreviewPath({
          collection: 'post',
          pathname: typeof data?.slug === 'string' ? `/post/${data?.slug}` : '',
          slug: data?.slug,
        }),
    },
    preview: (data) =>
      generatePreviewPath({
        collection: 'post',
        pathname: typeof data?.slug === 'string' ? `/post/${data?.slug}` : '',
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
    afterChange: [revalidateTerm],
    afterDelete: [revalidateTermDelete],
  },
  fields: [
    slug(),

    {
      type: 'tabs',
      tabs: [
        {
          label: {
            en: en.common.content,
            ru: ru.common.content,
          },
          fields: [
            {
              name: 'title',
              label: {
                en: 'Page Title',
                ru: 'Заголовок страницы',
              },
              type: 'text',
              required: true,
            },
            {
              name: 'cardTitle',
              label: {
                en: 'Card Title',
                ru: 'Заголовок карточки',
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
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
              overrides: {
                label: {
                  en: en.common.title.singular,
                  ru: ru.common.title.singular,
                },
              },
            }),
            MetaDescriptionField({
              overrides: {
                label: {
                  en: en.common.description.singular,
                  ru: ru.common.description.singular,
                },
              },
            }),
            MetaImageField({
              relationTo: 'media',
              overrides: {
                label: {
                  en: en.common.image.singular,
                  ru: ru.common.image.singular,
                },
              },
            }),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
  ],
}
