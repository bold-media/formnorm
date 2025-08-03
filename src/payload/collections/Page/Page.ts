import { slug } from '@/payload/fields/slug'
import { syncPathname } from '@/payload/hooks/syncPathname'
import { en } from '@/payload/i18n/en'
import { ru } from '@/payload/i18n/ru'
import { CollectionConfig } from 'payload'
import { seoFields } from '@/payload/fields/seo'
import { createBreadcrumbsField, createParentField } from '@payloadcms/plugin-nested-docs'
import { access } from '@/payload/access'
import { generatePreviewPath } from '@/utils/generatePreviewPath'
import { revalidatePage, revalidatePageDelete } from './hooks/revalidatePage'
import { blocksEditor } from '@/payload/fields/lexical/blocksEditor'
import { hero } from './fields/hero'

export const Page: CollectionConfig = {
  slug: 'page',
  labels: {
    singular: {
      en: 'Page',
      ru: 'Страница',
    },
    plural: {
      en: 'Pages',
      ru: 'Страницы',
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'pathname', 'publishedAt', 'updatedAt'],
    livePreview: {
      url: ({ data }) =>
        generatePreviewPath({
          collection: 'page',
          pathname: typeof data?.pathname === 'string' ? data.pathname : '',
        }),
    },
    preview: (data) =>
      generatePreviewPath({
        collection: 'page',
        pathname: typeof data?.pathname === 'string' ? data.pathname : '',
      }),
  },
  defaultPopulate: {
    title: true,
    slug: true,
    pathname: true,
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
    afterChange: [revalidatePage],
    afterDelete: [revalidatePageDelete],
  },
  fields: [
    slug(),
    {
      name: 'pathname',
      type: 'text',
      unique: true,
      index: true,
      label: {
        en: en.common.pathname.singular,
        ru: ru.common.pathname.singular,
      },
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [syncPathname],
      },
    },
    {
      name: 'containerSize',
      type: 'select',
      label: {
        en: 'Container Size',
        ru: 'Размер контейнера',
      },
      defaultValue: 'default',
      admin: {
        position: 'sidebar',
        isClearable: false,
      },
      options: [
        {
          label: {
            en: 'Default',
            ru: 'По умолчанию',
          },
          value: 'default',
        },
        {
          label: {
            en: 'Narrow',
            ru: 'Узкий',
          },
          value: 'post',
        },
      ],
    },
    {
      name: 'enableBreadcrumbs',
      label: {
        en: 'Enable Breadcrumbs',
        ru: 'Включить хлебные крошки',
      },
      admin: {
        position: 'sidebar',
      },
      type: 'checkbox',
      defaultValue: true,
    },
    createParentField('page', {
      label: { en: en.common.parentPage.singular, ru: ru.common.parentPage.singular },
    }),
    {
      type: 'tabs',
      tabs: [
        {
          label: {
            en: 'Main',
            ru: 'Основное',
          },
          fields: [
            hero,
            {
              name: 'title',
              type: 'text',
              required: true,
              label: {
                en: en.common.title.singular,
                ru: ru.common.title.singular,
              },
            },
            // {
            //   name: 'blocks',
            //   type: 'blocks',
            //   blocks: [RichTextBlock],
            // },
            {
              name: 'content',
              type: 'richText',
              label: {
                en: en.common.content,
                ru: ru.common.content,
              },
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
    createBreadcrumbsField('page', { admin: { hidden: true } }),
  ],
}
