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
}

export const Radio = ({ name, control, errors, label, options, required, width }: RadioProps) => {
  return (
    <Width width={width}>
      <div className="mb-4">
        <Label htmlFor={name} className="text-base font-normal">
          {label}
        </Label>
      </div>
      <Controller
        control={control}
        defaultValue=""
        name={name}
        render={({ field: { onChange, value } }) => (
          <RadioGroup className="gap-3" defaultValue={value} onValueChange={onChange} value={value}>
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
      {required && errors[name] && <Error />}
    </Width>
  )
}
