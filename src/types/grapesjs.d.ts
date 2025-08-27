import type { Editor as BaseEditor } from 'grapesjs';

export interface BackboneView<T extends Element = HTMLElement> {
  el: T;
}

// Extended GrapesJS Editor with Pages API support
export interface GjsEditor extends BaseEditor {
  Pages: {
    render(): BackboneView | HTMLElement;
  };
}

// Declare globally accessible editor (dev-only debug)
declare global {
  interface Window {
    __gjs?: GjsEditor;
  }
}

export {};
