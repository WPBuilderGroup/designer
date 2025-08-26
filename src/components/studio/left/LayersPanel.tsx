'use client'

import { Layers } from 'lucide-react'

export default function LayersPanel() {
  return (
    <div className="p-4">
      <div className="border-b border-border pb-2 mb-4">
        <h3 className="text-xs uppercase tracking-wide font-medium text-muted-foreground">Layer Tree</h3>
      </div>
      <div className="flex items-center justify-center h-32 border-2 border-dashed border-border rounded-md">
        <div className="text-center">
          <Layers size={24} className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No layers</p>
          <p className="text-xs text-muted-foreground/70">Select elements to see layers</p>
        </div>
      </div>
    </div>
  )
}
