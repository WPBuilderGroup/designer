'use client'

import React, { useEffect } from 'react'

export default function LeftSidebar() {
  // Ask CanvasHost to (re)mount when this sidebar renders
  useEffect(() => {
    window.dispatchEvent(new Event('gjs:mount-managers'))
  }, [])

  return (
      <aside className="h-full w-[300px] shrink-0 border-r bg-muted/20 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Pages & Layers */}
          <div className="flex-1 min-h-0">
            <div className="px-3 py-2 text-xs font-semibold uppercase opacity-70">Layers / Pages</div>
            <div id="gjs-layers" className="h-[280px] overflow-auto px-2" />
          </div>

          {/* Blocks */}
          <div className="flex-1 min-h-0 border-t">
            <div className="px-3 py-2 text-xs font-semibold uppercase opacity-70">Blocks</div>
            <div id="gjs-blocks" className="h-full overflow-auto px-2 pb-2" />
          </div>

          {/* Assets */}
          <div className="min-h-[220px] border-t">
            <div className="px-3 py-2 text-xs font-semibold uppercase opacity-70">Assets</div>
            <div id="gjs-assets" className="h-[200px] overflow-auto px-2 pb-2" />
          </div>
        </div>
      </aside>
  )
}
