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
  showTitle = true,
  buttonClassName = 'mt-8',
  formType = 'single',
}: {
  form: Form
  className?: string
  children?: React.ReactNode
  showTitle?: boolean
  buttonClassName?: string
  formType?: 'single' | 'double'
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

  // Helper function to check if a field is a checkbox
  const isCheckbox = (field: any) => field.blockType === 'checkbox'

  // Helper function to check if a field is part of a checkbox group
  const isPartOfCheckboxGroup = (fields: any[], currentIndex: number) => {
    if (!isCheckbox(fields[currentIndex])) return false

    // Find the start of the current group
    let groupStartIndex = currentIndex
    while (groupStartIndex > 0 && isCheckbox(fields[groupStartIndex - 1])) {
      groupStartIndex--
    }

    // If this is not the first checkbox in the group, it's part of a group
    return currentIndex > groupStartIndex
  }

  // Helper function to get group title for a checkbox
  const getCheckboxGroupTitle = (fields: any[], currentIndex: number) => {
    if (!isCheckbox(fields[currentIndex])) return undefined

    // Find the start of the current group
    let groupStartIndex = currentIndex
    while (groupStartIndex > 0 && isCheckbox(fields[groupStartIndex - 1])) {
      groupStartIndex--
    }

    // If this is the first checkbox in the group, use its label as the group title
    return currentIndex === groupStartIndex ? fields[currentIndex].label : undefined
  }

  return (
    <FormProvider {...formMethods}>
      <form id={id} onSubmit={handleSubmit(onSubmit)} className={cn(className)}>
        {showTitle && children}
        <div>
          {form &&
            form.fields &&
            form.fields?.map((field, index) => {
              const Field = fields[field.blockType as SupportedFieldTypes]
              if (Field) {
                const isGroupedCheckbox = isPartOfCheckboxGroup(form.fields || [], index)
                const groupTitle = isGroupedCheckbox
                  ? getCheckboxGroupTitle(form.fields || [], index)
                  : undefined
                return (
                  <div className={cn('mb-4')} key={index}>
                    <Field
                      form={{ name: formType === 'double' ? 'double-form' : 'single-form' }}
                      {...field}
                      {...formMethods}
                      control={control}
                      errors={errors}
                      register={register}
                      isGrouped={isGroupedCheckbox}
                      groupTitle={groupTitle}
                    />
                  </div>
                )
              }
              return null
            })}
        </div>

        <div className={buttonClassName}>
          <Button form={id} type="submit" variant="default" className="w-full" loading={isLoading}>
            {submitButtonLabel}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
