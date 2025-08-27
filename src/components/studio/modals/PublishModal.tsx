'use client'

import { useEffect, useRef } from 'react'
import { X, Clock, Loader2, CheckCircle, AlertCircle, ExternalLink, Copy } from 'lucide-react'

interface PublishModalProps {
  open: boolean
  onClose: () => void
  status: 'Queued' | 'Building' | 'Deployed' | 'Error'
  url?: string | null
  error?: string | null
}

export default function PublishModal({ open, onClose, status, url, error }: PublishModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const firstFocusableRef = useRef<HTMLAnchorElement>(null)

  // Focus management and keyboard handling
  useEffect(() => {
    if (!open) return

    // Focus the close button when modal opens
    const focusElement = closeButtonRef.current || firstFocusableRef.current
    if (focusElement) {
      setTimeout(() => focusElement.focus(), 100)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'Tab') {
        // Trap focus within modal
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusableElements || focusableElements.length === 0) return

        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  const getStatusIcon = () => {
    switch (status) {
      case 'Queued':
        return <Clock className="text-primary" size={24} aria-hidden="true" />
      case 'Building':
        return <Loader2 className="text-primary animate-spin" size={24} aria-hidden="true" />
      case 'Deployed':
        return <CheckCircle className="text-green-600" size={24} aria-hidden="true" />
      case 'Error':
        return <AlertCircle className="text-destructive" size={24} aria-hidden="true" />
    }
  }

  const getStatusMessage = () => {
    switch (status) {
      case 'Queued':
        return 'Your project has been queued for deployment...'
      case 'Building':
        return 'Building your project, this may take a few moments...'
      case 'Deployed':
        return 'Your project has been successfully deployed!'
      case 'Error':
        return 'An error occurred during deployment.'
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="publish-modal-title"
      aria-describedby="publish-modal-description"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-background rounded-md shadow-xl w-full max-w-md mx-4 border border-border"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2
            id="publish-modal-title"
            className="text-lg font-semibold text-foreground"
          >
            Publish Project
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Close dialog"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Status */}
          <div
            id="publish-modal-description"
            className="flex items-center space-x-3 mb-4"
          >
            {getStatusIcon()}
            <div>
              <div className="font-medium text-foreground">
                {status}
              </div>
              <div className="text-sm text-muted-foreground">
                {getStatusMessage()}
              </div>
            </div>
          </div>

          {/* URL Section (only when deployed) */}
          {status === 'Deployed' && url && (
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md p-4 mb-4">
              <div className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                Your site is live!
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="deployed-url" className="sr-only">
                  Deployed site URL
                </label>
                <input
                  id="deployed-url"
                  type="text"
                  value={url}
                  readOnly
                  className="flex-1 text-sm bg-background border border-green-300 dark:border-green-600 rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  onClick={() => copyToClipboard(url)}
                  className="rounded-md px-2.5 py-1.5 text-sm text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  title="Copy URL to clipboard"
                  aria-label="Copy URL to clipboard"
                >
                  <Copy size={16} aria-hidden="true" />
                </button>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md px-2.5 py-1.5 text-sm text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  title="Open site in new tab"
                  aria-label="Open deployed site in new tab"
                >
                  <ExternalLink size={16} aria-hidden="true" />
                </a>
              </div>
            </div>
          )}

          {/* Error Section */}
          {status === 'Error' && error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4 mb-4">
              <div className="text-sm font-medium text-destructive mb-2">
                Error Details
              </div>
              <div
                className="text-sm text-destructive/80 font-mono bg-destructive/5 rounded-md p-2"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            </div>
          )}

          {/* Progress Bar (for building state) */}
          {status === 'Building' && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Building...</span>
                <span>Please wait</span>
              </div>
              <div
                className="w-full bg-muted rounded-full h-2"
                role="progressbar"
                aria-label="Build progress"
                aria-valuenow={60}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          {status === 'Deployed' && url && (
            <a
              ref={firstFocusableRef}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 rounded-md px-2.5 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <ExternalLink size={16} aria-hidden="true" />
              <span>Visit Site</span>
            </a>
          )}
          <button
            onClick={onClose}
            className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            {status === 'Building' ? 'Close' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  )
}
