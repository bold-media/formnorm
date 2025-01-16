import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Label } from '@/components/Label'
import { Input } from '@/components/Input'
import React from 'react'
import { Width } from '../Width'
import { Error } from '../Error'

interface Props extends TextField {
  errors: Partial<
    FieldErrorsImpl<{
      [x: string]: any
    }>
  >
  register: UseFormRegister<FieldValues>
}
export const Text = ({
  name,
  defaultValue,
  errors,
  label,
  register,
  required: requiredFromProps,
  width,
}: Props) => {
  return (
    <Width width={width}>
      <Label htmlFor={name}>{label}</Label>
      <Input
        defaultValue={defaultValue}
        id={name}
        type="text"
        {...register(name, { required: requiredFromProps })}
      />
      {requiredFromProps && errors[name] && (
        <Error
          message={typeof errors[name]?.message === 'string' ? errors[name]?.message : undefined}
        />
      )}
    </Width>
  )
}
