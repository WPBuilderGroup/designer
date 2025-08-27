import { NextRequest, NextResponse } from 'next/server'
import { getPageData } from '@/lib/db'
import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'
import { safeJson } from '@/lib/api'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const [body, jsonError] = await safeJson(request)
    if (jsonError) return jsonError

    const { project, page } = body as { project?: string; page?: string }

    if (!project || !page) {
      return NextResponse.json(
        { error: 'Missing required fields: project and page' },
        { status: 400 }
      )
    }

    logger.info('Publishing page', { project, page })

    const pageData = await getPageData(project, page)

    if (!pageData) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    const html = generateHTMLDocument(
      pageData.gjs_html || '',
      pageData.gjs_css || '',
      page,
      project
    )

    try {
      const sitesDir = join(process.cwd(), '.next', 'cache', 'sites', project)
      await mkdir(sitesDir, { recursive: true })

      const filename = `${page}.html`
      const filepath = join(sitesDir, filename)
      await writeFile(filepath, html, 'utf8')

      const deploymentUrl = `/sites/${project}/${filename}`

      logger.info('Published successfully', {
        project,
        page,
        deploymentUrl,
      })

      return NextResponse.json({
        success: true,
        deploymentUrl,
        message: 'Page published successfully',
        meta: {
          project,
          page,
          filename,
          publishedAt: new Date().toISOString(),
          size: html.length,
        },
      })
    } catch (fsError) {
      logger.error('File system error', { error: fsError })
      return NextResponse.json(
        { error: 'Failed to write published file' },
        { status: 500 }
      )
    }

  } catch (error) {
    logger.error('Error in POST /api/publish', {
      error: error instanceof Error ? error.message : String(error),
    })

    return NextResponse.json(
      {
        error: 'Failed to publish page',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
