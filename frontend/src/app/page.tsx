'use client'

import { useState, useEffect } from 'react'
import { Upload, FileText, Download, Sparkles, CheckCircle, ArrowRight, Play } from 'lucide-react'
import toast from 'react-hot-toast'
import Confetti from 'react-confetti'
import useWindowSize from '@/hooks/useWindowSize'

import ResumeUpload from '@/components/ResumeUpload'
import JobDescriptionUpload from '@/components/JobDescriptionUpload'
import ResumePreview from '@/components/ResumePreview'
import { cn } from '@/lib/utils'
import { mockResume, mockJobDescription, mockTailoredResume } from '@/lib/mockData'

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
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const { width, height } = useWindowSize()

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
    
    if (isDemoMode) {
      setTimeout(() => {
        setTailoredResume(mockTailoredResume)
        setCurrentStep(4)
        setIsProcessing(false)
        toast.success('Resume tailored successfully! (Demo Mode)')
      }, 2000)
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tailor-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_id: resume.id,
          job_description_id: jobDescription.id,
        }),
      })

      if (!response.ok) throw new Error('Failed to tailor resume')

      const data = await response.json()
      setTailoredResume(data)
      setCurrentStep(4)
      toast.success('Resume tailored successfully!')
    } catch (error) {
      toast.error('Error tailoring resume. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!tailoredResume) {
      toast.error('No tailored resume available')
      return
    }

    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 8000) // Confetti for 8 seconds

    if (isDemoMode) {
      toast.success('PDF download simulated! (Demo Mode)')
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate-pdf/${tailoredResume.id}`, { method: 'POST' })
      if (!response.ok) throw new Error('Failed to generate PDF')
      
      const downloadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/download/${tailoredResume.id}`)
      const blob = await downloadResponse.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `tailored_resume_${tailoredResume.id}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      toast.success('Your tailored resume is downloading!')
    } catch (error) {
      toast.error('Error downloading PDF. Please try again.')
    }
  }

  const startDemo = () => {
    setIsDemoMode(true)
    setResume(mockResume)
    setJobDescription(mockJobDescription)
    setCurrentStep(3)
    toast.success('Demo mode activated!')
  }

  const resetDemo = () => {
    setIsDemoMode(false)
    setResume(null)
    setJobDescription(null)
    setTailoredResume(null)
    setCurrentStep(1)
    toast.success('Demo reset.')
  }

  return (
    <>
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={400} />}
      <div className="min-h-screen bg-neutral-50 font-body text-neutral-800">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-soft border-b border-neutral-200/80 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-warm-500 to-amber-500 rounded-lg flex items-center justify-center shadow-soft">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-heading font-medium text-neutral-900">Resume Optimizer</h1>
                  <p className="text-xs text-neutral-500">Your AI-Powered Career Partner</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {isDemoMode && (
                  <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium animate-fade-in">
                    Demo Mode
                  </div>
                )}
                <button
                  onClick={isDemoMode ? resetDemo : startDemo}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isDemoMode
                      ? 'bg-neutral-800 text-white hover:bg-neutral-900 shadow-soft'
                      : 'bg-gradient-to-r from-warm-500 to-amber-500 text-white hover:shadow-medium'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  <span>{isDemoMode ? 'Reset Demo' : 'Start Demo'}</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          
          {currentStep === 1 && !isDemoMode && (
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-hero text-neutral-900">Craft the perfect resume, effortlessly.</h1>
              <p className="text-subtitle mt-4 max-w-2xl mx-auto text-neutral-600">
                Let our AI analyze your resume against any job description to create a tailored application that gets noticed.
              </p>
            </div>
          )}

          {/* Progress Steps */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-center space-x-2 md:space-x-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={cn(
                      'flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all duration-300',
                      currentStep === step.id && 'animate-pulse-slow',
                      currentStep >= step.id
                        ? 'bg-warm-500 border-warm-600 text-white shadow-medium'
                        : 'bg-white border-neutral-300 text-neutral-400'
                    )}
                  >
                    <step.icon className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span
                    className={cn(
                      'ml-2 md:ml-3 text-sm font-medium hidden md:block',
                      currentStep >= step.id ? 'text-warm-700' : 'text-neutral-500'
                    )}
                  >
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="w-8 md:w-12 h-px bg-neutral-300 mx-2 md:mx-4"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Card Content */}
          <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-xl border border-neutral-200/80 rounded-2xl shadow-large animate-slide-up">
            {currentStep === 1 && (
              <div className="p-8 md:p-12">
                <h2 className="text-title font-heading text-neutral-900 mb-2">Upload Your Resume</h2>
                <p className="text-neutral-600 mb-8">Let's start by getting your current resume.</p>
                <ResumeUpload onUpload={handleResumeUpload} />
              </div>
            )}

            {currentStep === 2 && (
              <div className="p-8 md:p-12">
                <h2 className="text-title font-heading text-neutral-900 mb-2">Add Job Description</h2>
                <p className="text-neutral-600 mb-8">Now, let's see the job you're applying for.</p>
                <JobDescriptionUpload onUpload={handleJobDescriptionUpload} />
              </div>
            )}

            {currentStep === 3 && (
              <div className="p-8 md:p-12">
                <h2 className="text-title font-heading text-neutral-900 mb-2">Ready for the magic?</h2>
                <p className="text-neutral-600 mb-8">Our AI is ready to tailor your resume.</p>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-neutral-100/80 rounded-xl p-4 border border-neutral-200">
                      <h3 className="font-semibold text-neutral-800 mb-2">Selected Resume</h3>
                      <p className="text-sm text-neutral-600 truncate">{resume?.filename}</p>
                    </div>
                    <div className="bg-neutral-100/80 rounded-xl p-4 border border-neutral-200">
                      <h3 className="font-semibold text-neutral-800 mb-2">Job Description</h3>
                      <p className="text-sm text-neutral-600 truncate">{jobDescription?.title} at {jobDescription?.company}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleTailorResume}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-warm-500 to-amber-500 text-white py-4 px-6 rounded-lg font-semibold hover:shadow-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Tailoring Resume...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Tailor My Resume</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {currentStep === 4 && tailoredResume && (
              <div className="p-8 md:p-12">
                <h2 className="text-title font-heading text-neutral-900 mb-2">Your new resume is ready!</h2>
                <p className="text-neutral-600 mb-8">Review the AI's work and download your optimized resume.</p>
                <div className="space-y-6">
                  <div className="bg-green-50/80 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <span className="text-green-800 font-semibold">Resume tailored successfully!</span>
                        <p className="text-green-700 text-sm mt-1">
                          Estimated pages: {tailoredResume.estimated_pages}
                        </p>
                      </div>
                    </div>
                  </div>

                  <ResumePreview content={tailoredResume.preview_content} />

                  <button
                    onClick={handleDownloadPDF}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-lg font-semibold hover:shadow-medium transition-all duration-300 flex items-center justify-center space-x-2 text-lg"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
} 