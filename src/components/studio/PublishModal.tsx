'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { X, ExternalLink, Copy, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface PublishModalProps {
  isOpen: boolean
  onClose: () => void
}

interface PublishResult {
  deploymentUrl: string
  message: string
  meta: {
    project: string
    page: string
    filename: string
    publishedAt: string
    size: number
  }
}

export default function PublishModal({ isOpen, onClose }: PublishModalProps) {
  const searchParams = useSearchParams()
  const project = searchParams.get('project') || 'default-project'
  const page = searchParams.get('page') || 'home'
  
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishResult, setPublishResult] = useState<PublishResult | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handlePublish = async () => {
    setIsPublishing(true)
    setError('')
    setPublishResult(null)

    try {
      console.log(`Publishing ${project}/${page}...`)
      
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          project,
          page
        })
      })

      const data = await response.json()

      if (response.ok) {
        setPublishResult(data)
        console.log('Publish successful:', data.deploymentUrl)
      } else {
        setError(data.error || 'Failed to publish page')
      }
    } catch (err) {
      console.error('Publish error:', err)
      setError('Network error occurred while publishing')
    } finally {
      setIsPublishing(false)
    }
  }

  const handleCopyUrl = async () => {
    if (!publishResult) return

    const fullUrl = `${window.location.origin}${publishResult.deploymentUrl}`
    
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  const handleOpenPreview = () => {
    if (!publishResult) return
    
    const fullUrl = `${window.location.origin}${publishResult.deploymentUrl}`
    window.open(fullUrl, '_blank', 'noopener,noreferrer')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Publish Page
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Project/Page Info */}
          <div className="mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Publishing:</div>
              <div className="font-medium text-gray-900">
                {project} / {page}
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="text-red-600 mr-2" size={20} />
                <div className="text-red-700 text-sm">{error}</div>
              </div>
            </div>
          )}

          {/* Success State */}
          {publishResult && (
            <div className="mb-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                <div className="flex items-center mb-2">
                  <CheckCircle className="text-green-600 mr-2" size={20} />
                  <div className="text-green-700 font-medium">
                    Published Successfully!
                  </div>
                </div>
                <div className="text-green-600 text-sm">
                  {publishResult.message}
                </div>
              </div>

              {/* Deployment URL */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="text-sm text-gray-600 mb-2">Deployment URL:</div>
                <div className="flex items-center justify-between bg-white border rounded px-3 py-2">
                  <code className="text-sm text-gray-800 truncate flex-1">
                    {`${window.location.origin}${publishResult.deploymentUrl}`}
                  </code>
                  <button
                    onClick={handleCopyUrl}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                    title="Copy URL"
                  >
                    {copied ? (
                      <CheckCircle size={16} className="text-green-600" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Metadata */}
              <div className="text-xs text-gray-500 space-y-1">
                <div>File: {publishResult.meta.filename}</div>
                <div>Size: {formatFileSize(publishResult.meta.size)}</div>
                <div>Published: {formatDate(publishResult.meta.publishedAt)}</div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {!publishResult && (
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={16} />
                    Publishing...
                  </>
                ) : (
                  'Publish Page'
                )}
              </button>
            )}

            {publishResult && (
              <>
                <button
                  onClick={handleOpenPreview}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center"
                >
                  <ExternalLink className="mr-2" size={16} />
                  Open Preview
                </button>
                <button
                  onClick={() => {
                    setPublishResult(null)
                    setError('')
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Publish Again
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
