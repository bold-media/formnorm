// import { postEditor } from '@/payload/fields/lexical'
import { slug } from '@/payload/fields/slug'
import { en } from '@/payload/i18n/en'
import { ru } from '@/payload/i18n/ru'
import { generatePreviewPath } from '@/utils/generatePreviewPath'
import { CollectionConfig } from 'payload'
import { access } from '@/payload/access'
import { seoFields } from '@/payload/fields/seo'
import { revalidatePost, revalidatePostDelete } from './hooks/revalidatePost'
import { blocksEditor } from '@/payload/fields/lexical/blocksEditor'

export const Post: CollectionConfig = {
  slug: 'post',
  labels: {
    singular: {
      en: 'Post',
      ru: 'Пост',
    },
    plural: {
      en: 'Posts',
      ru: 'Посты',
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
    afterChange: [revalidatePost],
    afterDelete: [revalidatePostDelete],
  },
  fields: [
    slug(),
    {
      name: 'publishedAt',
      label: {
        en: 'Data',
        ru: 'Дата публикации',
      },
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      label: {
        en: 'Author',
        ru: 'Автор',
      },
      type: 'relationship',
      relationTo: 'user',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'categories',
      label: {
        en: 'Categories',
        ru: 'Категории',
      },
      type: 'relationship',
      hasMany: true,
      relationTo: 'category',
      admin: {
        position: 'sidebar',
      },
    },
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
                en: en.common.title.singular,
                ru: ru.common.title.singular,
              },
              type: 'text',
              required: true,
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
              name: 'headerImage',
              label: {
                en: 'Header Image',
                ru: 'Изображение в шапке',
              },
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: {
                  en: 'Image that will be displayed at the top of the post page. If not set, the cover image will be used.',
                  ru: 'Изображение, которое будет отображаться в верхней части страницы поста. Если не задано, будет использовано изображение обложки.',
                },
              },
            },
            {
              name: 'showHeaderImage',
              label: {
                en: 'Show Header Image',
                ru: 'Показывать изображение в шапке',
              },
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: {
                  en: 'If unchecked, no image will be displayed at the top of the post page.',
                  ru: 'Если не отмечено, изображение в верхней части страницы поста отображаться не будет.',
                },
              },
            },
            {
              name: 'headerImageMode',
              label: {
                en: 'Header Image Display Mode',
                ru: 'Режим отображения изображения в шапке',
              },
              type: 'select',
              defaultValue: 'cover',
              options: [
                {
                  label: {
                    en: 'Cover',
                    ru: 'Обложка',
                  },
                  value: 'cover',
                },
                {
                  label: {
                    en: 'Contain',
                    ru: 'Вместить',
                  },
                  value: 'contain',
                },
              ],
              admin: {
                description: {
                  en: 'Choose how the header image should be displayed.',
                  ru: 'Выберите, как должно отображаться изображение в шапке.',
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
            {
              name: 'article',
              label: {
                en: 'Article',
                ru: 'Пост',
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
