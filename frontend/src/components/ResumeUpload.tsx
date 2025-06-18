'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X, CheckCircle } from 'lucide-react'
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

    // Validate file type
    if (!isValidFileType(file.name, allowedTypes)) {
      toast.error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`)
      return
    }

    // Validate file size
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
          parsed_content: '', // Will be fetched separately if needed
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
      <div className="text-center">
        <p className="text-gray-600 mb-4">
          Upload your resume in PDF, DOCX, or TXT format. Maximum file size: 10MB.
        </p>
      </div>

      {!uploadedFile ? (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          )}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          {isDragActive ? (
            <p className="text-blue-600 font-medium">Drop your resume here...</p>
          ) : (
            <div>
              <p className="text-gray-600 font-medium mb-2">
                Drag & drop your resume here, or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Supports PDF, DOCX, and TXT files
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">{uploadedFile.name}</p>
                <p className="text-sm text-green-600">
                  {formatFileSize(uploadedFile.size)}
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="text-green-600 hover:text-green-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Uploading and processing resume...</p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">What we do with your resume:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Extract text content while preserving formatting</li>
          <li>• Identify key sections (experience, skills, education)</li>
          <li>• Prepare for AI-powered tailoring</li>
          <li>• Your data is processed securely and not stored permanently</li>
        </ul>
      </div>
    </div>
  )
} 