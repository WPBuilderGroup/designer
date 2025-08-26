'use client'

import { useState } from 'react'
import { ZoomIn, ZoomOut, Maximize2, Ruler } from 'lucide-react'

export default function Canvas() {
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

  return (
    <div className="relative h-full w-full bg-background rounded-md shadow-inner overflow-hidden">
      {/* Floating Toolbar - Top Right */}
      <div 
        className="absolute top-4 right-4 z-10 flex items-center space-x-1 bg-background border border-border rounded-md shadow-lg"
        role="toolbar"
        aria-label="Canvas controls"
      >
        {/* Zoom Out */}
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 25}
          className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-l-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          title="Zoom Out"
          aria-label={`Zoom out (current: ${zoom}%)`}
        >
          <ZoomOut size={16} aria-hidden="true" />
        </button>

        {/* Zoom Level Display */}
        <div 
          className="px-3 py-2 text-xs font-medium text-foreground border-x border-border min-w-[50px] text-center"
          aria-label={`Current zoom level: ${zoom} percent`}
          role="status"
        >
          {zoom}%
        </div>

        {/* Zoom In */}
        <button
          onClick={handleZoomIn}
          disabled={zoom >= 200}
          className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          title="Zoom In"
          aria-label={`Zoom in (current: ${zoom}%)`}
        >
          <ZoomIn size={16} aria-hidden="true" />
        </button>

        <div className="w-px h-6 bg-border" role="separator" aria-orientation="vertical" />

        {/* Fit to Screen */}
        <button
          onClick={handleFitToScreen}
          className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          title="Fit to Screen"
          aria-label="Fit canvas to screen"
        >
          <Maximize2 size={16} aria-hidden="true" />
        </button>

        {/* Toggle Rulers */}
        <button
          onClick={toggleRulers}
          className={`rounded-md px-2.5 py-1.5 text-sm rounded-r-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
            showRulers
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
          title="Toggle Rulers"
          aria-label={`${showRulers ? 'Hide' : 'Show'} rulers`}
          aria-pressed={showRulers}
        >
          <Ruler size={16} aria-hidden="true" />
        </button>
      </div>

      {/* Rulers (if enabled) */}
      {showRulers && (
        <>
          {/* Horizontal Ruler */}
          <div 
            className="absolute top-0 left-8 right-0 h-8 bg-muted border-b border-border flex items-end"
            role="img"
            aria-label="Horizontal ruler"
          >
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="flex-1 relative">
                <div className="absolute bottom-0 left-0 w-px h-2 bg-muted-foreground/50" />
                {i % 5 === 0 && (
                  <div className="absolute bottom-2 left-1 text-xs text-muted-foreground">
                    {i * 100}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Vertical Ruler */}
          <div 
            className="absolute top-8 left-0 bottom-0 w-8 bg-muted border-r border-border flex flex-col items-end"
            role="img"
            aria-label="Vertical ruler"
          >
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="flex-1 relative">
                <div className="absolute bottom-0 right-0 h-px w-2 bg-muted-foreground/50" />
                {i % 5 === 0 && (
                  <div className="absolute bottom-1 right-2 text-xs text-muted-foreground transform -rotate-90 origin-center">
                    {i * 50}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Corner */}
          <div className="absolute top-0 left-0 w-8 h-8 bg-muted border-r border-b border-border" />
        </>
      )}

      {/* Main Canvas Area */}
      <div
        className={`h-full w-full flex items-center justify-center ${
          showRulers ? 'pt-8 pl-8' : ''
        }`}
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'center center'
        }}
      >
        {/* Canvas Content Area */}
        <div 
          className="w-full max-w-4xl h-full bg-card border border-border shadow-lg rounded-md"
          role="main"
          aria-label="Design canvas"
          tabIndex={0}
        >
          {/* Placeholder Content */}
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="text-lg font-medium mb-2 text-foreground">Your Design Canvas</div>
              <div className="text-sm">Start building your page here</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
