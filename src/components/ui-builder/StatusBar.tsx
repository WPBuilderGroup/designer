'use client'

import { useState, useEffect } from 'react'
import { 
  Wifi, 
  WifiOff, 
  Save, 
  Clock, 
  Users, 
  Eye,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react'

type StatusType = 'success' | 'warning' | 'error' | 'info'

interface StatusMessage {
  id: string
  type: StatusType
  message: string
  timestamp: Date
}

export function StatusBar() {
  const [isOnline, setIsOnline] = useState(true)
  const [lastSaved, setLastSaved] = useState<Date>(new Date())
  const [messages, setMessages] = useState<StatusMessage[]>([
    {
      id: '1',
      type: 'success',
      message: 'Project saved successfully',
      timestamp: new Date()
    }
  ])
  const [currentMessage, setCurrentMessage] = useState<StatusMessage | null>(
    messages[0] || null
  )

  // Simulate online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Auto-hide messages after 5 seconds
  useEffect(() => {
    if (currentMessage) {
      const timer = setTimeout(() => {
        setCurrentMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [currentMessage])

  const getStatusIcon = (type: StatusType) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={14} className="text-green-500" />
      case 'warning':
        return <AlertCircle size={14} className="text-yellow-500" />
      case 'error':
        return <AlertCircle size={14} className="text-red-500" />
      case 'info':
        return <Info size={14} className="text-blue-500" />
      default:
        return <Info size={14} className="text-gray-500" />
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="h-6 bg-gray-900 border-t border-gray-700 flex items-center justify-between px-4 text-xs">
      {/* Left Section - Status Messages */}
      <div className="flex items-center space-x-4 flex-1">
        {currentMessage && (
          <div className="flex items-center space-x-2">
            {getStatusIcon(currentMessage.type)}
            <span className="text-gray-300">{currentMessage.message}</span>
            <button
              onClick={() => setCurrentMessage(null)}
              className="text-gray-500 hover:text-gray-300 ml-2"
            >
              ×
            </button>
          </div>
        )}
        
        {!currentMessage && (
          <div className="text-gray-500">Ready</div>
        )}
      </div>

      {/* Center Section - Additional Info */}
      <div className="flex items-center space-x-6 text-gray-400">
        {/* Page Info */}
        <div className="flex items-center space-x-1">
          <Eye size={12} />
          <span>1920×1080</span>
        </div>

        {/* Collaborators */}
        <div className="flex items-center space-x-1">
          <Users size={12} />
          <span>2 online</span>
        </div>

        {/* Elements Count */}
        <div className="text-gray-500">
          <span>12 elements</span>
        </div>
      </div>

      {/* Right Section - Connection & Save Status */}
      <div className="flex items-center space-x-4">
        {/* Last Saved */}
        <div className="flex items-center space-x-1 text-gray-400">
          <Clock size={12} />
          <span>Saved {getRelativeTime(lastSaved)}</span>
        </div>

        {/* Auto Save Indicator */}
        <div className="flex items-center space-x-1">
          <Save size={12} className="text-green-500" />
          <span className="text-gray-400">Auto-save on</span>
        </div>

        {/* Connection Status */}
        <div className="flex items-center space-x-1">
          {isOnline ? (
            <>
              <Wifi size={12} className="text-green-500" />
              <span className="text-gray-400">Online</span>
            </>
          ) : (
            <>
              <WifiOff size={12} className="text-red-500" />
              <span className="text-gray-400">Offline</span>
            </>
          )}
        </div>

        {/* Version */}
        <div className="text-gray-500 border-l border-gray-700 pl-4">
          v1.0.0
        </div>
      </div>
    </div>
  )
}
