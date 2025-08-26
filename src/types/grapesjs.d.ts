declare module 'grapesjs' {
  export interface View {
    el: HTMLElement
  }

  export interface BlockManager {
    render(): View
  }

  export interface LayerManager {
    render(): View
  }

  export interface AssetManager {
    render(): View
  }

  export interface StyleManager {
    render(): View
  }

  export interface Pages {
    render(): View
  }

  export interface Editor {
    BlockManager: BlockManager
    LayerManager: LayerManager
    AssetManager: AssetManager
    StyleManager: StyleManager
    Pages: Pages
    on(event: string, callback: (...args: unknown[]) => void): void
    destroy(): void
  }

  export interface EditorConfig {
    container: HTMLElement
    height?: string | number
    width?: string | number
    [key: string]: unknown
  }

  export function init(config: EditorConfig): Editor

  const grapesjs: { init: typeof init }
  export default grapesjs
}

declare module 'grapesjs-preset-webpage' {
  import type { Editor } from 'grapesjs'
  const plugin: (editor: Editor, options?: Record<string, unknown>) => void
  export default plugin
}

declare global {
  interface Window {
    __gjs?: import('grapesjs').Editor
  }
}

export {}
