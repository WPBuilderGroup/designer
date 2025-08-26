'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from 'react'
import { ensureDom } from '../../lib/gjs/ensureDom'
import { applyStyleManager } from '../../lib/gjs/styles'
import { applyPanels, registerViewCommands } from '../../lib/gjs/panels'
import { registerBlocks } from '../../lib/gjs/blocks'
import { configureAssets } from '../../lib/gjs/assets'

// dynamic imports to avoid SSR
let grapesjs: any
let presetWebpage: any

// ---- helpers ---------------------------------------------------------------

// make sure we don’t try to JSON.parse a HTML error page
async function loadProject(url: string) {
  const res = await fetch(url, { headers: { accept: 'application/json' } })
  const ct = res.headers.get('content-type') || ''
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return ct.includes('application/json') ? res.json() : null
}

// resolve Layers view element (works with new/old APIs)
function getLayersEl(ed?: any): HTMLElement | null {
  if (!ed) return null
  const LM = ed.LayerManager ?? ed.Layers
  if (!LM) return null
  const view = typeof LM.getView === 'function' ? LM.getView() : LM.render?.()
  const v = (view && view.el) ? view.el : view
  return v instanceof HTMLElement ? v : null
}

// resolve Pages view element
function getPagesEl(ed?: any): HTMLElement | null {
  if (!ed) return null
  const PM = ed.Pages
  if (!PM) return null
  const view = typeof PM.getView === 'function' ? PM.getView() : PM.render?.()
  const v = (view && view.el) ? view.el : view
  return v instanceof HTMLElement ? v : null
}

// default template (fallback)
const defaultTemplate = {
  'gjs-html': `<section style="padding:80px;text-align:center">Drop blocks here</section>`,
  'gjs-css': `body{margin:0;font-family:Inter,system-ui,Arial,sans-serif}`,
  'gjs-components': [],
  'gjs-styles': [],
}

// ---- component -------------------------------------------------------------

export default function CanvasHost() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<any>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => setIsClient(true), [])

  useEffect(() => {
    if (!isClient || !ensureDom() || !canvasRef.current) return

    const init = async () => {
      try {
        const [{ default: gjs }, { default: preset }] = await Promise.all([
          import('grapesjs'),
          import('grapesjs-preset-webpage'),
        ])
        grapesjs = gjs
        presetWebpage = preset

        // read /builder?project=...&page=...
        const qs = new URLSearchParams(window.location.search)
        const project = qs.get('project') || 'default-project'
        const page = qs.get('page') || 'home'
        const url = `/api/builder?project=${project}&page=${page}`

        // 1) init editor ONLY (don’t appendTo any manager here)
        const editor = grapesjs.init({
              container: canvasRef.current!,
              height: '100%',
              plugins: [presetWebpage],
            })

            // expose globally & notify others
        ;(window as any).__gjs = editor
        // use ONE canonical event name:
        window.dispatchEvent(new CustomEvent('gjs-ready', { detail: { editor } }))

        // 2) load project (safe)
        try {
          const data = await loadProject(url)
          if (data && (data['gjs-html'] || data['gjs-components'])) {
            if (data['gjs-html']) editor.setComponents(data['gjs-html'])
            if (data['gjs-css']) editor.setStyle(data['gjs-css'])
            editor.loadProjectData(data)
            console.log('Loading existing project data')
          } else {
            editor.setComponents(defaultTemplate['gjs-html'])
            editor.setStyle(defaultTemplate['gjs-css'])
            console.log('Loaded fallback template')
          }
        } catch (e) {
          editor.setComponents(defaultTemplate['gjs-html'])
          editor.setStyle(defaultTemplate['gjs-css'])
          console.warn('Load failed → fallback template used', e)
        }

        // 3) override store (autosave API)
        editor.store = async () => {
          const payload = {
            'gjs-html': editor.getHtml(),
            'gjs-css': editor.getCss(),
            'gjs-components': editor.getComponents(),
            'gjs-styles': editor.getStyle(),
          }
          try {
            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', accept: 'application/json' },
              body: JSON.stringify(payload),
            })
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
            console.log('Project data saved')
          } catch (err) {
            console.error('Error saving project data:', err)
          }
        }

        // 4) custom configs which don’t mount managers
        applyStyleManager(editor)
        applyPanels(editor)
        registerViewCommands(editor)
        registerBlocks(editor)
        configureAssets(editor)

        // device manager
        const DM = editor.DeviceManager
        DM.getAll().reset()
        DM.add('Desktop', '1000px')
        DM.add('Tablet', '768px', '1024px')
        DM.add('Mobile', '375px', '667px')
        DM.select('Desktop')

        // keyboard shortcuts
        const onKey = (e: KeyboardEvent) => {
          const isMac = navigator.platform.toUpperCase().includes('MAC')
          const ctrl = isMac ? e.metaKey : e.ctrlKey
          if (!ctrl) return
          switch (e.key.toLowerCase()) {
            case 's':
              e.preventDefault(); editor.store(); break
            case 'z':
              e.preventDefault(); e.shiftKey ? editor.runCommand('core:redo') : editor.runCommand('core:undo'); break
            case 'p':
              e.preventDefault(); editor.runCommand('preview'); break
          }
        }
        document.addEventListener('keydown', onKey)
        editorRef.current = editor
        ;(editor as any).cleanup = () => document.removeEventListener('keydown', onKey)

        // 5) commands for opening Pages & Layers drawer
        editor.Commands.add('open-pages-layers', {
          run(ed: any) {
            const pagesEl = getPagesEl(ed)
            const layersEl = getLayersEl(ed)
            if (pagesEl && layersEl) {
              window.dispatchEvent(new CustomEvent('gjs-show-drawer', {
                detail: { panelType: 'pages-layers', pagesElement: pagesEl, layersElement: layersEl },
              }))
            } else {
              console.warn('[GrapesJS] Pages or Layers element not available')
            }
          },
        })

        // ensure at least 1 page exists for UX
        if (editor.Pages.getAll().length === 0) {
          editor.Pages.add({ id: 'home', name: 'Home' })
        }

        console.log('GrapesJS editor initialized successfully')
      } catch (err) {
        console.error('Failed to initialize GrapesJS:', err)
      }
    }

    init()

    return () => {
      const ed = editorRef.current
      if (!ed) return
      try {
        ed.cleanup?.()
        ed.destroy()
        editorRef.current = null
      } catch (e) {
        console.error('Error destroying GrapesJS editor:', e)
      }
    }
  }, [isClient])

  if (!isClient) {
    return (
        <div className="h-full w-full grid place-items-center text-muted-foreground">
          Loading editor…
        </div>
    )
  }

  // Only the canvas lives here. Managers are mounted by Left/Right sidebars.
  return <div ref={canvasRef} id="gjs-canvas" className="h-full w-full" />
}
