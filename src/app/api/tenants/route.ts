import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { safeJson } from '@/lib/api'

export async function GET() {
  const { rows } = await query('select id, slug, name from tenants order by created_at desc')
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const [body, jsonError] = await safeJson<Record<string, unknown>>(req)
  if (jsonError) return jsonError
  const { name, slug } = body as { name?: string; slug?: string }
  if (!name || !slug) {
    return NextResponse.json({ error: 'name and slug required' }, { status: 400 })
  }
  await query('insert into tenants(slug, name) values($1,$2)', [slug, name])
  return NextResponse.json({ ok: true })
}
