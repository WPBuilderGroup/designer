import { NextRequest, NextResponse } from 'next/server'
import { getProjectsByWorkspace, createProject } from '@/lib/db'

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

    console.log(`GET /api/projects - Loading projects for workspace: ${workspace}`)

    const projects = await getProjectsByWorkspace(workspace)

    console.log(`Found ${projects.length} projects for workspace: ${workspace}`)
    return NextResponse.json({ projects })

  } catch (error) {
    console.error('Error in GET /api/projects:', error)
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
    const workspace = searchParams.get('workspace')
    
    if (!workspace) {
      return NextResponse.json(
        { error: 'Missing required parameter: workspace' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { name, slug } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields: name and slug' },
        { status: 400 }
      )
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        { error: 'Invalid slug format. Use only lowercase letters, numbers, and hyphens.' },
        { status: 400 }
      )
    }

    console.log(`POST /api/projects - Creating project: ${slug} in workspace: ${workspace}`)

    const project = await createProject(workspace, slug, name)

    if (!project) {
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: 500 }
      )
    }

    console.log(`Project created successfully: ${project.slug}`)

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        slug: project.slug,
        name: project.name,
        created_at: project.created_at,
        page_count: 0
      }
    })

  } catch (error) {
    console.error('Error in POST /api/projects:', error)
    
    // Handle specific database errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { error: 'Project slug already exists in this workspace' },
          { status: 409 }
        )
      }
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
