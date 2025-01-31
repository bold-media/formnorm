import { textEditor } from '@/payload/fields/lexical/textEditor'
import { Block } from 'payload'

export const TableBlock: Block = {
  slug: 'table',
  interfaceName: 'TableBlockType',
  labels: {
    singular: {
      en: 'Table',
      ru: 'Таблица',
    },
    plural: {
      en: 'Tables',
      ru: 'Таблицы',
    },
  },
  fields: [
    {
      name: 'columns',
      type: 'number',
      required: true,
      defaultValue: 1,
      min: 1,
      max: 5,
      admin: {
        description: {
          en: 'Select the number of columns (1-5)',
          ru: 'Выберите количество колонок (1-5)',
        },
      },
    },
    // В первом файле добавим после поля columns:
    {
      name: 'withHeader',
      type: 'checkbox',
      label: {
        en: 'Add header row',
        ru: 'Добавить строку заголовков',
      },
      defaultValue: false,
    },
    {
      name: 'header',
      type: 'array',
      label: {
        en: 'Header Cells',
        ru: 'Ячейки заголовка',
      },
      admin: {
        condition: (data) => data?.withHeader === true,
      },
      maxRows: 1,
      fields: [
        {
          name: 'col1',
          type: 'text',
          label: {
            en: 'Header 1',
            ru: 'Заголовок 1',
          },
        },
        {
          name: 'col2',
          type: 'text',
          label: {
            en: 'Header 2',
            ru: 'Заголовок 2',
          },
          admin: {
            condition: (data) => {
              return data?.columns >= 2
            },
          },
        },
        {
          name: 'col3',
          type: 'text',
          label: {
            en: 'Header 3',
            ru: 'Заголовок 3',
          },
          admin: {
            condition: (data) => {
              return data?.columns >= 3
            },
          },
        },
        {
          name: 'col4',
          type: 'text',
          label: {
            en: 'Header 4',
            ru: 'Заголовок 4',
          },
          admin: {
            condition: (data) => {
              return data?.columns >= 4
            },
          },
        },
        {
          name: 'col5',
          type: 'text',
          label: {
            en: 'Header 5',
            ru: 'Заголовок 5',
          },
          admin: {
            condition: (data) => {
              return data?.columns >= 5
            },
          },
        },
      ],
    },
    {
      name: 'rows',
      type: 'array',
      label: {
        en: 'Table Rows',
        ru: 'Строки таблицы',
      },
      admin: {
        description: {
          en: 'Add rows to your table',
          ru: 'Добавьте строки в таблицу',
        },
      },
      fields: [
        {
          name: 'col1',
          type: 'richText',
          editor: textEditor(),
          label: {
            en: 'Column 1',
            ru: 'Колонка 1',
          },
        },
        {
          name: 'col2',
          type: 'richText',
          editor: textEditor(),
          label: {
            en: 'Column 2',
            ru: 'Колонка 2',
          },
          admin: {
            condition: (data) => {
              return data?.columns >= 2
            },
          },
        },
        {
          name: 'col3',
          type: 'richText',
          editor: textEditor(),
          label: {
            en: 'Column 3',
            ru: 'Колонка 3',
          },
          admin: {
            condition: (data) => {
              return data?.columns >= 3
            },
          },
        },
        {
          name: 'col4',
          type: 'richText',
          editor: textEditor(),
          label: {
            en: 'Column 4',
            ru: 'Колонка 4',
          },
          admin: {
            condition: (data) => {
              return data?.columns >= 4
            },
          },
        },
        {
          name: 'col5',
          type: 'richText',
          editor: textEditor(),
          label: {
            en: 'Column 5',
            ru: 'Колонка 5',
          },
          admin: {
            condition: (data) => {
              return data?.columns >= 5
            },
          },
        },
      ],
    },
  ],
}
