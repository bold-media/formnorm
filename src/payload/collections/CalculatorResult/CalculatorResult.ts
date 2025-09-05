import { CollectionConfig } from 'payload'

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
  admin: {
    useAsTitle: 'calculationName',
    defaultColumns: ['calculationName', 'totalCost', 'area', 'createdAt'],
    listSearchableFields: ['calculationName', 'clientEmail', 'clientName'],
  },
  access: {
    // Настройте доступ по вашим требованиям
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'calculationName',
      type: 'text',
      label: {
        en: 'Calculation Name',
        ru: 'Название расчета',
      },
      admin: {
        description: 'Автоматически генерируется или вводится пользователем',
      },
    },

    // Информация о клиенте (опционально)
    {
      name: 'clientInfo',
      type: 'group',
      label: {
        en: 'Client Information',
        ru: 'Информация о клиенте',
      },
      fields: [
        {
          name: 'clientName',
          type: 'text',
          label: {
            en: 'Client Name',
            ru: 'Имя клиента',
          },
        },
        {
          name: 'clientEmail',
          type: 'email',
          label: {
            en: 'Client Email',
            ru: 'Email клиента',
          },
        },
        {
          name: 'clientPhone',
          type: 'text',
          label: {
            en: 'Client Phone',
            ru: 'Телефон клиента',
          },
        },
      ],
    },

    // Параметры расчета
    {
      name: 'calculationParams',
      type: 'group',
      label: {
        en: 'Calculation Parameters',
        ru: 'Параметры расчета',
      },
      fields: [
        {
          name: 'area',
          type: 'number',
          label: {
            en: 'House Area (m²)',
            ru: 'Площадь дома (м²)',
          },
          required: true,
        },
        {
          name: 'selectedFloor',
          type: 'text',
          label: {
            en: 'Selected Floor Type',
            ru: 'Выбранная этажность',
          },
        },
        {
          name: 'floorCoefficient',
          type: 'number',
          label: {
            en: 'Floor Coefficient',
            ru: 'Коэффициент этажности',
          },
        },
        {
          name: 'areaCoefficient',
          type: 'number',
          label: {
            en: 'Area Coefficient',
            ru: 'Коэффициент площади',
          },
        },
      ],
    },

    // Выбранные услуги
    {
      name: 'selectedServices',
      type: 'group',
      label: {
        en: 'Selected Services',
        ru: 'Выбранные услуги',
      },
      fields: [
        {
          name: 'generalServices',
          type: 'array',
          label: {
            en: 'General Construction Services',
            ru: 'Общестроительные услуги',
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              label: {
                en: 'Service Name',
                ru: 'Название услуги',
              },
            },
            {
              name: 'cost',
              type: 'number',
              label: {
                en: 'Cost',
                ru: 'Стоимость',
              },
            },
            {
              name: 'pricePerM2',
              type: 'number',
              label: {
                en: 'Price per m²',
                ru: 'Цена за м²',
              },
            },
            {
              name: 'isFixed',
              type: 'checkbox',
              label: {
                en: 'Fixed Price',
                ru: 'Фиксированная цена',
              },
            },
          ],
        },
        {
          name: 'engineeringServices',
          type: 'array',
          label: {
            en: 'Engineering Services',
            ru: 'Инженерные услуги',
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              label: {
                en: 'Service Name',
                ru: 'Название услуги',
              },
            },
            {
              name: 'cost',
              type: 'number',
              label: {
                en: 'Cost',
                ru: 'Стоимость',
              },
            },
            {
              name: 'pricePerM2',
              type: 'number',
              label: {
                en: 'Price per m²',
                ru: 'Цена за м²',
              },
            },
            {
              name: 'isFixed',
              type: 'checkbox',
              label: {
                en: 'Fixed Price',
                ru: 'Фиксированная цена',
              },
            },
          ],
        },
        {
          name: 'additionalElements',
          type: 'array',
          label: {
            en: 'Additional Elements',
            ru: 'Дополнительные элементы',
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              label: {
                en: 'Element Name',
                ru: 'Название элемента',
              },
            },
            {
              name: 'cost',
              type: 'number',
              label: {
                en: 'Cost',
                ru: 'Стоимость',
              },
            },
          ],
        },
      ],
    },

    // Результаты расчета
    {
      name: 'calculationResults',
      type: 'group',
      label: {
        en: 'Calculation Results',
        ru: 'Результаты расчета',
      },
      fields: [
        {
          name: 'generalServicesCost',
          type: 'number',
          label: {
            en: 'General Services Cost',
            ru: 'Стоимость общестроительных услуг',
          },
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'engineeringServicesCost',
          type: 'number',
          label: {
            en: 'Engineering Services Cost',
            ru: 'Стоимость инженерных услуг',
          },
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'servicesSubtotal',
          type: 'number',
          label: {
            en: 'Services Subtotal',
            ru: 'Промежуточная сумма услуг',
          },
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'servicesWithCoefficients',
          type: 'number',
          label: {
            en: 'Services with Coefficients',
            ru: 'Услуги с коэффициентами',
          },
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'additionalElementsCost',
          type: 'number',
          label: {
            en: 'Additional Elements Cost',
            ru: 'Стоимость дополнительных элементов',
          },
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'totalCost',
          type: 'number',
          label: {
            en: 'Total Cost',
            ru: 'Общая стоимость',
          },
          required: true,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'pricePerM2',
          type: 'number',
          label: {
            en: 'Price per m²',
            ru: 'Цена за м²',
          },
          admin: {
            readOnly: true,
          },
        },
      ],
    },

    // Метаданные
    {
      name: 'metadata',
      type: 'group',
      label: {
        en: 'Metadata',
        ru: 'Метаданные',
      },
      fields: [
        {
          name: 'calculationDate',
          type: 'date',
          label: {
            en: 'Calculation Date',
            ru: 'Дата расчета',
          },
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'ipAddress',
          type: 'text',
          label: {
            en: 'IP Address',
            ru: 'IP адрес',
          },
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'userAgent',
          type: 'textarea',
          label: {
            en: 'User Agent',
            ru: 'User Agent',
          },
          admin: {
            readOnly: true,
          },
        },
      ],
    },

    // Статус расчета
    {
      name: 'status',
      type: 'select',
      label: {
        en: 'Status',
        ru: 'Статус',
      },
      options: [
        { label: 'Новый', value: 'new' },
        { label: 'Просмотрен', value: 'viewed' },
        { label: 'В работе', value: 'in-progress' },
        { label: 'Завершен', value: 'completed' },
      ],
      defaultValue: 'new',
    },

    // Заметки администратора
    {
      name: 'adminNotes',
      type: 'textarea',
      label: {
        en: 'Admin Notes',
        ru: 'Заметки администратора',
      },
      admin: {
        description: 'Внутренние заметки, не видны клиенту',
      },
    },
  ],
  timestamps: true, // Автоматические createdAt и updatedAt
}
