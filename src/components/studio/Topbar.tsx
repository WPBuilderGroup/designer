'use client'

import { useMemo, useState } from 'react'
import { Monitor, Tablet, Smartphone, ChevronDown, Undo2, Redo2, Eye, Upload } from 'lucide-react'

type DeviceType = 'Desktop' | 'Tablet' | 'Mobile'
type TopbarProps = { onPublish?: () => void }

const DEVICES: { name: DeviceType; icon: React.ComponentType<{ size?: number }> }[] = [
  { name: 'Desktop', icon: Monitor },
  { name: 'Tablet', icon: Tablet },
  { name: 'Mobile', icon: Smartphone },
]

export default function Topbar({ onPublish }: TopbarProps) {
  const [selected, setSelected] = useState<DeviceType>('Desktop')
  const DeviceIcon = useMemo(
      () => DEVICES.find(d => d.name === selected)?.icon ?? Monitor,
      [selected]
  )

  const emit = (name: string, detail: any = {}) => {
    if (typeof window === 'undefined') return
    window.dispatchEvent(new CustomEvent(name, { detail }))
  }

  const handleDevice = (d: DeviceType) => {
    setSelected(d)
    emit('gjs:set-device', { name: d })
  }

  return (
      <div className="h-10 w-full border-b border-border bg-background px-3 flex items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-1">
          <button className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={() => emit('gjs:cmd', { name: 'core:undo' })} aria-label="Undo">
            <Undo2 size={16} />
          </button>
          <button className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={() => emit('gjs:cmd', { name: 'core:redo' })} aria-label="Redo">
            <Redo2 size={16} />
          </button>
          <div className="w-px h-6 bg-border mx-2" />
          <button className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={() => emit('gjs:preview-toggle')} aria-label="Preview">
            <Eye size={16} />
          </button>
        </div>

        <div className="relative">
          <button
              onClick={() => emit('gjs:toggle-device-menu')}
              className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm bg-muted hover:bg-muted/80 font-medium text-foreground"
          >
            <DeviceIcon size={16} />
            <span>{selected}</span>
            <ChevronDown size={14} />
          </button>
          {/* hidden helper để IDE không phàn nàn; thay đổi device vẫn qua emit */}
          <div className="hidden">
            {DEVICES.map(d => (
                <button key={d.name} onClick={() => handleDevice(d.name)} />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
              className="rounded-md px-2.5 py-1.5 text-sm bg-primary text-primary-foreground hover:opacity-90"
              onClick={() => (onPublish ? onPublish() : emit('gjs:publish'))}
          >
          <span className="inline-flex items-center gap-2">
            <Upload size={16} /> Publish
          </span>
          </button>
        </div>
      </div>
  )
}
