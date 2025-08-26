'use client'

import React, { useEffect, useState } from 'react'

type Tab = 'styles' | 'props'

export default function RightSidebar() {
  const [tab, setTab] = useState<Tab>('styles')

  useEffect(() => {
    // re-mount managers whenever we swap tabs (both are always present)
    window.dispatchEvent(new Event('gjs:mount-managers'))
  }, [tab])

  return (
      <aside className="h-full w-[340px] shrink-0 border-l bg-muted/20 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="border-b px-2">
            <div className="flex">
              <button
                  className={`px-3 py-2 text-sm ${tab === 'styles' ? 'font-semibold' : 'opacity-70'}`}
                  onClick={() => setTab('styles')}
              >
                Styles
              </button>
              <button
                  className={`px-3 py-2 text-sm ${tab === 'props' ? 'font-semibold' : 'opacity-70'}`}
                  onClick={() => setTab('props')}
              >
                Properties
              </button>
            </div>
          </div>

          {/* Both containers always exist; we just hide the inactive one */}
          <div className="flex-1 min-h-0">
            <div id="gjs-styles" className={`h-full overflow-auto px-2 ${tab !== 'styles' ? 'hidden' : ''}`} />
            <div id="gjs-traits" className={`h-full overflow-auto px-2 ${tab !== 'props' ? 'hidden' : ''}`} />
          </div>
        </div>
      </aside>
  )
}
