import type { Editor } from 'grapesjs'
import { logger } from '@/lib/logger'

/**
 * GrapesJS Panels and Commands configuration
 * Configures topbar buttons and their corresponding commands
 */

export interface PanelButton {
  id: string
  command?: string
  className?: string
  attributes?: Record<string, string>
  label?: string
  active?: boolean
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
 */
export function applyPanels(editor: Editor): void {
  if (!editor) {
    console.warn('Editor instance not provided to applyPanels')
    return
  }

  try {
    const panelManager = editor.Panels
    const commands = editor.Commands

    // Clear default panels
    panelManager.removePanel('commands')
    panelManager.removePanel('options')
    panelManager.removePanel('views')

    // Device switching commands
    commands.add('set-device-desktop', {
      run: (ed: Editor) => {
        ed.setDevice('Desktop')
        window.dispatchEvent(new CustomEvent('gjs-device-change', { detail: { device: 'desktop' } }))
      }
    })

    commands.add('set-device-tablet', {
      run: (ed: Editor) => {
        ed.setDevice('Tablet')
        window.dispatchEvent(new CustomEvent('gjs-device-change', { detail: { device: 'tablet' } }))
      }
    })

    commands.add('set-device-mobile', {
      run: (ed: Editor) => {
        ed.setDevice('Mobile')
        window.dispatchEvent(new CustomEvent('gjs-device-change', { detail: { device: 'mobile' } }))
      }
    })

    // Preview command
    commands.add('preview', {
      run: (ed: Editor) => {
        ed.runCommand('sw-visibility')
        const isPreview = !ed.Canvas.getBody().classList.contains('gjs-dashed')
        window.dispatchEvent(new CustomEvent('gjs-preview-toggle', { detail: { isPreview } }))
      }
    })

    // Fullscreen
    commands.add('fullscreen', {
      run: (ed: Editor) => {
        const canvas = ed.Canvas.getElement() as HTMLElement & {
          webkitRequestFullscreen?: () => void
          msRequestFullscreen?: () => void
        }
        const doc = document as Document & {
          webkitExitFullscreen?: () => void
          msExitFullscreen?: () => void
        }
        if (!document.fullscreenElement) {
          canvas.requestFullscreen?.() ||
          canvas.webkitRequestFullscreen?.() ||
          canvas.msRequestFullscreen?.()
        } else {
          doc.exitFullscreen?.() ||
          doc.webkitExitFullscreen?.() ||
          doc.msExitFullscreen?.()
        }
      }
    })

    // Clear canvas
    commands.add('clear-canvas', {
      run: (ed: Editor) => {
        if (confirm('Are you sure you want to clear the canvas? This action cannot be undone.')) {
          ed.setComponents('')
          ed.setStyle('')
        }
      }
    })

    // Undo/Redo with event
    commands.add('core:undo', {
      run: (ed: Editor) => {
        ed.UndoManager.undo()
        window.dispatchEvent(new CustomEvent('gjs-history-change'))
      }
    })

    commands.add('core:redo', {
      run: (ed: Editor) => {
        ed.UndoManager.redo()
        window.dispatchEvent(new CustomEvent('gjs-history-change'))
      }
    })

    // Add topbar panels
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

    // Devices
    const deviceManager = editor.DeviceManager
    deviceManager.add('Desktop', '100%')
    deviceManager.add('Tablet', '768px', '1024px')
    deviceManager.add('Mobile', '375px', '667px')

    // Listen for history-related events
    editor.on('component:add component:remove component:update', () => {
      window.dispatchEvent(new CustomEvent('gjs-history-change'))
    })

    logger.info('Panels and commands configured successfully')
  } catch (error) {
    console.error('Failed to apply panels configuration:', error)
  }
}

/**
 * Helpers for resolving view elements
 */
function resolveViewEl(view: unknown): HTMLElement | null {
  if (!view) return null

  // Direct el property
  if ((view as { el?: HTMLElement }).el) {
    return (view as { el?: HTMLElement }).el ?? null
  }

  // Using get('el') fallback
  const getter = (view as { get?: (key: string) => unknown }).get
  if (typeof getter === 'function') {
    const el = getter('el')
    if (el instanceof HTMLElement) return el
  }

  return view instanceof HTMLElement ? view : null
}

function mountInViewsContainer(editor: Editor, el: HTMLElement) {
  const pn = editor.Panels
  if (!pn.getPanel('views-container')) {
    pn.addPanel({
      id: 'views-container',
      visible: true,
      content: '<div class="gjs-one-bg gjs-two-color" id="views-wrap" style="height:100%;overflow:auto"></div>'
    })
  }

  const panel = pn.getPanel('views-container')
  const contentEl = panel?.get?.('contentEl') as HTMLElement | null
  const wrap = contentEl?.querySelector<HTMLElement>('#views-wrap') || null

  if (wrap) {
    wrap.innerHTML = ''
    wrap.appendChild(el)
  }
}

/**
 * Register commands to open GrapesJS views (layers, blocks, assets, styles)
 */
export function registerViewCommands(editor: Editor) {
  const pn = editor.Panels

  // Define view commands
  editor.Commands.add('open-layers', {
    run(ed: Editor) {
      const view = ed.Layers?.render?.()
      const el = resolveViewEl(view)
      if (el) mountInViewsContainer(ed, el)
    },
  })

  editor.Commands.add('open-blocks', {
    run(ed: Editor) {
      const view = ed.Blocks?.render?.()
      const el = resolveViewEl(view)
      if (el) mountInViewsContainer(ed, el)
    },
  })

  editor.Commands.add('open-assets', {
    run(ed: Editor) {
      const view = ed.Assets?.render?.()
      const el = resolveViewEl(view)
      if (el) mountInViewsContainer(ed, el)
    },
  })

  editor.Commands.add('open-styles', {
    run(ed: Editor) {
      const view = ed.Styles?.render?.()
      const el = resolveViewEl(view)
      if (el) mountInViewsContainer(ed, el)
    },
  })

  // Add buttons to trigger views
  if (!pn.getPanel('views')) {
    pn.addPanel({
      id: 'views',
      buttons: [
        { id: 'btn-layers', command: 'open-layers', className: 'gjs-pn-btn', label: 'Layers' },
        { id: 'btn-blocks', command: 'open-blocks', className: 'gjs-pn-btn', label: 'Blocks' },
        { id: 'btn-assets', command: 'open-assets', className: 'gjs-pn-btn', label: 'Assets' },
        { id: 'btn-styles', command: 'open-styles', className: 'gjs-pn-btn', label: 'Styles' }
      ]
    })
  }
}
