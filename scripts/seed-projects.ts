import * as dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { createProject } from '../src/lib/db';
import { logger } from '../src/lib/logger';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SEEDS = [
  'gjs-export_1756352980361.zip',
  'gjs-export_1756353025189.zip',
  'gjs-export_1756353063035.zip',
];

const WORKSPACE = process.env.SEED_WORKSPACE || 'default-workspace';

function toTitle(s: string) {
    return s.replace(/[-_]+/g, ' ').replace(/\b\w/g, m => m.toUpperCase()).trim();
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function main() {
  for (const name of SEEDS) {
    const filePath = path.join(process.cwd(), 'scripts', 'seeds', name);
    const buf = await fs.readFile(filePath);
    const zip = await JSZip.loadAsync(buf);

    const base = path.basename(name, '.zip');
    const slug = slugify(base);
    const outDir = path.join(process.cwd(), 'public', 'projects', WORKSPACE, slug);
    const publicPrefix = `/projects/${WORKSPACE}/${slug}/`;

    await fs.rm(outDir, { recursive: true, force: true });
    await fs.mkdir(outDir, { recursive: true });

    let thumbRel: string | null = null;

    for (const entry of Object.values(zip.files)) {
      if (entry.dir) continue;
      const data = await entry.async('uint8array');
      // Zip-slip guard
      const dest = path.normalize(path.join(outDir, entry.name));
      const normRoot = path.normalize(outDir + path.sep);
      if (!dest.startsWith(normRoot)) throw new Error(`Invalid path in zip: ${entry.name}`);
      await fs.mkdir(path.dirname(dest), { recursive: true });
      await fs.writeFile(dest, data);

      const lower = entry.name.toLowerCase();
      if (!thumbRel && /(thumb|screenshot).*\.(png|jpe?g|webp)$/.test(lower)) thumbRel = entry.name;
      if (!thumbRel && /^img\/.*\.(png|jpe?g|webp)$/.test(lower)) thumbRel = entry.name;
    }

    // Ensure project exists in DB (tenant auto-created if needed)
    await createProject(WORKSPACE, slug, toTitle(base)).catch(() => void 0);

    logger.info('Seeded project assets', {
      slug,
      workspace: WORKSPACE,
      exportDir: publicPrefix,
      thumbUrl: thumbRel ? publicPrefix + thumbRel : '/placeholder-thumb.jpg',
    });
  }

  console.log(`✅ Seeded ${SEEDS.length} projects from scripts/seeds/*.zip into public/projects/${WORKSPACE}/ and DB`);
}

main().catch(err => { console.error(err); process.exit(1); });
