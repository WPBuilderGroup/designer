import { NextRequest, NextResponse } from 'next/server'
import { query, GjsComponent, GjsStyle } from '@/lib/db'

interface SeoPayload {
  title?: string
  description?: string
  keywords?: string[]
  [key: string]: unknown
}

// Update page by id with grapesJson and optional seo, return {page}
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  // Parse body
  let body: Record<string, unknown> = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // Extract grapesJson & seo from body
  const grapesJson = body['grapesJson']
  const seoRaw = body['seo']

  // Validate grapesJson
  if (grapesJson !== undefined && (typeof grapesJson !== 'object' || grapesJson === null || Array.isArray(grapesJson))) {
    return NextResponse.json({ error: 'Invalid grapesJson' }, { status: 400 })
  }

  // Validate seo
  if (seoRaw !== undefined && (typeof seoRaw !== 'object' || seoRaw === null || Array.isArray(seoRaw))) {
    return NextResponse.json({ error: 'Invalid seo' }, { status: 400 })
  }

  // Cast types
  const g = (grapesJson || {}) as Record<string, unknown>
  const seo: SeoPayload | null = seoRaw ? (seoRaw as SeoPayload) : null

  const gHtml = typeof g['gjs-html'] === 'string' ? g['gjs-html'] : ''
  const gCss = typeof g['gjs-css'] === 'string' ? g['gjs-css'] : ''
  const gComp = (g['gjs-components'] as GjsComponent[]) || []
  const gStyles = (g['gjs-styles'] as GjsStyle[]) || []

  // Update grapes content
  await query(
    `UPDATE pages SET
      gjs_html = $2,
      gjs_css = $3,
      gjs_components = $4,
      gjs_styles = $5,
      updated_at = NOW()
     WHERE id = $1`,
    [id, gHtml, gCss, gComp, gStyles]
  )

  // Update SEO if provided (optional)
  if (seo !== null) {
    try {
      await query('UPDATE pages SET seo = $2 WHERE id = $1', [id, seo])
    } catch {
      // Ignore error if column "seo" doesn't exist
    }
  }

  // Return updated page path
  const { rows } = await query<{ id: string; path: string; updated_at: string }>(
    'SELECT id, slug as path, updated_at FROM pages WHERE id = $1',
    [id]
  )

  return NextResponse.json({ page: rows[0] })
}
