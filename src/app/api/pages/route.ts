import { NextRequest, NextResponse } from 'next/server'
import { getPagesByProject, createPage } from '@/lib/db'
import { safeJson } from '@/lib/api'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const project = searchParams.get('project')

    if (!project) {
      return NextResponse.json(
        { error: 'Missing required parameter: project' },
        { status: 400 }
      )
    }

    logger.info(`GET /api/pages - Loading pages for project: ${project}`)

    const pages = await getPagesByProject(project)

    return NextResponse.json({ pages })
  } catch (error) {
    logger.error('Error in GET /api/pages:', error)

    if (error instanceof Error && error.message.includes('Project not found')) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const project = searchParams.get('project')

    if (!project) {
      return NextResponse.json(
        { error: 'Missing required parameter: project' },
        { status: 400 }
      )
    }

    const [body, jsonError] = await safeJson(request)
    if (jsonError) return jsonError

    const { slug } = body as { slug?: string }

    if (!slug) {
      return NextResponse.json(
        { error: 'Missing required field: slug' },
        { status: 400 }
      )
    }

    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        {
          error: 'Invalid slug format. Use only lowercase letters, numbers, and hyphens.'
        },
        { status: 400 }
      )
    }

    logger.info(`POST /api/pages - Creating page: ${slug} in project: ${project}`)

    const page = await createPage(project, slug)

    if (!page) {
      return NextResponse.json(
        { error: 'Failed to create page' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      page: {
        id: page.id,
        slug: page.slug,
        updated_at: page.updated_at,
        has_content: false
      }
    })
  } catch (error: any) {
    logger.error('Error in POST /api/pages:', error)

    if (error?.code === '23505') {
      return NextResponse.json(
        { error: 'Page slug already exists in this project' },
        { status: 409 }
      )
    }

    if (error instanceof Error && error.message.includes('Project not found')) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
