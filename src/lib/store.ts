import type { Workspace } from '@/types/workspace';
import { Project, ProjectStatus } from './types';

// Storage keys
const STORAGE_KEY_WORKSPACES = 'designer-workspaces';
const STORAGE_KEY_PROJECTS = 'designer-projects';

// Default data - initialized only if localStorage is empty
const createDefaultData = () => {
  const defaultWorkspace: Workspace = {
    id: 'default-workspace',
    name: 'Default Workspace',
    role: 'owner',
    createdAt: Date.now(),
  };

  const defaultProjects: Project[] = [
    {
      id: 'sample-project-1',
      workspaceId: 'default-workspace',
      name: 'My First Website',
      slug: 'my-first-website',
      status: 'published',
      thumb: '/demo/Projects-detail.jpg',
      updatedAt: Date.now() - 86400000, // 1 day ago
    },
    {
      id: 'sample-project-2',
      workspaceId: 'default-workspace',
      name: 'Landing Page Draft',
      slug: 'landing-page-draft',
      status: 'draft',
      thumb: '/demo/Projects-Create.jpg',
      updatedAt: Date.now() - 3600000, // 1 hour ago
    },
  ];

  return { workspace: defaultWorkspace, projects: defaultProjects };
};

// In-memory database
export const db = {
  workspaces: [] as Workspace[],
  projects: [] as Project[],
};

// Persistence helpers
function persist(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY_WORKSPACES, JSON.stringify(db.workspaces));
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(db.projects));
  } catch (error) {
    console.warn('Failed to persist data to localStorage:', error);
  }
}

function load(): void {
  if (typeof window === 'undefined') return;

  try {
    const savedWorkspaces = localStorage.getItem(STORAGE_KEY_WORKSPACES);
    const savedProjects = localStorage.getItem(STORAGE_KEY_PROJECTS);

    if (savedWorkspaces && savedProjects) {
      db.workspaces = JSON.parse(savedWorkspaces);
      db.projects = JSON.parse(savedProjects);
    } else {
      const defaultData = createDefaultData();
      db.workspaces = [defaultData.workspace];
      db.projects = [...defaultData.projects];
      persist();
    }
  } catch (error) {
    console.warn('Failed to load data from localStorage, initializing with defaults:', error);
    const defaultData = createDefaultData();
    db.workspaces = [defaultData.workspace];
    db.projects = [...defaultData.projects];
    persist();
  }
}

// Workspace functions
export function listWorkspaces(): Workspace[] {
  return [...db.workspaces];
}

export function createWorkspace(name: string): Workspace {
  const workspace: Workspace = {
    id: `ws-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    name,
    role: 'owner',
    createdAt: Date.now(),
  };

  db.workspaces.push(workspace);
  persist();
  return workspace;
}

export function getWorkspace(id: string): Workspace | undefined {
  return db.workspaces.find(ws => ws.id === id);
}

export function renameWorkspace(id: string, name: string): boolean {
  const workspace = db.workspaces.find(ws => ws.id === id);
  if (workspace) {
    workspace.name = name;
    persist();
    return true;
  }
  return false;
}

export function deleteWorkspace(id: string): boolean {
  const index = db.workspaces.findIndex(ws => ws.id === id);
  if (index !== -1) {
    db.workspaces.splice(index, 1);
    db.projects = db.projects.filter(proj => proj.workspaceId !== id);
    persist();
    return true;
  }
  return false;
}

// Project functions
export function listProjects(filters?: { workspaceId?: string; status?: ProjectStatus }): Project[] {
  let projects = [...db.projects];

  if (filters?.workspaceId) {
    projects = projects.filter(proj => proj.workspaceId === filters.workspaceId);
  }

  if (filters?.status) {
    projects = projects.filter(proj => proj.status === filters.status);
  }

  return projects.sort((a, b) => b.updatedAt - a.updatedAt);
}

export function createProject(data: {
  workspaceId: string;
  name: string;
  slug: string;
  status: ProjectStatus;
  thumb?: string;
}): Project {
  const project: Project = {
    id: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    workspaceId: data.workspaceId,
    name: data.name,
    slug: data.slug,
    status: data.status,
    thumb: data.thumb,
    updatedAt: Date.now(),
  };

  db.projects.push(project);
  persist();
  return project;
}

export function updateProject(id: string, patch: Partial<Omit<Project, 'id' | 'workspaceId'>>): boolean {
  const project = db.projects.find(proj => proj.id === id);
  if (project) {
    Object.assign(project, patch);
    project.updatedAt = Date.now();
    persist();
    return true;
  }
  return false;
}

export function deleteProject(id: string): boolean {
  const index = db.projects.findIndex(proj => proj.id === id);
  if (index !== -1) {
    db.projects.splice(index, 1);
    persist();
    return true;
  }
  return false;
}

// Initialize the store
if (typeof window !== 'undefined') {
  load();
}
