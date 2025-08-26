// scripts/seed-landing-templates.ts
import * as dotenv from 'dotenv'
import path from 'node:path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { getPool, closePool } from '../src/lib/db'

const previews = [
  '/demo/0b64e28e-8942-4ffe-8102-7cf7d491ca17.png',
  '/demo/29ebac7f-2d59-42b9-96bd-8f134972230b.png',
  '/demo/3ca1938a-24d3-4d65-8154-0e954d0df1cd.png'
]

const templates = [
  {
    name: 'Wedding Landing',
    preview: previews[0],
    html: `<section style="padding:60px;text-align:center;font-family:serif">
             <h1>Caleb & Amaya</h1><p>Our Wedding – Save the Date</p>
             <a href="#" style="padding:10px 16px;border:1px solid #333;border-radius:6px;display:inline-block;margin-top:10px">RSVP</a>
           </section>`,
    css: ``
  },
  {
    name: 'Event Conference',
    preview: previews[1],
    html: `<header style="padding:60px;text-align:center;background:#0e1726;color:#fff">
             <h1>TechConf 2025</h1><p>Join 3,000+ builders</p>
             <a href="#" style="background:#fff;color:#0e1726;padding:10px 16px;border-radius:6px;display:inline-block;margin-top:10px">Get Tickets</a>
           </header>`,
    css: ``
  },
  {
    name: 'SaaS Hero',
    preview: previews[2],
    html: `<section style="padding:80px 20px;max-width:960px;margin:auto;text-align:center">
             <h1 style="font-size:44px">Grow faster with Acme</h1>
             <p>All-in-one analytics and automation</p>
             <div><a href="#" style="padding:10px 16px;border:1px solid #333;border-radius:8px;margin-right:8px;display:inline-block">Start free</a>
             <a href="#" style="padding:10px 16px;border:1px solid #333;border-radius:8px;display:inline-block">Book demo</a></div>
           </section>`,
    css: ``
  }
]

async function run() {
  const pool = getPool()
  for (const t of templates) {
    await pool.query(
        'insert into templates(name, type, gjs_html, gjs_css, gjs_components, gjs_styles, meta) values ($1,$2,$3,$4,$5,$6,$7)',
        [t.name, 'page', t.html, t.css, {}, {}, { preview: t.preview }]
    )
  }
  console.log('Seeded templates:', templates.length)
  await closePool()
}

run().catch(async e => {
  console.error(e)
  await closePool()
})
