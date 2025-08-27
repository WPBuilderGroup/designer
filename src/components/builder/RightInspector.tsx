'use client'

import { useState, useEffect, useRef } from 'react'
import type { GjsEditor, GjsReadyDetail } from '@/types/gjs'
import { logger } from '@/lib/logger'

/** Safely resolve the StyleManager element after the editor has loaded */
function resolveStyleEl(ed?: GjsEditor): HTMLElement | null {
  if (!ed) return null
  // Some setups expose StyleManager as `Styles`
  const sm: any = (ed as any).StyleManager ?? (ed as any).Styles
  if (!sm) return null

  const isLoaded =
    typeof (ed as any).isLoaded === 'function'
      ? (ed as any).isLoaded()
      : !!(ed as any).getModel?.()
  if (!isLoaded) return null

  const view = typeof sm.getView === 'function' ? sm.getView() : sm.render?.()
  const el = view?.el ?? sm.render?.()?.el
  return el instanceof HTMLElement ? el : null
}

export default function RightInspector() {
  const [activeTab, setActiveTab] = useState<'styles' | 'properties'>('styles')
  const [editor, setEditor] = useState<GjsEditor | null>(null)

  const stylesContainerRef = useRef<HTMLDivElement>(null)
  const propertiesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleGjsReady = (event: CustomEvent<GjsReadyDetail>) => {
      const { editor: editorInstance } = event.detail
      setEditor(editorInstance)

      // Mount managers slightly after ready to ensure views exist
      setTimeout(() => {
        mountManagers(editorInstance)
      }, 100)
    }

    const handleComponentSelect = () => {
      // Refresh managers when component selection changes
      refreshManagers()
    }

    window.addEventListener('gjs-ready', handleGjsReady as EventListener)
    window.addEventListener('gjs-component-select', handleComponentSelect)

    return () => {
      window.removeEventListener('gjs-ready', handleGjsReady as EventListener)
      window.removeEventListener('gjs-component-select', handleComponentSelect)
    }
    // Don't depend on `editor` here; we refresh via handlers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const mountManagers = (editorInstance: GjsEditor) => {
    try {
      // Style Manager
      const stylesContainer = stylesContainerRef.current
      const smEl = resolveStyleEl(editorInstance)
      if (stylesContainer) {
        stylesContainer.innerHTML = ''
        if (smEl) {
          stylesContainer.appendChild(smEl)
          logger.info('[GrapesJS] Style Manager mounted')
        } else {
          logger.warn('[GrapesJS] StyleManager element not available')
        }
      }

      // Trait Manager (Properties)
      const propertiesContainer = propertiesContainerRef.current
      if (propertiesContainer) {
        const tmEl = editorInstance.TraitManager?.render()?.el
        propertiesContainer.innerHTML = ''
        if (tmEl instanceof HTMLElement) {
          propertiesContainer.appendChild(tmEl)
          logger.info('[GrapesJS] Trait Manager mounted')
        } else {
          logger.warn('[GrapesJS] TraitManager element not available')
        }
      }

      // Update managers on selection changes
      editorInstance.on('component:selected', () => {
        setTimeout(() => refreshManagers(), 50)
      })
      editorInstance.on('component:deselected', () => {
        setTimeout(() => refreshManagers(), 50)
      })
    } catch (error) {
      logger.error('Failed to mount managers', {
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  const refreshManagers = () => {
    if (!editor) return
    try {
      // Re-render style manager
      if ((editor as any).StyleManager) {
        ;(editor as any).StyleManager.render()
      }
      // Re-render trait manager
      if (editor.TraitManager) {
        editor.TraitManager.render()
      }
    } catch (error) {
      logger.warn('Failed to refresh managers', {
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  const handleTabClick = (tabId: 'styles' | 'properties') => {
    setActiveTab(tabId)
    // Refresh active manager after switching
    setTimeout(() => {
      if (!editor) return
      if (tabId === 'styles') {
        ;(editor as any).StyleManager?.render?.()
      } else {
        editor.TraitManager?.render?.()
      }
    }, 50)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        {[
          { id: 'styles', label: 'Styles' },
          { id: 'properties', label: 'Properties' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id as 'styles' | 'properties')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'styles' && (
          <div className="h-full">
            <div
              ref={stylesContainerRef}
              className="overflow-auto h-[calc(100vh-48px)] p-2"
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
