import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const workspace = url.searchParams.get('workspace') || ''

  let workspaceId: string | null = null
  if (workspace) {
    const { rows } = await query<{ id: string }>('select id from tenants where slug=$1', [workspace])
    workspaceId = rows[0]?.id || null
  }

  // Defaults for MVP
  const projectsLimit = 5
  const publishLimit = 20

  const { rows: projRows } = await query<{ cnt: number }>(
    workspaceId
      ? 'select count(*)::int as cnt from projects where tenant_id=$1'
      : 'select count(*)::int as cnt from projects',
    workspaceId ? [workspaceId] : []
  )
  const projects = projRows[0]?.cnt ?? 0

  const { rows: pubRows } = await query<{ cnt: number }>(
    workspaceId
      ? `select count(*)::int as cnt from publications p
         join projects pr on pr.id=p.project_id where pr.tenant_id=$1`
      : 'select count(*)::int as cnt from publications',
    workspaceId ? [workspaceId] : []
  )
  const publishCount = pubRows[0]?.cnt ?? 0

  return NextResponse.json({
    projects,
    projectsLimit,
    publishCount,
    publishLimit,
    canPublish: publishCount < publishLimit,
  })
}

