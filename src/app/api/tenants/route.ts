import { NextRequest, NextResponse } from 'next/server'
import { query, Tenant } from '@/lib/db'

export async function GET() {
  const { rows } = await query<Tenant>('select id, slug, name from tenants order by created_at desc')
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const { name, slug } = await req.json()
  await query('insert into tenants(slug, name) values($1,$2)', [slug, name])
  return NextResponse.json({ ok: true })
}
