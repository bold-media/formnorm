import { textEditor } from '@/payload/fields/lexical/textEditor'
import { Block } from 'payload'
import { TableBlockType } from '@/payload/payload-types'
import { findBlockById } from '@/payload/utils/findBlockById'

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
      name: 'headerColOne',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.withHeader === true,
      },
    },
    {
      name: 'headerColTwo',
      type: 'text',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.withHeader === true && siblingData?.columns >= 2,
      },
    },
    {
      name: 'headerColThree',
      type: 'text',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.withHeader === true && siblingData?.columns >= 3,
      },
    },
    {
      name: 'headerColFour',
      type: 'text',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.withHeader === true && siblingData?.columns >= 4,
      },
    },
    {
      name: 'headerColFive',
      type: 'text',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.withHeader === true && siblingData?.columns >= 5,
      },
    },
    {
      name: 'rows',
      type: 'array',
      label: {
        en: 'Rows',
        ru: 'Строки',
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
            condition: (data, siblingData) => {
              const block = findBlockById<TableBlockType>({
                richText: data?.article,
                targetId: siblingData?.id,
                path: ['rows', 'id'],
              })
              return block !== null && block.columns >= 2
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
            condition: (data, siblingData) => {
              const block = findBlockById<TableBlockType>({
                richText: data?.article,
                targetId: siblingData?.id,
                path: ['rows', 'id'],
              })
              return block !== null && block.columns >= 3
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
            condition: (data, siblingData) => {
              const block = findBlockById<TableBlockType>({
                richText: data?.article,
                targetId: siblingData?.id,
                path: ['rows', 'id'],
              })
              return block !== null && block.columns >= 4
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
            condition: (data, siblingData) => {
              const block = findBlockById<TableBlockType>({
                richText: data?.article,
                targetId: siblingData?.id,
                path: ['rows', 'id'],
              })
              return block !== null && block.columns >= 5
            },
          },
        },
      ],
    },
  ],
}
