'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { listWorkspaces, getWorkspace } from '../lib/store'
import type { Workspace } from '../lib/types'
import Button from './ui/Button'
import Dropdown from './ui/Dropdown'

export interface AppShellProps {
  children: React.ReactNode
}

const CURRENT_WORKSPACE_KEY = 'currentWS'

const AppShell = ({ children }: AppShellProps) => {
  const router = useRouter()
  const workspaces: Workspace[] = listWorkspaces()
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null) // Initialize as null to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false)

  // Load current workspace from localStorage on mount
  useEffect(() => {
    setIsClient(true) // Mark that we're now on the client

    const savedWorkspaceId = localStorage.getItem(CURRENT_WORKSPACE_KEY)
    if (savedWorkspaceId) {
      const workspace = getWorkspace(savedWorkspaceId)
      if (workspace) {
        setCurrentWorkspace(workspace)
      } else {
        // If saved workspace doesn't exist, fallback to first available
        const firstWorkspace: Workspace | null = workspaces[0] ?? null
        setCurrentWorkspace(firstWorkspace)
        if (firstWorkspace) {
          localStorage.setItem(CURRENT_WORKSPACE_KEY, firstWorkspace.id)
        }
      }
    } else if (workspaces[0]) {
      // No saved workspace, use first available
      setCurrentWorkspace(workspaces[0])
      localStorage.setItem(CURRENT_WORKSPACE_KEY, workspaces[0].id)
    }
  }, [workspaces])

  // Handle workspace selection
  const handleWorkspaceSelect = (workspace: Workspace) => {
    setCurrentWorkspace(workspace)
    localStorage.setItem(CURRENT_WORKSPACE_KEY, workspace.id)
    router.push('/projects') // Navigate to projects page to show updated workspace content
  }

  const workspaceDropdownItems = [
    ...workspaces.map(workspace => ({
      label: workspace.name,
      onClick: () => handleWorkspaceSelect(workspace),
      icon: (
        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
          currentWorkspace?.id === workspace.id 
            ? 'border-blue-500 bg-blue-500' 
            : 'border-gray-300 bg-white'
        }`}>
          {currentWorkspace?.id === workspace.id && (
            <div className="w-2 h-2 rounded-full bg-white" />
          )}
        </div>
      ),
      selected: currentWorkspace?.id === workspace.id,
      type: 'item' as const
    })),
    // Separator
    {
      type: 'separator' as const,
      label: '',
      onClick: () => {}
    },
    {
      label: 'Manage Workspaces',
      onClick: () => {
        router.push('/workspaces')
      },
      icon: (
        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.50a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      type: 'item' as const
    }
  ]

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-60 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="h-14 flex items-center px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="font-semibold text-gray-900">Designer Studio</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {[
            {
              name: 'Projects',
              href: '/projects',
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              )
            },
            {
              name: 'Licenses',
              href: '/licenses',
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              )
            },
            {
              name: 'Playground',
              href: '/playground',
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )
            },
            {
              name: 'SDK Documentation',
              href: '/docs',
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              )
            }
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <span className="mr-3 text-gray-400">
                {item.icon}
              </span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          {/* Left: Workspace Selector */}
          <div className="flex items-center space-x-4">
            <Dropdown
              trigger={
                <Button variant="outline" size="sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="font-medium">{currentWorkspace?.name || 'Select Workspace'}</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </Button>
              }
              items={workspaceDropdownItems}
              align="left"
            />
          </div>

          {/* Right: Help and Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Help
            </Button>
          </div>
        </header>

        {/* Main scrollable content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppShell
