import { query } from '@/lib/db'
import { sanitizeHtml, sanitizeCss } from '@/lib/sanitize'

export const dynamic = 'force-dynamic'

export default async function Site({ params }: { params: { site: string } }) {
  const site = params.site

  const { rows } = await query<{ html: string | null; css: string | null }>(
    `
    SELECT pub.html, pub.css
    FROM publications pub
    JOIN projects p ON p.id = pub.project_id
    WHERE p.slug = $1
    ORDER BY pub.created_at DESC
    LIMIT 1
  `,
    [site]
  )

  const rawHtml = rows[0]?.html || '<h1>Not published yet</h1>'
  const rawCss = rows[0]?.css || ''

  const sanitizedHtml = sanitizeHtml(rawHtml)
  const sanitizedCss = sanitizeCss(rawCss)

  return (
    <html>
      <head>
        <style dangerouslySetInnerHTML={{ __html: sanitizedCss }} />
      </head>
      <body>
        <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
      </body>
    </html>
  )
}
