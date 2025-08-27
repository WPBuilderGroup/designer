import type { Editor } from 'grapesjs';

declare module 'grapesjs-preset-webpage' {
  export default function presetWebpage(editor: Editor, opts?: Record<string, unknown>): void;
}
