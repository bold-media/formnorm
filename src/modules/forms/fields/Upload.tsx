import React, { useCallback } from 'react'
import { FileUpload } from '@/components/FileUpload'
import { Width } from '../Width'
import { useFormContext } from 'react-hook-form'

interface UploadProps {
  label?: string
  required?: boolean
  name: string
  multiple?: boolean
}

export const Upload = ({ label, required, name, multiple = true }: UploadProps) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext()
  const value = watch(name)

  const handleFilesChange = useCallback(
    (files: File[]) => {
      if (files.length === 0) {
        setValue(name, null)
      } else {
        // For multiple files, pass the array directly
        // For single file, pass just the first file
        setValue(name, multiple ? files : files[0])
      }
    },
    [name, multiple, setValue],
  )

  return (
    <Width className="my-4" width="100">
      {label && (
        <label className="block text-zinc-900 mt-5 mb-1 font-medium text-base sm:text-lg md:text-xl">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <FileUpload onFilesChange={handleFilesChange} multiple={multiple} value={value} />
      {errors[name] && (
        <p className="mt-1 text-sm text-red-500">{errors[name]?.message as string}</p>
      )}
    </Width>
  )
}
