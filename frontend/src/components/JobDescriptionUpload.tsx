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

    // Validate form
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
      <div className="text-center">
        <p className="text-gray-600 mb-4">
          Add the job description you want to tailor your resume for.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              <Briefcase className="w-4 h-4 inline mr-2" />
              Job Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Senior Software Engineer"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              <Building className="w-4 h-4 inline mr-2" />
              Company Name
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="e.g., Google, Microsoft"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-2" />
            Job Description
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Paste the full job description here. Include requirements, responsibilities, and any specific skills or qualifications mentioned..."
            rows={12}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
            required
          />
          <p className="text-sm text-gray-500 mt-2">
            {formData.content.length} characters (minimum 50)
          </p>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">What we extract from the job description:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Key technical skills and technologies</li>
          <li>• Required and preferred qualifications</li>
          <li>• Job responsibilities and expectations</li>
          <li>• Industry-specific keywords</li>
          <li>• Experience level requirements</li>
        </ul>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-900 mb-2">💡 Tips for better results:</h3>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Include the complete job description for better keyword extraction</li>
          <li>• Make sure to include requirements and responsibilities sections</li>
          <li>• The more detailed the description, the better the tailoring</li>
        </ul>
      </div>
    </div>
  )
} 