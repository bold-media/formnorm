export interface RadioOption {
  label: string
  value: string
}

export interface BaseField {
  name: string
  label: string
  type: string
  required?: boolean
  width?: number
  admin?: {
    width?: string
    [key: string]: any
  }
}

export interface RadioField extends BaseField {
  type: 'radio'
  options: RadioOption[]
  defaultValue?: string
}
