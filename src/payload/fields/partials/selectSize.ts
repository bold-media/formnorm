import { deepMerge } from '@/utils/deepMerge'
import { SelectField } from 'payload'

export type SizeVariants = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export const variantOptions: Record<
  SizeVariants,
  { label: { en: string; ru: string }; value: string }
> = {
  none: {
    label: {
      en: 'None',
      ru: 'Нет',
    },
    value: 'none',
  },
  xs: {
    label: {
      en: 'XS',
      ru: 'XS',
    },
    value: 'xs',
  },
  sm: {
    label: {
      en: 'SM',
      ru: 'S',
    },
    value: 'sm',
  },
  md: {
    label: {
      en: 'MD',
      ru: 'M',
    },
    value: 'md',
  },
  lg: {
    label: {
      en: 'LG',
      ru: 'L',
    },
    value: 'lg',
  },
  xl: {
    label: {
      en: 'XL',
      ru: 'XL',
    },
    value: 'xl',
  },
}

type SizeType = (options?: {
  variants?: SizeVariants[]
  overrides?: Partial<SelectField>
}) => SelectField

export const selectSize: SizeType = ({ variants, overrides = {} } = {}) => {
  const sizeResult: SelectField = {
    name: 'size',
    type: 'select',
    label: {
      en: 'Size',
      ru: 'Размер',
    },
    admin: { isClearable: false },
    options: [],
  }

  let variantsToUse = [
    variantOptions.none,
    variantOptions.xs,
    variantOptions.sm,
    variantOptions.md,
    variantOptions.lg,
    variantOptions.xl,
  ]

  if (variants) {
    variantsToUse = variants.map((variant) => variantOptions[variant])

    if (!variants.includes('md') && !overrides.defaultValue) {
      sizeResult.defaultValue = variants[0]
    }
  } else {
    if (!overrides.defaultValue) {
      sizeResult.defaultValue = 'md'
    }
  }

  variantsToUse.map((option) => sizeResult.options.push(option))

  return deepMerge(sizeResult, overrides)
}
