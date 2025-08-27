import { query } from '@/lib/db'

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

  return (
    <html>
      <head><style dangerouslySetInnerHTML={{ __html: css }} /></head>
      <body>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </body>
    </html>
  )
}
