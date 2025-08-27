'use client'

import { ReactNode, useState, useEffect } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Topbar from './Topbar'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import StatusBar from './StatusBar'

interface StudioShellProps {
  children: ReactNode
  header?: ReactNode
  left?: ReactNode
  right?: ReactNode
  footer?: ReactNode
  onPublish?: () => void
}

export function StudioShell({
  children,
  header,
  left,
  right,
  footer,
  onPublish
}: StudioShellProps) {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true)
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const isSmall = window.innerWidth < 1280
      setIsSmallScreen(isSmall)
      if (isSmall) {
        setIsRightSidebarOpen(false)
      } else {
        setIsRightSidebarOpen(true)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen)
  }

  return (
    <div className="h-screen w-full bg-background grid grid-rows-[48px_1fr_28px] overflow-hidden">
      {/* Header - Topbar */}
      <div className="bg-background border-b border-border">
        {header || <Topbar onPublish={onPublish} />}
      </div>

      {/* Main Content Area with Resizable Panels */}
      <div className="overflow-hidden relative">
        <PanelGroup direction="horizontal">
          {/* Left Sidebar Panel */}
          <Panel
            defaultSize={isSmallScreen ? 25 : 17.5}
            minSize={isSmallScreen ? 20 : 13.75}
            maxSize={30}
            className="bg-background border-r border-border"
          >
            {left || <LeftSidebar />}
          </Panel>

          {/* Resize Handle */}
          <PanelResizeHandle className="w-1 bg-border hover:bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" />

          {/* Main Canvas Panel */}
          <Panel 
            minSize={30} 
            className="bg-muted/20 relative"
          >
            {children}
            
            {/* Right Sidebar Toggle Button - Only on small screens */}
            {isSmallScreen && (
              <button
                onClick={toggleRightSidebar}
                className="absolute top-4 right-4 z-20 rounded-md px-2.5 py-1.5 text-sm bg-background border border-border shadow-lg text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label={isRightSidebarOpen ? 'Hide properties panel' : 'Show properties panel'}
              >
                {isRightSidebarOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
            )}
          </Panel>

          {/* Resize Handle - Only when right sidebar is shown */}
          {(!isSmallScreen || isRightSidebarOpen) && (
            <PanelResizeHandle className="w-1 bg-border hover:bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" />
          )}

          {/* Right Sidebar Panel - Conditional rendering */}
          {(!isSmallScreen || isRightSidebarOpen) && (
            <Panel
              defaultSize={isSmallScreen ? 35 : 20}
              minSize={isSmallScreen ? 30 : 17.5}
              maxSize={isSmallScreen ? 50 : 30}
              className={`bg-background border-l border-border ${
                isSmallScreen ? 'absolute right-0 top-0 bottom-0 z-10 shadow-xl' : ''
              }`}
            >
              {right || <RightSidebar />}
            </Panel>
          )}
        </PanelGroup>

        {/* Overlay for small screens when right sidebar is open */}
        {isSmallScreen && isRightSidebarOpen && (
          <div 
            className="absolute inset-0 bg-black/20 z-5"
            onClick={() => setIsRightSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Footer - Status Bar */}
      <div className="bg-background border-t border-border">
        {footer || <StatusBar />}
      </div>
    </div>
  )
}
