'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRef, useEffect, useState } from 'react'
import { ensureDom } from '../../lib/gjs/ensureDom'
import { applyStyleManager } from '../../lib/gjs/styles'
import { applyPanels, registerViewCommands } from '../../lib/gjs/panels'
import { registerBlocks } from '../../lib/gjs/blocks'
import { configureAssets } from '../../lib/gjs/assets'

// Dynamic imports to avoid SSR issues
let grapesjs: any
let presetWebpage: any

// Default template for new projects
const defaultTemplate = {
  'gjs-html': `
    <section style="padding: 100px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; min-height: 500px; display: flex; align-items: center; justify-content: center;">
      <div style="max-width: 800px;">
        <h1 style="font-size: 48px; margin-bottom: 20px; font-weight: bold;">Welcome to Your New Website</h1>
        <p style="font-size: 20px; margin-bottom: 30px; opacity: 0.9; line-height: 1.6;">Start building something amazing. Drag and drop blocks from the left panel to customize your site.</p>
        <a href="#" style="display: inline-block; background: white; color: #667eea; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-right: 15px;">Get Started</a>
        <a href="#" style="display: inline-block; border: 2px solid white; color: white; padding: 13px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">Learn More</a>
      </div>
    </section>
    
    <section style="padding: 80px 20px; text-align: center; background: white;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="font-size: 36px; margin-bottom: 20px; color: #333;">Features</h2>
        <p style="font-size: 18px; color: #666; margin-bottom: 50px; max-width: 600px; margin-left: auto; margin-right: auto;">Everything you need to build a professional website.</p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; margin-top: 40px;">
          <div style="text-align: center; padding: 30px 20px;">
            <div style="width: 80px; height: 80px; background: #007bff; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px;">⚡</div>
            <h3 style="font-size: 24px; margin-bottom: 15px; color: #333;">Fast</h3>
            <p style="color: #666; line-height: 1.6;">Lightning-fast performance with optimized code and assets.</p>
          </div>
          
          <div style="text-align: center; padding: 30px 20px;">
            <div style="width: 80px; height: 80px; background: #28a745; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px;">🔒</div>
            <h3 style="font-size: 24px; margin-bottom: 15px, color: #333;">Secure</h3>
            <p style="color: #666; line-height: 1.6;">Built with security best practices and regular updates.</p>
          </div>
          
          <div style="text-align: center; padding: 30px 20px;">
            <div style="width: 80px; height: 80px; background: #17a2b8; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px;">📱</div>
            <h3 style="font-size: 24px; margin-bottom: 15px; color: #333;">Responsive</h3>
            <p style="color: #666; line-height: 1.6;">Perfect on all devices, from mobile to desktop.</p>
          </div>
        </div>
      </div>
    </section>
  `,
  'gjs-css': `
    * { 
      box-sizing: border-box; 
    }
    body { 
      margin: 0; 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
      line-height: 1.6; 
    }
    h1, h2, h3, h4, h5, h6 { 
      margin: 0; 
      font-weight: 600; 
    }
    p { 
      margin: 0; 
    }
    a { 
      transition: all 0.3s ease; 
    }
    a:hover { 
      transform: translateY(-2px); 
      box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
    }
  `,
  'gjs-components': [],
  'gjs-styles': []
}

// Helper to safely get Layers element after editor loaded
function resolveLayerEl(ed?: any): HTMLElement | null {
  if (!ed) return null;
  const lm: any = ed.Layers ?? ed.LayerManager;
  if (!lm) return null;
  // Always try to get a view and ensure it's rendered
  let view: any = typeof lm.getView === 'function' ? lm.getView() : undefined;
  if (!view && typeof lm.render === 'function') view = lm.render();
  if (view && !(view as any).el && typeof (view as any).render === 'function') view = (view as any).render();
  const el = (view as any)?.el ?? view;
  return el instanceof HTMLElement ? el : null;
}

// Helper to safely get Pages element after editor loaded
function resolvePageEl(ed?: any): HTMLElement | null {
  if (!ed) return null;
  const pm: any = ed.Pages;
  if (!pm) return null;
  let view: any = typeof pm.getView === 'function' ? pm.getView() : undefined;
  if (!view && typeof pm.render === 'function') view = pm.render();
  if (view && !(view as any).el && typeof (view as any).render === 'function') view = (view as any).render();
  const el = (view as any)?.el ?? view;
  return el instanceof HTMLElement ? el : null;
}

// Safe remote load (prevents "<DOCTYPE" is not valid JSON)
async function loadProject(url: string) {
  const res = await fetch(url, { headers: { accept: 'application/json' } })
  const ct = res.headers.get('content-type') || ''
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return ct.includes('application/json') ? res.json() : null
}

export default function CanvasHost() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<any>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Mark as client-side after hydration
    setIsClient(true)
  }, [])

  // Patch listener: route [data-cmd] clicks to editor.runCommand(...)
  useEffect(() => {
    if (!isClient) return
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      const el = target.closest('[data-cmd]') as HTMLElement | null
      if (!el) return
      const cmd = el.getAttribute('data-cmd') || ''
      const ed = editorRef.current
      if (!cmd || !ed) return
      e.preventDefault()
      try {
        ed.runCommand(cmd)
        const panelId = cmd === 'open-blocks' ? 'blocks'
          : cmd === 'open-assets' ? 'assets'
          : cmd === 'open-layers' ? 'layers'
          : cmd === 'open-pages-layers' ? 'pages-layers'
          : ''
        if (panelId) {
          window.dispatchEvent(new CustomEvent('gjs-panel-change', {
            detail: { panelId, command: cmd }
          }))
        }
      } catch (err) {
        console.warn(`[GrapesJS] Failed to run command "${cmd}":`, err)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [isClient])

  useEffect(() => {
    if (!isClient || !ensureDom() || !canvasRef.current) return

    // Dynamic import of GrapesJS and its dependencies
    const initGrapesJS = async () => {
      try {
        // Only import on client side
        if (typeof window === 'undefined') return

        // Import GrapesJS and its CSS
        const [grapesJSModule, presetWebpageModule] = await Promise.all([
          import('grapesjs'),
          import('grapesjs-preset-webpage')
        ])

        grapesjs = grapesJSModule.default
        presetWebpage = presetWebpageModule.default

        // Read query parameters from URL
        const urlParams = new URLSearchParams(window.location.search)
        const project = urlParams.get('project') || 'default-project'
        const page = urlParams.get('page') || 'home'

        // Initialize GrapesJS editor
        const urlLoad = `/api/builder?project=${project}&page=${page}`;
        const urlStore = `/api/builder?project=${project}&page=${page}`;
        const editor = grapesjs.init({
          container: canvasRef.current,
          height: '100%',
          plugins: [presetWebpage],
          layerManager: { appendTo: '#layers-panel' },
          blockManager: { appendTo: '#blocks-panel' },
          styleManager: { appendTo: '#styles-panel' },
        }); // <-- Add closing parenthesis and semicolon to complete grapesjs.init call

        // Custom load initial data (safe JSON parsing)
        try {
          const data = await loadProject(urlLoad)
          if (data) {
            handleLoadedData(editor, data)
          } else {
            console.warn('No JSON data returned, loading fallback template')
            loadFallbackTemplate(editor)
          }
        } catch (err) {
          console.warn('Failed to load builder data, using fallback:', err)
          loadFallbackTemplate(editor)
        }

        // Override store method for autosave
        editor.store = async () => {
          const payload = {
            'gjs-html': editor.getHtml(),
            'gjs-css': editor.getCss(),
            'gjs-components': editor.getComponents(),
            'gjs-styles': editor.getStyle(),
            'gjs-assets': editor.getComponents(), // adjust if using AssetManager
          };
          try {
            const res = await fetch(urlStore, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', accept: 'application/json' },
              body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
            console.log('Project data saved')
          } catch (error) {
            console.error('Error saving project data:', error)
          }
        };

        // Store editor reference for cleanup
        editorRef.current = editor

        // Apply custom configurations in order
        applyStyleManager(editor)
        applyPanels(editor)
        registerViewCommands(editor)
        registerBlocks(editor)
        configureAssets(editor)

        // Setup device manager
        setupDeviceManager(editor)

        // Setup keyboard shortcuts
        setupKeyboardShortcuts(editor)

        // Setup auto-save listeners
        setupAutoSave(editor)

        // Add panel commands for LeftDock integration
        setupPanelCommands(editor)

        // Dispatch custom event when editor is ready
        window.dispatchEvent(new CustomEvent('gjs-ready', {
          detail: editor
        }))

        console.log('GrapesJS editor initialized successfully')

      } catch (error) {
        console.error('Failed to initialize GrapesJS:', error)
      }
    }

    initGrapesJS()

    // Cleanup function
    return () => {
      if (editorRef.current) {
        try {
          // Clean up keyboard shortcuts
          if (editorRef.current.keyboardCleanup) {
            editorRef.current.keyboardCleanup()
          }

          // Clean up auto-save
          if (editorRef.current.autoSaveCleanup) {
            editorRef.current.autoSaveCleanup()
          }

          // Destroy editor
          editorRef.current.destroy()
          editorRef.current = null
          console.log('GrapesJS editor destroyed')
        } catch (error) {
          console.error('Error destroying GrapesJS editor:', error)
        }
      }
    }
  }, [isClient])

  const handleLoadedData = (editor: any, data: any) => {
    // Check if we have valid project data
    if (data && (data['gjs-html'] || data['gjs-css'] || data['gjs-components'] || data['gjs-styles'])) {
      try {
        console.log('Loading existing project data')

        // Load the complete project data
        if (data['gjs-html']) {
          editor.setComponents(data['gjs-html'])
        }

        if (data['gjs-css']) {
          editor.setStyle(data['gjs-css'])
        }

        // Load full project data if available
        editor.loadProjectData(data)

        return data
      } catch (error) {
        console.error('Failed to load project data:', error)
        return loadFallbackTemplate(editor)
      }
    } else {
      console.log('No existing data found, loading fallback template')
      return loadFallbackTemplate(editor)
    }
  }

  const loadFallbackTemplate = (editor: any) => {
    try {
      // Set the default template
      editor.setComponents(defaultTemplate['gjs-html'])
      editor.setStyle(defaultTemplate['gjs-css'])

      // Clear undo manager for fresh start
      setTimeout(() => {
        editor.UndoManager.clear()
      }, 100)

      console.log('Fallback template loaded successfully')
      return defaultTemplate
    } catch (error) {
      console.error('Failed to load fallback template:', error)
      return {}
    }
  }

  const setupDeviceManager = (editor: any) => {
    try {
      const deviceManager = editor.DeviceManager

      // Clear existing devices
      deviceManager.getAll().reset()

      // Add responsive devices
      deviceManager.add('Desktop', '1000px')
      deviceManager.add('Tablet', '768px', '1024px')
      deviceManager.add('Mobile', '375px', '667px')

      // Set desktop as default
      deviceManager.select('Desktop')

      console.log('Device Manager configured with responsive breakpoints')
    } catch (error) {
      console.error('Failed to setup Device Manager:', error)
    }
  }

  const setupKeyboardShortcuts = (editor: any) => {
    if (typeof window === 'undefined') return

    try {
      const handleKeydown = (e: KeyboardEvent) => {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
        const ctrlKey = isMac ? e.metaKey : e.ctrlKey

        if (ctrlKey) {
          switch (e.key.toLowerCase()) {
            case 's':
              e.preventDefault()
              editor.store()
              console.log('Manual save triggered')
              break
            case 'z':
              e.preventDefault()
              if (e.shiftKey) {
                // Ctrl/Cmd + Shift + Z = Redo
                editor.runCommand('core:redo')
              } else {
                // Ctrl/Cmd + Z = Undo
                editor.runCommand('core:undo')
              }
              break
            case 'p':
              e.preventDefault()
              editor.runCommand('preview')
              break
            default:
              break
          }
        }
      }

      // Add keyboard event listener
      document.addEventListener('keydown', handleKeydown)

      // Store cleanup function
      editor.keyboardCleanup = () => {
        document.removeEventListener('keydown', handleKeydown)
      }

      console.log('Keyboard shortcuts configured')
    } catch (error) {
      console.error('Failed to setup keyboard shortcuts:', error)
    }
  }

  const setupAutoSave = (editor: any) => {
    if (typeof window === 'undefined') return

    try {
      let autoSaveTimeout: NodeJS.Timeout

      const debouncedSave = () => {
        clearTimeout(autoSaveTimeout)
        autoSaveTimeout = setTimeout(() => {
          editor.store()
          console.log('Auto-save triggered')
        }, 2000) // 2 second debounce
      }

      // Listen for content changes
      editor.on('asset:add', debouncedSave)
      editor.on('asset:remove', debouncedSave)
      editor.on('component:add', debouncedSave)
      editor.on('component:remove', debouncedSave)
      editor.on('component:update', debouncedSave)
      editor.on('style:target', debouncedSave)
      editor.on('selector:add', debouncedSave)

      // Store cleanup function
      editor.autoSaveCleanup = () => {
        clearTimeout(autoSaveTimeout)
      }

      console.log('Auto-save listeners configured')
    } catch (error) {
      console.error('Failed to setup auto-save:', error)
    }
  }

  const setupPanelCommands = (editor: any) => {
    const commands = editor.Commands

    // Setup default page if none exists
    const pages = editor.Pages
    if (pages.getAll().length === 0) {
      pages.add({ id: 'home', name: 'Home' })
      console.log('Default Home page created')
    }

    // Listen for page events for autosave
    editor.on('page:add', (page: any) => {
      console.log('Page added:', page.get('name'))
      // Trigger autosave when page is added
      editor.store()
    })

    editor.on('page:remove', (page: any) => {
      console.log('Page removed:', page.get('name'))
      editor.store()
    })

    editor.on('page:select', (page: any) => {
      console.log('Page selected:', page.get('name'))
      // Dispatch event for UI sync
      window.dispatchEvent(new CustomEvent('gjs-page-change', {
        detail: { pageId: page.get('id'), pageName: page.get('name') }
      }))
    })

    // Remove legacy view commands; these are provided by registerViewCommands
    // commands.add('open-blocks', ...) // removed
    // commands.add('open-assets', ...) // removed
    // commands.add('open-layers', ...) // removed
    // commands.add('open-styles', ...) // removed

    // Open Pages & Layers drawer command
    commands.add('open-pages-layers', {
      run: (editor: any) => {
        let pagesEl = resolvePageEl(editor);
        let layersEl = resolveLayerEl(editor);
        // Retry render once if missing
        if (!pagesEl && (editor as any).Pages?.render) {
          (editor as any).Pages.render();
          pagesEl = resolvePageEl(editor);
        }
        if (!layersEl && ((editor as any).Layers?.render || (editor as any).LayerManager?.render)) {
          const lm: any = (editor as any).Layers ?? (editor as any).LayerManager;
          lm.render?.();
          layersEl = resolveLayerEl(editor);
        }
        if (pagesEl && layersEl) {
          window.dispatchEvent(new CustomEvent('gjs-show-drawer', {
            detail: { panelType: 'pages-layers', pagesElement: pagesEl, layersElement: layersEl }
          }));
        } else {
          console.warn('[GrapesJS] Pages or Layers element not available');
        }
      }
    })

    // Auto-open layers panel on startup (uses registerViewCommands)
    setTimeout(() => {
      editor.runCommand('open-layers')
    }, 100)

    console.log('Panel commands configured successfully')
  }

  // Always render the same content during SSR and initial client render
  if (!isClient) {
    return (
      <div className="h-full w-full relative">
        <div
          className="h-full w-full bg-white flex items-center justify-center"
        >
          <div className="text-gray-500">Loading editor...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full relative">
      {/* Canvas container for GrapesJS */}
      <div
        ref={canvasRef}
        id="gjs-canvas"
        className="h-full w-full"
      />
      {/* GrapesJS auto-mount panels */}
      <div id="layers-panel" />
      <div id="blocks-panel" />
      <div id="styles-panel" />
    </div>
  )
}
