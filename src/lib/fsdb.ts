import { promises as fs } from 'fs';
import path from 'path';
import type { Project } from './types';

const DB = path.join(process.cwd(), 'data', 'projects.json');

export async function ensureDb() {
    try { await fs.access(DB); }
    catch {
        await fs.mkdir(path.dirname(DB), { recursive: true });
        await fs.writeFile(DB, JSON.stringify({ projects: [] as Project[] }, null, 2), 'utf8');
    }
}

export async function readProjects(): Promise<Project[]> {
    await ensureDb();
    const raw = await fs.readFile(DB, 'utf8');
    const json = JSON.parse(raw) as { projects: Project[] };
    return json.projects;
}

export async function writeProjects(projects: Project[]) {
    await ensureDb();
    await fs.writeFile(DB, JSON.stringify({ projects }, null, 2), 'utf8');
}
