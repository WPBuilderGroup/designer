import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { safeJson } from '@/lib/api'

export async function POST(req: NextRequest) {
  const [body, jsonError] = await safeJson<Record<string, unknown>>(req)
  if (jsonError) return jsonError

  const domain = body['domain'] as string | undefined
  if (!domain) {
    return NextResponse.json({ error: 'domain required' }, { status: 400 })
  }

  // Simplified: always mark as verified (in real use, you should verify TXT DNS record)
  await query(
    'update domains set status=$2, verified_at=now() where domain=$1',
    [domain, 'verified']
  )

  return NextResponse.json({ verified: true })
}
