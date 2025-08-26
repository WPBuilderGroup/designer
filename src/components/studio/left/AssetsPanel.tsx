'use client'

import { Upload, ImageIcon } from 'lucide-react'

export default function AssetsPanel() {
  const sampleAssets = [
    { id: '1', name: 'hero-image.jpg', type: 'image' },
    { id: '2', name: 'logo.png', type: 'image' },
    { id: '3', name: 'background.jpg', type: 'image' },
    { id: '4', name: 'avatar.png', type: 'image' },
  ]

  return (
    <div className="p-4 space-y-4">
      <div className="border-b border-border pb-2">
        <h3 className="text-xs uppercase tracking-wide font-medium text-muted-foreground">Assets</h3>
      </div>

      {/* Upload Button */}
      <button className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-border rounded-md hover:border-primary hover:bg-primary/5 transition-colors">
        <Upload size={16} className="text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Upload Assets</span>
      </button>

      {/* Assets Grid */}
      <div className="grid grid-cols-2 gap-3">
        {sampleAssets.map((asset) => (
          <div
            key={asset.id}
            className="group relative aspect-square bg-muted rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-ring"
          >
            {/* Placeholder image */}
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center">
              <ImageIcon size={20} className="text-muted-foreground" />
            </div>
            
            {/* Asset name */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {asset.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
