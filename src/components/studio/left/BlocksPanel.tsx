'use client'

import {
  // Basic blocks
  Type,
  Image,
  Mouse,
  Link,
  Hash,
  // Layout blocks
  Layout,
  Columns2,
  Columns3,
  Grid3X3,
  Box,
  // Form blocks
  FormInput,
  CheckSquare,
  Radio,
  List,
  Send,
  // Media blocks
  Video,
  Music,
  FileImage,
  Play,
  // Section blocks
  LayoutTemplate,
  Navigation,
  Archive,
  User
} from 'lucide-react'

export default function BlocksPanel() {
  const blockCategories = [
    {
      id: 'basic',
      name: 'Basic',
      blocks: [
        { id: 'text', name: 'Text', icon: Type },
        { id: 'heading', name: 'Heading', icon: Hash },
        { id: 'button', name: 'Button', icon: Mouse },
        { id: 'link', name: 'Link', icon: Link },
        { id: 'divider', name: 'Divider', icon: Box },
      ]
    },
    {
      id: 'layout',
      name: 'Layout',
      blocks: [
        { id: 'container', name: 'Container', icon: Layout },
        { id: 'columns2', name: '2 Columns', icon: Columns2 },
        { id: 'columns3', name: '3 Columns', icon: Columns3 },
        { id: 'grid', name: 'Grid', icon: Grid3X3 },
      ]
    },
    {
      id: 'forms',
      name: 'Forms',
      blocks: [
        { id: 'input', name: 'Input', icon: FormInput },
        { id: 'checkbox', name: 'Checkbox', icon: CheckSquare },
        { id: 'radio', name: 'Radio', icon: Radio },
        { id: 'select', name: 'Select', icon: List },
        { id: 'submit', name: 'Submit', icon: Send },
      ]
    },
    {
      id: 'media',
      name: 'Media',
      blocks: [
        { id: 'image', name: 'Image', icon: Image },
        { id: 'video', name: 'Video', icon: Video },
        { id: 'audio', name: 'Audio', icon: Music },
        { id: 'gallery', name: 'Gallery', icon: FileImage },
      ]
    },
    {
      id: 'sections',
      name: 'Sections',
      blocks: [
        { id: 'header', name: 'Header', icon: LayoutTemplate },
        { id: 'hero', name: 'Hero', icon: Play },
        { id: 'footer', name: 'Footer', icon: Archive },
        { id: 'testimonial', name: 'Testimonial', icon: User },
        { id: 'navbar', name: 'Navbar', icon: Navigation },
      ]
    }
  ]

  const handleBlockClick = (blockId: string) => {
    console.log('add block', blockId)
  }

  const handleKeyDown = (event: React.KeyboardEvent, blockId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleBlockClick(blockId)
    }
  }

  return (
    <div className="p-4 space-y-6">
      {blockCategories.map((category) => (
        <section key={category.id} aria-labelledby={`${category.id}-heading`}>
          <div className="border-b border-border pb-2 mb-3">
            <h3
              id={`${category.id}-heading`}
              className="text-xs uppercase tracking-wide font-medium text-muted-foreground"
            >
              {category.name}
            </h3>
          </div>
          <div
            className="grid grid-cols-2 gap-3"
            role="grid"
            aria-labelledby={`${category.id}-heading`}
          >
            {category.blocks.map((block) => (
              <button
                key={block.id}
                onClick={() => handleBlockClick(block.id)}
                onKeyDown={(e) => handleKeyDown(e, block.id)}
                className="flex flex-col items-center justify-center p-4 bg-muted hover:bg-accent border border-border rounded-md transition-colors group focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                draggable
                aria-label={`Add ${block.name} block to canvas`}
                title={`Add ${block.name}`}
                role="gridcell"
              >
                <block.icon
                  size={20}
                  className="mb-2 text-muted-foreground group-hover:text-primary"
                  aria-hidden="true"
                />
                <span className="text-xs text-foreground text-center">{block.name}</span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
