import { deepMerge } from '@/utils/deepMerge'
import { NumberField } from 'payload'

type ManualSpaceType = (options?: { overrides?: Partial<NumberField> }) => NumberField

export const manualSpace: ManualSpaceType = ({ overrides = {} } = {}) => {
  const field: NumberField = {
    name: 'space',
    type: 'number',
    label: {
      en: 'Space',
      ru: 'Отступ',
    },
    defaultValue: 0,
    admin: {
      width: '33.333%',
    },
  }

  return deepMerge(field, overrides)
}
