'use client'
import { RenderForm } from '@/modules/forms/RenderForm'
import { SingleFormBlockType, Form } from '@payload-types'
import React from 'react'

export const SingleFormBlock = (props: SingleFormBlockType) => {
  const { form } = props

  if (!form) return null

  return (
    <section className="container relative px-0 xs:px-4">
      <div className="max-w-3xl mx-auto">
        <RenderForm
          form={form as Form}
          className="px-4 xs:px-8 sm:px-12 pt-12 sm:pt-16 pb-8 border border-zinc-200"
        >
          {typeof form === 'object' && (
            <h3 className="not-prose mt-0 mb-4 leading-10 text-center font-semibold md:font-bold text-[1.5rem] sm:text-[1.7rem]">
              {form?.title}
            </h3>
          )}
        </RenderForm>
      </div>
    </section>
  )
}
