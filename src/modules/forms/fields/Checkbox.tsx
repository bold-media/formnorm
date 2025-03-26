import type { CheckboxField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { useFormContext } from 'react-hook-form'

import { Checkbox as CheckboxUI } from '@/components/Checkbox'
import { Label } from '@/components/Label'
import React from 'react'
import { Error } from '../Error'
import { Width } from '../Width'

type CheckboxProps = CheckboxField & {
  errors: Partial<
    FieldErrorsImpl<{
      [x: string]: any
    }>
  >
  getValues: any
  register: UseFormRegister<FieldValues>
  setValue: any
  isGrouped?: boolean
  groupTitle?: string
  options?: { label: string; value: string }[]
  form?: any
}

export const Checkbox = ({
  name,
  defaultValue,
  errors,
  label,
  register,
  required: requiredFromProps,
  width,
  isGrouped = false,
  groupTitle,
  options,
  form,
}: CheckboxProps) => {
  const { setValue } = useFormContext()
  const isDoubleForm = form?.name === 'double-form'

  const renderCheckbox = (option: { label: string; value: string }, index: number) => {
    const optionName = `${name}_${index}`
    const props = register(optionName, { required: requiredFromProps })

    return (
      <label key={index} className="flex items-center cursor-pointer gap-2 py-0">
        <CheckboxUI
          defaultChecked={defaultValue === true}
          {...props}
          onCheckedChange={(checked) => {
            setValue(optionName, checked)
          }}
        />
        <span className={`font-normal ${isDoubleForm ? 'text-sm' : 'text-base'}`}>
          {option.label}
        </span>
      </label>
    )
  }

  if (options && options.length > 0) {
    return (
      <Width width={width}>
        <div className="space-y-1">
          <div
            className={`font-medium text-zinc-900 mt-5 mb-2 ${
              !isDoubleForm ? 'text-base sm:text-lg md:text-xl' : 'text-sm'
            }`}
          >
            {label}
          </div>
          <div className="space-y-1">
            {options.map((option, index) => renderCheckbox(option, index))}
          </div>
        </div>
        {requiredFromProps && errors[name] && <Error />}
      </Width>
    )
  }

  // Fallback for single checkbox without options
  const props = register(name, { required: requiredFromProps })
  return (
    <Width width={width}>
      <label className="flex items-center cursor-pointer gap-3 py-2">
        <CheckboxUI
          defaultChecked={defaultValue === true}
          {...props}
          onCheckedChange={(checked) => {
            setValue(props.name, checked)
          }}
        />
        <span className={`font-normal leading-tight ${isDoubleForm ? 'text-sm' : 'text-base'}`}>
          {label}
        </span>
      </label>
      {requiredFromProps && errors[name] && <Error />}
    </Width>
  )
}
