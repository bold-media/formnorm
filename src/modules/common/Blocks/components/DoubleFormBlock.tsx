'use client'
import { Button } from '@/components/Button'
import { RenderForm } from '@/modules/forms/RenderForm'
import { cn } from '@/utils/cn'
import { getLinkProps } from '@/utils/getLinkProps'
import { DoubleFormBlockType, Form } from '@payload-types'
import Link from 'next/link'
import React from 'react'

export const DoubleFormBlock = (props: DoubleFormBlockType) => {
  const { forms } = props

  if (!forms || !Array.isArray(forms)) return null

  return (
    <section className="container relative px-0 xs:px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-0 xs:justify-items-center">
        {forms?.map(({ id, form, link }, index) => (
          <div key={id} className="max-w-lg md:max-w-none md:w-full md:h-full md:flex md:flex-col ">
            <RenderForm
              form={form as Form}
              formType="double"
              className={cn(
                'px-4 xs:px-8 sm:px-12 pt-12 sm:pt-16 pb-8 border border-zinc-200 border-b-0',
                'md:flex-1 md:flex md:flex-col md:justify-between',
                index === 0 && 'md:border-r-0',
                index === 1 && 'md:bg-zinc-100/70',
              )}
              buttonClassName="mt-2"
            >
              {typeof form === 'object' && (
                <h3 className="not-prose mt-0 mb-4 leading-10 text-center md:text-left font-semibold md:font-bold text-[1.5rem] sm:text-[1.7rem]">
                  {form?.title}
                </h3>
              )}
            </RenderForm>
            <Button
              variant="white"
              size="xl"
              className={cn('not-prose w-full border-zinc-200', index === 0 && 'md:border-r-0')}
              icon={index === 0 ? 'arrowLeft' : 'arrowRight'}
              asChild
            >
              <Link {...getLinkProps(link)}>{link.label}</Link>
            </Button>
          </div>
        ))}
      </div>
    </section>
  )
}
