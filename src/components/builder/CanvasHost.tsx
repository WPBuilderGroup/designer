'use client';

import React, { useEffect, useRef } from 'react';
import grapesjs, { Editor } from 'grapesjs';
// @ts-expect-error – preset chưa có type đầy đủ
import presetWebpage from 'grapesjs-preset-webpage';
import type { BackboneView } from '@/types/grapesjs';
import { logger } from '@/lib/logger';
import { applyStyleManager } from '@/lib/gjs/styles'
import { applyPanels, registerViewCommands } from '@/lib/gjs/panels'
import { configureAssets } from '@/lib/gjs/assets'
import { registerBlocks } from '@/lib/gjs/blocks'

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
  // Blocks/Assets will be shown via LeftDock drawer
  const layersRef = useRef<HTMLDivElement | null>(null);
  const pagesRef = useRef<HTMLDivElement | null>(null);
  // Style and Asset managers are rendered by RightInspector
  const editorRef = useRef<GjsEditor | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Ensure GrapesJS CSS is present without going through the bundler
    // We serve the css from /public/grapesjs/grapes.min.css copied at install time
    const ensureGjsCss = () => {
      const id = 'gjs-css-local';
      if (document.getElementById(id)) return;
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = '/grapesjs/grapes.min.css';
      document.head.appendChild(link);
    };
    ensureGjsCss();

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

    // Configure editor integrations (panels/commands, style manager, assets, blocks)
    try {
      applyPanels(editor)
      registerViewCommands(editor)
      applyStyleManager(editor as unknown as Editor)
      configureAssets(editor)
      registerBlocks(editor)
    } catch (e) {
      logger.warn('GrapesJS configuration error', { error: e })
    }

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
        mountView(layersRef, editor.LayerManager.render(), 'Layer Manager');
      } catch (e) {
        logger.error('LayerManager mount error', { error: e });
      }

      try {
        const maybePages: any = (editor as any).Pages;
        const view = maybePages?.render?.();
        const el = getViewElement(view);
        const container = pagesRef.current;
        if (container) {
          container.innerHTML = '';
          if (el) {
            container.appendChild(el);
            logger.info('Pages Manager mounted');
          } else {
            // Graceful fallback when Pages plugin/view is unavailable in this build
            const note = document.createElement('div');
            note.className = 'text-xs text-gray-500 p-3';
            note.textContent = 'Pages view is not available in this build.';
            container.appendChild(note);
            logger.warn('Pages Manager view is invalid');
          }
        }
      } catch (e) {
        logger.error('PagesManager mount error', { error: e });
      }

      // Style Manager and Asset Manager are mounted in RightInspector
    };

    editor.on('load', () => {
      logger.info('GrapesJS editor initialized');
      requestAnimationFrame(mountManagers);
      // Notify outer UI that editor is ready
      window.dispatchEvent(new CustomEvent('gjs-ready', { detail: { editor } }))
    });

    // Bridge component selection to external panels
    editor.on('component:selected', (cmp) => {
      window.dispatchEvent(new CustomEvent('gjs-component-select', { detail: { component: cmp } }))
    })

    // Reflect undo/redo availability to topbar
    editor.on('component:add component:remove component:update style:target', () => {
      window.dispatchEvent(new CustomEvent('gjs-history-change'))
    })

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
      <aside className="w-[300px] shrink-0 border-r border-gray-200 bg-white flex flex-col">
        {/* Pages */}
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50">
            <div className="text-sm font-medium text-gray-700">Pages</div>
            <div className="flex items-center gap-1">
              <button
                aria-label="Add page"
                className="px-2 py-1 text-xs rounded bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  const ed = editorRef.current as any
                  if (!ed?.Pages) return
                  const curr = ed.Pages.getAll?.() || []
                  const idx = curr.length + 1
                  const id = `page-${idx}`
                  ed.Pages.add?.({ id, styles: '', component: '' })
                  try { ed.Pages.select?.(id) } catch {}
                }}
              >
                +
              </button>
            </div>
          </div>
          <div className="h-48 overflow-auto" ref={pagesRef} aria-label="Pages" />
        </div>

        {/* Layers */}
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
            <div className="text-sm font-medium text-gray-700">Layers</div>
          </div>
          <div className="flex-1 overflow-auto" ref={layersRef} aria-label="Layers" />
        </div>
      </aside>

      {/* Canvas */}
      <main className="flex-1 relative bg-muted">
        <div ref={canvasRef} className="absolute inset-0" />
      </main>

      {/* Right sidebar removed: Blocks/Assets appear in drawer */}
    </div>
  );
}
