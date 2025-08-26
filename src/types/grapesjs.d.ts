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
