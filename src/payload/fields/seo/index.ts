import { Field, FieldAccess } from 'payload'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

type SeoFieldsOptions = {
  titlePath?: string
  descriptionPath?: string
  imagePath?: string
  includeNoIndex?: boolean
  hasGenerateFn?: boolean
  previewSuffix?: string
  noIndexAccess?:
    | {
        create?: FieldAccess
        read?: FieldAccess
        update?: FieldAccess
      }
    | undefined
}

export const seoFields = ({
  titlePath = 'meta.title',
  descriptionPath = 'meta.description',
  imagePath = 'meta.image',
  includeNoIndex = true,
  hasGenerateFn = true,
  noIndexAccess,
}: // previewSuffix,
SeoFieldsOptions = {}): Field[] => {
  const baseFields: Field[] = [
    OverviewField({
      titlePath,
      descriptionPath,
      imagePath,
    }),
    MetaTitleField({
      hasGenerateFn,
      overrides: {
        label: {
          en: 'Meta Title',
          ru: 'Мета заголовок',
        },
        admin: {
          description: {
            en: 'This will be displayed as the title in search engine results',
            ru: 'Это будет отображаться как заголовок в результатах поиска',
          },
        },
      },
    }),
    MetaDescriptionField({
      hasGenerateFn,
      overrides: {
        label: {
          en: 'Meta Description',
          ru: 'Мета описание',
        },
        admin: {
          description: {
            en: 'This will be displayed as the description in search engine results',
            ru: 'Это будет отображаться как описание в результатах поиска',
          },
        },
      },
    }),
    PreviewField({
      hasGenerateFn: true,
      titlePath,
      descriptionPath,
      // overrides: {
      //   custom: {
      //     previewSuffix,
      //   },
      // },
    }),
    MetaImageField({
      relationTo: 'media',
      overrides: {
        label: {
          en: 'Meta Image',
          ru: 'Мета изображение',
        },
        admin: {
          description: {
            en: 'This image will be used when sharing on social media',
            ru: 'Это изображение будет использоваться при публикации в социальных сетях',
          },
        },
      },
    }),
    {
      name: 'canonicalURL',
      type: 'text',
      label: {
        en: 'Canonical URL',
        ru: 'Канонический URL',
      },
      admin: {
        description: {
          en: 'The canonical URL for this page. Leave empty to use the default URL.',
          ru: 'Канонический URL для этой страницы. Оставьте пустым для использования URL по умолчанию.',
        },
        placeholder: {
          en: 'https://example.com/page or /page',
          ru: 'https://example.com/page или /page',
        },
      },
    },
  ]

  if (includeNoIndex) {
    const noIndexField: Field = {
      name: 'noIndex',
      label: {
        en: 'Do not index',
        ru: 'Не индексировать',
      },
      type: 'checkbox',
      defaultValue: false,
      access: noIndexAccess,
      admin: {
        description: {
          en: 'Checking this box will add meta tags to the page, asking search engines not to index this page. It will also remove it from the sitemap.',
          ru: 'Установка этого флажка добавит мета-теги на страницу, запрещающие поисковым системам индексировать эту страницу. Она также будет удалена из карты сайта.',
        },
      },
    }
    baseFields.push(noIndexField)
  }

  return baseFields
}
