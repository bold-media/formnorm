'use client'

import {
  AudioWaveform,
  File as FileIcon,
  FileImage,
  FolderArchive,
  UploadCloud,
  Video,
  X,
} from 'lucide-react'
import { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Input } from '../Input'

interface FileUploadProps {
  onFilesChange: (files: File[]) => void
  multiple?: boolean
  value?: File[] | File | null
}

enum FileTypes {
  Image = 'image',
  Pdf = 'pdf',
  Audio = 'audio',
  Video = 'video',
  Other = 'other',
}

const ImageColor = {
  bgColor: 'bg-purple-600',
  fillColor: 'fill-purple-600',
}

const PdfColor = {
  bgColor: 'bg-blue-400',
  fillColor: 'fill-blue-400',
}

const AudioColor = {
  bgColor: 'bg-yellow-400',
  fillColor: 'fill-yellow-400',
}

const VideoColor = {
  bgColor: 'bg-green-400',
  fillColor: 'fill-green-400',
}

const OtherColor = {
  bgColor: 'bg-gray-400',
  fillColor: 'fill-gray-400',
}

export default function FileUpload({ onFilesChange, multiple = false, value }: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  // Sync with external value
  useEffect(() => {
    if (value === null) {
      setSelectedFiles([])
    } else if (Array.isArray(value)) {
      setSelectedFiles(value)
    } else if (value && 'name' in value && 'type' in value && 'size' in value) {
      setSelectedFiles([value])
    }
  }, [value])

  const getFileIconAndColor = (file: File) => {
    if (file.type.includes(FileTypes.Image)) {
      return {
        icon: <FileImage size={40} className={ImageColor.fillColor} />,
        color: ImageColor.bgColor,
      }
    }

    if (file.type.includes(FileTypes.Pdf)) {
      return {
        icon: <FileIcon size={40} className={PdfColor.fillColor} />,
        color: PdfColor.bgColor,
      }
    }

    if (file.type.includes(FileTypes.Audio)) {
      return {
        icon: <AudioWaveform size={40} className={AudioColor.fillColor} />,
        color: AudioColor.bgColor,
      }
    }

    if (file.type.includes(FileTypes.Video)) {
      return {
        icon: <Video size={40} className={VideoColor.fillColor} />,
        color: VideoColor.bgColor,
      }
    }

    return {
      icon: <FolderArchive size={40} className={OtherColor.fillColor} />,
      color: OtherColor.bgColor,
    }
  }

  const removeFile = useCallback(
    (file: File) => {
      const newFiles = selectedFiles.filter((f) => f !== file)
      setSelectedFiles(newFiles)
      onFilesChange(newFiles)
    },
    [selectedFiles, onFilesChange],
  )

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = multiple ? [...selectedFiles, ...acceptedFiles] : acceptedFiles
      setSelectedFiles(newFiles)
      onFilesChange(newFiles)
    },
    [multiple, selectedFiles, onFilesChange],
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple,
  })

  return (
    <div>
      <div>
        <label
          {...getRootProps()}
          className="relative flex flex-col items-center justify-center w-full py-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 "
        >
          <div className=" text-center">
            <div className=" border p-2 rounded-md max-w-min mx-auto">
              <UploadCloud size={20} />
            </div>

            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold hidden sm:inline">Перетащите файл</span>
              <span className="font-semibold sm:hidden">Выберите файл</span>
            </p>
            <p className="text-xs text-gray-500">
              Нажмите, чтобы загрузить файл (файл должен быть меньше 10 МБ)
              {multiple && ' - Допускаются несколько файлов'}
            </p>
          </div>
        </label>

        <Input
          {...getInputProps()}
          id="dropzone-file"
          type="file"
          className="hidden"
          multiple={multiple}
        />
      </div>

      {selectedFiles.length > 0 && (
        <div>
          <p className="font-medium my-2 mt-6 text-muted-foreground text-sm">Выбранные файлы</p>
          <div className="space-y-2 pr-3">
            {selectedFiles.map((file) => {
              return (
                <div
                  key={file.lastModified}
                  className="flex justify-between gap-2 rounded-lg overflow-hidden border border-slate-100 group hover:pr-0 pr-2 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center flex-1 p-2">
                    <div className="text-white">{getFileIconAndColor(file).icon}</div>
                    <div className="w-full ml-2 space-y-1">
                      <div className="text-sm flex justify-between">
                        <p className="text-muted-foreground ">{file.name.slice(0, 25)}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file)}
                    className="bg-red-500 text-white transition-all items-center justify-center px-2 hidden group-hover:flex"
                  >
                    <X size={20} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
