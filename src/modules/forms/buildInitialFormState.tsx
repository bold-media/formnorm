import type { FormFieldBlock } from '@payloadcms/plugin-form-builder/types'

export type FormState = {
  [key: string]: string | boolean | number | undefined
}

type FormField = {
  name: string
  blockType: string
  defaultValue?: string | boolean | number | null
  blockName?: string | null
  [key: string]: any
}

export const buildInitialFormState = (fields: FormField[] | null | undefined): FormState => {
  if (!fields) return {}

  return fields.reduce<FormState>((initialSchema, field) => {
    // Skip message fields
    if (field.blockType === 'message') {
      return initialSchema
    }

    return {
      ...initialSchema,
      [field.name]: field.defaultValue ?? (field.blockType === 'checkbox' ? false : ''),
    }
  }, {})
}
