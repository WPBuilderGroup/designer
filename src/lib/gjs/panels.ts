/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Editor } from 'grapesjs'
import { GrapesJSEditor } from '@/types/grapesjs-editor'
/**
 * GrapesJS Panels and Commands configuration
 * Configures topbar buttons and their corresponding commands
 */

export interface PanelButton {
  id: string
  command?: string
  className?: string
  attributes?: Record<string, any>
  label?: string
}

export interface Panel {
  id: string
  buttons?: PanelButton[]
}

/**
 * Device configurations for responsive design
 */
export const deviceConfigs = {
  desktop: { name: 'Desktop', width: '1000px' },
  tablet: { name: 'Tablet', width: '768px', height: '1024px' },
  mobile: { name: 'Mobile', width: '375px', height: '667px' }
}

/**
 * Configure panels and commands for the GrapesJS editor
 * @param editor - The GrapesJS editor instance
 */
export function applyPanels(editor: GrapesJSEditor): void {
  if (!editor) {
    console.warn('Editor instance not provided to applyPanels')
    return
  }

  try {
    const panelManager = editor.Panels
    const commands = editor.Commands

    // Clear existing panels to start fresh
    panelManager.removePanel('commands')
    panelManager.removePanel('options')
    panelManager.removePanel('views')

    // Add device switching commands (updated for new device names)
    commands.add('set-device-desktop', {
      run: (editor: GrapesJSEditor) => {
        editor.setDevice('Desktop')
        // Dispatch event for UI sync
        window.dispatchEvent(new CustomEvent('gjs-device-change', {
          detail: { device: 'desktop' }
        }))
      }
    })

    commands.add('set-device-tablet', {
      run: (editor: GrapesJSEditor) => {
        editor.setDevice('Tablet')
        window.dispatchEvent(new CustomEvent('gjs-device-change', {
          detail: { device: 'tablet' }
        }))
      }
    })

    commands.add('set-device-mobile', {
      run: (editor: GrapesJSEditor) => {
        editor.setDevice('Mobile')
        window.dispatchEvent(new CustomEvent('gjs-device-change', {
          detail: { device: 'mobile' }
        }))
      }
    })

    // Enhanced preview command with event dispatch
    commands.add('preview', {
      run: (editor: GrapesJSEditor) => {
        editor.runCommand('sw-visibility')
        window.dispatchEvent(new CustomEvent('gjs-preview-toggle', {
          detail: { isPreview: !editor.Canvas.getBody().classList.contains('gjs-dashed') }
        }))
      }
    })

    // Fullscreen command
    commands.add('fullscreen', {
      run: (editor: GrapesJSEditor) => {
        const canvas = editor.Canvas.getElement() as HTMLElement & {
          webkitRequestFullscreen?: () => void
          msRequestFullscreen?: () => void
        }
        const doc = document as Document & {
          webkitExitFullscreen?: () => void
          msExitFullscreen?: () => void
        }
        if (!document.fullscreenElement) {
          if (canvas.requestFullscreen) canvas.requestFullscreen()
          else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen()
          else if (canvas.msRequestFullscreen) canvas.msRequestFullscreen()
        } else {
          if (doc.exitFullscreen) doc.exitFullscreen()
          else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen()
          else if (doc.msExitFullscreen) doc.msExitFullscreen()
        }
      }
    })

    // Clear canvas command
    commands.add('clear-canvas', {
      run: (editor: GrapesJSEditor) => {
        if (confirm('Are you sure you want to clear the canvas? This action cannot be undone.')) {
          editor.setComponents('')
          editor.setStyle('')
        }
      }
    })

    // Enhanced undo/redo commands with event dispatch
    commands.add('core:undo', {
      run: (editor: GrapesJSEditor) => {
        editor.UndoManager.undo()
        window.dispatchEvent(new CustomEvent('gjs-history-change'))
      }
    })

    commands.add('core:redo', {
      run: (editor: GrapesJSEditor) => {
        editor.UndoManager.redo()
        window.dispatchEvent(new CustomEvent('gjs-history-change'))
      }
    })

    // Configure topbar panel with custom buttons
    panelManager.addPanel({
      id: 'basic-actions',
      buttons: [
        {
          id: 'visibility',
          active: true,
          className: 'gjs-btn-prim',
          command: 'sw-visibility',
          attributes: { title: 'Show/Hide borders' }
        }
      ]
    })

    // Add devices panel
    panelManager.addPanel({
      id: 'devices-c',
      buttons: [
        {
          id: 'device-desktop',
          command: 'set-device-desktop',
          className: 'gjs-btn-prim active',
          attributes: { title: 'Desktop view' }
        },
        {
          id: 'device-tablet',
          command: 'set-device-tablet',
          className: 'gjs-btn-prim',
          attributes: { title: 'Tablet view' }
        },
        {
          id: 'device-mobile',
          command: 'set-device-mobile',
          className: 'gjs-btn-prim',
          attributes: { title: 'Mobile view' }
        }
      ]
    })

    // Add options panel
    panelManager.addPanel({
      id: 'options',
      buttons: [
        {
          id: 'preview',
          className: 'gjs-btn-prim',
          command: 'preview',
          attributes: { title: 'Preview mode' }
        },
        {
          id: 'fullscreen',
          className: 'gjs-btn-prim',
          command: 'fullscreen',
          attributes: { title: 'Fullscreen' }
        },
        {
          id: 'undo',
          className: 'gjs-btn-prim',
          command: 'core:undo',
          attributes: { title: 'Undo' }
        },
        {
          id: 'redo',
          className: 'gjs-btn-prim',
          command: 'core:redo',
          attributes: { title: 'Redo' }
        },
        {
          id: 'clear',
          className: 'gjs-btn-prim',
          command: 'clear-canvas',
          attributes: { title: 'Clear canvas' }
        }
      ]
    })

    // Setup device manager with predefined devices
    const deviceManager = editor.DeviceManager
    deviceManager.add('Desktop', '100%')
    deviceManager.add('Tablet', '768px', '1024px')
    deviceManager.add('Mobile', '375px', '667px')

    // Listen for history changes to update undo/redo states
    editor.on('component:add component:remove component:update', () => {
      window.dispatchEvent(new CustomEvent('gjs-history-change'))
    })

    console.log('Panels and commands configured successfully')
  } catch (error) {
    console.error('Failed to apply panels configuration:', error)
  }
}

// 'use client' optional for modules used on the client
function resolveViewEl(view: unknown): HTMLElement | null {
  if (!view) return null
  if (typeof view === 'object' && view !== null) {
    const maybeEl = (view as { el?: unknown }).el
    if (maybeEl instanceof HTMLElement) return maybeEl
    const getter = (view as { get?: (key: string) => unknown }).get
    if (typeof getter === 'function') {
      const v = getter('el')
      if (v instanceof HTMLElement) return v
    }
  }
  return view instanceof HTMLElement ? view : null
}

function mountInViewsContainer(editor: Editor, el: HTMLElement) {
  const pn = editor.Panels
  if (!pn.getPanel('views-container')) {
    pn.addPanel({ id: 'views-container', visible: true, content: '<div class="gjs-one-bg gjs-two-color" id="views-wrap" style="height:100%;overflow:auto"></div>' })
  }
  const panel = pn.getPanel('views-container')
  const wrap = (panel as any)?.get('contentEl')?.querySelector('#views-wrap') as HTMLElement | null
  if (wrap) {
    wrap.innerHTML = ''
    wrap.appendChild(el)
  }
}

export function registerViewCommands(editor: Editor) {
  // LAYERS
  editor.Commands.add('open-layers', {
    run(ed: Editor) {
      const view = (ed as any).Layers?.render?.()
      const el = resolveViewEl(view)
      if (el) mountInViewsContainer(ed, el)
    },
  })

  // BLOCKS
  editor.Commands.add('open-blocks', {
    run(ed: Editor) {
      const view = (ed as any).Blocks?.render?.()
      const el = resolveViewEl(view)
      if (el) mountInViewsContainer(ed, el)
    },
  })

  // ASSETS
  editor.Commands.add('open-assets', {
    run(ed: Editor) {
      const view = (ed as any).Assets?.render?.()
      const el = resolveViewEl(view)
      if (el) mountInViewsContainer(ed, el)
    },
  })

  // STYLES
  editor.Commands.add('open-styles', {
    run(ed: Editor) {
      const view = (ed as any).Styles?.render?.()
      const el = resolveViewEl(view)
      if (el) mountInViewsContainer(ed, el)
    },
  })

  // Tiny buttons panel to trigger views
  const pn = editor.Panels
  if (!pn.getPanel('views')) {
    pn.addPanel({ id: 'views', buttons: [
      { id: 'btn-layers', command: 'open-layers', className: 'gjs-pn-btn', label: 'Layers' },
      { id: 'btn-blocks', command: 'open-blocks', className: 'gjs-pn-btn', label: 'Blocks' },
      { id: 'btn-assets', command: 'open-assets', className: 'gjs-pn-btn', label: 'Assets' },
      { id: 'btn-styles', command: 'open-styles', className: 'gjs-pn-btn', label: 'Styles' },
    ]})
  }
}
