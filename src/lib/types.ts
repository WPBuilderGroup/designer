export type { Workspace } from '../types/workspace';

export type ProjectStatus = 'draft' | 'published';

export type Project = {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  status: ProjectStatus;
  thumb?: string;
  updatedAt: number;
};
