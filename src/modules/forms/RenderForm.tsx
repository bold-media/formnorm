'use client'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { Button } from '@/components/Button'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { toast } from 'sonner'
import { buildInitialFormState, FormState } from './buildInitialFormState'
import { fields, SupportedFieldTypes } from './fields'
import { getClientSideURL } from '@/utils/getURL'
import { Form } from '@payload-types'
import { cn } from '@/utils/cn'
import { RichText } from '../common/RichText'

export type Value = unknown

export interface Property {
  [key: string]: Value
}

export interface Data {
  [key: string]: Property | Property[]
}

export type FormBlockType = {
  blockName?: string
  blockType?: 'form'
  enableIntro: boolean
  form: FormType
  introContent?: SerializedEditorState
}

export const RenderForm = ({
  form,
  className,
  children,
}: {
  form: Form
  className?: string
  children?: React.ReactNode
}) => {
  const {
    id,
    confirmationType,
    confirmationMessage,
    redirect,
    submitButtonLabel,
    fields: fieldsFromForm,
  } = form ?? {}

  const formMethods = useForm<FormState>({
    defaultValues: buildInitialFormState(fieldsFromForm as any),
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const onSubmit = useCallback(
    (data: FormState) => {
      const submitForm = async () => {
        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        try {
          await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: id,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          setIsLoading(false)

          console.log(`confirmationType: ${confirmationType}`)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          } else if (confirmationType === 'message') {
            toast.success(<RichText data={confirmationMessage} />)
            formMethods.reset()
          }
        } catch (err) {
          setIsLoading(false)
          toast.error('Что-то пошло не так. Пожалуйста, попробуйте снова!')
        }
      }
      void submitForm()
    },
    [router, id, redirect, confirmationType, confirmationMessage, formMethods],
  )

  return (
    <FormProvider {...formMethods}>
      <form id={id} onSubmit={handleSubmit(onSubmit)} className={cn(className)}>
        {children}
        <div className="mb-4 last:mb-0">
          {form &&
            form.fields &&
            form.fields?.map((field, index) => {
              const Field = fields[field.blockType as SupportedFieldTypes]
              if (Field) {
                return (
                  <div className="mb-4 last:mb-0" key={index}>
                    <Field
                      form={form}
                      {...field}
                      {...formMethods}
                      control={control}
                      errors={errors}
                      register={register}
                    />
                  </div>
                )
              }
              return null
            })}
        </div>

        <Button form={id} type="submit" variant="default" className="w-full" loading={isLoading}>
          {submitButtonLabel}
        </Button>
      </form>
    </FormProvider>
  )
}
