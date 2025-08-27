'use client'

import { useState, useEffect } from 'react';
import PublishModal from './PublishModal';
import type { GjsEditor, GjsReadyDetail } from '@/types/gjs';

export default function Topbar() {
  const [currentDevice, setCurrentDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [isPreview, setIsPreview] = useState(false)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [editor, setEditor] = useState<GjsEditor | null>(null)
  const [showPublishModal, setShowPublishModal] = useState(false)

  const deviceSizes = [
    { id: 'desktop', icon: '💻', label: 'Desktop', active: currentDevice === 'desktop' },
    { id: 'tablet', icon: '📱', label: 'Tablet', active: currentDevice === 'tablet' },
    { id: 'mobile', icon: '📱', label: 'Mobile', active: currentDevice === 'mobile' }
  ]

  useEffect(() => {
    // Listen for GrapesJS ready event
    const handleGjsReady = (event: CustomEvent<GjsReadyDetail>) => {
      const { editor: editorInstance } = event.detail
      setEditor(editorInstance)

      // Initialize undo/redo state
      updateHistoryState(editorInstance)
    }

    // Listen for device changes
    const handleDeviceChange = (event: CustomEvent<{ device: 'desktop' | 'tablet' | 'mobile' }>) => {
      setCurrentDevice(event.detail.device)
    }

    // Listen for preview toggle
    const handlePreviewToggle = (event: CustomEvent<{ isPreview: boolean }>) => {
      setIsPreview(event.detail.isPreview)
    }

    // Listen for history changes
    const handleHistoryChange = () => {
      if (editor) {
        updateHistoryState(editor)
      }
    }

    // Add event listeners
    window.addEventListener('gjs-ready', handleGjsReady as EventListener)
    window.addEventListener('gjs-device-change', handleDeviceChange as EventListener)
    window.addEventListener('gjs-preview-toggle', handlePreviewToggle as EventListener)
    window.addEventListener('gjs-history-change', handleHistoryChange)

    return () => {
      window.removeEventListener('gjs-ready', handleGjsReady as EventListener)
      window.removeEventListener('gjs-device-change', handleDeviceChange as EventListener)
      window.removeEventListener('gjs-preview-toggle', handlePreviewToggle as EventListener)
      window.removeEventListener('gjs-history-change', handleHistoryChange)
    }
  }, [editor])

  const updateHistoryState = (editorInstance: GjsEditor) => {
    const undoManager = editorInstance.UndoManager
    setCanUndo(undoManager.hasUndo())
    setCanRedo(undoManager.hasRedo())
  }

  const handleDeviceClick = (deviceId: 'desktop' | 'tablet' | 'mobile') => {
    if (editor) {
      editor.runCommand(`set-device-${deviceId}`)
    }
  }

  const handlePreview = () => {
    if (editor) {
      editor.runCommand('preview')
    }
  }

  const handleFullscreen = () => {
    if (editor) {
      editor.runCommand('fullscreen')
    }
  }

  const handleUndo = () => {
    if (editor && canUndo) {
      editor.runCommand('core:undo')
    }
  }

  const handleRedo = () => {
    if (editor && canRedo) {
      editor.runCommand('core:redo')
    }
  }

  const handleClear = () => {
    if (editor) {
      editor.runCommand('clear-canvas')
    }
  }

  const handlePublish = () => {
    // Get current project and page from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const project = urlParams.get('project') || 'default-project'
    const page = urlParams.get('page') || 'home'

    // Show the publish modal
    setShowPublishModal(true)

    // Dispatch publish request event
    window.dispatchEvent(new CustomEvent('publish-request', {
      detail: { project, page }
    }))
  }

  return (
    <>
      <div className="h-full flex items-center justify-between px-4 bg-white border-b border-gray-200">
        {/* Left Section - Device Selector */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {deviceSizes.map((device) => (
              <button
                key={device.id}
                onClick={() => handleDeviceClick(device.id as 'desktop' | 'tablet' | 'mobile')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  device.active 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title={device.label}
              >
                <span className="mr-1">{device.icon}</span>
                {device.label}
              </button>
            ))}
          </div>
        </div>

        {/* Center Section - Undo/Redo */}
        <div className="flex items-center space-x-1">
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className={`p-2 rounded transition-colors ${
              canUndo 
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                : 'text-gray-300 cursor-not-allowed'
            }`}
            title="Undo"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className={`p-2 rounded transition-colors ${
              canRedo 
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                : 'text-gray-300 cursor-not-allowed'
            }`}
            title="Redo"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
            </svg>
          </button>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePreview}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
              isPreview
                ? 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <svg className="w-4 h-4 mr-1.5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview
          </button>

          <button
            onClick={handleFullscreen}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="Fullscreen"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>

          <button
            onClick={handleClear}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Clear canvas"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          <button
            onClick={handlePublish}
            className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            <svg className="w-4 h-4 mr-1.5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
            </svg>
            Publish
          </button>
        </div>
      </div>

      {/* Publish Modal */}
      <PublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
      />
    </>
  )
}
