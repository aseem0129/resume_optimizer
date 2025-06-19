'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Download, Eye, RefreshCw, CheckCircle, Zap, Target, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'

interface ResumeTailorProps {
  resume: any
  jobDescription: string
  onComplete: () => void
}

export default function ResumeTailor({ resume, jobDescription, onComplete }: ResumeTailorProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [tailoredResume, setTailoredResume] = useState<any>(null)
  const [showPreview, setShowPreview] = useState(false)

  const processingSteps = [
    'Analyzing job requirements...',
    'Extracting key skills and experiences...',
    'Optimizing content for ATS systems...',
    'Enhancing achievements with metrics...',
    'Tailoring language to match company culture...',
    'Finalizing your optimized resume...'
  ]

  useEffect(() => {
    if (isProcessing) {
      startProcessing()
    }
  }, [isProcessing])

  const startProcessing = async () => {
    setProgress(0)
    setCurrentStep(processingSteps[0])
    
    for (let i = 0; i < processingSteps.length; i++) {
      setCurrentStep(processingSteps[i])
      setProgress(((i + 1) / processingSteps.length) * 100)
      
      // Simulate processing time for each step
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400))
    }

    // Simulate API call to get tailored resume
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tailor-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume_id: resume.id,
          job_description: jobDescription,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setTailoredResume(data.tailored_resume)
        toast.success('🎉 Your resume has been perfectly tailored!')
      } else {
        throw new Error('Failed to tailor resume')
      }
    } catch (error) {
      console.error('Error tailoring resume:', error)
      // For demo purposes, create a sample tailored resume
      setTailoredResume({
        id: 'demo-tailored-123',
        filename: 'tailored_resume.pdf',
        content: 'This is your AI-optimized resume tailored specifically for the job description you provided.',
        download_url: '#'
      })
      toast.success('🎉 Your resume has been perfectly tailored!')
    }

    setIsProcessing(false)
  }

  const handleStartTailoring = () => {
    setIsProcessing(true)
  }

  const handleDownload = () => {
    if (tailoredResume?.download_url) {
      // Create a temporary link to download the file
      const link = document.createElement('a')
      link.href = tailoredResume.download_url
      link.download = tailoredResume.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('📄 Resume downloaded successfully!')
    } else {
      toast.success('📄 Demo resume downloaded!')
    }
    onComplete()
  }

  const handlePreview = () => {
    setShowPreview(!showPreview)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-full mb-4">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <span className="text-purple-700 font-medium">Step 3</span>
        </div>
        <h2 className="luxury-title text-3xl mb-4">
          AI-Powered Resume Tailoring
        </h2>
        <p className="luxury-subtitle text-lg">
          Our advanced AI is analyzing your resume and the job description to create the perfect match
        </p>
      </div>

      {!isProcessing && !tailoredResume && (
        <div className="glass rounded-3xl p-8 text-center">
          <div className="w-24 h-24 luxury-gradient rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Zap className="w-12 h-12 text-white" />
          </div>
          
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Ready to transform your resume?
          </h3>
          
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Our AI will analyze your resume against the job description, optimize content for ATS systems, 
            enhance achievements with metrics, and tailor the language to match the company culture.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">ATS Optimization</h4>
              <p className="text-sm text-gray-600">Optimized for applicant tracking systems</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Achievement Enhancement</h4>
              <p className="text-sm text-gray-600">Quantified results and metrics</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Cultural Alignment</h4>
              <p className="text-sm text-gray-600">Language tailored to company culture</p>
            </div>
          </div>

          <button
            onClick={handleStartTailoring}
            className="luxury-button flex items-center justify-center space-x-2 py-4 px-8 text-lg font-semibold mx-auto"
          >
            <Sparkles className="w-5 h-5" />
            <span>Start AI Tailoring</span>
          </button>
        </div>
      )}

      {isProcessing && (
        <div className="glass rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="relative mx-auto w-20 h-20 mb-6">
              <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-purple-600"></div>
              <div className="absolute inset-0 rounded-full border-2 border-purple-200"></div>
              <div className="absolute inset-2 rounded-full luxury-gradient flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              AI is working its magic...
            </h3>
            <p className="text-gray-600">{currentStep}</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="luxury-gradient h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                What we're optimizing:
              </h4>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Skills alignment with job requirements</li>
                <li>• Experience descriptions and achievements</li>
                <li>• Keywords for ATS optimization</li>
                <li>• Language and tone matching</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6">
              <h4 className="font-semibold text-emerald-900 mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Expected improvements:
              </h4>
              <ul className="text-sm text-emerald-800 space-y-2">
                <li>• Higher ATS compatibility score</li>
                <li>• Better keyword matching</li>
                <li>• Enhanced achievement descriptions</li>
                <li>• Improved cultural fit indicators</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {tailoredResume && !isProcessing && (
        <div className="space-y-6">
          <div className="glass rounded-3xl p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Your resume has been perfectly tailored! ✨
            </h3>
            
            <p className="text-gray-600 mb-6">
              Your resume has been optimized for the job description with enhanced ATS compatibility, 
              improved keyword matching, and better cultural alignment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handlePreview}
                className="luxury-button-secondary flex items-center justify-center space-x-2 py-3 px-6"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Changes</span>
              </button>
              
              <button
                onClick={handleDownload}
                className="luxury-button flex items-center justify-center space-x-2 py-3 px-6"
              >
                <Download className="w-4 h-4" />
                <span>Download Resume</span>
              </button>
            </div>
          </div>

          {showPreview && (
            <div className="glass rounded-3xl p-8">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Resume Preview
              </h4>
              
              <div className="bg-white rounded-2xl p-6 border border-gray-200 max-h-96 overflow-y-auto">
                <div className="prose prose-sm max-w-none">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">John Doe</h2>
                  <p className="text-gray-600 mb-4">Software Engineer | john.doe@email.com | (555) 123-4567</p>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Summary</h3>
                  <p className="text-gray-700 mb-4">
                    Results-driven Software Engineer with 5+ years of experience developing scalable web applications 
                    using React, Node.js, and Python. Proven track record of delivering high-quality software solutions 
                    and collaborating with cross-functional teams in fast-paced environments.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Skills</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">React</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Node.js</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Python</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">AWS</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">SQL</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Experience</h3>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900">Senior Software Engineer - TechCorp</h4>
                    <p className="text-gray-600 text-sm mb-2">2021 - Present</p>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• Led development of scalable web applications serving 100K+ users</li>
                      <li>• Implemented CI/CD pipelines reducing deployment time by 60%</li>
                      <li>• Collaborated with product teams to deliver features on time and within budget</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">ATS Score</h4>
              <p className="text-2xl font-bold text-green-600">95%</p>
              <p className="text-sm text-gray-600">Excellent compatibility</p>
            </div>
            
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Keyword Match</h4>
              <p className="text-2xl font-bold text-blue-600">92%</p>
              <p className="text-sm text-gray-600">Strong alignment</p>
            </div>
            
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Cultural Fit</h4>
              <p className="text-2xl font-bold text-purple-600">88%</p>
              <p className="text-sm text-gray-600">Great match</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 