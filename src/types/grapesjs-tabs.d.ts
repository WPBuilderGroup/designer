import type { Editor } from 'grapesjs';

declare module 'grapesjs-tabs' {
  export default function tabs(editor: Editor, opts?: Record<string, unknown>): void;
}
