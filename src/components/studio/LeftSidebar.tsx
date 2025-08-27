'use client'

import { useState } from 'react'
import { Layers as LayersIcon, Images, Blocks as BlocksIcon } from 'lucide-react'

type Tab = 'layers' | 'blocks' | 'assets'

export default function LeftSidebar() {
  const [tab, setTab] = useState<Tab>('layers')

  return (
      <div className="h-full w-[280px] flex">
        {/* Rail */}
        <div className="w-10 bg-sidebar text-sidebar-foreground flex flex-col items-center py-3 gap-3 border-r border-border">
          <button className={`h-8 w-8 rounded-lg flex items-center justify-center hover:bg-muted ${tab === 'layers' ? 'bg-muted' : ''}`}
                  onClick={() => setTab('layers')} title="Pages & Layers">
            <LayersIcon size={18} />
          </button>
          <button className={`h-8 w-8 rounded-lg flex items-center justify-center hover:bg-muted ${tab === 'blocks' ? 'bg-muted' : ''}`}
                  onClick={() => setTab('blocks')} title="Blocks">
            <BlocksIcon size={18} />
          </button>
          <button className={`h-8 w-8 rounded-lg flex items-center justify-center hover:bg-muted ${tab === 'assets' ? 'bg-muted' : ''}`}
                  onClick={() => setTab('assets')} title="Assets">
            <Images size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {/* PAGES + LAYERS */}
          <div className={`h-full overflow-auto p-3 ${tab === 'layers' ? '' : 'hidden'}`}>
            <div id="gjs-pages" className="mb-3" />
            <div id="gjs-layers" className="min-h-[200px]" />
          </div>
          {/* BLOCKS */}
          <div className={`h-full overflow-auto p-3 ${tab === 'blocks' ? '' : 'hidden'}`}>
            <div id="gjs-blocks" className="min-h-[200px]" />
          </div>
          {/* ASSETS */}
          <div className={`h-full overflow-auto p-3 ${tab === 'assets' ? '' : 'hidden'}`}>
            <div id="gjs-assets" className="min-h-[200px]" />
          </div>
        </div>
      </div>
  )
}
