'use client';

import React, { useEffect, useRef } from 'react';
import grapesjs, { Editor } from 'grapesjs';
// @ts-expect-error – preset chưa có type đầy đủ
import presetWebpage from 'grapesjs-preset-webpage';
import type { BackboneView } from '@/types/grapesjs';
import { logger } from '@/lib/logger';

type CanvasHostProps = {
  className?: string;
};

interface PagesApi {
  render(): BackboneView | HTMLElement;
}

type GjsEditor = Editor & {
  Pages: PagesApi;
};

declare global {
  interface Window {
    __gjs?: GjsEditor;
  }
}

const isBackboneView = (view: unknown): view is BackboneView =>
  typeof view === 'object' &&
  view !== null &&
  'el' in view &&
  (view as any).el instanceof HTMLElement;

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
      window.__gjs = editor;
    }

    const mountView = (
      ref: React.RefObject<HTMLDivElement | null>,
      view: unknown,
      name: string
    ) => {
      const el = ref.current;
      if (!el) {
        logger.warn(`${name} container not found`);
        return;
      }

      el.innerHTML = '';
      const element = getViewElement(view);

      if (element) {
        el.appendChild(element);
        logger.info(`${name} mounted`, { name });
      } else {
        logger.warn(`${name} view is invalid`);
      }
    };

    const mountManagers = () => {
      try {
        mountView(blocksRef, editor.BlockManager.render(), 'Block Manager');
      } catch (e) {
        logger.error('BlockManager mount error', { error: e });
      }

      try {
        mountView(layersRef, editor.LayerManager.render(), 'Layer Manager');
      } catch (e) {
        logger.error('LayerManager mount error', { error: e });
      }

      try {
        mountView(pagesRef, editor.Pages.render(), 'Pages Manager');
      } catch (e) {
        logger.error('PagesManager mount error', { error: e });
      }

      try {
        mountView(assetsRef, editor.AssetManager.render(), 'Assets Manager');
      } catch (e) {
        logger.error('AssetManager mount error', { error: e });
      }

      try {
        mountView(stylesRef, editor.StyleManager.render(), 'Style Manager');
      } catch (e) {
        logger.error('StyleManager mount error', { error: e });
      }
    };

    editor.on('load', () => {
      logger.info('GrapesJS editor initialized');
      requestAnimationFrame(mountManagers);
    });

    return () => {
      try {
        editor.destroy();
        logger.info('GrapesJS editor destroyed');
      } catch (e) {
        logger.warn('Error during editor destroy', { error: e });
      }

      editorRef.current = null;

      if (process.env.NODE_ENV === 'development' && window.__gjs === editor) {
        delete window.__gjs;
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
