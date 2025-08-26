import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// Verify a domain by id; MVP marks as active (stub for Vercel Domains verify)
export async function POST(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  await query('update domains set status=$2, verified_at=now() where id=$1', [id, 'active'])
  const { rows } = await query<{
    id: string
    domain: string
    status: string
    verified_at: string | null
  }>('select id, domain, status, verified_at from domains where id=$1', [id])
  return NextResponse.json({ status: rows[0]?.status || 'active' })
}
