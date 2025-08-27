'use client'

import { useState, useEffect } from 'react'
import type { GrapesJSEditor } from '@/types/grapesjs'

interface GlobalStylesState {
  colors: {
    primary: string
    secondary: string
    accent: string
    success: string
    warning: string
    error: string
  }
  typography: {
    bodyFont: string
    bodySize: string
    bodyLineHeight: string
    headingFont: string
    headingWeight: string
    subheadingFont: string
    subheadingSize: string
    buttonFont: string
    buttonWeight: string
  }
}

const defaultStyles: GlobalStylesState = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    accent: '#17a2b8',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545'
  },
  typography: {
    bodyFont: 'Inter, sans-serif',
    bodySize: '16px',
    bodyLineHeight: '1.6',
    headingFont: 'Inter, sans-serif',
    headingWeight: '600',
    subheadingFont: 'Inter, sans-serif',
    subheadingSize: '18px',
    buttonFont: 'Inter, sans-serif',
    buttonWeight: '500'
  }
}

interface GlobalStylesPanelProps {
  isOpen: boolean
  onClose: () => void
  editor?: GrapesJSEditor
}

export default function GlobalStylesPanel({ isOpen, onClose, editor }: GlobalStylesPanelProps) {
  const [styles, setStyles] = useState<GlobalStylesState>(defaultStyles)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    // Load existing styles from CSS variables if they exist
    loadExistingStyles()
  }, [])

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    // Update CSS variables and editor styles when styles change
    if (isOpen) {
      updateGlobalStyles()
    }
  }, [styles, isOpen])

  const loadExistingStyles = () => {
    if (typeof window === 'undefined') return

    try {
      const root = document.documentElement
      const computedStyle = getComputedStyle(root)

      const loadedStyles = { ...defaultStyles }

      // Load colors
      Object.keys(loadedStyles.colors).forEach(key => {
        const value = computedStyle.getPropertyValue(`--t-${key}`)
        if (value) {
          loadedStyles.colors[key as keyof typeof loadedStyles.colors] = value.trim()
        }
      })

      // Load typography
      const bodyFont = computedStyle.getPropertyValue('--t-body-font')
      if (bodyFont) loadedStyles.typography.bodyFont = bodyFont.trim()

      const bodySize = computedStyle.getPropertyValue('--t-body-size')
      if (bodySize) loadedStyles.typography.bodySize = bodySize.trim()

      setStyles(loadedStyles)
    } catch (error) {
      console.warn('Failed to load existing styles:', error)
    }
  }

  const updateGlobalStyles = () => {
    if (typeof window === 'undefined') return

    // Update CSS variables in the document
    updateCSSVariables()

    // Update editor styles if editor is available
    if (editor) {
      updateEditorStyles()
    }
  }

  const updateCSSVariables = () => {
    if (typeof window === 'undefined') return

    let styleElement = document.getElementById('gjs-global-vars') as HTMLStyleElement

    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = 'gjs-global-vars'
      document.head.appendChild(styleElement)
    }

    const cssVariables = `
      :root {
        /* Colors */
        --t-primary: ${styles.colors.primary};
        --t-secondary: ${styles.colors.secondary};
        --t-accent: ${styles.colors.accent};
        --t-success: ${styles.colors.success};
        --t-warning: ${styles.colors.warning};
        --t-error: ${styles.colors.error};
        
        /* Typography */
        --t-body-font: ${styles.typography.bodyFont};
        --t-body-size: ${styles.typography.bodySize};
        --t-body-line-height: ${styles.typography.bodyLineHeight};
        --t-heading-font: ${styles.typography.headingFont};
        --t-heading-weight: ${styles.typography.headingWeight};
        --t-subheading-font: ${styles.typography.subheadingFont};
        --t-subheading-size: ${styles.typography.subheadingSize};
        --t-button-font: ${styles.typography.buttonFont};
        --t-button-weight: ${styles.typography.buttonWeight};
      }
      
      /* Apply theme styles */
      body {
        font-family: var(--t-body-font);
        font-size: var(--t-body-size);
        line-height: var(--t-body-line-height);
      }
      
      h1, h2, h3, h4, h5, h6 {
        font-family: var(--t-heading-font);
        font-weight: var(--t-heading-weight);
        color: var(--t-primary);
      }
      
      .subheading {
        font-family: var(--t-subheading-font);
        font-size: var(--t-subheading-size);
        color: var(--t-secondary);
      }
      
      button, .btn {
        font-family: var(--t-button-font);
        font-weight: var(--t-button-weight);
      }
      
      .btn-primary {
        background-color: var(--t-primary);
        border-color: var(--t-primary);
      }
      
      .btn-secondary {
        background-color: var(--t-secondary);
        border-color: var(--t-secondary);
      }
      
      .btn-success {
        background-color: var(--t-success);
        border-color: var(--t-success);
      }
      
      .text-primary { color: var(--t-primary); }
      .text-secondary { color: var(--t-secondary); }
      .text-accent { color: var(--t-accent); }
      .text-success { color: var(--t-success); }
      .text-warning { color: var(--t-warning); }
      .text-error { color: var(--t-error); }
    `

    styleElement.textContent = cssVariables
  }

  const updateEditorStyles = () => {
    try {
      // Add styles to the editor's canvas
      const canvasDocument = editor.Canvas.getDocument()
      if (canvasDocument) {
        let editorStyleElement = canvasDocument.getElementById('gjs-theme-vars')

        if (!editorStyleElement) {
          editorStyleElement = canvasDocument.createElement('style')
          editorStyleElement.id = 'gjs-theme-vars'
          canvasDocument.head.appendChild(editorStyleElement)
        }

        editorStyleElement.textContent = `
          :root {
            --t-primary: ${styles.colors.primary};
            --t-secondary: ${styles.colors.secondary};
            --t-accent: ${styles.colors.accent};
            --t-success: ${styles.colors.success};
            --t-warning: ${styles.colors.warning};
            --t-error: ${styles.colors.error};
            --t-body-font: ${styles.typography.bodyFont};
            --t-body-size: ${styles.typography.bodySize};
            --t-body-line-height: ${styles.typography.bodyLineHeight};
            --t-heading-font: ${styles.typography.headingFont};
            --t-heading-weight: ${styles.typography.headingWeight};
            --t-subheading-font: ${styles.typography.subheadingFont};
            --t-subheading-size: ${styles.typography.subheadingSize};
            --t-button-font: ${styles.typography.buttonFont};
            --t-button-weight: ${styles.typography.buttonWeight};
          }
          
          body {
            font-family: var(--t-body-font);
            font-size: var(--t-body-size);
            line-height: var(--t-body-line-height);
          }
          
          h1, h2, h3, h4, h5, h6 {
            font-family: var(--t-heading-font);
            font-weight: var(--t-heading-weight);
            color: var(--t-primary);
          }
          
          .subheading {
            font-family: var(--t-subheading-font);
            font-size: var(--t-subheading-size);
            color: var(--t-secondary);
          }
          
          button, .btn {
            font-family: var(--t-button-font);
            font-weight: var(--t-button-weight);
          }
          
          .btn-primary { background-color: var(--t-primary); border-color: var(--t-primary); }
          .btn-secondary { background-color: var(--t-secondary); border-color: var(--t-secondary); }
          .btn-success { background-color: var(--t-success); border-color: var(--t-success); }
          .text-primary { color: var(--t-primary); }
          .text-secondary { color: var(--t-secondary); }
          .text-accent { color: var(--t-accent); }
          .text-success { color: var(--t-success); }
          .text-warning { color: var(--t-warning); }
          .text-error { color: var(--t-error); }
        `
      }
    } catch (error) {
      console.warn('Failed to update editor styles:', error)
    }
  }

  const handleColorChange = (colorKey: keyof typeof styles.colors, value: string) => {
    setStyles(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value
      }
    }))
  }

  const handleTypographyChange = (typographyKey: keyof typeof styles.typography, value: string) => {
    setStyles(prev => ({
      ...prev,
      typography: {
        ...prev.typography,
        [typographyKey]: value
      }
    }))
  }

  const resetToDefaults = () => {
    setStyles(defaultStyles)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute left-14 top-0 bottom-0 pointer-events-auto">
        <div className="w-80 h-full bg-white border-r border-gray-200 shadow-lg">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <h3 className="font-medium text-gray-900">Global Styles</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={resetToDefaults}
                  className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                >
                  Reset
                </button>
                <button
                  onClick={onClose}
                  className="p-1 rounded hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Colors Section */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Colors</h4>
                <div className="space-y-3">
                  {Object.entries(styles.colors).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-sm text-gray-700 capitalize">
                        {key}
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={value}
                          onChange={(e) => handleColorChange(key as keyof typeof styles.colors, e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => handleColorChange(key as keyof typeof styles.colors, e.target.value)}
                          className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Typography Section */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Typography</h4>

                {/* Body Typography */}
                <div className="mb-4">
                  <h5 className="text-xs font-medium text-gray-600 mb-2">Body Text</h5>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-500">Font Family</label>
                      <select
                        value={styles.typography.bodyFont}
                        onChange={(e) => handleTypographyChange('bodyFont', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                      >
                        <option value="Inter, sans-serif">Inter</option>
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="Helvetica, sans-serif">Helvetica</option>
                        <option value="Georgia, serif">Georgia</option>
                        <option value="Times New Roman, serif">Times New Roman</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-500">Size</label>
                        <input
                          type="text"
                          value={styles.typography.bodySize}
                          onChange={(e) => handleTypographyChange('bodySize', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="16px"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Line Height</label>
                        <input
                          type="text"
                          value={styles.typography.bodyLineHeight}
                          onChange={(e) => handleTypographyChange('bodyLineHeight', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="1.6"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Heading Typography */}
                <div className="mb-4">
                  <h5 className="text-xs font-medium text-gray-600 mb-2">Headings</h5>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-500">Font Family</label>
                      <select
                        value={styles.typography.headingFont}
                        onChange={(e) => handleTypographyChange('headingFont', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                      >
                        <option value="Inter, sans-serif">Inter</option>
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="Helvetica, sans-serif">Helvetica</option>
                        <option value="Georgia, serif">Georgia</option>
                        <option value="Times New Roman, serif">Times New Roman</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Font Weight</label>
                      <select
                        value={styles.typography.headingWeight}
                        onChange={(e) => handleTypographyChange('headingWeight', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                      >
                        <option value="400">Normal</option>
                        <option value="500">Medium</option>
                        <option value="600">Semi Bold</option>
                        <option value="700">Bold</option>
                        <option value="800">Extra Bold</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Subheading Typography */}
                <div className="mb-4">
                  <h5 className="text-xs font-medium text-gray-600 mb-2">Subheadings</h5>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-500">Font Family</label>
                      <select
                        value={styles.typography.subheadingFont}
                        onChange={(e) => handleTypographyChange('subheadingFont', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                      >
                        <option value="Inter, sans-serif">Inter</option>
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="Helvetica, sans-serif">Helvetica</option>
                        <option value="Georgia, serif">Georgia</option>
                        <option value="Times New Roman, serif">Times New Roman</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Font Size</label>
                      <input
                        type="text"
                        value={styles.typography.subheadingSize}
                        onChange={(e) => handleTypographyChange('subheadingSize', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                        placeholder="18px"
                      />
                    </div>
                  </div>
                </div>

                {/* Button Typography */}
                <div>
                  <h5 className="text-xs font-medium text-gray-600 mb-2">Buttons</h5>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-500">Font Family</label>
                      <select
                        value={styles.typography.buttonFont}
                        onChange={(e) => handleTypographyChange('buttonFont', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                      >
                        <option value="Inter, sans-serif">Inter</option>
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="Helvetica, sans-serif">Helvetica</option>
                        <option value="Georgia, serif">Georgia</option>
                        <option value="Times New Roman, serif">Times New Roman</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Font Weight</label>
                      <select
                        value={styles.typography.buttonWeight}
                        onChange={(e) => handleTypographyChange('buttonWeight', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                      >
                        <option value="400">Normal</option>
                        <option value="500">Medium</option>
                        <option value="600">Semi Bold</option>
                        <option value="700">Bold</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
