import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const q = (url.searchParams.get('q') || '').trim()
  const tag = (url.searchParams.get('tag') || '').trim()

  const clauses: string[] = []
  const params: any[] = []
  if (q) { params.push(`%${q.toLowerCase()}%`); clauses.push(`lower(name) like $${params.length}`) }
  if (tag) { params.push(tag); clauses.push(`(meta->'tags')::jsonb ? $${params.length}`) }

  const where = clauses.length ? `where ${clauses.join(' and ')}` : ''
  const { rows } = await query(
    `select id, name, type, coalesce(meta->>'preview','') as preview from templates ${where} order by created_at desc`,
    params
  )
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
  const { name, type = 'page', grapesJson, meta } = body as {
    name?: string
    type?: string
    grapesJson?: Record<string, unknown>
    meta?: Record<string, unknown>
  }
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })

  const g = grapesJson || {}
  const gHtml = (g['gjs-html'] as string) || ''
  const gCss = (g['gjs-css'] as string) || ''
  const gComp = (g['gjs-components'] as object) || {}
  const gStyles = (g['gjs-styles'] as object) || {}

  await query(
    `insert into templates(name, type, gjs_html, gjs_css, gjs_components, gjs_styles, meta)
     values($1,$2,$3,$4,$5,$6,$7)`,
    [name, type, gHtml, gCss, gComp, gStyles, meta || {}]
  )

  return NextResponse.json({ ok: true })
}
