'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, FileCheck2, X, Sparkle } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn, formatFileSize, isValidFileType } from '@/lib/utils'

interface Resume {
  id: number
  filename: string
  parsed_content: string
}

interface ResumeUploadProps {
  onUpload: (resume: Resume) => void
}

export default function ResumeUpload({ onUpload }: ResumeUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const allowedTypes = ['.pdf', '.docx', '.txt']
  const maxSize = 10 * 1024 * 1024 // 10MB

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    if (!isValidFileType(file.name, allowedTypes)) {
      toast.error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`)
      return
    }

    if (file.size > maxSize) {
      toast.error('File too large. Maximum size: 10MB')
      return
    }

    setUploadedFile(file)
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload-resume`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      
      if (data.success) {
        onUpload({
          id: data.file_id,
          filename: data.filename,
          parsed_content: '',
        })
      } else {
        throw new Error(data.message || 'Upload failed')
      }
    } catch (error) {
      toast.error('Error uploading resume. Please try again.')
      console.error('Upload error:', error)
      setUploadedFile(null)
    } finally {
      setIsUploading(false)
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxSize,
    multiple: false,
  })

  const removeFile = () => {
    setUploadedFile(null)
  }

  return (
    <div className="space-y-6">
      {!uploadedFile ? (
        <div
          {...getRootProps()}
          className={cn(
            'relative group overflow-hidden bg-neutral-100/60 border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ease-in-out transform',
            isDragActive
              ? 'border-warm-500 bg-warm-50/80 scale-105 shadow-medium'
              : 'border-neutral-300 hover:border-neutral-400/80 hover:bg-neutral-100'
          )}
        >
          <input {...getInputProps()} />
          <div className="absolute inset-0 bg-gradient-to-br from-warm-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <UploadCloud className={cn('w-16 h-16 text-neutral-400 mx-auto mb-4 transition-transform duration-300', isDragActive && 'transform -translate-y-1 scale-110 text-warm-600')} />
            {isDragActive ? (
              <p className="text-xl font-semibold text-warm-700 font-heading">Let go to begin the magic!</p>
            ) : (
              <div>
                <p className="text-lg font-semibold text-neutral-700 mb-2 font-heading">
                  Let's begin your story. Place your resume here.
                </p>
                <p className="text-sm text-neutral-500">
                  Supports PDF, DOCX, and TXT files up to 10MB
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-green-50/80 border border-green-200 rounded-2xl p-5 animate-scale-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FileCheck2 className="w-8 h-8 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">{uploadedFile.name}</p>
                <p className="text-sm text-green-700">
                  {formatFileSize(uploadedFile.size)} - Ready to go!
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="text-neutral-500 hover:text-neutral-800 p-1 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="flex items-center justify-center space-x-3 text-neutral-600">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-warm-600"></div>
          <p>Analyzing your resume...</p>
        </div>
      )}

      <div className="bg-neutral-100/70 border border-neutral-200/80 rounded-2xl p-5">
        <div className="flex items-center space-x-3">
          <Sparkle className="w-8 h-8 text-warm-500" />
          <div>
            <h3 className="font-semibold text-neutral-800">What we do with your resume:</h3>
            <p className="text-sm text-neutral-600 mt-1">
              Your document is securely parsed to prepare it for our AI tailoring process. We respect your privacy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 