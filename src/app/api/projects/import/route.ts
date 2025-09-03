import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import { promises as fs } from 'fs';
import path from 'path';
import { getProjectsByWorkspace, createProject } from '@/lib/db';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PLACEHOLDER_THUMB = '/placeholder-thumb.jpg';

function toTitle(s: string) {
    return s.replace(/[-_]+/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()).trim();
}

function slugify(s: string) {
    return s
        .toLowerCase()
        .trim()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

async function ensureDir(dir: string) {
    await fs.mkdir(dir, { recursive: true });
}
async function safeWrite(root: string, relative: string, buf: Uint8Array | Buffer) {
    // chống zip-slip
    const dest = path.normalize(path.join(root, relative));
    const normRoot = path.normalize(root + path.sep);
    if (!dest.startsWith(normRoot)) throw new Error(`Invalid path in zip: ${relative}`);
    await ensureDir(path.dirname(dest));
    await fs.writeFile(dest, buf);
}

export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const workspace = searchParams.get('workspace');
        if (!workspace) {
            return NextResponse.json({ error: 'Missing required parameter: workspace' }, { status: 400 });
        }

        const form = await request.formData();
        const files = form.getAll('zips') as File[];
        if (!files.length) {
            return NextResponse.json({ error: 'No zip files uploaded' }, { status: 400 });
        }

        logger.info('Importing zips', { route: '/api/projects/import', count: files.length, workspace });

        const existing = await getProjectsByWorkspace(workspace);
        const imported: Array<{
            slug: string;
            name: string;
            exportDir: string;
            thumbUrl: string;
            created: boolean;
        }> = [];

        for (const f of files) {
            const base = f.name.replace(/\.zip$/i, '');
            const slug = slugify(base);
            const outDir = path.join(process.cwd(), 'public', 'projects', workspace, slug);
            const publicPrefix = `/projects/${workspace}/${slug}/`;

            // unzip
            const zip = await JSZip.loadAsync(await f.arrayBuffer());

            await fs.rm(outDir, { recursive: true, force: true });
            await ensureDir(outDir);

            let thumbRel: string | null = null;

            for (const entry of Object.values(zip.files)) {
                if (entry.dir) continue;
                const data = await entry.async('uint8array');
                await safeWrite(outDir, entry.name, data);

                const lower = entry.name.toLowerCase();
                if (!thumbRel && /(thumb|screenshot).*\.(png|jpe?g|webp)$/.test(lower)) thumbRel = entry.name;
                if (!thumbRel && /^img\/.*\.(png|jpe?g|webp)$/.test(lower)) thumbRel = entry.name;
            }

            const thumbUrl = thumbRel ? publicPrefix + thumbRel : PLACEHOLDER_THUMB;

            // create project in DB if not exists (optional, giữ tương thích backend)
            const exists = existing.find((p: any) => p.slug === slug);
            let created = false;
            if (!exists) {
                await createProject(workspace, slug, toTitle(base)).catch(() => void 0);
                created = true;
            }

            imported.push({
                slug,
                name: toTitle(base),
                exportDir: publicPrefix,
                thumbUrl,
                created,
            });

            logger.info('Imported project assets', { slug, workspace, created });
        }

        return NextResponse.json({ imported });
    } catch (error) {
        logger.error('Import failed', {
            route: '/api/projects/import',
            method: 'POST',
            error: error instanceof Error ? error.message : String(error),
        });

        return NextResponse.json(
            { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
