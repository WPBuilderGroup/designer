import { NextRequest, NextResponse } from 'next/server'
import { getProjectsByWorkspace, createProject } from '@/lib/db'
import { safeJson } from '@/lib/api'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workspace = searchParams.get('workspace')

    if (!workspace) {
      return NextResponse.json(
        { error: 'Missing required parameter: workspace' },
        { status: 400 }
      )
    }

    logger.info('Loading projects', { route: '/api/projects', method: 'GET', workspace })

    const projects = await getProjectsByWorkspace(workspace)

    logger.info('Projects loaded', { count: projects.length, workspace })

    return NextResponse.json({ projects })
  } catch (error) {
    logger.error('Failed to load projects', {
      route: '/api/projects',
      method: 'GET',
      error: error instanceof Error ? error.message : String(error),
    })

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workspace = searchParams.get('workspace')

    if (!workspace) {
      return NextResponse.json(
        { error: 'Missing required parameter: workspace' },
        { status: 400 }
      )
    }

    const [body, jsonError] = await safeJson(request)
    if (jsonError) return jsonError

    const { name, slug } = body as { name?: string; slug?: string }

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields: name and slug' },
        { status: 400 }
      )
    }

    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        {
          error: 'Invalid slug format. Use only lowercase letters, numbers, and hyphens.',
        },
        { status: 400 }
      )
    }

    logger.info('Creating project', {
      route: '/api/projects',
      method: 'POST',
      workspace,
      slug,
      name,
    })

    const project = await createProject(workspace, slug, name)

    if (!project) {
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: 500 }
      )
    }

    logger.info('Project created', {
      id: project.id,
      slug: project.slug,
      name: project.name,
      workspace,
    })

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        slug: project.slug,
        name: project.name,
        created_at: project.created_at,
        page_count: 0,
      },
    })
  } catch (error: any) {
    logger.error('Error creating project', {
      route: '/api/projects',
      method: 'POST',
      error: error instanceof Error ? error.message : String(error),
    })

    if (error?.code === '23505') {
      return NextResponse.json(
        { error: 'Project slug already exists in this workspace' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
