'use client'

import { useState } from 'react'
import { 
  Layout, 
  Type, 
  Image, 
  Square, 
  Circle, 
  MousePointer, 
  Move3D,
  Layers,
  Palette,
  Grid3X3
} from 'lucide-react'

type TabType = 'components' | 'layers' | 'styles'

export function LeftSidebar() {
  const [activeTab, setActiveTab] = useState<TabType>('components')

  const components = [
    { icon: Layout, label: 'Container', type: 'container' },
    { icon: Type, label: 'Text', type: 'text' },
    { icon: Image, label: 'Image', type: 'image' },
    { icon: Square, label: 'Button', type: 'button' },
    { icon: Circle, label: 'Input', type: 'input' },
    { icon: Grid3X3, label: 'Grid', type: 'grid' },
  ]

  const layers = [
    { id: '1', name: 'Header Container', type: 'container', level: 0 },
    { id: '2', name: 'Navigation', type: 'nav', level: 1 },
    { id: '3', name: 'Logo', type: 'image', level: 2 },
    { id: '4', name: 'Menu Items', type: 'list', level: 2 },
    { id: '5', name: 'Hero Section', type: 'section', level: 0 },
    { id: '6', name: 'Title', type: 'text', level: 1 },
  ]

  const tabs = [
    { id: 'components', label: 'Components', icon: Layout },
    { id: 'layers', label: 'Layers', icon: Layers },
    { id: 'styles', label: 'Styles', icon: Palette },
  ]

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm ${
              activeTab === tab.id
                ? 'bg-gray-700 text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'components' && (
          <div className="p-4">
            <h3 className="text-white text-sm font-medium mb-3">Basic Components</h3>
            <div className="space-y-2">
              {components.map((component) => (
                <div
                  key={component.type}
                  className="flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer group"
                  draggable
                >
                  <component.icon size={20} className="text-gray-300 group-hover:text-white" />
                  <span className="text-gray-300 group-hover:text-white text-sm">
                    {component.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'layers' && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white text-sm font-medium">Layers</h3>
              <button className="text-gray-400 hover:text-white">
                <MousePointer size={16} />
              </button>
            </div>
            <div className="space-y-1">
              {layers.map((layer) => (
                <div
                  key={layer.id}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded cursor-pointer group"
                  style={{ paddingLeft: `${12 + layer.level * 16}px` }}
                >
                  <Move3D size={14} className="text-gray-500" />
                  <span className="text-gray-300 group-hover:text-white text-sm flex-1">
                    {layer.name}
                  </span>
                  <span className="text-xs text-gray-500">{layer.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'styles' && (
          <div className="p-4">
            <h3 className="text-white text-sm font-medium mb-3">Quick Styles</h3>
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Background</label>
                <div className="flex space-x-2">
                  <div className="w-6 h-6 bg-red-500 rounded cursor-pointer"></div>
                  <div className="w-6 h-6 bg-blue-500 rounded cursor-pointer"></div>
                  <div className="w-6 h-6 bg-green-500 rounded cursor-pointer"></div>
                  <div className="w-6 h-6 bg-yellow-500 rounded cursor-pointer"></div>
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Text Color</label>
                <div className="flex space-x-2">
                  <div className="w-6 h-6 bg-white rounded cursor-pointer"></div>
                  <div className="w-6 h-6 bg-black rounded cursor-pointer"></div>
                  <div className="w-6 h-6 bg-gray-500 rounded cursor-pointer"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
