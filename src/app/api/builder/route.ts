import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// In-memory storage for demo; replace with DB layer
const mem = new Map<string, any>()
const keyOf = (project: string|null, page: string|null) => `${project ?? 'unknown'}::${page ?? 'home'}`

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const project = sp.get('project')
  const page = sp.get('page')
  const data = mem.get(keyOf(project, page)) ?? {}

  return NextResponse.json({
    'gjs-html': data['gjs-html'] ?? '',
    'gjs-css': data['gjs-css'] ?? '',
    'gjs-components': data['gjs-components'] ?? [],
    'gjs-styles': data['gjs-styles'] ?? [],
    'gjs-assets': data['gjs-assets'] ?? [],
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const sp = req.nextUrl.searchParams
  const project = sp.get('project')
  const page = sp.get('page')

  // Normalize payload shape
  const payload = {
    'gjs-html': body['gjs-html'] ?? '',
    'gjs-css': body['gjs-css'] ?? '',
    'gjs-components': body['gjs-components'] ?? [],
    'gjs-styles': body['gjs-styles'] ?? [],
    'gjs-assets': body['gjs-assets'] ?? [],
  }

  mem.set(keyOf(project, page), payload)
  return NextResponse.json({ ok: true })
}
