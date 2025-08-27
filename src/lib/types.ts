export type Workspace = {
  id: string;
  name: string;
  role?: 'owner' | 'admin' | 'member';
  createdAt: number;
};

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
