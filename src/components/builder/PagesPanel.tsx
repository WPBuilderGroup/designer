'use client'

import { useEffect, useMemo, useState } from 'react'
import type { GjsEditor } from '@/types/gjs'
import { logger } from '@/lib/logger'

type PageItem = { id: string; slug: string; updated_at?: string; has_content?: boolean }

type Props = { project: string }

export default function PagesPanel({ project }: Props) {
  const [editor, setEditor] = useState<GjsEditor | null>(null)
  const [pages, setPages] = useState<PageItem[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [renaming, setRenaming] = useState<string | null>(null)
  const [menuFor, setMenuFor] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const onReady = (e: any) => setEditor(e.detail.editor)
    window.addEventListener('gjs-ready', onReady as EventListener)
    return () => window.removeEventListener('gjs-ready', onReady as EventListener)
  }, [])

  const loadPages = async () => {
    setLoading(true)
    try {
      let res = await fetch(`/api/pages?project=${encodeURIComponent(project)}`)
      if (res.status === 404) {
        // Auto-provision project in default workspace then retry
        await fetch(`/api/projects?workspace=${encodeURIComponent('default-workspace')}` , {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ name: project, slug: project })
        }).catch(() => {})
        res = await fetch(`/api/pages?project=${encodeURIComponent(project)}`)
      }
      const json = await res.json().catch(() => ({ pages: [] }))
      setPages(json.pages || [])
      if (!selected && (json.pages?.length ?? 0) > 0) setSelected(json.pages[0].id)
      // If still empty, create default "home" page so user can start immediately
      if ((json.pages?.length ?? 0) === 0) {
        await fetch(`/api/pages?project=${encodeURIComponent(project)}`, {
          method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ slug: 'home' })
        }).catch(() => {})
        // reload list
        const res2 = await fetch(`/api/pages?project=${encodeURIComponent(project)}`)
        const json2 = await res2.json().catch(() => ({ pages: [] }))
        setPages(json2.pages || [])
        if (json2.pages?.[0]) setSelected(json2.pages[0].id)
      }
    } catch (e) {
      logger.warn('Failed to load pages', { error: String(e) })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadPages() }, [project])

  const selectPage = async (page: PageItem) => {
    setSelected(page.id)
    setMenuFor(null)
    try {
      const res = await fetch(`/api/pages/${page.id}`)
      const { page: data } = await res.json()
      if (editor) {
        const html = data?.gjs_html || ''
        const css = data?.gjs_css || ''
        editor.setComponents?.(html)
        editor.setStyle?.(css)
        // notify autosave which page we're on
        window.dispatchEvent(new CustomEvent('gjs-page-selected', { detail: { id: page.id, slug: page.slug } }))
      }
    } catch (e) {
      logger.warn('Failed to select page', { error: String(e) })
    }
  }

  const addPage = async () => {
    const idx = (pages?.length || 0) + 1
    const slug = `page-${idx}`
    try {
      const res = await fetch(`/api/pages?project=${encodeURIComponent(project)}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      const { page } = await res.json()
      await loadPages()
      const created = { id: page.id, slug: page.slug } as PageItem
      selectPage(created)
    } catch (e) {
      logger.warn('Failed to add page', { error: String(e) })
    }
  }

  const renamePage = async (page: PageItem, newSlug: string) => {
    if (!newSlug || newSlug === page.slug) { setRenaming(null); return }
    try {
      await fetch(`/api/pages/${page.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug: newSlug }),
      })
      setRenaming(null)
      await loadPages()
    } catch (e) {
      logger.warn('Failed to rename page', { error: String(e) })
    }
  }

  const deletePage = async (page: PageItem) => {
    try {
      await fetch(`/api/pages/${page.id}`, { method: 'DELETE' })
      await loadPages()
    } catch (e) {
      logger.warn('Failed to delete page', { error: String(e) })
    }
  }

  const duplicatePage = async (page: PageItem) => {
    try {
      // Create new page
      const slug = `${page.slug}-copy`
      const createRes = await fetch(`/api/pages?project=${encodeURIComponent(project)}`, {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ slug })
      })
      const { page: created } = await createRes.json()
      // Load content from source
      const sourceRes = await fetch(`/api/pages/${page.id}`)
      const { page: data } = await sourceRes.json()
      // Push content to new page
      await fetch(`/api/pages/${created.id}`, {
        method: 'PUT', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          grapesJson: {
            'gjs-html': data?.gjs_html || '',
            'gjs-css': data?.gjs_css || '',
            'gjs-components': data?.gjs_components || [],
            'gjs-styles': data?.gjs_styles || [],
          }
        })
      })
      await loadPages()
    } catch (e) {
      logger.warn('Failed to duplicate page', { error: String(e) })
    }
  }

  const openSettings = async (page: PageItem) => {
    // Simple example: prompt SEO title/description
    const title = window.prompt('SEO title', '') || ''
    const description = window.prompt('SEO description', '') || ''
    try {
      await fetch(`/api/pages/${page.id}`, {
        method: 'PUT', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ grapesJson: {}, seo: { title, description } })
      })
      logger.info('Page SEO updated')
    } catch (e) {
      logger.warn('Failed to update SEO', { error: String(e) })
    }
  }

  const Item = ({ p }: { p: PageItem }) => {
    const active = p.id === selected
    return (
      <div className={`flex items-center group justify-between px-3 py-2 text-sm cursor-pointer ${active ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
        onClick={() => selectPage(p)}>
        {renaming === p.id ? (
          <input autoFocus defaultValue={p.slug} onBlur={(e) => renamePage(p, e.currentTarget.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') renamePage(p, (e.target as HTMLInputElement).value) }}
            className='w-full border rounded px-2 py-1 text-sm' />
        ) : (
          <span className='truncate'>{p.slug}</span>
        )}
        <div className='relative'>
          <button onClick={(e) => { e.stopPropagation(); setMenuFor(menuFor === p.id ? null : p.id) }}
            className='opacity-0 group-hover:opacity-100 transition text-gray-500 hover:text-gray-700'>⋮</button>
          {menuFor === p.id && (
            <div className='absolute right-0 mt-1 w-32 bg-white border rounded shadow z-10'>
              <button className='block w-full text-left px-3 py-1.5 hover:bg-gray-100' onClick={(e) => { e.stopPropagation(); setRenaming(p.id); setMenuFor(null) }}>Rename</button>
              <button className='block w-full text-left px-3 py-1.5 hover:bg-gray-100' onClick={(e) => { e.stopPropagation(); duplicatePage(p); }}>Duplicate</button>
              <button className='block w-full text-left px-3 py-1.5 hover:bg-gray-100' onClick={(e) => { e.stopPropagation(); openSettings(p) }}>Settings</button>
              <button className='block w-full text-left px-3 py-1.5 text-red-600 hover:bg-red-50' onClick={(e) => { e.stopPropagation(); deletePage(p) }}>Delete</button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col h-full'>
      <div className='flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200'>
        <div className='text-sm font-medium text-gray-700'>Pages</div>
        <div className='flex items-center gap-1'>
          <button title='Add page' onClick={addPage} className='px-2 py-1 text-xs rounded bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'>+</button>
        </div>
      </div>
      <div className='overflow-auto'>{loading ? <div className='p-3 text-xs text-gray-500'>Loading...</div> : pages.map((p) => (<Item key={p.id} p={p} />))}</div>
    </div>
  )
}
