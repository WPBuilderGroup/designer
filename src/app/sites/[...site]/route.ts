import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { resolve, relative, isAbsolute } from 'path'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ site: string[] }> }
) {
  const resolvedParams = await params;
  try {
    const sitePath = resolvedParams.site

    if (!sitePath || sitePath.length < 2) {
      return new NextResponse('Invalid site path', { status: 400 })
    }

    const [project, filename] = sitePath

    const isValidSegment = (segment: string) =>
      /^[a-zA-Z0-9._-]+$/.test(segment) && !segment.includes('..')

    if (!isValidSegment(project) || !isValidSegment(filename)) {
      return new NextResponse('Invalid site path', { status: 400 })
    }

    const baseDir = resolve(process.cwd(), '.next', 'cache', 'sites')
    const filepath = resolve(baseDir, project, filename)
    const relativePath = relative(baseDir, filepath)

    if (relativePath.startsWith('..') || isAbsolute(relativePath)) {
      return new NextResponse('Invalid site path', { status: 400 })
    }

    try {
      const content = await readFile(filepath, 'utf8')

      return new NextResponse(content, {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=3600',
          'X-Generated-By': 'Designer Studio'
        }
      })
    } catch {
      return new NextResponse('Site not found', { status: 404 })
    }

  } catch (error) {
    console.error('Error serving site:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
