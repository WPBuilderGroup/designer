import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { z } from 'zod'

type DomainRow = {
  id: string
  domain: string
  status: string
  token: string
  verified_at: string | null
}

const BodySchema = z.object({
  projectId: z.string().min(1).optional(),
  hostname: z.string().min(1),
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

  // Parse body safely
  const raw = (await req.json().catch(() => ({}))) as Record<string, unknown>

  const parsed = BodySchema.safeParse({
    projectId: raw.projectId,
    hostname: (raw.hostname as string | undefined) ?? (raw.domain as string | undefined),
  })

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid projectId or hostname' }, { status: 400 })
  }

  const projectId = parsed.data.projectId
  const hostname = normalizeHostname(parsed.data.hostname)

  let pid: string | undefined = projectId
  if (!pid && legacyProjectSlug) {
    const { rows } = await query<{ id: string }>(
      'select id from projects where slug = $1',
      [legacyProjectSlug]
    )
    pid = rows[0]?.id
  }

  if (!pid) {
    return NextResponse.json({ error: 'projectId required' }, { status: 400 })
  }

  // Idempotent insert
  await query(
    `
    insert into domains(project_id, domain)
    values($1, $2)
    on conflict (domain) do nothing
  `,
    [pid, hostname]
  )

  const { rows } = await query<{
    id: string
    domain: string
    status: string
    token: string
  }>(
    'select id, domain, status, token from domains where domain = $1',
    [hostname]
  )

  const row = rows[0]
  if (!row) {
    return NextResponse.json({ error: 'Domain not found' }, { status: 404 })
  }

  const instructions = [
    `Create TXT _verify.${hostname} with value: ${row.token}`,
    `Then CNAME ${hostname} → cname.vercel-dns.com`,
  ]

  return NextResponse.json({
    id: row.id,
    domain: hostname,
    status: row.status,
    verificationToken: row.token,
    instructions,
  })
}
