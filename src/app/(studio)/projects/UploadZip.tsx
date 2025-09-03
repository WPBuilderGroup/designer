'use client';

import { useRef, useState } from 'react';
import Button from '../../../components/ui/Button';
import { listProjects, createProject } from '../../../lib/store';

type Props = {
    workspaceId: string | null;
    onDone?: () => void;
};

type ImportedItem = { slug: string; name: string; thumbRel?: string };

export default function UploadZip({ workspaceId, onDone }: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [busy, setBusy] = useState(false);

    const pick = () => inputRef.current?.click();

    const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || !files.length || !workspaceId) return;

        const form = new FormData();
        Array.from(files).forEach((f) => form.append('zips', f));

        setBusy(true);
        try {
            const res = await fetch(
                `/api/projects/import?workspace=${encodeURIComponent(workspaceId)}`,
                { method: 'POST', body: form }
            );

            const data = (await res.json().catch(() => ({}))) as { imported?: ImportedItem[]; error?: string; message?: string };

            if (!res.ok) {
                alert(data?.error || data?.message || 'Import failed');
                return;
            }

            // Tạo project mới trong local store nếu chưa tồn tại
            const current = listProjects({ workspaceId });
            const existingSlugs = new Set(current.map((p) => p.slug));

            (data.imported || []).forEach((it) => {
                if (!existingSlugs.has(it.slug)) {
                    // createProject(workspaceId, slug, name)
                    createProject(workspaceId, it.slug, it.name);
                }
            });

            onDone?.(); // refresh list ở page.tsx
        } finally {
            setBusy(false);
            if (inputRef.current) inputRef.current.value = ''; // reset input
        }
    };

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept=".zip"
                multiple
                hidden
                onChange={onChange}
            />
            <Button
                variant="outline"
                size="sm"
                onClick={pick}
                disabled={!workspaceId || busy}
            >
                {busy ? 'Importing…' : 'Import .zip'}
            </Button>
        </>
    );
}
