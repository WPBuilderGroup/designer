'use client';

import React, { useEffect, useRef } from 'react';
import grapesjs, { Editor } from 'grapesjs';
import presetWebpage from 'grapesjs-preset-webpage';
import type { BackboneView } from '@/types/grapesjs';

type CanvasHostProps = {
  className?: string;
};

interface PagesApi {
  render(): BackboneView | HTMLElement;
}

type GjsEditor = Editor & {
  Pages: PagesApi;
};

const isBackboneView = (view: unknown): view is BackboneView =>
  typeof view === 'object' &&
  view !== null &&
  'el' in view &&
  (view as { el?: unknown }).el instanceof HTMLElement;

const getViewElement = (view: unknown): HTMLElement | null => {
  if (view instanceof HTMLElement) return view;
  if (isBackboneView(view)) return view.el;
  return null;
};

export default function CanvasHost({ className }: CanvasHostProps) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const blocksRef = useRef<HTMLDivElement | null>(null);
  const layersRef = useRef<HTMLDivElement | null>(null);
  const pagesRef = useRef<HTMLDivElement | null>(null);
  const assetsRef = useRef<HTMLDivElement | null>(null);
  const stylesRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<GjsEditor | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const editor = grapesjs.init({
      container: canvasRef.current,
      height: '100%',
      width: '100%',
      fromElement: false,
      storageManager: false,
      panels: { defaults: [] },
      deviceManager: {
        devices: [
          { name: 'Desktop', width: '' },
          { name: 'Tablet', width: '768px' },
          { name: 'Mobile', width: '375px' },
        ],
      },
      plugins: [presetWebpage],
      pluginsOpts: {
        [presetWebpage]: {},
      },
    }) as GjsEditor;

    editorRef.current = editor;

    if (process.env.NODE_ENV === 'development') {
      (window as any).__gjs = editor;
    }

    const log = (msg: string) => console.log(msg);

    const mountView = (
      ref: React.RefObject<HTMLDivElement | null>,
      view: unknown,
      name: string
    ) => {
      const el = ref.current;
      if (el) {
        el.innerHTML = '';
        const element = getViewElement(view);
        if (element) {
          el.appendChild(element);
          log(`[GrapesJS] ${name} mounted`);
        } else {
          console.warn(`[GrapesJS] ${name} render returned invalid view`);
        }
      } else {
        console.warn(`[GrapesJS] ${name} element not available`);
      }
    };

    const mountManagers = () => {
      try {
        mountView(blocksRef, editor.BlockManager.render(), 'Block Manager');
      } catch (e) {
        console.warn('[GrapesJS] BlockManager mount error', e);
      }

      try {
        mountView(layersRef, editor.LayerManager.render(), 'Layer Manager');
      } catch (e) {
        console.warn('[GrapesJS] LayerManager mount error', e);
      }

      try {
        mountView(pagesRef, editor.Pages.render(), 'Pages Manager');
      } catch (e) {
        console.warn('[GrapesJS] Pages mount error', e);
      }

      try {
        mountView(assetsRef, editor.AssetManager.render(), 'Assets Manager');
      } catch (e) {
        console.warn('[GrapesJS] AssetManager mount error', e);
      }

      try {
        mountView(stylesRef, editor.StyleManager.render(), 'Style Manager');
      } catch (e) {
        console.warn('[GrapesJS] StyleManager mount error', e);
      }
    };

    editor.on('load', () => {
      log('GrapesJS editor initialized successfully');
      requestAnimationFrame(mountManagers);
    });

    return () => {
      try {
        editor.destroy();
      } catch {}

      editorRef.current = null;

      if (
        process.env.NODE_ENV === 'development' &&
        (window as any).__gjs === editor
      ) {
        delete (window as any).__gjs;
      }
    };
  }, []);

  return (
    <div className={className ?? 'h-full w-full flex'}>
      {/* Left sidebar */}
      <aside className="w-[300px] shrink-0 border-r border-border bg-background">
        <div className="h-1/2 overflow-auto" ref={pagesRef} aria-label="Pages" />
        <div className="h-1/2 overflow-auto" ref={layersRef} aria-label="Layers" />
      </aside>

      {/* Canvas */}
      <main className="flex-1 relative bg-muted">
        <div ref={canvasRef} className="absolute inset-0" />
      </main>

      {/* Right sidebar */}
      <aside className="w-[360px] shrink-0 border-l border-border bg-background">
        <div className="h-1/2 overflow-auto" ref={blocksRef} aria-label="Blocks" />
        <div className="h-1/2 overflow-auto">
          <div className="h-[50%] overflow-auto" ref={stylesRef} aria-label="Styles" />
          <div className="h-[50%] overflow-auto" ref={assetsRef} aria-label="Assets" />
        </div>
      </aside>
    </div>
  );
}
