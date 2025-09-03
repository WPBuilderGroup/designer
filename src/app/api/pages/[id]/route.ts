import { NextRequest, NextResponse } from 'next/server'
import { query, GjsComponent, GjsStyle } from '@/lib/db'

interface SeoPayload {
  title?: string
  description?: string
  keywords?: string[]
  [key: string]: unknown
}

// Update page by id with grapesJson and optional seo, return {page}
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const { rows } = await query(
    `SELECT id, slug, gjs_html, gjs_css, gjs_components, gjs_styles, updated_at
     FROM pages WHERE id = $1 LIMIT 1`,
    [id]
  )
  if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ page: rows[0] })
}

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
  if (
    grapesJson !== undefined &&
    (typeof grapesJson !== 'object' || grapesJson === null || Array.isArray(grapesJson))
  ) {
    return NextResponse.json({ error: 'Invalid grapesJson' }, { status: 400 })
  }

  // Validate seo
  if (
    seoRaw !== undefined &&
    (typeof seoRaw !== 'object' || seoRaw === null || Array.isArray(seoRaw))
  ) {
    return NextResponse.json({ error: 'Invalid seo' }, { status: 400 })
  }

  // Cast types
  const g = (grapesJson || {}) as Record<string, unknown>
  const seo: SeoPayload | null = seoRaw ? (seoRaw as SeoPayload) : null

  const gHtml = typeof g['gjs-html'] === 'string' ? g['gjs-html'] : ''
  const gCss = typeof g['gjs-css'] === 'string' ? g['gjs-css'] : ''
  const gComp = Array.isArray(g['gjs-components']) ? (g['gjs-components'] as GjsComponent[]) : []
  const gStyles = Array.isArray(g['gjs-styles']) ? (g['gjs-styles'] as GjsStyle[]) : []

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

// Rename (slug only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  let body: Record<string, unknown> = {}
  try { body = await req.json() } catch {}
  const slug = typeof body['slug'] === 'string' ? body['slug'] : null
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })
  await query('UPDATE pages SET slug=$2, updated_at=NOW() WHERE id=$1', [id, slug])
  const { rows } = await query('SELECT id, slug, updated_at FROM pages WHERE id=$1', [id])
  return NextResponse.json({ page: rows[0] })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  await query('DELETE FROM pages WHERE id = $1', [id])
  return NextResponse.json({ success: true })
}
