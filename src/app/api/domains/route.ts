import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { z } from 'next/dist/compiled/zod'

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
  const rawBody: unknown = await req.json().catch(() => ({}))
  const body = rawBody as Record<string, unknown>

  const BodySchema = z.object({
    projectId: z.string().uuid().optional(),
    hostname: z.string().min(1)
  })

  const parsed = BodySchema.safeParse({
    projectId: body.projectId,
    hostname: (body.hostname as string | undefined) || (body.domain as string | undefined)
  })

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid projectId or hostname' }, { status: 400 })
  }

  const { projectId, hostname } = parsed.data

  // Resolve project id
  let pid: string | undefined = projectId
  if (!pid && legacyProjectSlug) {
    const { rows } = await query('select id from projects where slug=$1', [legacyProjectSlug])
    pid = rows[0]?.id
  }
  if (!pid) {
    return NextResponse.json({ error: 'projectId required' }, { status: 400 })
  }

  await query(
    `insert into domains(project_id, domain)
     values($1, $2)
     on conflict (domain) do nothing`,
    [pid, hostname]
  )

  const { rows } = await query('select id, domain, status, token from domains where domain=$1', [hostname])
  const row = rows[0]
  if (!row) {
    return NextResponse.json({ error: 'Domain not found' }, { status: 404 })
  }

  const instructions = [
    `Create TXT _verify.${hostname} with value: ${row.token}`,
    `Then CNAME ${hostname} → cname.vercel-dns.com`
  ]

  return NextResponse.json({ id: row.id, verificationToken: row.token, instructions })
}
