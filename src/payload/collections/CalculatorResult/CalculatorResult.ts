import { access, accessField } from '@/payload/access'
import { textEditor } from '@/payload/fields/lexical/textEditor'
import { CollectionConfig } from 'payload'
import { generateCalculationNumber } from './hooks/generateCalculationNumber'
import { sendTelegramNotificationHook } from './hooks/sendTelegramNotification'

export const CalculatorResult: CollectionConfig = {
  slug: 'calculator-results',
  labels: {
    singular: {
      en: 'Calculator Result',
      ru: 'Результат расчета',
    },
    plural: {
      en: 'Calculator Results',
      ru: 'Результаты расчетов',
    },
  },
  upload: {
    bulkUpload: false,
    filesRequiredOnCreate: false,
    mimeTypes: ['application/pdf'],
    hideRemoveFile: true,
  },
  admin: {
    useAsTitle: 'calculationNumber',
    listSearchableFields: ['calculationNumber', 'calculationName', 'clientEmail', 'clientName'],
    defaultColumns: ['calculationNumber', 'clientName', 'createdAt'],
  },
  access: {
    // Только чтение для всех, создание только через API
    read: () => true,
    create: () => false,
    update: access(),
    delete: access(),
  },
  fields: [
    {
      name: 'calculationNumber',
      type: 'text',
      label: {
        en: 'Calculation Number',
        ru: 'Номер расчета',
      },
      required: false,
      unique: true,
      hooks: {
        beforeChange: [generateCalculationNumber],
      },
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'clientName',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'contactInfo',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'email',
              type: 'email',
              label: {
                en: 'Client Email',
                ru: 'Email клиента',
              },
              admin: {
                width: '50%',
              },
            },
            {
              name: 'phone',
              type: 'text',
              label: {
                en: 'Client Phone',
                ru: 'Телефон клиента',
              },
              admin: {
                width: '50%',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'calculationSummary',
      type: 'group',
      label: {
        en: 'Calculation Summary',
        ru: 'Сводка расчета',
      },
      admin: {
        description: 'Итоговые данные расчета',
      },
      fields: [
        {
          name: 'area',
          type: 'number',
          label: {
            en: 'Area (m²)',
            ru: 'Площадь (м²)',
          },
          admin: {
            readOnly: true,
            width: '33%',
          },
          hooks: {
            beforeValidate: [
              ({ data, value }) => {
                if (value !== undefined) return value
                return data?.metadata?.calculations?.area || 0
              },
            ],
          },
        },
        {
          name: 'selectedFloor',
          type: 'text',
          label: {
            en: 'Floor Type',
            ru: 'Этажность',
          },
          admin: {
            readOnly: true,
            width: '33%',
          },
          hooks: {
            beforeValidate: [
              ({ data, value }) => {
                if (value !== undefined) return value
                return data?.metadata?.formData?.selectedFloor || ''
              },
            ],
          },
        },
        {
          name: 'totalCost',
          type: 'number',
          label: {
            en: 'Total Cost',
            ru: 'Общая стоимость',
          },
          admin: {
            readOnly: true,
            width: '33%',
          },
          hooks: {
            beforeValidate: [
              ({ data, value }) => {
                if (value !== undefined) return Math.round(value * 100) / 100
                const totalCost = data?.metadata?.calculations?.totalCost || 0
                // Round to 2 decimal places to avoid floating point precision issues
                return Math.round(totalCost * 100) / 100
              },
            ],
          },
        },
      ],
    },
    {
      name: 'selectedServices',
      type: 'textarea',
      label: {
        en: 'Selected Services',
        ru: 'Выбранные услуги',
      },
      admin: {
        readOnly: true,
        rows: 4,
      },
      hooks: {
        beforeValidate: [
          ({ data, value }) => {
            if (value !== undefined) return value
            const items = data?.metadata?.calculations?.generalItems || []
            return items
              .map(
                (item: any) =>
                  `${item.name}: ${item.cost.toLocaleString()} ${
                    data?.metadata?.config?.currency || '₽'
                  }`,
              )
              .join('\n')
          },
        ],
      },
    },
    {
      name: 'additionalElements',
      type: 'textarea',
      label: {
        en: 'Additional Elements',
        ru: 'Дополнительные элементы',
      },
      admin: {
        readOnly: true,
        rows: 3,
      },
      hooks: {
        beforeValidate: [
          ({ data, value }) => {
            if (value !== undefined) return value
            const items = data?.metadata?.calculations?.elementItems || []
            const currency = data?.metadata?.config?.currency || '₽'
            let result = []
            let currentSection = ''

            for (const item of items) {
              if (item.isSectionTitle) {
                currentSection = item.name
              } else {
                const line = currentSection
                  ? `${currentSection} - ${item.name}: ${item.cost.toLocaleString()} ${currency}`
                  : `${item.name}: ${item.cost.toLocaleString()} ${currency}`
                result.push(line)
              }
            }

            return result.join('\n')
          },
        ],
      },
    },
    {
      name: 'metadata',
      type: 'json',
      label: {
        en: 'Raw Calculation Data',
        ru: 'Исходные данные расчета',
      },
      admin: {
        description: 'Все данные расчета в JSON формате для генерации PDF',
        readOnly: true,
        hidden: true,
        disableListColumn: true,
        disableListFilter: true,
      },
    },
    {
      name: 'notes',
      type: 'richText',
      access: {
        read: accessField(),
        create: accessField(),
        update: accessField(),
      },
      editor: textEditor({ align: false }),
    },
    {
      name: 'formSubmissions',
      type: 'join',
      collection: 'form-submissions',
      on: 'calculatorResult',
    },
    // {
    //   type: 'ui',
    //   name: 'formSubmissionsLink',
    //   label: {
    //     en: 'Related Form Submissions',
    //     ru: 'Связанные заявки',
    //   },
    //   admin: {
    //     position: 'sidebar',
    //     components: {
    //       Field: '@/payload/components/FormSubmissionsLink',
    //     },
    //   },
    // },
  ],
  hooks: {
    afterChange: [sendTelegramNotificationHook],
  },
}
