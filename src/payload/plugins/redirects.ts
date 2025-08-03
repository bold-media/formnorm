import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { revalidateTag } from 'next/cache'
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

const revalidateRedirects: CollectionAfterChangeHook = ({ doc, req: { payload } }) => {
  payload.logger.info('Revalidating redirects cache')
  revalidateTag('redirects')
  return doc
}

const revalidateRedirectsDelete: CollectionAfterDeleteHook = ({ doc, req: { payload } }) => {
  payload.logger.info('Revalidating redirects cache after delete')
  revalidateTag('redirects')
  return doc
}

// Recursive function to translate nested fields
const translateFields = (fields: any[]): any[] => {
  return fields.map((field: any) => {
    // Handle 'from' field
    if ('name' in field && field.name === 'from') {
      return {
        ...field,
        label: {
          en: 'From URL',
          ru: 'Исходный URL',
        },
        admin: {
          ...field.admin,
          description: {
            en: 'The relative path to redirect from (e.g., /old-page or /post/old-slug)',
            ru: 'Относительный путь для перенаправления (например, /old-page или /post/old-slug)',
          },
        },
      }
    }
    
    // Handle 'to' group field
    if ('name' in field && field.name === 'to' && field.type === 'group') {
      return {
        ...field,
        label: {
          en: 'To URL',
          ru: 'Целевой URL',
        },
        // Process nested fields in the group
        fields: field.fields?.map((nestedField: any) => {
          // Handle 'type' radio field
          if ('name' in nestedField && nestedField.name === 'type' && nestedField.type === 'radio') {
            return {
              ...nestedField,
              label: {
                en: 'Redirect Type',
                ru: 'Тип перенаправления',
              },
              // Translate radio options
              options: nestedField.options?.map((option: any) => {
                if (typeof option === 'object' && option.value === 'reference') {
                  return {
                    ...option,
                    label: {
                      en: 'Internal link',
                      ru: 'Внутренняя ссылка',
                    },
                  }
                }
                if (typeof option === 'object' && option.value === 'custom') {
                  return {
                    ...option,
                    label: {
                      en: 'Custom URL',
                      ru: 'Произвольный URL',
                    },
                  }
                }
                return option
              }),
            }
          }
          
          // Handle 'reference' field
          if ('name' in nestedField && nestedField.name === 'reference') {
            return {
              ...nestedField,
              label: {
                en: 'Document to redirect to',
                ru: 'Документ для перенаправления',
              },
            }
          }
          
          // Handle 'url' field
          if ('name' in nestedField && nestedField.name === 'url') {
            return {
              ...nestedField,
              label: {
                en: 'Custom URL',
                ru: 'Произвольный URL',
              },
              admin: {
                ...nestedField.admin,
                placeholder: {
                  en: 'https://example.com or /path',
                  ru: 'https://example.com или /путь',
                },
              },
            }
          }
          
          return nestedField
        }),
      }
    }
    
    // Handle 'type' field (redirect status code) if it exists
    if ('name' in field && field.name === 'type' && field.type === 'select') {
      return {
        ...field,
        label: {
          en: 'Redirect Type',
          ru: 'Тип перенаправления',
        },
        admin: {
          ...field.admin,
          description: {
            en: 'HTTP status code for the redirect',
            ru: 'HTTP код статуса для перенаправления',
          },
        },
      }
    }
    
    return field
  })
}

export const redirects = redirectsPlugin({
  collections: ['page', 'post', 'service', 'project', 'category', 'term'],
  overrides: {
    labels: {
      singular: {
        en: 'Redirect',
        ru: 'Перенаправление',
      },
      plural: {
        en: 'Redirects',
        ru: 'Перенаправления',
      },
    },
    fields: ({ defaultFields }) => translateFields(defaultFields),
    hooks: {
      afterChange: [revalidateRedirects],
      afterDelete: [revalidateRedirectsDelete],
    },
  },
})
