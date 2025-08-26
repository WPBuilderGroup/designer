'use client'

import { Save, Eye, Settings, Undo, Redo, Download, Upload } from 'lucide-react'

export function Topbar() {
  return (
    <div className="h-14 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-4">
      {/* Logo và Project Info */}
      <div className="flex items-center space-x-4">
        <div className="text-white font-semibold text-lg">
          UI Builder
        </div>
        <div className="text-gray-400 text-sm">
          Untitled Project
        </div>
      </div>

      {/* Toolbar Actions */}
      <div className="flex items-center space-x-2">
        {/* Undo/Redo */}
        <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded">
          <Undo size={16} />
        </button>
        <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded">
          <Redo size={16} />
        </button>
        
        <div className="w-px h-6 bg-gray-600 mx-2" />
        
        {/* Import/Export */}
        <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded">
          <Upload size={16} />
        </button>
        <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded">
          <Download size={16} />
        </button>
        
        <div className="w-px h-6 bg-gray-600 mx-2" />
        
        {/* Preview */}
        <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
          <Eye size={16} />
          <span>Preview</span>
        </button>
        
        {/* Save */}
        <button className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm">
          <Save size={16} />
          <span>Save</span>
        </button>
        
        {/* Settings */}
        <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded">
          <Settings size={16} />
        </button>
      </div>
    </div>
  )
}
