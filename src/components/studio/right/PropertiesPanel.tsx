'use client'

import { Plus } from 'lucide-react'

export default function PropertiesPanel() {
  return (
    <div className="p-4 space-y-6">
      {/* Element Properties */}
      <fieldset>
        <legend className="border-b border-border pb-2 mb-4">
          <h3 className="text-xs uppercase tracking-wide font-medium text-muted-foreground">Element Properties</h3>
        </legend>
        <div className="space-y-4">
          <div>
            <label htmlFor="element-name" className="block text-xs font-medium text-muted-foreground mb-1">
              Name
            </label>
            <input
              id="element-name"
              type="text"
              defaultValue="Text Block"
              className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="element-id" className="block text-xs font-medium text-muted-foreground mb-1">
              ID
            </label>
            <input
              id="element-id"
              type="text"
              placeholder="element-id"
              className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="element-classes" className="block text-xs font-medium text-muted-foreground mb-1">
              Class
            </label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2" role="list" aria-label="Applied CSS classes">
                <span 
                  className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                  role="listitem"
                >
                  text-lg
                  <button 
                    className="ml-1 text-primary hover:text-primary/70 focus:outline-none focus:ring-1 focus:ring-ring"
                    aria-label="Remove text-lg class"
                  >
                    ×
                  </button>
                </span>
                <span 
                  className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                  role="listitem"
                >
                  font-bold
                  <button 
                    className="ml-1 text-primary hover:text-primary/70 focus:outline-none focus:ring-1 focus:ring-ring"
                    aria-label="Remove font-bold class"
                  >
                    ×
                  </button>
                </span>
              </div>
              <button 
                className="flex items-center space-x-2 w-full rounded-md px-2.5 py-1.5 text-sm text-muted-foreground bg-muted border border-border hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Add new CSS class"
              >
                <Plus size={16} aria-hidden="true" />
                <span>Add class</span>
              </button>
            </div>
          </div>
        </div>
      </fieldset>

      {/* Custom Attributes */}
      <fieldset>
        <legend className="border-b border-border pb-2 mb-4">
          <h3 className="text-xs uppercase tracking-wide font-medium text-muted-foreground">Custom Attributes</h3>
        </legend>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <label htmlFor="attr-key-1" className="sr-only">Attribute key</label>
            <input
              id="attr-key-1"
              type="text"
              placeholder="Key"
              className="flex-1 px-3 py-2 text-sm bg-muted border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            <label htmlFor="attr-value-1" className="sr-only">Attribute value</label>
            <input
              id="attr-value-1"
              type="text"
              placeholder="Value"
              className="flex-1 px-3 py-2 text-sm bg-muted border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            <button 
              className="rounded-md px-2.5 py-1.5 text-sm bg-destructive/10 text-destructive hover:bg-destructive/20 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Remove this attribute"
            >
              Remove
            </button>
          </div>

          <button 
            className="flex items-center space-x-2 w-full rounded-md px-2.5 py-1.5 text-sm text-muted-foreground bg-muted border border-border hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Add new custom attribute"
          >
            <Plus size={16} aria-hidden="true" />
            <span>Add attribute</span>
          </button>
        </div>
      </fieldset>
    </div>
  )
}
