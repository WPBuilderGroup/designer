import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { query } from '@/lib/db'

type DomainRow = {
  id: string
  domain: string
  status: string
  token: string
  verified_at: string | null
}

const BodySchema = z.object({
  projectId: z.string().uuid().optional(),
  hostname: z.string().min(1).optional(),
  domain: z.string().min(1).optional(),
})

function normalizeHostname(raw: string): string {
  let h = raw.trim().toLowerCase()
  h = h.replace(/^https?:\/\//, '')
  h = h.split('/')[0].split('?')[0]
  h = h.replace(/\.$/, '')
  return h
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const project = url.searchParams.get('project') || ''

  const { rows } = await query<DomainRow>(
    `
    select d.id, d.domain, d.status, d.token, d.verified_at
    from domains d
    join projects p on p.id = d.project_id
    where p.slug = $1
    order by d.domain
  `,
    [project]
  )

  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url)
  const legacyProjectSlug = url.searchParams.get('project') || ''
  const body = await req.json().catch(() => ({}))

  const parsed = BodySchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid projectId or hostname/domain' }, { status: 400 })
  }

  const hostnameInput = parsed.data.hostname || parsed.data.domain
  if (!hostnameInput) {
    return NextResponse.json({ error: 'hostname or domain required' }, { status: 400 })
  }

  const normalizedHostname = normalizeHostname(hostnameInput)
  let projectId = parsed.data.projectId

  if (!projectId && legacyProjectSlug) {
    const { rows } = await query<{ id: string }>(
      'select id from projects where slug = $1',
      [legacyProjectSlug]
    )
    projectId = rows[0]?.id
  }

  if (!projectId) {
    return NextResponse.json({ error: 'projectId required' }, { status: 400 })
  }

  // Insert domain (idempotent)
  await query(
    `
    insert into domains(project_id, domain)
    values($1, $2)
    on conflict (domain) do nothing
  `,
    [projectId, normalizedHostname]
  )

  const { rows } = await query<{
    id: string
    domain: string
    status: string
    token: string
  }>(
    'select id, domain, status, token from domains where domain = $1',
    [normalizedHostname]
  )

  const row = rows[0]
  if (!row) {
    return NextResponse.json({ error: 'Domain not found' }, { status: 404 })
  }

  const instructions = [
    `Create TXT record: _verify.${normalizedHostname} with value: ${row.token}`,
    `Then set CNAME: ${normalizedHostname} → cname.vercel-dns.com`,
  ]

  return NextResponse.json({
    id: row.id,
    domain: normalizedHostname,
    status: row.status,
    verificationToken: row.token,
    instructions,
  })
}
