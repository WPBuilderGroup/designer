export interface GrapesView {
  el: HTMLElement;
}

export interface BlockManager {
  render(): GrapesView;
}

export interface LayerManager {
  render(): GrapesView;
}

export interface AssetManager {
  render(): GrapesView;
}

export interface StyleManager {
  render(): GrapesView;
}

export interface Pages {
  render(): GrapesView;
}

export interface Editor {
  BlockManager: BlockManager;
  LayerManager: LayerManager;
  AssetManager: AssetManager;
  StyleManager: StyleManager;
  Pages: Pages;
  on(event: string, callback: (...args: unknown[]) => void): void;
  destroy(): void;
}

export interface InitConfig {
  container: HTMLElement | string;
  height?: string | number;
  width?: string | number;
  fromElement?: boolean;
  storageManager?: unknown;
  panels?: unknown;
  deviceManager?: unknown;
  plugins?: unknown[];
  pluginsOpts?: Record<string, unknown>;
}

export function init(config: InitConfig): Editor;

declare const grapesjs: {
  init: typeof init;
};
export default grapesjs;

declare global {
  interface Window {
    __gjs?: Editor;
  }
}
