'use client'

import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

interface PublishModalProps {
  isOpen: boolean
  onClose: () => void
}

interface PublishState {
  status: 'idle' | 'queued' | 'building' | 'deployed' | 'error'
  deploymentUrl?: string
  error?: string
  project?: string
  page?: string
}

export default function PublishModal({ isOpen, onClose }: PublishModalProps) {
  const [publishState, setPublishState] = useState<PublishState>({
    status: 'idle'
  })

  useEffect(() => {
    // Listen for publish requests from Topbar
    const handlePublishRequest = (event: CustomEvent) => {
      const { project, page } = event.detail
      setPublishState({
        status: 'queued',
        project,
        page
      })
      
      // Start the publish process
      startPublish(project, page)
    }

    window.addEventListener('publish-request', handlePublishRequest as EventListener)

    return () => {
      window.removeEventListener('publish-request', handlePublishRequest as EventListener)
    }
  }, [])

  const startPublish = async (project: string, page: string) => {
    try {
      // Set to building state
      setPublishState(prev => ({
        ...prev,
        status: 'building'
      }))

      // Call the publish API
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      // Set to deployed state with deployment URL
      setPublishState(prev => ({
        ...prev,
        status: 'deployed',
        deploymentUrl: result.deploymentUrl || result.url
      }))

    } catch (error) {
      console.error('Publish failed:', error)
      setPublishState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }))
    }
  }

  const handleClose = () => {
    setPublishState({ status: 'idle' })
    onClose()
  }

  const handleRetry = () => {
    if (publishState.project && publishState.page) {
      startPublish(publishState.project, publishState.page)
    }
  }

  const getStatusIcon = () => {
    switch (publishState.status) {
      case 'queued':
        return (
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        )
      case 'building':
        return (
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        )
      case 'deployed':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )
      case 'error':
        return (
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )
      default:
        return null
    }
  }

  const getStatusMessage = () => {
    switch (publishState.status) {
      case 'queued':
        return {
          title: 'Queued for Publishing',
          description: 'Your project has been queued for deployment. Please wait...'
        }
      case 'building':
        return {
          title: 'Building Your Site',
          description: 'We\'re building and optimizing your website. This may take a few minutes...'
        }
      case 'deployed':
        return {
          title: 'Successfully Deployed!',
          description: 'Your website has been published and is now live.'
        }
      case 'error':
        return {
          title: 'Publishing Failed',
          description: publishState.error || 'An error occurred while publishing your website.'
        }
      default:
        return {
          title: 'Publish Your Website',
          description: 'Ready to make your website live? Click publish to deploy your changes.'
        }
    }
  }

  const statusMessage = getStatusMessage()
  const isPublishing = publishState.status === 'queued' || publishState.status === 'building'

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title="Publish Website"
    >
      <div className="space-y-6">
        {/* Status Section */}
        <div className="flex items-start space-x-4">
          {getStatusIcon()}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {statusMessage.title}
            </h3>
            <p className="text-sm text-gray-600">
              {statusMessage.description}
            </p>
          </div>
        </div>

        {/* Project Info */}
        {publishState.project && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">
              <div className="flex justify-between mb-1">
                <span>Project:</span>
                <span className="font-medium text-gray-900">{publishState.project}</span>
              </div>
              <div className="flex justify-between">
                <span>Page:</span>
                <span className="font-medium text-gray-900">{publishState.page}</span>
              </div>
            </div>
          </div>
        )}

        {/* Deployment URL */}
        {publishState.status === 'deployed' && publishState.deploymentUrl && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-green-800 mb-2">
              Your website is live!
            </h4>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={publishState.deploymentUrl}
                readOnly
                className="flex-1 px-3 py-2 text-sm bg-white border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(publishState.deploymentUrl!)
                }}
              >
                Copy
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  window.open(publishState.deploymentUrl, '_blank')
                }}
              >
                Visit
              </Button>
            </div>
          </div>
        )}

        {/* Error Details */}
        {publishState.status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-red-800 mb-2">
              Error Details
            </h4>
            <p className="text-sm text-red-700">
              {publishState.error}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          {publishState.status === 'error' && (
            <Button
              variant="outline"
              onClick={handleRetry}
            >
              Retry
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isPublishing}
          >
            {publishState.status === 'deployed' ? 'Done' : 'Cancel'}
          </Button>
          
          {publishState.status === 'idle' && (
            <Button
              onClick={() => {
                // Trigger publish for current project/page
                const urlParams = new URLSearchParams(window.location.search)
                const project = urlParams.get('project') || 'default-project'
                const page = urlParams.get('page') || 'home'
                
                setPublishState({
                  status: 'queued',
                  project,
                  page
                })
                startPublish(project, page)
              }}
            >
              Publish Now
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
