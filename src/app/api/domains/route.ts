import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { query } from '@/lib/db'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const project = url.searchParams.get('project') || ''
  const { rows } = await query(`
    select d.id, d.domain, d.status, d.token, d.verified_at
    from domains d
    join projects p on p.id = d.project_id
    where p.slug=$1
    order by d.domain
  `, [project])
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url)
  const legacyProjectSlug = url.searchParams.get('project') || ''
  const body = await req.json().catch(() => ({} as any))

  const BaseSchema = z.object({
    projectId: z.string().uuid().optional(),
    hostname: z.string().min(1).optional(),
    domain: z.string().min(1).optional(),
  })
  const parsed = BaseSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid projectId or hostname' }, { status: 400 })
  }

  let { projectId: pid, hostname } = {
    projectId: parsed.data.projectId,
    hostname: parsed.data.hostname || parsed.data.domain,
  }

  // Resolve project id
  if (!pid && legacyProjectSlug) {
    const { rows } = await query('select id from projects where slug=$1', [legacyProjectSlug])
    pid = rows[0]?.id
  }

  const FinalSchema = z.object({
    projectId: z.string().uuid(),
    hostname: z.string().min(1),
  })
  const result = FinalSchema.safeParse({ projectId: pid, hostname })
  if (!result.success) {
    return NextResponse.json({ error: 'projectId and hostname required' }, { status: 400 })
  }

  const { projectId, hostname: host } = result.data

  await query(
    `insert into domains(project_id, domain)
     values($1, $2)
     on conflict (domain) do nothing`,
    [projectId, host],
  )

  const { rows } = await query('select id, domain, status, token from domains where domain=$1', [host])
  const row = rows[0]
  if (!row) {
    return NextResponse.json({ error: 'domain not found' }, { status: 404 })
  }

  const instructions = [
    `Create TXT _verify.${host} with value: ${row.token}`,
    `Then CNAME ${host} → cname.vercel-dns.com`,
  ]

  return NextResponse.json({ id: row.id, verificationToken: row.token, instructions })
}
