import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

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
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
  const rawG = body['grapesJson']
  const rawSeo = body['seo']

  if (rawG !== undefined && (typeof rawG !== 'object' || rawG === null || Array.isArray(rawG))) {
    return NextResponse.json({ error: 'Invalid grapesJson' }, { status: 400 })
  }
  if (rawSeo !== undefined && (typeof rawSeo !== 'object' || rawSeo === null || Array.isArray(rawSeo))) {
    return NextResponse.json({ error: 'Invalid seo' }, { status: 400 })
  }

  const g = (rawG || {}) as Record<string, unknown>
  const seo: SeoPayload | null = rawSeo ? (rawSeo as SeoPayload) : null

  const gHtml = typeof g['gjs-html'] === 'string' ? (g['gjs-html'] as string) : ''
  const gCss = typeof g['gjs-css'] === 'string' ? (g['gjs-css'] as string) : ''
  const gComp = (g['gjs-components'] as object) || {}
  const gStyles = (g['gjs-styles'] as object) || {}

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

  const { rows } = await query('select id, slug as path, updated_at from pages where id=$1', [id])
  return NextResponse.json({ page: rows[0] })
}
