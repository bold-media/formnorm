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
}: CheckboxProps) => {
  const props = register(name, { required: requiredFromProps })
  const { setValue } = useFormContext()

  return (
    <Width width={width}>
      <label
        className={`flex items-center cursor-pointer ${isGrouped ? 'gap-2 py-0' : 'gap-3 py-2'}`}
      >
        <CheckboxUI
          defaultChecked={defaultValue}
          {...props}
          onCheckedChange={(checked) => {
            setValue(props.name, checked)
          }}
        />
        <span className="font-normal">{label}</span>
      </label>
      {requiredFromProps && errors[name] && <Error />}
    </Width>
  )
}
