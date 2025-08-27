'use client'

import { useState } from 'react'
import { Smartphone, Tablet, Monitor, ZoomIn, ZoomOut } from 'lucide-react'

type DeviceType = 'mobile' | 'tablet' | 'desktop'

export function Canvas() {
  const [device, setDevice] = useState<DeviceType>('desktop')
  const [zoom, setZoom] = useState(100)

  const deviceSizes = {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1200, height: 800 },
  }

  const devices = [
    { type: 'mobile' as DeviceType, icon: Smartphone, label: 'Mobile' },
    { type: 'tablet' as DeviceType, icon: Tablet, label: 'Tablet' },
    { type: 'desktop' as DeviceType, icon: Monitor, label: 'Desktop' },
  ]

  const currentSize = deviceSizes[device]
  const scale = zoom / 100

  return (
    <div className="flex-1 bg-gray-100 flex flex-col">
      {/* Canvas Toolbar */}
      <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        {/* Device Selector */}
        <div className="flex items-center space-x-2">
          {devices.map((deviceOption) => (
            <button
              key={deviceOption.type}
              onClick={() => setDevice(deviceOption.type)}
              className={`flex items-center space-x-2 px-3 py-2 rounded text-sm ${
                device === deviceOption.type
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <deviceOption.icon size={16} />
              <span>{deviceOption.label}</span>
            </button>
          ))}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setZoom(Math.max(25, zoom - 25))}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-sm text-gray-600 min-w-[60px] text-center">
            {zoom}%
          </span>
          <button
            onClick={() => setZoom(Math.min(200, zoom + 25))}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
          >
            <ZoomIn size={16} />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
        <div
          className="bg-white shadow-lg border border-gray-300 relative"
          style={{
            width: currentSize.width * scale,
            height: currentSize.height * scale,
            transform: `scale(${scale})`,
            transformOrigin: 'center',
          }}
        >
          {/* Canvas Content */}
          <div className="w-full h-full p-4 overflow-hidden">
            {/* Placeholder Content */}
            <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-lg font-medium mb-2">Drop components here</div>
                <div className="text-sm">Drag elements from the left sidebar to start building</div>
              </div>
            </div>
          </div>

          {/* Selection Indicators */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Example selection box */}
            <div className="absolute top-4 left-4 w-32 h-8 border-2 border-blue-500 bg-blue-100 bg-opacity-20 rounded">
              <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                Text Element
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Footer */}
      <div className="h-8 bg-white border-t border-gray-200 flex items-center justify-between px-4 text-xs text-gray-500">
        <div>
          {currentSize.width} × {currentSize.height}px
        </div>
        <div>
          Ready
        </div>
      </div>
    </div>
  )
}
