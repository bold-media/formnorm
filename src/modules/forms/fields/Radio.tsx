import type { Control, FieldErrorsImpl, FieldValues } from 'react-hook-form'
import type { RadioField } from '../types'

import { Label } from '@/components/Label'
import { RadioGroup, RadioGroupItem } from '@/components/RadioGroup'
import React from 'react'
import { Controller } from 'react-hook-form'

import { Error } from '../Error'
import { Width } from '../Width'

type RadioProps = RadioField & {
  control: Control<FieldValues, any>
  errors: Partial<
    FieldErrorsImpl<{
      [x: string]: any
    }>
  >
  form?: any
}

export const Radio = ({
  name,
  control,
  errors,
  label,
  options,
  required,
  width,
  form,
}: RadioProps) => {
  const isDoubleForm = form?.name === 'double-form'

  return (
    <Width width={width}>
      <div className="space-y-1">
        <div
          className={`text-zinc-900 mt-5 mb-2 ${
            !isDoubleForm ? 'font-medium text-base sm:text-lg md:text-xl' : 'font-normal'
          }`}
        >
          {label}
        </div>
        <Controller
          control={control}
          defaultValue=""
          name={name}
          render={({ field: { onChange, value } }) => (
            <RadioGroup
              className="gap-3"
              defaultValue={value}
              onValueChange={onChange}
              value={value}
            >
              {options.map(({ label, value }) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem id={`${name}-${value}`} value={value} />
                  <Label className="font-normal" htmlFor={`${name}-${value}`}>
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
          rules={{ required }}
        />
      </div>
      {required && errors[name] && <Error />}
    </Width>
  )
}
