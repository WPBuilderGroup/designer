'use client';

import React, { useEffect, useRef } from 'react';
import grapesjs, { Editor } from 'grapesjs';
// (tuỳ bạn có dùng preset nào, có thể giữ hoặc bỏ 2 dòng dưới)
// @ts-expect-error – một số preset chưa có type
import presetWebpage from 'grapesjs-preset-webpage';

import { logger } from '@/lib/logger';

type CanvasHostProps = {
  // có thể truyền thêm props nếu bạn đang dùng (projectId, pageId,…)
  className?: string;
};

export default function CanvasHost({ className }: CanvasHostProps) {
  // Canvas & panel refs
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const blocksRef = useRef<HTMLDivElement | null>(null);
  const layersRef = useRef<HTMLDivElement | null>(null);
  const pagesRef = useRef<HTMLDivElement | null>(null);
  const assetsRef = useRef<HTMLDivElement | null>(null);
  const stylesRef = useRef<HTMLDivElement | null>(null);

  const editorRef = useRef<Editor | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Khởi tạo editor
    const editor = grapesjs.init({
      container: canvasRef.current,
      height: '100%',
      width: '100%',
      fromElement: false,
      storageManager: false, // bạn có thể bật lại sau
      panels: { defaults: [] }, // ta tự build UI ngoài
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
    });

    editorRef.current = editor;
    // Expose để debug
    // @ts-ignore
    window.__gjs = editor;

      const log = (msg: string) => logger.info(msg);

    const mountManagers = () => {
      // BLOCKS
      try {
        const el = blocksRef.current;
        if (el) {
          el.innerHTML = '';
          const view = editor.BlockManager.render();
          // @ts-ignore view.el tồn tại vì là Backbone view
          if (view && view.el) el.appendChild(view.el as HTMLElement);
          log('[GrapesJS] Block Manager mounted');
        } else {
          console.warn('[GrapesJS] Blocks element not available');
        }
      } catch (e) {
        console.warn('[GrapesJS] BlockManager mount error', e);
      }

      // LAYERS
      try {
        const el = layersRef.current;
        if (el) {
          el.innerHTML = '';
          const view = editor.LayerManager.render();
          // @ts-ignore
          if (view && view.el) el.appendChild(view.el as HTMLElement);
          log('[GrapesJS] Layer Manager mounted');
        } else {
          console.warn('[GrapesJS] Layers element not available');
        }
      } catch (e) {
        console.warn('[GrapesJS] LayerManager mount error', e);
      }

      // PAGES
      try {
        const el = pagesRef.current;
        if (el) {
          el.innerHTML = '';
          // Pages API mới – render() trả Backbone view giống các manager khác
          // @ts-ignore
          const view = editor.Pages.render();
          // @ts-ignore
          if (view && view.el) el.appendChild(view.el as HTMLElement);
          log('[GrapesJS] Pages Manager mounted');
        } else {
          console.warn('[GrapesJS] Pages element not available');
        }
      } catch (e) {
        console.warn('[GrapesJS] Pages mount error', e);
      }

      // ASSETS
      try {
        const el = assetsRef.current;
        if (el) {
          el.innerHTML = '';
          const view = editor.AssetManager.render();
          // @ts-ignore
          if (view && view.el) el.appendChild(view.el as HTMLElement);
          log('[GrapesJS] Assets Manager mounted');
        } else {
          console.warn('[GrapesJS] Assets element not available');
        }
      } catch (e) {
        console.warn('[GrapesJS] AssetManager mount error', e);
      }

      // STYLES
      try {
        const el = stylesRef.current;
        if (el) {
          el.innerHTML = '';
          const view = editor.StyleManager.render();
          // @ts-ignore
          if (view && view.el) el.appendChild(view.el as HTMLElement);
          log('[GrapesJS] Style Manager mounted');
        } else {
          console.warn('[GrapesJS] StyleManager element not available');
        }
      } catch (e) {
        console.warn('[GrapesJS] StyleManager mount error', e);
      }
    };

    // Chờ editor load xong rồi mount managers
    editor.on('load', () => {
      log('GrapesJS editor initialized successfully');
      // Đảm bảo DOM panels đã render
      requestAnimationFrame(mountManagers);
    });

    return () => {
      try {
        editor.destroy();
      } catch {}
      editorRef.current = null;
      // @ts-ignore
      if (window.__gjs === editor) delete window.__gjs;
    };
  }, []);

  // Ở đây chỉ dựng layout + container cho các panel
  return (
      <div className={className ?? 'h-full w-full flex'}>
        {/* Left sidebar – bạn có thể thay bằng component riêng nếu muốn */}
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
            {/* Tabs Styles/Assets nếu bạn muốn tách riêng, tạm để 2 khối dưới đây */}
            <div className="h-[50%] overflow-auto" ref={stylesRef} aria-label="Styles" />
            <div className="h-[50%] overflow-auto" ref={assetsRef} aria-label="Assets" />
          </div>
        </aside>
      </div>
  );
}
