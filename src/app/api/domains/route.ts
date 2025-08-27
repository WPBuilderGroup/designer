import { NextRequest, NextResponse } from 'next/server'
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
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
  const projectId: string | undefined = body.projectId as string | undefined
  const hostname: string | undefined =
    (body.hostname as string | undefined) || (body.domain as string | undefined)

  // Resolve project id
  let pid = projectId as string | undefined
  if (!pid && legacyProjectSlug) {
    const { rows } = await query('select id from projects where slug=$1', [legacyProjectSlug])
    pid = rows[0]?.id
  }
  if (!pid || !hostname) return NextResponse.json({ error: 'projectId and hostname required' }, { status: 400 })

  await query(
    `insert into domains(project_id, domain)
     values($1, $2)
     on conflict (domain) do nothing`,
    [pid, hostname]
  )

  const { rows } = await query('select id, domain, status, token from domains where domain=$1', [hostname])
  const row = rows[0]

  const instructions = [
    `Create TXT _verify.${hostname} with value: ${row.token}`,
    `Then CNAME ${hostname} → cname.vercel-dns.com`
  ]

  return NextResponse.json({ id: row.id, verificationToken: row.token, instructions })
}
