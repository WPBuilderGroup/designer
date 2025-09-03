import { NextRequest, NextResponse } from 'next/server';
import { getProjectsByWorkspace, createProject } from '@/lib/db';
import { safeJson } from '@/lib/api';
import { logger } from '@/lib/logger';

const PLACEHOLDER_THUMB = '/placeholder-thumb.jpg';

function computePublicPaths(workspace: string, slug: string, thumb?: string) {
  // Mọi export được đặt ở: /public/projects/<workspace>/<slug>/
  const exportDir = `/projects/${workspace}/${slug}/`;

  // Nếu DB có lưu thumb dạng tuyệt đối → dùng luôn.
  if (thumb && thumb.startsWith('/')) {
    return { exportDir, thumbUrl: thumb };
  }
  // Nếu DB chỉ lưu tên file → coi như nằm trong exportDir.
  if (thumb && !thumb.startsWith('/')) {
    return { exportDir, thumbUrl: exportDir + thumb };
  }
  // Fallback placeholder.
  return { exportDir, thumbUrl: PLACEHOLDER_THUMB };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspace = searchParams.get('workspace');

    if (!workspace) {
      return NextResponse.json(
          { error: 'Missing required parameter: workspace' },
          { status: 400 }
      );
    }

    logger.info('Loading projects', { route: '/api/projects', method: 'GET', workspace });

    const projects = await getProjectsByWorkspace(workspace);

    const enriched = projects.map((p: any) => {
      const { exportDir, thumbUrl } = computePublicPaths(workspace, p.slug, p.thumb);
      return {
        id: p.id,
        workspaceId: p.workspaceId ?? workspace,
        name: p.name,
        slug: p.slug,
        status: p.status ?? 'published',
        updatedAt: p.updatedAt ?? p.updated_at ?? p.created_at ?? Date.now(),
        // giữ field cũ để tương thích
        thumb: p.thumb,
        // field mới cho UI
        thumbUrl,
        exportDir
      };
    });

    logger.info('Projects loaded', { count: enriched.length, workspace });

    return NextResponse.json({ projects: enriched });
  } catch (error) {
    logger.error('Failed to load projects', {
      route: '/api/projects',
      method: 'GET',
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
        {
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspace = searchParams.get('workspace');

    if (!workspace) {
      return NextResponse.json(
          { error: 'Missing required parameter: workspace' },
          { status: 400 }
      );
    }

    const [body, jsonError] = await safeJson(request);
    if (jsonError) return jsonError;

    const { name, slug } = body as { name?: string; slug?: string };

    if (!name || !slug) {
      return NextResponse.json(
          { error: 'Missing required fields: name and slug' },
          { status: 400 }
      );
    }

    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
          {
            error:
                'Invalid slug format. Use only lowercase letters, numbers, and hyphens.',
          },
          { status: 400 }
      );
    }

    logger.info('Creating project', {
      route: '/api/projects',
      method: 'POST',
      workspace,
      slug,
      name,
    });

    const project = await createProject(workspace, slug, name);

    if (!project) {
      return NextResponse.json(
          { error: 'Failed to create project' },
          { status: 500 }
      );
    }

    const { exportDir, thumbUrl } = computePublicPaths(workspace, project.slug, project.thumb);

    logger.info('Project created', {
      id: project.id,
      slug: project.slug,
      name: project.name,
      workspace,
    });

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        slug: project.slug,
        name: project.name,
        created_at: project.created_at ?? Date.now(),
        page_count: 0,
        // field mới cho UI
        thumbUrl,
        exportDir
      },
    });
  } catch (error: any) {
    logger.error('Error creating project', {
      route: '/api/projects',
      method: 'POST',
      error: error instanceof Error ? error.message : String(error),
    });

    if (error?.code === '23505') {
      return NextResponse.json(
          { error: 'Project slug already exists in this workspace' },
          { status: 409 }
      );
    }

    return NextResponse.json(
        {
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
    );
  }
}
