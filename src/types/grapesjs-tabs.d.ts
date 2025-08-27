import type { Editor } from 'grapesjs';

declare module 'grapesjs-tabs' {
  /**
   * Type declaration for grapesjs-tabs plugin
   * @param editor - The GrapesJS editor instance
   * @param opts - Optional plugin options
   */
  export default function tabs(editor: Editor, opts?: Record<string, unknown>): void;
}
