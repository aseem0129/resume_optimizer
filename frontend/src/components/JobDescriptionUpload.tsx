'use client'

import { useState } from 'react'
import { FileText, Building, Briefcase, Send } from 'lucide-react'
import toast from 'react-hot-toast'

interface JobDescription {
  id: number
  title: string
  company: string
  content: string
}

interface JobDescriptionUploadProps {
  onUpload: (jobDescription: JobDescription) => void
}

export default function JobDescriptionUpload({ onUpload }: JobDescriptionUploadProps) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    content: '',
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.company.trim() || !formData.content.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    if (formData.content.length < 50) {
      toast.error('Job description should be at least 50 characters long')
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload-job-description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to process job description')
      }

      const data = await response.json()
      onUpload(data)
    } catch (error) {
      toast.error('Error processing job description. Please try again.')
      console.error('Error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative group">
            <label htmlFor="title" className="absolute -top-3 left-3 bg-white px-1 text-sm font-medium text-neutral-600 font-heading">
              Job Title
            </label>
            <div className="flex items-center bg-white rounded-lg border border-neutral-300 transition-all duration-300 group-focus-within:border-warm-500 group-focus-within:ring-2 group-focus-within:ring-warm-500/50">
              <Briefcase className="w-5 h-5 text-neutral-400 mx-3" />
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Senior Software Engineer"
                className="w-full pl-0 pr-4 py-3 bg-transparent border-0 focus:ring-0"
                required
              />
            </div>
          </div>

          <div className="relative group">
            <label htmlFor="company" className="absolute -top-3 left-3 bg-white px-1 text-sm font-medium text-neutral-600 font-heading">
              Company Name
            </label>
            <div className="flex items-center bg-white rounded-lg border border-neutral-300 transition-all duration-300 group-focus-within:border-warm-500 group-focus-within:ring-2 group-focus-within:ring-warm-500/50">
              <Building className="w-5 h-5 text-neutral-400 mx-3" />
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="e.g., Google, Microsoft"
                className="w-full pl-0 pr-4 py-3 bg-transparent border-0 focus:ring-0"
                required
              />
            </div>
          </div>
        </div>

        <div className="relative group">
          <label htmlFor="content" className="absolute -top-3 left-3 bg-white px-1 text-sm font-medium text-neutral-600 font-heading">
            Job Description
          </label>
          <div className="flex items-start bg-white rounded-lg border border-neutral-300 transition-all duration-300 group-focus-within:border-warm-500 group-focus-within:ring-2 group-focus-within:ring-warm-500/50">
            <FileText className="w-5 h-5 text-neutral-400 mx-3 mt-3.5" />
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Paste the full job description here..."
              rows={12}
              className="w-full pl-0 pr-4 py-3 bg-transparent border-0 focus:ring-0 resize-vertical"
              required
            />
          </div>
          <p className="text-xs text-neutral-500 mt-2 text-right">
            {formData.content.length} characters
          </p>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-warm-500 to-amber-500 text-white py-4 px-6 rounded-lg font-semibold hover:shadow-medium active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Process Job Description</span>
            </>
          )}
        </button>
      </form>

      <div className="bg-neutral-100/70 border border-neutral-200/80 rounded-2xl p-5">
        <h3 className="font-semibold text-neutral-800 mb-2 font-heading">💡 Tips for Best Results</h3>
        <ul className="text-sm text-neutral-600 space-y-2 list-disc list-inside">
          <li>Provide the complete job description for the most accurate tailoring.</li>
          <li>Ensure requirements and responsibilities are included.</li>
          <li>The more detail you provide, the better our AI can assist you.</li>
        </ul>
      </div>
    </div>
  )
} 