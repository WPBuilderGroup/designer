declare module 'grapesjs' {
  export interface Manager {
    render(): unknown;
  }

  export interface Editor {
    BlockManager: Manager;
    LayerManager: Manager;
    AssetManager: Manager;
    StyleManager: Manager;
    Pages: Manager;
    on(event: string, callback: () => void): void;
    destroy(): void;
  }

  export type PluginFunction = (editor: Editor, opts?: Record<string, unknown>) => void;

  const grapesjs: {
    init(config: Record<string, unknown>): Editor;
  };

  export default grapesjs;
}

/**
 * Type cho Backbone-style view trong GrapesJS (thường trả về từ `.render()`)
 */
export interface BackboneView<T extends Element = HTMLElement> {
  el: T;
}

/**
 * Kết hợp type từ GrapesJS với Pages API mở rộng
 */
export interface GjsEditor extends import('grapesjs').Editor {
  Pages: {
    render(): BackboneView | HTMLElement;
  };
}

/**
 * Global window declaration để debug trong môi trường development
 */
declare global {
  interface Window {
    __gjs?: GjsEditor;
  }
}
