'use client'

import React, { useEffect, useMemo, useState } from 'react'

type DeviceName = 'Desktop' | 'Tablet' | 'Mobile'

export default function Topbar() {
  const [editor, setEditor] = useState<any>(null)
  const [device, setDevice] = useState<DeviceName>('Desktop')

  useEffect(() => {
    const handler = (e: any) => setEditor(e.detail?.editor || (window as any).__gjs)
    // capture editor if CanvasHost already fired
    if ((window as any).__gjs) setEditor((window as any).__gjs)
    window.addEventListener('gjs:ready', handler as any)
    return () => window.removeEventListener('gjs:ready', handler as any)
  }, [])

  const devices: DeviceName[] = useMemo(() => ['Desktop', 'Tablet', 'Mobile'], [])

  useEffect(() => {
    if (!editor) return
    const DM = editor.DeviceManager || editor.Devices
    if (DM?.setDevice) DM.setDevice(device)
  }, [device, editor])

  return (
      <header className="h-11 border-b bg-background px-3 flex items-center gap-2">
        <div className="flex items-center gap-1">
          {devices.map(d => (
              <button
                  key={d}
                  onClick={() => setDevice(d)}
                  className={`px-2.5 py-1.5 text-sm rounded-md ${
                      device === d ? 'bg-muted font-medium' : 'hover:bg-muted/60'
                  }`}
              >
                {d}
              </button>
          ))}
        </div>

        <div className="ml-auto text-xs opacity-70">
          {editor ? 'Editor ready' : 'Connecting…'}
        </div>
      </header>
  )
}
