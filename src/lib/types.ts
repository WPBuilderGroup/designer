// src/lib/types.ts

export interface Workspace {
  id: string;
  name: string;
  role?: 'owner' | 'admin' | 'member';
  createdAt: number;
}

export type ProjectStatus = 'draft' | 'published';

export type Project = {
  id: string;
  workspaceId: string;

  name: string;
  slug: string;

  status: ProjectStatus;

  /**
   * Thời điểm cập nhật gần nhất (ms)
   */
  updatedAt: number;

  /**
   * (cũ) 1 số chỗ trong app có thể đang dùng
   * ví dụ: '/projects/<slug>/thumb.jpg'
   */
  thumb?: string;

  /**
   * (mới) dùng cho màn Projects + import/seed
   * URL public của thumbnail, VD: '/projects/<slug>/thumb.jpg'
   */
  thumbUrl?: string;

  /**
   * (mới) thư mục public chứa export, VD: '/projects/<slug>/'
   */
  exportDir?: string;
};
