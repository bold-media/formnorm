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
import { ProgressBar } from '@/components/ProgressBar'

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
  onSuccess,
  submissionContext,
}: {
  form: Form
  className?: string
  children?: React.ReactNode
  showTitle?: boolean
  buttonClassName?: string
  formType?: 'single' | 'double'
  onSuccess?: () => void
  submissionContext?: any
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
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [uploadedFileIds, setUploadedFileIds] = useState<Record<string, string>>({})

  const onSubmit = useCallback(
    (data: FormState) => {
      const submitForm = async () => {
        setIsLoading(true)
        setUploadProgress({})

        try {
          // First, upload any files that haven't been uploaded yet
          const fileFields = Object.entries(data).filter(([name, value]) => {
            if (!value) return false
            if (Array.isArray(value)) {
              return (
                value.length > 0 &&
                value.every((file) => file && typeof file === 'object' && 'name' in file)
              )
            }
            return value && typeof value === 'object' && 'name' in value
          })

          const uploadPromises = fileFields.flatMap(([name, value]) => {
            const files = Array.isArray(value) ? value : [value]
            return files.map((file) => {
              const formData = new FormData()
              formData.append('file', file as File)

              return new Promise<{ name: string; fileId: string }>((resolve, reject) => {
                const xhr = new XMLHttpRequest()

                xhr.upload.addEventListener('progress', (event) => {
                  if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100)
                    setUploadProgress((prev) => ({
                      ...prev,
                      [name]: progress,
                    }))
                  }
                })

                xhr.addEventListener('load', async () => {
                  if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                      const result = JSON.parse(xhr.responseText)
                      resolve({ name, fileId: result.id })
                    } catch (error) {
                      reject(new Error(`Failed to parse response for file ${file.name}`))
                    }
                  } else {
                    reject(new Error(`Failed to upload file ${file.name}`))
                  }
                })

                xhr.addEventListener('error', () => {
                  reject(new Error(`Failed to upload file ${file.name}`))
                })

                xhr.open('POST', `${getClientSideURL()}/api/upload`)
                xhr.send(formData)
              })
            })
          })

          const newUploadedFiles = await Promise.all(uploadPromises)
          const newFileMap = new Map(newUploadedFiles.map(({ name, fileId }) => [name, fileId]))

          // Merge new uploads with existing ones
          const allFileIds = { ...uploadedFileIds }
          newFileMap.forEach((fileId, name) => {
            allFileIds[name] = fileId
          })

          // Then prepare the form data with file IDs
          const dataToSend = Object.entries(data).map(([name, value]) => {
            if (allFileIds[name]) {
              return {
                field: name,
                value: allFileIds[name],
              }
            }
            return {
              field: name,
              value,
            }
          })

          // Submit the form
          const response = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: id,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          if (!response.ok) {
            throw new Error('Failed to submit form')
          }

          setIsLoading(false)
          setUploadProgress({})
          setUploadedFileIds({}) // Clear uploaded files only on successful form submission
          formMethods.reset()

          // Вызываем callback после успешной отправки
          if (onSuccess) {
            onSuccess()
          }

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect
            if (url) router.push(url)
          } else if (confirmationType === 'message') {
            toast.success(<RichText data={confirmationMessage} />)
          }
        } catch (err) {
          setIsLoading(false)
          setUploadProgress({})
          toast.error('Что-то пошло не так. Пожалуйста, попробуйте снова!')
        }
      }
      void submitForm()
    },
    [router, id, redirect, confirmationType, confirmationMessage, formMethods, uploadedFileIds, onSuccess],
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
                    {field.blockType === 'upload' && uploadProgress[field.name] !== undefined && (
                      <div className="mt-2">
                        <ProgressBar
                          progress={uploadProgress[field.name]}
                          className="bg-blue-500"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Uploading... {uploadProgress[field.name]}%
                        </p>
                      </div>
                    )}
                  </div>
                )
              }
              return null
            })}
        </div>

        <div className={buttonClassName}>
          <Button
            form={id}
            type="submit"
            variant="default"
            className="w-full"
            loading={isLoading}
            disabled={isLoading || Object.keys(uploadProgress).length > 0}
          >
            {submitButtonLabel}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
