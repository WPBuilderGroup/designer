'use client'

import { useState, useEffect, useRef } from 'react'
import type {
  GjsEditor,
  GjsReadyDetail,
  ManagerView,
} from '@/types/gjs'
import { logger } from '@/lib/logger'

// Helper to safely get StyleManager element after editor loaded
function resolveStyleEl(ed?: GjsEditor): HTMLElement | null {
  if (!ed) return null
  const sm: any = (ed as any).StyleManager || (ed as any).Styles
  const isLoaded = typeof (ed as any).isLoaded === 'function' ? (ed as any).isLoaded() : !!(ed as any).getModel?.()
  if (!isLoaded || !sm) return null
  const view = typeof sm.getView === 'function' ? sm.getView() : undefined
  const rendered = typeof sm.render === 'function' ? sm.render() : undefined
  const el = (view && (view as any).el) || (rendered && (rendered as any).el) || rendered
  return el instanceof HTMLElement ? el : null
}

export default function RightInspector() {
  const [activeTab, setActiveTab] = useState<'styles' | 'properties'>('styles')
  const [editor, setEditor] = useState<GjsEditor | null>(null)
  const [selectionName, setSelectionName] = useState<string>('None')
  const stylesContainerRef = useRef<HTMLDivElement>(null)
  const propertiesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleGjsReady = (event: CustomEvent<GjsReadyDetail>) => {
      const { editor: editorInstance } = event.detail
      setEditor(editorInstance)

      setTimeout(() => {
        mountManagers(editorInstance)
      }, 100)
    }

    const handleComponentSelect = () => {
      refreshManagers()
      try {
        const sel: any = (editor as any)?.getSelected?.()
        const name = sel?.get?.('name') || sel?.getName?.() || sel?.get?.('tagName') || 'Element'
        setSelectionName(name)
      } catch {
        setSelectionName('Element')
      }
    }

    window.addEventListener('gjs-ready', handleGjsReady as EventListener)
    window.addEventListener('gjs-component-select', handleComponentSelect)

    return () => {
      window.removeEventListener('gjs-ready', handleGjsReady as EventListener)
      window.removeEventListener('gjs-component-select', handleComponentSelect)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const mountManagers = (editorInstance: GjsEditor) => {
    try {
      // Mount Style Manager
      const stylesContainer = stylesContainerRef.current
      const smEl = resolveStyleEl(editorInstance)
      if (stylesContainer) {
        stylesContainer.innerHTML = ''
        if (smEl) {
          stylesContainer.appendChild(smEl)
          logger.info('Style Manager mounted')
        } else {
          logger.warn('StyleManager element not available')
        }
      }

      // Mount Trait Manager (Properties)
      const propertiesContainer = propertiesContainerRef.current
      const tm: any = (editorInstance as any).TraitManager
      const tmRendered = tm?.render?.()
      const tmEl = (tmRendered && tmRendered.el) || tmRendered

      if (propertiesContainer) {
        propertiesContainer.innerHTML = ''
        if (tmEl instanceof HTMLElement) {
          propertiesContainer.appendChild(tmEl)
          logger.info('Trait Manager mounted')
        } else {
          logger.warn('TraitManager element not available')
        }
      }

      // Refresh managers on selection change
      editorInstance.on('component:selected', () => setTimeout(refreshManagers, 50))
      editorInstance.on('component:deselected', () => setTimeout(refreshManagers, 50))
    } catch (error) {
      logger.error('Failed to mount managers', {
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  const refreshManagers = () => {
    if (!editor) return
    try {
      // Re-bind Style Manager element to ensure visibility after internal re-renders
      const stylesContainer = stylesContainerRef.current
      const smEl = resolveStyleEl(editor)
      if (stylesContainer && smEl) {
        stylesContainer.innerHTML = ''
        stylesContainer.appendChild(smEl)
      }

      // Re-bind Trait Manager element as well
      const propertiesContainer = propertiesContainerRef.current
      const tm: any = (editor as any).TraitManager
      const tmRendered = tm?.render?.()
      const tmEl = (tmRendered && tmRendered.el) || tmRendered
      if (propertiesContainer && tmEl instanceof HTMLElement) {
        propertiesContainer.innerHTML = ''
        propertiesContainer.appendChild(tmEl)
      }
    } catch (error) {
      logger.warn('Failed to refresh managers', {
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  const handleTabClick = (tab: 'styles' | 'properties') => {
    setActiveTab(tab)
    setTimeout(() => refreshManagers(), 50)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        {['styles', 'properties'].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab as 'styles' | 'properties')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab === 'styles' ? 'Styles' : 'Properties'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'styles' && (
          <div className="h-full">
            {/* Selection header like reference UI */}
            <div className="flex items-center justify-between px-3 py-2 text-xs border-b border-gray-200">
              <div className="text-gray-600">
                Selection
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded border border-gray-300 bg-white text-gray-700">
                  {selectionName}
                </span>
              </div>
              <div className="text-gray-400">State ▾</div>
            </div>
            <div
              ref={stylesContainerRef}
              className="overflow-auto h-[calc(100vh-48px)] p-2 inspector-sm"
            >
              {!editor && (
                <div className="text-sm text-gray-500 p-4 text-center">
                  Loading Style Manager...
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="h-full">
            <div
              ref={propertiesContainerRef}
              className="overflow-auto h-[calc(100vh-48px)] p-2"
            >
              {!editor && (
                <div className="text-sm text-gray-500 p-4 text-center">
                  Loading Properties...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
