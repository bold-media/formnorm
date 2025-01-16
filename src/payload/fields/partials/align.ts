import { deepMerge } from '@/utils/deepMerge'
import { LabelFunction, SelectField, StaticLabel } from 'payload'

export type AlignVariants = 'none' | 'left' | 'center' | 'right' | 'fullWidth'

export const variantOptions: Record<
  AlignVariants,
  { label: LabelFunction | StaticLabel; value: string }
> = {
  none: {
    label: {
      en: 'None',
      ru: 'Нет',
    },
    value: 'none',
  },
  left: {
    label: {
      en: 'Left',
      ru: 'Слева',
    },
    value: 'left',
  },
  center: {
    label: {
      en: 'Center',
      ru: 'По центру',
    },
    value: 'center',
  },
  right: {
    label: {
      en: 'Right',
      ru: 'Справа',
    },
    value: 'right',
  },
  fullWidth: {
    label: {
      en: 'Full Width',
      ru: 'На всю ширину',
    },
    value: 'fullWidth',
  },
}

type AlignType = (options?: {
  variants?: AlignVariants[]
  overrides?: Partial<SelectField>
}) => SelectField

export const align: AlignType = ({ variants, overrides = {} } = {}) => {
  const field: SelectField = {
    name: 'align',
    type: 'select',
    label: {
      en: 'Align',
      ru: 'Выравнивание',
    },
    admin: {
      isClearable: false,
      width: '33.333%',
    },
    options: [],
  }

  let variantsToUse = [
    variantOptions.none,
    variantOptions.left,
    variantOptions.center,
    variantOptions.right,
    variantOptions.fullWidth,
  ]

  if (variants) {
    variantsToUse = variants.map((variant) => variantOptions[variant])

    if (!variants?.includes('left') && !overrides.defaultValue) {
      field.defaultValue = variants[0]
    }
  } else {
    if (!overrides.defaultValue) {
      field.defaultValue = 'left'
    }
  }

  variantsToUse.map((option) => field.options.push(option))

  return deepMerge(field, overrides)
}
