import { query } from '@/lib/db'
import DOMPurify from 'isomorphic-dompurify'

export const dynamic = 'force-dynamic'

export default async function Site({ params }: { params: { site: string } }) {
  const site = params.site
  const { rows } = await query(`
    select pub.html, pub.css from publications pub
    join projects p on p.id = pub.project_id
    where p.slug=$1
    order by pub.created_at desc limit 1
  `, [site])
  const html = rows[0]?.html || '<h1>Not published yet</h1>'
  const css = rows[0]?.css || ''
  const { html: sanitizedHtml, css: sanitizedCss } = sanitizeContent(html, css)

  return (
    <html>
      <head><style dangerouslySetInnerHTML={{ __html: sanitizedCss }} /></head>
      <body>
        <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
      </body>
    </html>
  )
}

export function sanitizeContent(html: string, css: string) {
  return {
    html: DOMPurify.sanitize(html),
    css: DOMPurify.sanitize(css, { SAFE_FOR_CSS: true })
  }
}
