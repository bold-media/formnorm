import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/Input'
import { Label } from '@/components/Label'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

type NumberProps = TextField & {
  errors: Partial<
    FieldErrorsImpl<{
      [x: string]: any
    }>
  >
  register: UseFormRegister<FieldValues>
}

export const Number = ({
  name,
  defaultValue,
  errors,
  label,
  register,
  required: requiredFromProps,
  width,
}: NumberProps) => {
  return (
    <Width width={width}>
      <Label htmlFor={name}>{label}</Label>
      <Input
        defaultValue={defaultValue}
        id={name}
        type="number"
        {...register(name, { required: requiredFromProps })}
      />
      {requiredFromProps && errors[name] && <Error />}
    </Width>
  )
}
