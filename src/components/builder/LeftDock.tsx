'use client'

import { useState, useEffect, type ReactNode } from 'react'
import type { GjsEditor, GjsReadyDetail } from '@/types/gjs'
import GlobalStylesPanel from './GlobalStylesPanel'

interface DockItem {
  id: string
  command?: string
  label: string
  icon: ReactNode
  active: boolean
}

export default function LeftDock() {
  const [activePanel, setActivePanel] = useState<string>('pages-layers')
  const [editor, setEditor] = useState<GjsEditor | null>(null)
  const [showDrawer, setShowDrawer] = useState<boolean>(false)
  const [showGlobalStyles, setShowGlobalStyles] = useState<boolean>(false)
  const [drawerContent, setDrawerContent] = useState<{
    type: string
    pagesElement?: HTMLElement
    layersElement?: HTMLElement
    panelElement?: HTMLElement
  } | null>(null)

  const dockItems: DockItem[] = [
    {
      id: 'pages-layers',
      command: 'open-pages-layers',
      label: 'Pages & Layers',
      active: activePanel === 'pages-layers',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'blocks',
      command: 'open-blocks',
      label: 'Blocks',
      active: activePanel === 'blocks',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      id: 'assets',
      command: 'open-assets',
      label: 'Assets',
      active: activePanel === 'assets',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'global-styles',
      label: 'Global Styles',
      active: activePanel === 'global-styles',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
      ),
    }
  ]

  useEffect(() => {
    const handleGjsReady = (event: CustomEvent<GjsReadyDetail>) => {
      setEditor(event.detail.editor)
    }

    const handlePanelChange = (event: CustomEvent<{ panelId?: string }>) => {
      if (event.detail.panelId) {
        setActivePanel(event.detail.panelId)
      }
    }

    const handleShowDrawer = (event: CustomEvent<{
      panelType: string
      pagesElement?: HTMLElement
      layersElement?: HTMLElement
      panelElement?: HTMLElement
    }>) => {
      const { panelType, pagesElement, layersElement, panelElement } = event.detail
      setDrawerContent({ type: panelType, pagesElement, layersElement, panelElement })
      setShowDrawer(true)
    }

    window.addEventListener('gjs-ready', handleGjsReady as EventListener)
    window.addEventListener('gjs-panel-change', handlePanelChange as EventListener)
    window.addEventListener('gjs-show-drawer', handleShowDrawer as EventListener)

    return () => {
      window.removeEventListener('gjs-ready', handleGjsReady as EventListener)
      window.removeEventListener('gjs-panel-change', handlePanelChange as EventListener)
      window.removeEventListener('gjs-show-drawer', handleShowDrawer as EventListener)
    }
  }, [])

  const handleItemClick = (item: DockItem) => {
    if (!editor) return

    setActivePanel(item.id)

    if (item.id === 'pages-layers') {
      setShowDrawer(!showDrawer)
      setShowGlobalStyles(false)
      if (!showDrawer && item.command) editor.runCommand(item.command)
    } else if (item.id === 'global-styles') {
      setShowGlobalStyles(!showGlobalStyles)
      setShowDrawer(false)
    } else {
      setShowDrawer(false)
      setShowGlobalStyles(false)
      if (item.command) editor.runCommand(item.command)
    }

    window.dispatchEvent(new CustomEvent('gjs-panel-change', {
      detail: { panelId: item.id, command: item.command },
    }))
  }

  const handleCloseDrawer = () => {
    setShowDrawer(false)
    setDrawerContent(null)
  }

  const handleCloseGlobalStyles = () => {
    setShowGlobalStyles(false)
    setActivePanel('')
  }

  const renderDrawerContent = () => {
    if (!drawerContent) return null

    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <h3 className="font-medium text-gray-900">
            {drawerContent.type === 'pages-layers' ? 'Pages & Layers' : 'Layers'}
          </h3>
          <button
            onClick={handleCloseDrawer}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          {drawerContent.type === 'pages-layers' && (
            <div className="h-full flex flex-col">
              <div className="border-b border-gray-200">
                <div className="p-3 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700">Pages</h4>
                </div>
                <div
                  className="p-2 max-h-32 overflow-y-auto"
                  ref={(el) => {
                    if (el && drawerContent.pagesElement) {
                      el.innerHTML = ''
                      el.appendChild(drawerContent.pagesElement)
                    }
                  }}
                />
              </div>

              <div className="flex-1 flex flex-col">
                <div className="p-3 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700">Layers</h4>
                </div>
                <div
                  className="flex-1 overflow-y-auto p-2"
                  ref={(el) => {
                    if (el && drawerContent.layersElement) {
                      el.innerHTML = ''
                      el.appendChild(drawerContent.layersElement)
                    }
                  }}
                />
              </div>
            </div>
          )}

          {drawerContent.type === 'layers' && drawerContent.panelElement && (
            <div
              className="h-full overflow-y-auto p-2"
              ref={(el) => {
                if (el && drawerContent.panelElement) {
                  el.innerHTML = ''
                  el.appendChild(drawerContent.panelElement)
                }
              }}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="h-full flex flex-col py-2">
        {dockItems.map((item) => {
          const isCmdRouted = item.id !== 'global-styles' && !!item.command
          return (
            <button
              key={item.id}
              data-cmd={isCmdRouted ? item.command : undefined}
              onClick={() => handleItemClick(item)}
              className={`w-12 h-12 mx-2 mb-1 rounded-lg flex items-center justify-center transition-colors group relative ${
                item.active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
              title={item.label}
            >
              {item.icon}
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            </button>
          )
        })}
      </div>

      {showDrawer && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <div className="absolute left-14 top-0 bottom-0 pointer-events-auto">
            <div className="w-80 h-full bg-white border-r border-gray-200 shadow-lg">
              {renderDrawerContent()}
            </div>
          </div>
        </div>
      )}

      <GlobalStylesPanel
        isOpen={showGlobalStyles}
        onClose={handleCloseGlobalStyles}
        editor={editor}
      />
    </>
  )
}
