'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X, CheckCircle, Sparkles, Award } from 'lucide-react'
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
    <div className="space-y-8">
      <div className="text-center">
        <p className="luxury-subtitle text-lg">
          Upload your resume and let us transform it into your career success story
        </p>
      </div>

      {!uploadedFile ? (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-500 hover-lift',
            isDragActive
              ? 'border-purple-400 bg-gradient-to-r from-purple-50 to-blue-50 shadow-lg'
              : 'border-gray-300 hover:border-purple-300 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50'
          )}
        >
          <input {...getInputProps()} />
          <div className="space-y-6">
            <div className="relative mx-auto w-24 h-24">
              <div className={cn(
                'w-full h-full rounded-3xl flex items-center justify-center transition-all duration-500',
                isDragActive 
                  ? 'luxury-gradient shadow-xl scale-110' 
                  : 'bg-gradient-to-r from-slate-100 to-blue-100 shadow-lg'
              )}>
                <Upload className={cn(
                  'w-12 h-12 transition-all duration-500',
                  isDragActive ? 'text-white' : 'text-blue-600'
                )} />
              </div>
              {isDragActive && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse-glow">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            
            {isDragActive ? (
              <div className="space-y-2">
                <p className="text-xl font-semibold text-purple-700">Drop your resume here</p>
                <p className="text-purple-600">We're ready to transform it!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-xl font-semibold text-gray-800 mb-2">
                    Drag & drop your resume here
                  </p>
                  <p className="text-gray-600">or click to browse files</p>
                </div>
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>PDF</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>DOCX</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>TXT</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-3xl p-6 animate-fade-in-scale">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-green-800 text-lg">{uploadedFile.name}</p>
                <p className="text-green-600 text-sm">
                  {formatFileSize(uploadedFile.size)}
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="text-green-600 hover:text-green-800 transition-colors p-2 rounded-full hover:bg-green-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-16 h-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
            <div className="absolute inset-0 rounded-full border-2 border-purple-200"></div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-700 font-medium">Processing your resume</p>
            <p className="text-gray-500 text-sm">Extracting content and preparing for optimization</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6 text-center hover-lift">
          <div className="w-12 h-12 luxury-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
          <p className="text-sm text-gray-600">Advanced algorithms extract key information from your resume</p>
        </div>
        
        <div className="glass rounded-2xl p-6 text-center hover-lift">
          <div className="w-12 h-12 luxury-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Professional Formatting</h3>
          <p className="text-sm text-gray-600">Maintains your original layout while optimizing content</p>
        </div>
        
        <div className="glass rounded-2xl p-6 text-center hover-lift">
          <div className="w-12 h-12 luxury-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Secure Processing</h3>
          <p className="text-sm text-gray-600">Your data is processed securely and never stored permanently</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
          <Sparkles className="w-5 h-5 mr-2" />
          What happens next?
        </h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span>We extract and analyze your resume content with precision</span>
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span>Identify key sections: experience, skills, education, and achievements</span>
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span>Prepare your content for AI-powered tailoring optimization</span>
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span>Your data is processed securely and never stored permanently</span>
          </li>
        </ul>
      </div>
    </div>
  )
} 