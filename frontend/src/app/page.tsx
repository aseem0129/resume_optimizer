'use client'

import { useState, useEffect } from 'react'
import { Upload, FileText, Sparkles, CheckCircle, Crown, Star, Play, Zap } from 'lucide-react'
import { Toaster, toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'
import ResumeUpload from '@/components/ResumeUpload'
import JobDescription from '@/components/JobDescription'
import ResumeTailor from '@/components/ResumeTailor'

interface Resume {
  id: number
  filename: string
  parsed_content: string
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [resume, setResume] = useState<Resume | null>(null)
  const [jobDescription, setJobDescription] = useState<string>('')
  const [isDemoMode, setIsDemoMode] = useState(false)

  const steps = [
    {
      id: 1,
      title: 'Upload Resume',
      description: 'Upload your current resume',
      icon: Upload
    },
    {
      id: 2,
      title: 'Job Description',
      description: 'Add the job description',
      icon: FileText
    },
    {
      id: 3,
      title: 'AI Tailoring',
      description: 'Let AI optimize your resume',
      icon: Sparkles
    },
    {
      id: 4,
      title: 'Download',
      description: 'Get your tailored resume',
      icon: CheckCircle
    }
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleResumeUpload = (uploadedResume: Resume) => {
    setResume(uploadedResume)
    setCurrentStep(2)
  }

  const handleJobDescriptionSubmit = (description: string) => {
    setJobDescription(description)
    setCurrentStep(3)
  }

  const handleTailorComplete = () => {
    setCurrentStep(4)
  }

  const startDemo = () => {
    setIsDemoMode(true)
    setResume({
      id: 1,
      filename: 'demo_resume.pdf',
      parsed_content: 'Demo resume content'
    })
    setJobDescription('Demo job description for testing purposes')
    setCurrentStep(1)
    toast.success('🎭 Demo mode activated! Try the full workflow.')
  }

  const resetDemo = () => {
    setIsDemoMode(false)
    setResume(null)
    setJobDescription('')
    setCurrentStep(1)
    toast.success('🔄 Demo reset. Ready for real data.')
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(156,146,172,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-10 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-10 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 luxury-gradient rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
                  <Crown className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Star className="w-2 h-2 text-white" />
                </div>
              </div>
              <div>
                <h1 className="luxury-title text-3xl">Resume Optimizer</h1>
                <p className="luxury-subtitle text-sm">Where dreams meet opportunity</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isDemoMode && (
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium border border-amber-200 shadow-sm">
                  🎭 Demo Mode
                </div>
              )}
              <button
                onClick={isDemoMode ? resetDemo : startDemo}
                className={`luxury-button px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isDemoMode
                    ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'
                }`}
              >
                <Play className="w-4 h-4 mr-2" />
                <span>{isDemoMode ? 'Reset Demo' : 'Start Demo'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="luxury-title text-4xl md:text-5xl mb-4">
              Transform Your Career
            </h2>
            <p className="luxury-subtitle text-lg md:text-xl max-w-2xl mx-auto">
              Let AI craft the perfect resume that opens doors to your dream job
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 shadow-lg',
                      currentStep > step.id
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                        : currentStep === step.id
                        ? 'luxury-gradient text-white shadow-xl'
                        : 'bg-white/80 border-gray-200 text-gray-400'
                    )}
                  >
                    <step.icon className="w-7 h-7" />
                  </div>
                  <div className="mt-3 text-center">
                    <p className={cn(
                      'font-semibold text-sm transition-colors',
                      currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                    )}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      'w-16 h-0.5 transition-all duration-500',
                      currentStep > step.id ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-200'
                    )}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="max-w-4xl mx-auto">
            {currentStep === 1 && (
              <div className="glass rounded-3xl p-8 animate-fade-in-scale hover-lift">
                <ResumeUpload onUpload={handleResumeUpload} />
              </div>
            )}

            {currentStep === 2 && (
              <div className="glass rounded-3xl p-8 animate-fade-in-scale hover-lift">
                <JobDescription onJobDescriptionSubmit={handleJobDescriptionSubmit} />
              </div>
            )}

            {currentStep === 3 && (
              <div className="glass rounded-3xl p-8 animate-fade-in-scale hover-lift">
                <ResumeTailor 
                  resume={resume!} 
                  jobDescription={jobDescription} 
                  onComplete={handleTailorComplete} 
                />
              </div>
            )}

            {currentStep === 4 && (
              <div className="glass rounded-3xl p-8 animate-fade-in-scale hover-lift success-glow">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="luxury-title text-3xl mb-2">Your Success Awaits</h2>
                  <p className="luxury-subtitle">Download your perfectly tailored resume</p>
                </div>
                
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-green-900">Resume Successfully Tailored!</h3>
                        <p className="text-green-700 text-sm">Your resume has been optimized for maximum impact</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass rounded-2xl p-6 text-center hover-lift">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">ATS Optimized</h4>
                      <p className="text-sm text-gray-600">Perfect for tracking systems</p>
                    </div>
                    
                    <div className="glass rounded-2xl p-6 text-center hover-lift">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Keyword Enhanced</h4>
                      <p className="text-sm text-gray-600">Aligned with job requirements</p>
                    </div>
                    
                    <div className="glass rounded-2xl p-6 text-center hover-lift">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Ready to Apply</h4>
                      <p className="text-sm text-gray-600">Download and start applying</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => {
                        toast.success('📄 Demo resume downloaded!')
                        resetDemo()
                      }}
                      className="luxury-button px-8 py-4 rounded-2xl text-lg font-semibold flex items-center justify-center space-x-3 mx-auto"
                    >
                      <CheckCircle className="w-6 h-6" />
                      <span>Download Tailored Resume</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white/80 backdrop-blur-xl border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="luxury-subtitle">
              Powered by advanced AI technology to help you land your dream job
            </p>
          </div>
        </div>
      </footer>

      <Toaster position="top-right" />
    </div>
  )
} 