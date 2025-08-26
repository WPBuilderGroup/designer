'use client';

import { useEffect, useRef } from 'react';
import type { Editor } from 'grapesjs';

interface Props { editor?: Editor | null; }

export default function RightSidebar({ editor }: Props) {
  const stylesRef = useRef<HTMLDivElement>(null);
  const traitsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor) return;

    const mount = (manager: any, host: HTMLDivElement | null) => {
      if (!host || !manager?.render) return;
      const v = manager.render();
      const el = (v && 'el' in v) ? (v as any).el : v;
      if (el instanceof HTMLElement) {
        host.innerHTML = '';
        host.appendChild(el);
      }
    };

    const sm: any = (editor as any).Styles || (editor as any).StyleManager;
    const tm: any = (editor as any).Traits || (editor as any).TraitManager;

    mount(sm, stylesRef.current);
    mount(tm, traitsRef.current);
  }, [editor]);

  return (
    <div className="p-2 space-y-4">
      <div className="rounded border min-h-40" ref={stylesRef} />
      <div className="rounded border min-h-40" ref={traitsRef} />
    </div>
  );
}
