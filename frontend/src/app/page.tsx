'use client'

import { useState } from 'react'
import { Upload, FileText, Download, Sparkles, CheckCircle, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import ResumeUpload from '@/components/ResumeUpload'
import JobDescriptionUpload from '@/components/JobDescriptionUpload'
import ResumePreview from '@/components/ResumePreview'
import { cn } from '@/lib/utils'

interface Resume {
  id: number
  filename: string
  parsed_content: string
}

interface JobDescription {
  id: number
  title: string
  company: string
  content: string
}

interface TailoredResume {
  id: number
  preview_content: string
  estimated_pages: number
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1)
  const [resume, setResume] = useState<Resume | null>(null)
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(null)
  const [tailoredResume, setTailoredResume] = useState<TailoredResume | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const steps = [
    { id: 1, title: 'Upload Resume', icon: Upload },
    { id: 2, title: 'Add Job Description', icon: FileText },
    { id: 3, title: 'AI Tailoring', icon: Sparkles },
    { id: 4, title: 'Download PDF', icon: Download },
  ]

  const handleResumeUpload = (uploadedResume: Resume) => {
    setResume(uploadedResume)
    setCurrentStep(2)
    toast.success('Resume uploaded successfully!')
  }

  const handleJobDescriptionUpload = (uploadedJD: JobDescription) => {
    setJobDescription(uploadedJD)
    setCurrentStep(3)
    toast.success('Job description processed!')
  }

  const handleTailorResume = async () => {
    if (!resume || !jobDescription) {
      toast.error('Please upload both resume and job description first')
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tailor-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume_id: resume.id,
          job_description_id: jobDescription.id,
          preserve_formatting: true,
          target_length: 'one_page',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to tailor resume')
      }

      const data = await response.json()
      setTailoredResume(data)
      setCurrentStep(4)
      toast.success('Resume tailored successfully!')
    } catch (error) {
      toast.error('Error tailoring resume. Please try again.')
      console.error('Error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!tailoredResume) {
      toast.error('No tailored resume available')
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate-pdf/${tailoredResume.id}`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      const data = await response.json()
      
      // Download the PDF
      const downloadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/download/${tailoredResume.id}`)
      const blob = await downloadResponse.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `tailored_resume_${tailoredResume.id}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('PDF downloaded successfully!')
    } catch (error) {
      toast.error('Error downloading PDF. Please try again.')
      console.error('Error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Resume Optimizer</h1>
                <p className="text-sm text-gray-600">AI-Powered Resume Tailoring</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    'flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors',
                    currentStep >= step.id
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  )}
                >
                  <step.icon className="w-6 h-6" />
                </div>
                <span
                  className={cn(
                    'ml-3 text-sm font-medium',
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                  )}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-gray-300 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 1 && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Your Resume</h2>
              <ResumeUpload onUpload={handleResumeUpload} />
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Job Description</h2>
              <JobDescriptionUpload onUpload={handleJobDescriptionUpload} />
            </div>
          )}

          {currentStep === 3 && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Resume Tailoring</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Selected Resume</h3>
                    <p className="text-sm text-gray-600">{resume?.filename}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Job Description</h3>
                    <p className="text-sm text-gray-600">{jobDescription?.title} at {jobDescription?.company}</p>
                  </div>
                </div>
                
                <button
                  onClick={handleTailorResume}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Tailoring Resume...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Tailor Resume with AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && tailoredResume && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Download Your Tailored Resume</h2>
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">Resume tailored successfully!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Estimated pages: {tailoredResume.estimated_pages}
                  </p>
                </div>

                <ResumePreview content={tailoredResume.preview_content} />

                <button
                  onClick={handleDownloadPDF}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 