export function uid() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
export function slugify(s: string) {
    return s.toLowerCase().trim()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
