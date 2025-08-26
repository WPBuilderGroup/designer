'use client'

import { useState } from 'react'
import { ZoomIn, ZoomOut, Maximize2, Ruler } from 'lucide-react'

export default function CanvasToolbar() {
  const [zoom, setZoom] = useState(100)
  const [showRulers, setShowRulers] = useState(false)

  const handleZoomIn = () => {
    setZoom(prev => Math.min(200, prev + 25))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(25, prev - 25))
  }

  const handleFitToScreen = () => {
    setZoom(100)
  }

  const toggleRulers = () => {
    setShowRulers(prev => !prev)
  }

  return {
    zoom,
    showRulers,
    toolbar: (
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-1 bg-background border border-border rounded-md shadow-lg">
        {/* Zoom Out */}
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 25}
          className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-l-md disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>

        {/* Zoom Level Display */}
        <div className="px-3 py-2 text-xs font-medium text-foreground border-x border-border min-w-[50px] text-center">
          {zoom}%
        </div>

        {/* Zoom In */}
        <button
          onClick={handleZoomIn}
          disabled={zoom >= 200}
          className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>

        <div className="w-px h-6 bg-border" />

        {/* Fit to Screen */}
        <button
          onClick={handleFitToScreen}
          className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
          title="Fit to Screen"
        >
          <Maximize2 size={16} />
        </button>

        {/* Toggle Rulers */}
        <button
          onClick={toggleRulers}
          className={`rounded-md px-2.5 py-1.5 text-sm rounded-r-md ${
            showRulers
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
          title="Toggle Rulers"
        >
          <Ruler size={16} />
        </button>
      </div>
    )
  }
}
