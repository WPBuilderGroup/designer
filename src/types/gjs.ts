export interface ManagerView {
  el?: HTMLElement
}

export interface GjsView {
  el: HTMLElement
}

export interface StyleManager {
  render(): ManagerView
  getView?(): ManagerView
}

export interface GjsStyleManager {
  render(): GjsView
  getView?(): GjsView
}

export interface TraitManager {
  render(): ManagerView
}

export interface GjsTraitManager {
  render(): GjsView
}

export interface UndoManager {
  hasUndo(): boolean
  hasRedo(): boolean
}

export interface GjsUndoManager {
  hasUndo(): boolean
  hasRedo(): boolean
}

export interface GjsEditor {
  StyleManager: StyleManager | GjsStyleManager
  TraitManager: TraitManager | GjsTraitManager
  UndoManager: UndoManager | GjsUndoManager
  runCommand(command: string, value?: unknown): void
  on(event: string, callback: (...args: unknown[]) => void): void
  isLoaded?(): boolean
  getModel?(): unknown
  Styles?: GjsStyleManager
  Canvas?: {
    getDocument(): Document | null
    getBody?: () => HTMLElement
    getElement?: () => HTMLElement
  }
}

export interface GjsReadyDetail {
  editor: GjsEditor
}

export interface GjsPanelChangeDetail {
  panelId?: string
  command?: string
}

export interface GjsShowDrawerDetail {
  panelType: string
  pagesElement?: HTMLElement
  layersElement?: HTMLElement
  panelElement?: HTMLElement
}

export interface GjsDeviceChangeDetail {
  device: 'desktop' | 'tablet' | 'mobile'
}

export interface GjsPreviewToggleDetail {
  isPreview: boolean
}
