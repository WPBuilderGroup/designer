import { NextRequest, NextResponse } from 'next/server'
import { query, GjsComponent, GjsStyle } from '@/lib/db'

// Update page by id with grapesJson and optional seo, return {page}
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
  const g = (body['grapesJson'] || {}) as Record<string, unknown>
  const seo: unknown = (body['seo'] ?? null)

  const gHtml = (g['gjs-html'] as string) || ''
  const gCss = (g['gjs-css'] as string) || ''
  const gComp = (g['gjs-components'] as GjsComponent[]) || []
  const gStyles = (g['gjs-styles'] as GjsStyle[]) || []

  await query(
    `update pages set
      gjs_html=$2,
      gjs_css=$3,
      gjs_components=$4,
      gjs_styles=$5,
      updated_at=now()
     where id=$1`,
    [id, gHtml, gCss, gComp, gStyles]
  )

  // Optional: update SEO if column exists (future-proof, ignore if fails)
  if (seo !== null) {
    try {
      await query('update pages set seo=$2 where id=$1', [id, seo])
    } catch {
      // ignore if column not present
    }
  }

  const { rows } = await query<{ id: string; path: string; updated_at: string }>(
    'select id, slug as path, updated_at from pages where id=$1',
    [id]
  )
  return NextResponse.json({ page: rows[0] })
}
