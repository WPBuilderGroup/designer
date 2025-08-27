import { NextRequest, NextResponse } from 'next/server'
import { query, GjsComponent, GjsStyle } from '@/lib/db'
import { safeJson } from '@/lib/api'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const q = (url.searchParams.get('q') || '').trim()
  const tag = (url.searchParams.get('tag') || '').trim()

  const clauses: string[] = []
  const params: unknown[] = []

  if (q) {
    params.push(`%${q.toLowerCase()}%`)
    clauses.push(`lower(name) LIKE $${params.length}`)
  }

  if (tag) {
    params.push(tag)
    clauses.push(`(meta->'tags')::jsonb ? $${params.length}`)
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
  const { rows } = await query(
    `
    SELECT id, name, type, COALESCE(meta->>'preview', '') AS preview
    FROM templates
    ${where}
    ORDER BY created_at DESC
    `,
    params
  )

  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const [body, jsonError] = await safeJson<Record<string, unknown>>(req)
  if (jsonError) return jsonError

  const { name, type = 'page', grapesJson, meta } = body as {
    name?: string
    type?: string
    grapesJson?: Record<string, unknown>
    meta?: Record<string, unknown>
  }

  if (!name) {
    return NextResponse.json({ error: 'name required' }, { status: 400 })
  }

  const g = grapesJson || {}
  const gHtml = (g['gjs-html'] as string) || ''
  const gCss = (g['gjs-css'] as string) || ''
  const gComp = (g['gjs-components'] as GjsComponent[]) || []
  const gStyles = (g['gjs-styles'] as GjsStyle[]) || []

  await query(
    `
    INSERT INTO templates(name, type, gjs_html, gjs_css, gjs_components, gjs_styles, meta)
    VALUES($1, $2, $3, $4, $5, $6, $7)
    `,
    [name, type, gHtml, gCss, gComp, gStyles, meta || {}]
  )

  return NextResponse.json({ ok: true })
}
