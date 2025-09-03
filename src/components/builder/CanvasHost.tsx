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
import PagesPanel from './PagesPanel'

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

      // Attempt to bootstrap content from public export if editor is empty
      ;(async () => {
        try {
          const qs = new URLSearchParams(globalThis.location.search)
          const project = qs.get('project') || 'default'
          const pageSlug = qs.get('page') || 'home'
          const workspace = qs.get('workspace') || 'default-workspace'
          const base = `/projects/${encodeURIComponent(workspace)}/${encodeURIComponent(project)}/`
          const htmlRes = await fetch(base + 'index.html').catch(() => null)
          const okHtml = htmlRes && htmlRes.ok ? await htmlRes.text() : ''
          // try to infer CSS href from HTML, fallback to common paths
          let cssText = ''
          if (okHtml) {
            try {
              const doc = new DOMParser().parseFromString(okHtml, 'text/html')
              const links = Array.from(doc.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[]
              const hrefs = links.map(l => l.getAttribute('href') || '').filter(Boolean)
              const cssPathCandidates = [...hrefs, 'style.css', 'css/style.css', 'styles.css']
              for (const rel of cssPathCandidates) {
                try {
                  const res = await fetch(base + rel)
                  if (res.ok) {
                    const txt = await res.text()
                    cssText += `\n/* ${rel} */\n` + txt
                  }
                } catch {}
              }
              // Resolve one-level @import and rewrite relative URLs
              async function resolveCss(input: string): Promise<string> {
                let out = input
                // Fetch @import url('...') relative
                const importRe = /@import\s+url\((['\"]?)(?!https?:|\/)([^)\'\"]+)\1\)\s*;?/g
                const imports: Array<{ match: string; path: string }> = []
                let m: RegExpExecArray | null
                while ((m = importRe.exec(input))) {
                  imports.push({ match: m[0], path: m[2] })
                }
                for (const imp of imports) {
                  try {
                    const r = await fetch(base + imp.path.replace(/^\.\//, ''))
                    if (r.ok) {
                      const t = await r.text()
                      out = out.replace(imp.match, `\n/* inlined: ${imp.path} */\n${t}\n`)
                    }
                  } catch {}
                }
                // Rewrite url(...) relative assets
                out = out.replace(/url\((['\"]?)(?!https?:|\/)([^)\'\"]+)\1\)/g, (_mm, _q, p) => `url(${base}${String(p).replace(/^\.\//, '')})`)
                return out
              }
              if (cssText) cssText = await resolveCss(cssText)
              // Rewrite relative asset URLs in HTML (img/src/href)
              doc.querySelectorAll('[src], [href]').forEach((el) => {
                const hasSrc = (el as HTMLElement).hasAttribute('src')
                const hasHref = (el as HTMLElement).hasAttribute('href')
                const val = hasSrc
                  ? (el as HTMLElement).getAttribute('src')
                  : (hasHref ? (el as HTMLElement).getAttribute('href') : null)
                if (!val) return
                const isAbs = /^(https?:)?\//i.test(val)
                if (!isAbs) {
                  const fixed = base + val.replace(/^\.\//, '')
                  if (hasSrc) (el as HTMLElement).setAttribute('src', fixed)
                  if (hasHref) (el as HTMLElement).setAttribute('href', fixed)
                }
              })
              // Use only <body> content as components
              let bodyHtml = doc.body ? doc.body.innerHTML : okHtml
              // Optional: ensure basic :root variables if missing
              if (cssText && !/:root\s*\{[^}]*--gjs-t-color-primary/.test(cssText)) {
                cssText = `:root{--gjs-t-color-primary:#cf549e;--gjs-t-color-secondary:#b9227d;--gjs-t-color-accent:#ffb347;--gjs-t-color-success:#28a745;--gjs-t-color-warning:#ffc107;--gjs-t-color-error:#dc3545;}` + "\n" + cssText
              }
              const isEmpty = !editor.getHtml()?.trim()
              if (isEmpty && (bodyHtml || cssText)) {
                if (bodyHtml) editor.setComponents(bodyHtml)
                if (cssText) editor.setStyle(cssText)
                logger.info('Bootstrapped content from export (parsed)')
                // Ensure page exists in DB and save initial content
                try {
                  let pageId: string | null = null
                  const getList = await fetch(`/api/pages?project=${encodeURIComponent(project)}`).then(r => r.ok ? r.json() : { pages: [] as any[] })
                  const pages: any[] = getList.pages || []
                  const found = pages.find(p => p.slug === pageSlug)
                  if (found) pageId = found.id
                  else {
                    const created = await fetch(`/api/pages?project=${encodeURIComponent(project)}`, {
                      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ slug: pageSlug })
                    }).then(r => r.ok ? r.json() : null)
                    pageId = created?.page?.id || null
                  }
                  if (pageId) {
                    await fetch(`/api/pages/${pageId}`, {
                      method: 'PUT', headers: { 'content-type': 'application/json' },
                      body: JSON.stringify({ grapesJson: { 'gjs-html': editor.getHtml(), 'gjs-css': editor.getCss(), 'gjs-components': editor.getComponents(), 'gjs-styles': editor.getStyle() } })
                    }).catch(() => {})
                    // set current id for autosave loop
                    window.dispatchEvent(new CustomEvent('gjs-page-selected', { detail: { id: pageId, slug: pageSlug } }))
                  }
                } catch {}
                return
              }
            } catch {}
          }
          const cssRes = await fetch(base + 'style.css').catch(() => null)
          const okCss = cssRes && cssRes.ok ? await cssRes.text() : ''
          const isEmpty = !editor.getHtml()?.trim()
          if (isEmpty && (okHtml || okCss)) {
            if (okHtml) editor.setComponents(okHtml)
            if (okCss) editor.setStyle(okCss)
            logger.info('Bootstrapped content from public export', { base })
          }
        } catch (err) {
          logger.warn('Failed to bootstrap content from public export', { error: String(err) })
        }
      })()
    });

    // Bridge component selection to external panels
    editor.on('component:selected', (cmp) => {
      window.dispatchEvent(new CustomEvent('gjs-component-select', { detail: { component: cmp } }))
    })

    // Reflect undo/redo availability to topbar
    editor.on('component:add component:remove component:update style:target', () => {
      window.dispatchEvent(new CustomEvent('gjs-history-change'))
    })

    // Track current page id for autosave
    let currentPageId: string | null = null
    const onPageSelected = (e: any) => { currentPageId = e.detail?.id || null }
    window.addEventListener('gjs-page-selected', onPageSelected as EventListener)

    // Debounced autosave to DB when page is known
    let saveTimeout: any
    editor.on('update', () => {
      clearTimeout(saveTimeout)
      saveTimeout = setTimeout(async () => {
        try {
          const payload = {
            grapesJson: {
              'gjs-html': editor.getHtml(),
              'gjs-css': editor.getCss(),
              'gjs-components': editor.getComponents(),
              'gjs-styles': editor.getStyle(),
            }
          }
          if (currentPageId) {
            await fetch(`/api/pages/${currentPageId}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) })
          }
        } catch (err) {
          logger.warn('Autosave failed', { error: String(err) })
        }
      }, 800)
    })

    // Manual import-to-DB handler
    const importHandler = async () => {
      try {
        const qs = new URLSearchParams(globalThis.location.search)
        const project = qs.get('project') || 'default'
        const pageSlug = qs.get('page') || 'home'
        // ensure pageId
        let pageId: string | null = currentPageId
        if (!pageId) {
          const list = await fetch(`/api/pages?project=${encodeURIComponent(project)}`).then(r => r.ok ? r.json() : { pages: [] })
          const found = (list.pages || []).find((p: any) => p.slug === pageSlug)
          if (found) pageId = found.id
          else {
            const created = await fetch(`/api/pages?project=${encodeURIComponent(project)}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ slug: pageSlug }) }).then(r => r.ok ? r.json() : null)
            pageId = created?.page?.id || null
          }
        }
        if (pageId) {
          await fetch(`/api/pages/${pageId}`, {
            method: 'PUT', headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ grapesJson: { 'gjs-html': editor.getHtml(), 'gjs-css': editor.getCss(), 'gjs-components': editor.getComponents(), 'gjs-styles': editor.getStyle() } })
          })
          logger.info('Imported current canvas into DB', { pageId, pageSlug })
          window.dispatchEvent(new CustomEvent('gjs-page-selected', { detail: { id: pageId, slug: pageSlug } }))
        }
      } catch (err) {
        logger.warn('Import to DB failed', { error: String(err) })
      }
    }
    window.addEventListener('gjs-import-request', importHandler as EventListener)

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
      window.removeEventListener('gjs-page-selected', onPageSelected as EventListener)
      window.removeEventListener('gjs-import-request', importHandler as EventListener)
    };
  }, []);

  return (
    <div className={className ?? 'h-full w-full flex'}>
      {/* Left sidebar */}
      <aside className="w-[300px] shrink-0 border-r border-gray-200 bg-white flex flex-col">
        {/* Pages Panel (React) */}
        <PagesPanel project={new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('project') || 'default'} />

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
