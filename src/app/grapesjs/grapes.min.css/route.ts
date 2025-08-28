import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { resolve } from 'path'

export async function GET() {
  try {
    const cssPath = resolve(process.cwd(), 'node_modules', 'grapesjs', 'dist', 'css', 'grapes.min.css')
    const css = await readFile(cssPath, 'utf8')
    return new NextResponse(css, {
      status: 200,
      headers: {
        'Content-Type': 'text/css; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (err) {
    return new NextResponse('/* grapes.min.css not found */', { status: 404, headers: { 'Content-Type': 'text/css' } })
  }
}

