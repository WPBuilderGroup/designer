// app/api/grapesjs/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { safeJson } from '@/lib/api'

export const dynamic = 'force-dynamic'

interface GrapesJSPayload {
  'gjs-html': string
  'gjs-css': string
  'gjs-components': unknown[]
  'gjs-styles': unknown[]
  'gjs-assets': unknown[]
}

// In-memory storage (temporary; replace with DB layer)
const mem = new Map<string, GrapesJSPayload>()
const keyOf = (project: string | null, page: string | null) =>
  `${project ?? 'unknown'}::${page ?? 'home'}`

const emptyPayload: GrapesJSPayload = {
  'gjs-html': '',
  'gjs-css': '',
  'gjs-components': [],
  'gjs-styles': [],
  'gjs-assets': [],
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const project = sp.get('project')
  const page = sp.get('page')

  const data = mem.get(keyOf(project, page)) ?? emptyPayload

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const [body, jsonError] = await safeJson<Record<string, unknown>>(req)
  if (jsonError) return jsonError

  const sp = req.nextUrl.searchParams
  const project = sp.get('project')
  const page = sp.get('page')

  const payload: GrapesJSPayload = {
    'gjs-html': typeof body['gjs-html'] === 'string' ? body['gjs-html'] : '',
    'gjs-css': typeof body['gjs-css'] === 'string' ? body['gjs-css'] : '',
    'gjs-components': Array.isArray(body['gjs-components']) ? body['gjs-components'] : [],
    'gjs-styles': Array.isArray(body['gjs-styles']) ? body['gjs-styles'] : [],
    'gjs-assets': Array.isArray(body['gjs-assets']) ? body['gjs-assets'] : [],
  }

  mem.set(keyOf(project, page), payload)

  return NextResponse.json({ ok: true })
}
