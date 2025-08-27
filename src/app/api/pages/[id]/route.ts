import { NextRequest, NextResponse } from 'next/server'
import { query, GjsComponent, GjsStyle } from '@/lib/db'

interface SeoPayload {
  title?: string
  description?: string
  [key: string]: unknown
}

// Update page by id with grapesJson and optional seo, return {page}
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  let body: Record<string, unknown> = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const grapesJson = body['grapesJson']
  const seoRaw = body['seo']

  if (grapesJson !== undefined && (typeof grapesJson !== 'object' || grapesJson === null)) {
    return NextResponse.json({ error: 'grapesJson must be an object' }, { status: 400 })
  }

  if (seoRaw !== undefined && seoRaw !== null && typeof seoRaw !== 'object') {
    return NextResponse.json({ error: 'seo must be an object' }, { status: 400 })
  }

  const g = (grapesJson || {}) as Record<string, unknown>
  const seo = (seoRaw ?? null) as SeoPayload | null

  const gHtml = (g['gjs-html'] as string) || ''
  const gCss = (g['gjs-css'] as string) || ''
  const gComp = (g['gjs-components'] as GjsComponent[]) || []
  const gStyles = (g['gjs-styles'] as GjsStyle[]) || []

  await query(
    `update pages set
      gjs_html = $2,
      gjs_css = $3,
      gjs_components = $4,
      gjs_styles = $5,
      updated_at = now()
     where id = $1`,
    [id, gHtml, gCss, gComp, gStyles]
  )

  // Optional SEO update (safe to fail)
  if (seo !== null) {
    try {
      await query('update pages set seo = $2 where id = $1', [id, seo])
    } catch {
      // ignore error, e.g. missing 'seo' column
    }
  }

  const { rows } = await query<{ id: string; path: string; updated_at: string }>(
    'select id, slug as path, updated_at from pages where id = $1',
    [id]
  )

  return NextResponse.json({ page: rows[0] })
}
