import { NextRequest, NextResponse } from 'next/server'
import { query, Project, PageData } from '@/lib/db'

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: idOrSlug } = await context.params
  // Try by UUID first, then by slug
  const { rows: projRows } = await query<Project>(
    `select id, slug, name, created_at from projects where id::text=$1 or slug=$1 limit 1`,
    [idOrSlug]
  )
  const project = projRows[0]
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { rows: pages } = await query<Pick<PageData, 'id' | 'slug' | 'updated_at'>>(
    `select id, slug, updated_at from pages where project_id=$1 order by updated_at desc`,
    [project.id]
  )

  return NextResponse.json({ project, pages })
}
