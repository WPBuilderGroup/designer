'use client';

import { useState } from 'react';
import type { Editor } from 'grapesjs';
import { Undo, Redo, Eye, Monitor, Tablet, Smartphone, ChevronDown } from 'lucide-react';

type DeviceType = 'Desktop' | 'Tablet' | 'Mobile';

interface TopbarProps {
  editor?: Editor | null;
  onPublish?: () => void;
}

const DEVICES: ReadonlyArray<{ name: DeviceType; icon: any }> = [
  { name: 'Desktop', icon: Monitor },
  { name: 'Tablet',  icon: Tablet },
  { name: 'Mobile',  icon: Smartphone },
];

export default function Topbar({ editor, onPublish }: TopbarProps) {
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('Desktop');
  const [open, setOpen] = useState(false);

  const DeviceIcon = (DEVICES.find(d => d.name === selectedDevice)?.icon) ?? Monitor;

  const setDevice = (name: DeviceType) => {
    setSelectedDevice(name);
    try { (editor as any)?.setDevice?.(name); } catch {}
    setOpen(false);
  };

  const run = (id: string) => {
    try {
      (editor as any)?.runCommand?.(id) || (editor as any)?.Commands?.run?.(id);
    } catch {}
  };

  return (
    <div className="h-10 border-b bg-background px-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
          onClick={() => run('core:undo')}
          aria-label="Undo"
        >
          <Undo size={16} />
        </button>
        <button
          className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
          onClick={() => run('core:redo')}
          aria-label="Redo"
        >
          <Redo size={16} />
        </button>
        <span className="w-px h-6 bg-border mx-2" />
        <button
          className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
          onClick={() => run('core:preview')}
          aria-label="Preview"
        >
          <Eye size={16} />
        </button>
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm bg-muted hover:bg-muted/80 font-medium text-foreground"
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <DeviceIcon size={16} />
          <span>{selectedDevice}</span>
          <ChevronDown size={14} />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 z-50 min-w-40 rounded-md border bg-popover shadow">
            {DEVICES.map(d => {
              const Icon = d.icon;
              return (
                <button
                  key={d.name}
                  onClick={() => setDevice(d.name)}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 hover:bg-muted"
                >
                  <Icon size={16} />
                  <span>{d.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onPublish}
          className="rounded-md px-3 py-1.5 text-sm bg-primary text-primary-foreground hover:opacity-90"
        >
          Publish
        </button>
      </div>
    </div>
  );
}
