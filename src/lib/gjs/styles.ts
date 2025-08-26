/**
 * GrapesJS Style Manager configuration
 * Organizes CSS properties into logical sectors similar to design tools
 */

export interface StyleSector {
  name: string
  open?: boolean
  buildProps?: string[]
  properties?: unknown[]
}

/**
 * Style Manager configuration with sectors organized like professional design tools
 */
export const styleManagerConfig: StyleSector[] = [
  {
    name: 'Layout',
    open: false,
    buildProps: [
      'display',
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'z-index'
    ]
  },
  {
    name: 'Size',
    open: true,
    buildProps: [
      'width',
      'min-width',
      'max-width',
      'height',
      'min-height',
      'max-height'
    ]
  },
  {
    name: 'Space',
    open: false,
    buildProps: [
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left'
    ]
  },
  {
    name: 'Position',
    open: false,
    buildProps: [
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'z-index'
    ]
  },
  {
    name: 'Typography',
    open: false,
    properties: [
      {
        property: 'font-family',
        type: 'select',
        options: [
          { value: 'Arial, sans-serif', name: 'Arial' },
          { value: 'Helvetica, sans-serif', name: 'Helvetica' },
          { value: 'Inter, sans-serif', name: 'Inter' },
          { value: 'Georgia, serif', name: 'Georgia' },
          { value: 'Times New Roman, serif', name: 'Times New Roman' },
          { value: 'Courier New, monospace', name: 'Courier New' }
        ]
      },
      {
        property: 'font-size',
        type: 'integer',
        units: ['px', 'em', 'rem', '%'],
        defaults: 'px'
      },
      {
        property: 'font-weight',
        type: 'select',
        options: [
          { value: '300', name: 'Light' },
          { value: '400', name: 'Normal' },
          { value: '500', name: 'Medium' },
          { value: '600', name: 'Semi Bold' },
          { value: '700', name: 'Bold' },
          { value: '800', name: 'Extra Bold' }
        ]
      },
      {
        property: 'line-height',
        type: 'integer',
        units: ['px', 'em', 'rem', ''],
        defaults: ''
      },
      {
        property: 'color',
        type: 'color'
      },
      {
        property: 'text-align',
        type: 'radio',
        options: [
          { value: 'left', name: 'Left' },
          { value: 'center', name: 'Center' },
          { value: 'right', name: 'Right' },
          { value: 'justify', name: 'Justify' }
        ]
      }
    ]
  },
  {
    name: 'Background',
    open: false,
    properties: [
      {
        property: 'background-color',
        type: 'color'
      },
      {
        property: 'background-image',
        type: 'file'
      },
      {
        property: 'background-size',
        type: 'select',
        options: [
          { value: 'auto', name: 'Auto' },
          { value: 'cover', name: 'Cover' },
          { value: 'contain', name: 'Contain' },
          { value: '100%', name: '100%' }
        ]
      },
      {
        property: 'background-repeat',
        type: 'select',
        options: [
          { value: 'repeat', name: 'Repeat' },
          { value: 'no-repeat', name: 'No Repeat' },
          { value: 'repeat-x', name: 'Repeat X' },
          { value: 'repeat-y', name: 'Repeat Y' }
        ]
      },
      {
        property: 'background-position',
        type: 'select',
        options: [
          { value: 'left top', name: 'Left Top' },
          { value: 'center top', name: 'Center Top' },
          { value: 'right top', name: 'Right Top' },
          { value: 'left center', name: 'Left Center' },
          { value: 'center center', name: 'Center' },
          { value: 'right center', name: 'Right Center' },
          { value: 'left bottom', name: 'Left Bottom' },
          { value: 'center bottom', name: 'Center Bottom' },
          { value: 'right bottom', name: 'Right Bottom' }
        ]
      }
    ]
  },
  {
    name: 'Borders',
    open: false,
    properties: [
      {
        property: 'border-width',
        type: 'integer',
        units: ['px', 'em', 'rem'],
        defaults: 'px'
      },
      {
        property: 'border-style',
        type: 'select',
        options: [
          { value: 'none', name: 'None' },
          { value: 'solid', name: 'Solid' },
          { value: 'dashed', name: 'Dashed' },
          { value: 'dotted', name: 'Dotted' },
          { value: 'double', name: 'Double' }
        ]
      },
      {
        property: 'border-color',
        type: 'color'
      },
      {
        property: 'border-radius',
        type: 'integer',
        units: ['px', 'em', 'rem', '%'],
        defaults: 'px'
      }
    ]
  },
  {
    name: 'Effects',
    open: false,
    properties: [
      {
        property: 'opacity',
        type: 'slider',
        defaults: 1,
        step: 0.01,
        max: 1,
        min: 0
      },
      {
        property: 'box-shadow',
        type: 'stack',
        preview: true,
        properties: [
          {
            property: 'box-shadow-h',
            type: 'integer',
            units: ['px'],
            defaults: '0'
          },
          {
            property: 'box-shadow-v',
            type: 'integer',
            units: ['px'],
            defaults: '0'
          },
          {
            property: 'box-shadow-blur',
            type: 'integer',
            units: ['px'],
            defaults: '0'
          },
          {
            property: 'box-shadow-spread',
            type: 'integer',
            units: ['px'],
            defaults: '0'
          },
          {
            property: 'box-shadow-color',
            type: 'color',
            defaults: '#000000'
          },
          {
            property: 'box-shadow-type',
            type: 'select',
            options: [
              { value: '', name: 'Outside' },
              { value: 'inset', name: 'Inside' }
            ]
          }
        ]
      }
    ]
  }
]

/**
 * Convert string to kebab-case
 */
function toKebab(v?: string): string {
  return (v || '').toLowerCase().trim().replace(/\s+/g, '-');
}

import { GrapesJSEditor } from '@/types/grapesjs-editor'

/**
 * Apply the style manager configuration to the GrapesJS editor
 * @param editor - The GrapesJS editor instance
 */

export function applyStyleManager(editor: GrapesJSEditor): void {
  if (!editor) {
    console.warn('Editor instance not provided to applyStyleManager')
    return
  }

  try {
    // Get the Style Manager with fallback for different API versions
    const sm = editor.Styles || editor.StyleManager

    if (!sm) {
      console.warn('Style Manager not found in editor - styles configuration skipped')
      return
    }

    // Clear existing sectors if possible
    try {
      sm.getSectors?.()?.reset?.()
    } catch (e) {
      console.warn('Could not clear existing sectors:', e)
    }

    // Try the legacy addSectors method first (v0.1x)
    if (typeof sm.addSectors === 'function') {
      sm.addSectors(styleManagerConfig)
      console.log('Style Manager configured successfully with addSectors (legacy API)')
      return
    }

    // Fallback to individual sector addition for newer versions
    console.log('Using fallback method for Style Manager configuration')

    for (const sector of styleManagerConfig) {
      try {
        // Compute sector properties
        const id = toKebab(sector.name)
        const label = sector.name || id
        const props = sector.properties || sector.buildProps || []

        // Try newer addSector method (v0.2x)
        if (typeof sm.addSector === 'function') {
          sm.addSector(id, {
            name: label,
            open: !!sector.open,
            properties: props
          })
        } else {
          // Even newer API - add sector then properties individually
          if (typeof sm.addSector === 'function') {
            sm.addSector(id, {
              name: label,
              open: !!sector.open
            })
          }

          // Add properties individually if they exist
          if (Array.isArray(props) && typeof sm.addProperty === 'function') {
            props.forEach((prop: unknown) => {
              try {
                if (typeof prop === 'string') {
                  // Simple property name (buildProps style)
                  sm.addProperty(id, { property: prop })
                } else if (prop && typeof prop === 'object') {
                  // Full property object (properties style)
                  sm.addProperty(id, prop)
                }
              } catch (propError) {
                console.warn(`Failed to add property ${prop} to sector ${id}:`, propError)
              }
            })
          }
        }
      } catch (sectorError) {
        console.warn(`Failed to add sector ${sector.name}:`, sectorError)
      }
    }

    console.log('Style Manager configured successfully with fallback method')
  } catch (error) {
    console.error('Failed to apply Style Manager configuration:', error)
  }
}
