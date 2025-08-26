import type { Editor } from 'grapesjs';

export interface BackboneView<T extends Element = HTMLElement> {
  el: T;
}

declare global {
  interface Window {
    __gjs?: Editor;
  }
}

export {};
