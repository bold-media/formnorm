import { cn } from '@/utils/cn'
import React, { ComponentPropsWithRef } from 'react'

interface Props extends ComponentPropsWithRef<'div'> {
  message?: string | null | undefined
}

export const Error = ({ className, message }: Props) => {
  return (
    <div className={cn('mt-2 text-red-700 text-sm', className)}>
      {message || 'Обязательное поле'}
    </div>
  )
}
