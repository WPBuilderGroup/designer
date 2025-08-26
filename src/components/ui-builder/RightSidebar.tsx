'use client'

import { useState } from 'react'
import { 
  Settings, 
  Paintbrush, 
  Layout, 
  Type,
  Palette,
  Box,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Move
} from 'lucide-react'

type RightTabType = 'properties' | 'styles' | 'settings'

export function RightSidebar() {
  const [activeTab, setActiveTab] = useState<RightTabType>('properties')
  const [selectedElement, setSelectedElement] = useState('Text Element')

  const tabs = [
    { id: 'properties', label: 'Properties', icon: Settings },
    { id: 'styles', label: 'Styles', icon: Paintbrush },
    { id: 'settings', label: 'Settings', icon: Layout },
  ]

  return (
    <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as RightTabType)}
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
        {activeTab === 'properties' && (
          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-white text-sm font-medium mb-2">Selected Element</h3>
              <div className="bg-gray-700 p-3 rounded">
                <div className="text-blue-400 text-sm font-medium">{selectedElement}</div>
                <div className="text-gray-400 text-xs">div.text-element</div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Basic Properties */}
              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 block">Content</label>
                <textarea
                  className="w-full bg-gray-700 text-white p-2 rounded text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
                  rows={3}
                  placeholder="Enter text content..."
                  defaultValue="Hello World"
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 block">ID</label>
                <input
                  type="text"
                  className="w-full bg-gray-700 text-white p-2 rounded text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="element-id"
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 block">Classes</label>
                <input
                  type="text"
                  className="w-full bg-gray-700 text-white p-2 rounded text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="class1 class2"
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 block">Link URL</label>
                <input
                  type="url"
                  className="w-full bg-gray-700 text-white p-2 rounded text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'styles' && (
          <div className="p-4 space-y-6">
            {/* Typography */}
            <div>
              <h4 className="text-white text-sm font-medium mb-3 flex items-center">
                <Type size={16} className="mr-2" />
                Typography
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Font Family</label>
                  <select className="w-full bg-gray-700 text-white p-2 rounded text-sm border border-gray-600">
                    <option>Inter</option>
                    <option>Arial</option>
                    <option>Helvetica</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Size</label>
                    <input
                      type="number"
                      className="w-full bg-gray-700 text-white p-2 rounded text-sm border border-gray-600"
                      defaultValue="16"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Weight</label>
                    <select className="w-full bg-gray-700 text-white p-2 rounded text-sm border border-gray-600">
                      <option>400</option>
                      <option>500</option>
                      <option>600</option>
                      <option>700</option>
                    </select>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 p-2 bg-gray-700 hover:bg-gray-600 rounded">
                    <Bold size={16} className="mx-auto text-gray-300" />
                  </button>
                  <button className="flex-1 p-2 bg-gray-700 hover:bg-gray-600 rounded">
                    <Italic size={16} className="mx-auto text-gray-300" />
                  </button>
                  <button className="flex-1 p-2 bg-gray-700 hover:bg-gray-600 rounded">
                    <Underline size={16} className="mx-auto text-gray-300" />
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 p-2 bg-gray-700 hover:bg-gray-600 rounded">
                    <AlignLeft size={16} className="mx-auto text-gray-300" />
                  </button>
                  <button className="flex-1 p-2 bg-gray-700 hover:bg-gray-600 rounded">
                    <AlignCenter size={16} className="mx-auto text-gray-300" />
                  </button>
                  <button className="flex-1 p-2 bg-gray-700 hover:bg-gray-600 rounded">
                    <AlignRight size={16} className="mx-auto text-gray-300" />
                  </button>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div>
              <h4 className="text-white text-sm font-medium mb-3 flex items-center">
                <Palette size={16} className="mr-2" />
                Colors
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Text Color</label>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-black rounded border border-gray-600"></div>
                    <input
                      type="text"
                      className="flex-1 bg-gray-700 text-white p-2 rounded text-sm border border-gray-600"
                      defaultValue="#000000"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Background</label>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white rounded border border-gray-600"></div>
                    <input
                      type="text"
                      className="flex-1 bg-gray-700 text-white p-2 rounded text-sm border border-gray-600"
                      defaultValue="#ffffff"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Layout */}
            <div>
              <h4 className="text-white text-sm font-medium mb-3 flex items-center">
                <Box size={16} className="mr-2" />
                Layout
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Width</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 text-white p-2 rounded text-sm border border-gray-600"
                    placeholder="auto"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Height</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 text-white p-2 rounded text-sm border border-gray-600"
                    placeholder="auto"
                  />
                </div>
              </div>
            </div>

            {/* Spacing */}
            <div>
              <h4 className="text-white text-sm font-medium mb-3 flex items-center">
                <Move size={16} className="mr-2" />
                Spacing
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Margin</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 text-white p-2 rounded text-sm border border-gray-600"
                    placeholder="0px"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Padding</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 text-white p-2 rounded text-sm border border-gray-600"
                    placeholder="0px"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-4">
            <h3 className="text-white text-sm font-medium mb-4">Page Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 block">Page Title</label>
                <input
                  type="text"
                  className="w-full bg-gray-700 text-white p-2 rounded text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
                  defaultValue="Untitled Page"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 block">Meta Description</label>
                <textarea
                  className="w-full bg-gray-700 text-white p-2 rounded text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
                  rows={3}
                  placeholder="Page description..."
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 block">Favicon</label>
                <input
                  type="url"
                  className="w-full bg-gray-700 text-white p-2 rounded text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="https://example.com/favicon.ico"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
