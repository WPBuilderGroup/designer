import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(req: NextRequest) {
  const url = new URL(req.url)
  const project = url.searchParams.get('project') || ''
  const { domain } = await req.json()

  // Simplified: always mark as verified (in real life, check DNS TXT)
  await query('update domains set status=$2, verified_at=now() where domain=$1', [domain, 'verified'])
  return NextResponse.json({ verified: true })
}
