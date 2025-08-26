'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react'
import { logger } from '@/lib/logger'

// Helper to safely get StyleManager element after editor loaded
function resolveStyleEl(ed?: any): HTMLElement | null {
  if (!ed) return null;
  const sm: any = ed.StyleManager ?? ed.Styles;
  if (!sm) return null;
  const isLoaded = typeof ed.isLoaded === 'function' ? ed.isLoaded() : !!ed.getModel?.();
  if (!isLoaded) return null;
  const view = typeof sm.getView === 'function' ? sm.getView() : undefined;
  const el = view?.el ?? (typeof sm.render === 'function' ? sm.render().el : undefined);
  return el instanceof HTMLElement ? el : null;
}

export default function RightInspector() {
  const [activeTab, setActiveTab] = useState<'styles' | 'properties'>('styles')
  const [editor, setEditor] = useState<any>(null)
  const stylesContainerRef = useRef<HTMLDivElement>(null)
  const propertiesContainerRef = useRef<HTMLDivElement>(null)

  const tabs = [
    { id: 'styles', label: 'Styles' },
    { id: 'properties', label: 'Properties' }
  ]

  useEffect(() => {
    // Listen for GrapesJS ready event
    const handleGjsReady = (event: CustomEvent) => {
      const editorInstance = event.detail
      setEditor(editorInstance)

      // Mount the style manager and trait manager after editor is ready
      setTimeout(() => {
        mountManagers(editorInstance)
      }, 100)
    }

    // Listen for component selection changes
    const handleComponentSelect = () => {
      // Refresh the managers when component selection changes
      if (editor) {
        refreshManagers()
      }
    }

    window.addEventListener('gjs-ready', handleGjsReady as EventListener)
    window.addEventListener('gjs-component-select', handleComponentSelect)

    return () => {
      window.removeEventListener('gjs-ready', handleGjsReady as EventListener)
      window.removeEventListener('gjs-component-select', handleComponentSelect)
    }
  }, [editor])

  const mountManagers = (editorInstance: any) => {
    try {
      // Mount Style Manager
      const stylesContainer = stylesContainerRef.current;
      const smEl = resolveStyleEl(editorInstance);
      if (stylesContainer) {
        stylesContainer.innerHTML = '';
        if (smEl) {
          stylesContainer.appendChild(smEl);
          logger.debug('Style Manager mounted');
        } else {
          console.warn('[GrapesJS] StyleManager element not available');
        }
      }

      // Mount Trait Manager (Properties)
      const propertiesContainer = propertiesContainerRef.current;
      if (propertiesContainer) {
        const tm: any = editorInstance.TraitManager;
        const tmView = tm?.render();
        const tmEl = (tmView as any)?.el;
        propertiesContainer.innerHTML = '';
        if (tmEl instanceof HTMLElement) {
          propertiesContainer.appendChild(tmEl);
          logger.debug('Trait Manager mounted');
        } else {
          console.warn('[GrapesJS] TraitManager element not available');
        }
      }

      // Listen for component selection to update managers
      editorInstance.on('component:selected', () => {
        setTimeout(() => refreshManagers(), 50)
      })

      editorInstance.on('component:deselected', () => {
        setTimeout(() => refreshManagers(), 50)
      })

    } catch (error) {
      console.error('Failed to mount managers:', error)
    }
  }

  const refreshManagers = () => {
    if (!editor) return

    try {
      // Refresh Style Manager
      const styleManager = editor.StyleManager
      if (styleManager && stylesContainerRef.current) {
        styleManager.render()
      }

      // Refresh Trait Manager
      const traitManager = editor.TraitManager
      if (traitManager && propertiesContainerRef.current) {
        traitManager.render()
      }
    } catch (error) {
      console.warn('Failed to refresh managers:', error)
    }
  }

  const handleTabClick = (tabId: 'styles' | 'properties') => {
    setActiveTab(tabId)

    // Refresh the active manager when switching tabs
    setTimeout(() => {
      if (tabId === 'styles' && editor) {
        editor.StyleManager.render()
      } else if (tabId === 'properties' && editor) {
        editor.TraitManager.render()
      }
    }, 50)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 bg-white">
        {tabs.map((tab) => (
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

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'styles' && (
          <div className="h-full">
            <div
              ref={stylesContainerRef}
              className="overflow-auto h-[calc(100vh-48px)] p-2"
            >
              {/* Style Manager will be mounted here */}
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
              {/* Trait Manager will be mounted here */}
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
