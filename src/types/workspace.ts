export interface Workspace {
    id: string;
    name: string;
    role?: 'owner' | 'admin' | 'member';
    createdAt: number;
}
