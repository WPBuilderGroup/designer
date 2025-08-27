export interface GjsView {
  el: HTMLElement
}

export interface GjsStyleManager {
  render(): GjsView
  getView?(): GjsView
}

export interface GjsTraitManager {
  render(): GjsView
}

export interface GjsUndoManager {
  hasUndo(): boolean
  hasRedo(): boolean
}

export interface GjsEditor {
  StyleManager: GjsStyleManager
  TraitManager: GjsTraitManager
  UndoManager: GjsUndoManager
  runCommand(command: string): void
  on(event: string, callback: (...args: unknown[]) => void): void
  isLoaded?(): boolean
  getModel?(): unknown
  Styles?: GjsStyleManager
}

export interface GjsReadyDetail {
  editor: GjsEditor
}
