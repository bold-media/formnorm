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
  form?: any
}

export const Number = ({ name, label, required, width, register, errors, form }: NumberProps) => {
  const isDoubleForm = form?.name === 'double-form'

  return (
    <Width width={width}>
      <div className="space-y-1">
        <div
          className={`text-zinc-900 mt-5 mb-0 ${
            !isDoubleForm ? 'font-medium text-base sm:text-lg md:text-xl' : 'font-normal'
          }`}
        >
          {label}
        </div>
        <Input type="number" {...register(name, { required })} className="w-full mt-0 pt-0" />
      </div>
      {required && errors[name] && <Error />}
    </Width>
  )
}
