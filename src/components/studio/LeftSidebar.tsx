'use client';

import { useEffect, useRef } from 'react';
import type { Editor } from 'grapesjs';

interface Props { editor?: Editor | null; }

export default function LeftSidebar({ editor }: Props) {
  const layersRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<HTMLDivElement>(null);
  const assetsRef = useRef<HTMLDivElement>(null);

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

    const lm: any = (editor as any).Layers || (editor as any).LayerManager;
    const bm: any = (editor as any).Blocks || (editor as any).BlockManager;
    const am: any = (editor as any).Assets || (editor as any).AssetManager;

    mount(lm, layersRef.current);
    mount(bm, blocksRef.current);
    mount(am, assetsRef.current);
  }, [editor]);

  return (
    <div className="p-2 space-y-4">
      <div className="rounded border min-h-40" ref={layersRef} />
      <div className="rounded border min-h-40" ref={blocksRef} />
      <div className="rounded border min-h-40" ref={assetsRef} />
    </div>
  );
}
