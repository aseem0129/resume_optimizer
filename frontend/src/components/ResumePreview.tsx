'use client'

import { useState } from 'react'
import { Eye, EyeOff, Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface ResumePreviewProps {
  content: string
}

export default function ResumePreview({ content }: ResumePreviewProps) {
  const [showFullContent, setShowFullContent] = useState(false)
  const [copied, setCopied] = useState(false)

  const toggleContent = () => {
    setShowFullContent(!showFullContent)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      toast.success('Content copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy content')
    }
  }

  const displayContent = showFullContent ? content : content.slice(0, 500) + '...'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Resume Preview</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={copyToClipboard}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
          <button
            onClick={toggleContent}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            {showFullContent ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Show Less</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>Show More</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {displayContent}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Preview Notes:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• This is a preview of your tailored resume content</li>
          <li>• The final PDF will have professional formatting</li>
          <li>• Content has been optimized for the job description</li>
          <li>• Keywords and relevant experience have been emphasized</li>
        </ul>
      </div>
    </div>
  )
} 