'use client'

import { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Type,
  Move,
  Square,
  Image as ImageIcon,
  Frame,
  Sparkles
} from 'lucide-react'

interface AccordionState {
  [key: string]: boolean
}

export default function StylesPanel() {
  const [accordionState, setAccordionState] = useState<AccordionState>({
    typography: true,
    space: false,
    position: false,
    background: false,
    border: false,
    effects: false,
  })

  const toggleAccordion = (key: string) => {
    setAccordionState(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const AccordionHeader = ({
    id,
    title,
    icon: Icon,
    isOpen
  }: {
    id: string
    title: string
    icon: React.ComponentType<{ size: number; className?: string }>
    isOpen: boolean
  }) => (
    <button
      onClick={() => toggleAccordion(id)}
      className="w-full flex items-center justify-between p-3 bg-muted hover:bg-accent border-b border-border"
    >
      <div className="flex items-center space-x-2">
        <Icon size={16} className="text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">{title}</span>
      </div>
      {isOpen ? (
        <ChevronDown size={16} className="text-muted-foreground" />
      ) : (
        <ChevronRight size={16} className="text-muted-foreground" />
      )}
    </button>
  )

  const ControlGroup = ({ children }: { children: React.ReactNode }) => (
    <div className="p-4 space-y-4 border-b border-border">
      {children}
    </div>
  )

  const ControlRow = ({
    label,
    children
  }: {
    label: string
    children: React.ReactNode
  }) => (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-wide font-medium text-muted-foreground block">
        {label}
      </label>
      {children}
    </div>
  )

  return (
    <div>
      {/* Typography */}
      <div>
        <AccordionHeader
          id="typography"
          title="Typography"
          icon={Type}
          isOpen={accordionState.typography}
        />
        {accordionState.typography && (
          <ControlGroup>
            <ControlRow label="Font Size">
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="12"
                  max="72"
                  defaultValue="16"
                  className="flex-1 accent-primary"
                />
                <input
                  type="number"
                  defaultValue="16"
                  className="w-16 px-2 py-1 text-xs bg-muted border border-border rounded-md text-foreground"
                />
              </div>
            </ControlRow>
            <ControlRow label="Font Weight">
              <select className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="400">Normal</option>
                <option value="500">Medium</option>
                <option value="600">Semi Bold</option>
                <option value="700">Bold</option>
              </select>
            </ControlRow>
            <ControlRow label="Line Height">
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                defaultValue="1.5"
                className="w-full accent-primary"
              />
            </ControlRow>
          </ControlGroup>
        )}
      </div>

      {/* Space */}
      <div>
        <AccordionHeader
          id="space"
          title="Space"
          icon={Move}
          isOpen={accordionState.space}
        />
        {accordionState.space && (
          <ControlGroup>
            <ControlRow label="Margin">
              <div className="grid grid-cols-4 gap-2">
                <input type="number" placeholder="T" className="px-2 py-1 text-xs bg-muted border border-border rounded-md text-foreground" />
                <input type="number" placeholder="R" className="px-2 py-1 text-xs bg-muted border border-border rounded-md text-foreground" />
                <input type="number" placeholder="B" className="px-2 py-1 text-xs bg-muted border border-border rounded-md text-foreground" />
                <input type="number" placeholder="L" className="px-2 py-1 text-xs bg-muted border border-border rounded-md text-foreground" />
              </div>
            </ControlRow>
            <ControlRow label="Padding">
              <div className="grid grid-cols-4 gap-2">
                <input type="number" placeholder="T" className="px-2 py-1 text-xs bg-muted border border-border rounded-md text-foreground" />
                <input type="number" placeholder="R" className="px-2 py-1 text-xs bg-muted border border-border rounded-md text-foreground" />
                <input type="number" placeholder="B" className="px-2 py-1 text-xs bg-muted border border-border rounded-md text-foreground" />
                <input type="number" placeholder="L" className="px-2 py-1 text-xs bg-muted border border-border rounded-md text-foreground" />
              </div>
            </ControlRow>
          </ControlGroup>
        )}
      </div>

      {/* Position */}
      <div>
        <AccordionHeader
          id="position"
          title="Position"
          icon={Square}
          isOpen={accordionState.position}
        />
        {accordionState.position && (
          <ControlGroup>
            <ControlRow label="Display">
              <select className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="block">Block</option>
                <option value="inline">Inline</option>
                <option value="flex">Flex</option>
                <option value="grid">Grid</option>
              </select>
            </ControlRow>
            <ControlRow label="Position">
              <select className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="static">Static</option>
                <option value="relative">Relative</option>
                <option value="absolute">Absolute</option>
                <option value="fixed">Fixed</option>
              </select>
            </ControlRow>
          </ControlGroup>
        )}
      </div>

      {/* Background */}
      <div>
        <AccordionHeader
          id="background"
          title="Background"
          icon={ImageIcon}
          isOpen={accordionState.background}
        />
        {accordionState.background && (
          <ControlGroup>
            <ControlRow label="Background Color">
              <div className="flex items-center space-x-2">
                <input type="color" defaultValue="#ffffff" className="w-10 h-8 border border-gray-300 dark:border-gray-600 rounded" />
                <input type="text" defaultValue="#ffffff" className="flex-1 px-3 py-2 text-sm bg-muted border border-border rounded-md text-foreground" />
              </div>
            </ControlRow>
            <ControlRow label="Opacity">
              <input type="range" min="0" max="100" defaultValue="100" className="w-full" />
            </ControlRow>
          </ControlGroup>
        )}
      </div>

      {/* Border */}
      <div>
        <AccordionHeader
          id="border"
          title="Border"
          icon={Frame}
          isOpen={accordionState.border}
        />
        {accordionState.border && (
          <ControlGroup>
            <ControlRow label="Border Width">
              <input type="range" min="0" max="10" defaultValue="1" className="w-full" />
            </ControlRow>
            <ControlRow label="Border Style">
              <select className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
            </ControlRow>
            <ControlRow label="Border Radius">
              <input type="range" min="0" max="50" defaultValue="0" className="w-full" />
            </ControlRow>
          </ControlGroup>
        )}
      </div>

      {/* Effects */}
      <div>
        <AccordionHeader
          id="effects"
          title="Effects"
          icon={Sparkles}
          isOpen={accordionState.effects}
        />
        {accordionState.effects && (
          <ControlGroup>
            <ControlRow label="Box Shadow">
              <select className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="none">None</option>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </ControlRow>
            <ControlRow label="Blur">
              <input type="range" min="0" max="20" defaultValue="0" className="w-full" />
            </ControlRow>
          </ControlGroup>
        )}
      </div>
    </div>
  )
}
