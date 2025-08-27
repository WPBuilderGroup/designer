'use client'

import { useState } from 'react'
type Tab = 'styles' | 'properties'

export default function RightSidebar() {
  const [tab, setTab] = useState<Tab>('styles')

  return (
      <div className="h-full w-[360px] border-l border-border bg-background flex flex-col">
        <div className="h-10 px-3 flex items-center gap-4 border-b border-border text-sm">
          <button className={`h-7 px-2 rounded-md ${tab === 'styles' ? 'bg-muted font-medium' : 'hover:bg-muted'}`}
                  onClick={() => setTab('styles')}>Styles</button>
          <button className={`h-7 px-2 rounded-md ${tab === 'properties' ? 'bg-muted font-medium' : 'hover:bg-muted'}`}
                  onClick={() => setTab('properties')}>Properties</button>
        </div>
        <div className="flex-1 overflow-auto p-3">
          <div id="gjs-styles" className={`${tab === 'styles' ? '' : 'hidden'}`} />
          <div id="gjs-traits" className={`${tab === 'properties' ? '' : 'hidden'}`} />
        </div>
      </div>
  )
}
