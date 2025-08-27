import { NextRequest, NextResponse } from 'next/server'
import { safeJson } from '@/lib/api'

export const dynamic = 'force-dynamic'

// In-memory storage for demo; replace with DB layer
const mem = new Map<string, unknown>()
const keyOf = (project: string|null, page: string|null) => `${project ?? 'unknown'}::${page ?? 'home'}`

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const project = sp.get('project')
  const page = sp.get('page')
  const data = (mem.get(keyOf(project, page)) ?? {}) as Record<string, unknown>

  return NextResponse.json({
    'gjs-html': data['gjs-html'] ?? '',
    'gjs-css': data['gjs-css'] ?? '',
    'gjs-components': data['gjs-components'] ?? [],
    'gjs-styles': data['gjs-styles'] ?? [],
    'gjs-assets': data['gjs-assets'] ?? [],
  })
}

export async function POST(req: NextRequest) {
  const [body, jsonError] = await safeJson<Record<string, unknown>>(req)
  if (jsonError) return jsonError
  const sp = req.nextUrl.searchParams
  const project = sp.get('project')
  const page = sp.get('page')

  // Normalize payload shape
  const payload = {
    'gjs-html': (body['gjs-html'] as string) ?? '',
    'gjs-css': (body['gjs-css'] as string) ?? '',
    'gjs-components': (body['gjs-components'] as unknown[]) ?? [],
    'gjs-styles': (body['gjs-styles'] as unknown[]) ?? [],
    'gjs-assets': (body['gjs-assets'] as unknown[]) ?? [],
  }

  mem.set(keyOf(project, page), payload)
  return NextResponse.json({ ok: true })
}
