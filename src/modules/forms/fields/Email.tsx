import type { EmailField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/Input'

import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

type EmailProps = EmailField & {
  errors: Partial<
    FieldErrorsImpl<{
      [x: string]: any
    }>
  >
  register: UseFormRegister<FieldValues>
}

export const Email = ({
  name,
  defaultValue,
  errors,
  label,
  register,
  required: requiredFromProps,
  width,
}: EmailProps) => {
  return (
    <Width width={width}>
      <Input
        defaultValue={defaultValue}
        id={name}
        type="text"
        placeholder={label}
        {...register(name, { pattern: /^\S[^\s@]*@\S+$/, required: requiredFromProps })}
      />

      {requiredFromProps && errors[name] && <Error />}
    </Width>
  )
}
