import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  const host = req.headers.get('host') || ''
  const base = process.env.PUBLIC_BASE_DOMAIN || 'pages.localtest.me'

  // If host is like {site}.{base}
  if (host.endsWith(base)) {
    const site = host.slice(0, -base.length).replace(/\.$/, '')
    if (site && site !== 'www') {
      // Rewrite to public site route
      url.pathname = `/_sites/${site}`
      return NextResponse.rewrite(url)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
