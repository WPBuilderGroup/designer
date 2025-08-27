import type { Editor as BaseEditor } from 'grapesjs';

/**
 * Type cho Backbone-style view trong GrapesJS (thường trả về từ `.render()`)
 */
export interface BackboneView<T extends Element = HTMLElement> {
  el: T;
}

/**
 * Kết hợp type từ GrapesJS với Pages API mở rộng
 */
export interface GjsEditor extends BaseEditor {
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

export {};
