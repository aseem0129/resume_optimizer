'use client'

import { useState } from 'react'
import { Briefcase, Target, Zap, Search, Sparkles, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'

interface JobDescriptionProps {
  onJobDescriptionSubmit: (jobDescription: string) => void
}

export default function JobDescription({ onJobDescriptionSubmit }: JobDescriptionProps) {
  const [jobDescription, setJobDescription] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description')
      return
    }

    setIsProcessing(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onJobDescriptionSubmit(jobDescription.trim())
      toast.success('🎯 Job description analyzed successfully!')
    } catch (error) {
      toast.error('Error processing job description')
    } finally {
      setIsProcessing(false)
    }
  }

  const sampleJobDescriptions = [
    {
      title: 'Software Engineer',
      company: 'Tech Corp',
      description: 'We are looking for a passionate Software Engineer to join our team. You will be responsible for developing scalable web applications using React, Node.js, and Python. Experience with cloud platforms like AWS is a plus.'
    },
    {
      title: 'Marketing Manager',
      company: 'Growth Inc',
      description: 'Join our dynamic marketing team! We need a creative Marketing Manager to develop and execute digital marketing campaigns. Experience with social media, content creation, and analytics tools required.'
    },
    {
      title: 'Data Analyst',
      company: 'Data Solutions',
      description: 'Seeking a detail-oriented Data Analyst to help us make data-driven decisions. Proficiency in SQL, Python, and visualization tools like Tableau. Experience with machine learning is preferred.'
    }
  ]

  const insertSample = (description: string) => {
    setJobDescription(description)
    toast.success('📋 Sample job description loaded!')
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-full mb-4">
          <Target className="w-5 h-5 text-purple-600" />
          <span className="text-purple-700 font-medium">Step 2</span>
        </div>
        <h2 className="luxury-title text-3xl mb-4">
          Tell us about your dream job
        </h2>
        <p className="luxury-subtitle text-lg">
          We'll tailor your resume to match the specific requirements and culture of your target position
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass rounded-3xl p-8">
          <div className="space-y-4">
            <label htmlFor="jobDescription" className="block">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-10 h-10 luxury-gradient rounded-xl flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Job Description</h3>
                  <p className="text-gray-600 text-sm">Paste the full job posting or description</p>
                </div>
              </div>
            </label>
            
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here... We'll analyze the requirements, responsibilities, and company culture to optimize your resume accordingly."
              className="w-full h-48 p-6 border border-gray-200 rounded-2xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
              disabled={isProcessing}
            />
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{jobDescription.length} characters</span>
              <span>Minimum 50 characters recommended</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={isProcessing || !jobDescription.trim()}
            className="luxury-button flex-1 flex items-center justify-center space-x-2 py-4 px-8 text-lg font-semibold"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Analyze & Optimize</span>
              </>
            )}
          </button>
        </div>
      </form>

      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Try with sample job descriptions</h3>
          <p className="text-gray-600">See how our AI tailors resumes for different roles</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleJobDescriptions.map((job, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-6 hover-lift cursor-pointer transition-all duration-300 border border-gray-200 hover:border-purple-300"
              onClick={() => insertSample(job.description)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 luxury-gradient rounded-xl flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <Sparkles className="w-5 h-5 text-purple-500" />
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-1">{job.title}</h4>
              <p className="text-purple-600 text-sm mb-3">{job.company}</p>
              
              <p className="text-gray-600 text-sm line-clamp-3">
                {job.description.substring(0, 120)}...
              </p>
              
              <button className="mt-4 text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors">
                Use this sample →
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6">
        <h3 className="font-semibold text-emerald-900 mb-3 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          What our AI analyzes:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-emerald-800">
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Required skills and technologies</span>
            </div>
            <div className="flex items-start">
              <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Experience level and qualifications</span>
            </div>
            <div className="flex items-start">
              <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Company culture and values</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Key responsibilities and duties</span>
            </div>
            <div className="flex items-start">
              <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Preferred qualifications and certifications</span>
            </div>
            <div className="flex items-start">
              <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Industry-specific keywords and terminology</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 text-center">
        <div className="w-16 h-16 luxury-gradient rounded-3xl flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Matching</h3>
        <p className="text-gray-600">
          Our advanced AI analyzes both your resume and the job description to create the perfect match. 
          We identify key skills, experiences, and achievements that align with the position requirements.
        </p>
      </div>
    </div>
  )
} 