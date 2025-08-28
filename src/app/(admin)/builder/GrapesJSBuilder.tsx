'use client'

import { useEffect, useRef, useState } from 'react'
import grapesjs from 'grapesjs'
import type { Editor } from 'grapesjs'
import 'grapesjs/css/grapes.min.css'

import { logger } from '@/lib/logger'
import { styleManagerConfig } from '@/lib/gjs/styles'

// Import plugins in proper order
import basicBlocks from 'grapesjs-blocks-basic'
import presetWebpage from 'grapesjs-preset-webpage'
import forms from 'grapesjs-plugin-forms'
import navbar from 'grapesjs-navbar'
import countdown from 'grapesjs-component-countdown'
import tabs from 'grapesjs-tabs'
import customCode from 'grapesjs-custom-code'
import styleBg from 'grapesjs-style-bg'
import exportPlg from 'grapesjs-plugin-export'

function addCommonBlocks(editor: Editor) {
  const bm = editor.BlockManager;

  // Add custom sections with proper drag-and-drop attributes
  bm.add('section-hero', {
    label: 'Hero Section',
    category: 'Sections',
    media: '<div style="width:100%;height:50px;background:#4299e1;border-radius:4px;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;">Hero</div>',
    content: `<section class="hero-section" style="padding:80px 20px;text-align:center;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;">
      <div style="max-width:800px;margin:0 auto;">
        <h1 style="font-size:3rem;margin-bottom:1rem;font-weight:bold;">Your Amazing Hero Title</h1>
        <p style="font-size:1.2rem;margin-bottom:2rem;opacity:0.9;">A compelling subtitle that explains your value proposition</p>
        <a href="#" style="background:#ff6b6b;color:white;padding:12px 30px;border-radius:6px;text-decoration:none;display:inline-block;font-weight:600;">Get Started</a>
      </div>
    </section>`,
    attributes: { class: 'gjs-block-section' }
  });

  bm.add('section-features', {
    label: 'Features Grid',
    category: 'Sections',
    media: '<div style="width:100%;height:50px;background:#48bb78;border-radius:4px;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;">Features</div>',
    content: `<section class="features-section" style="padding:80px 20px;background:#f7fafc;">
      <div style="max-width:1200px;margin:0 auto;">
        <h2 style="text-align:center;font-size:2.5rem;margin-bottom:3rem;color:#2d3748;">Our Features</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:2rem;">
          <div style="text-align:center;padding:2rem;background:white;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
            <div style="width:60px;height:60px;background:#4299e1;border-radius:50%;margin:0 auto 1rem;"></div>
            <h3 style="font-size:1.5rem;margin-bottom:1rem;color:#2d3748;">Fast Performance</h3>
            <p style="color:#718096;">Lightning-fast loading times for the best user experience</p>
          </div>
          <div style="text-align:center;padding:2rem;background:white;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
            <div style="width:60px;height:60px;background:#48bb78;border-radius:50%;margin:0 auto 1rem;"></div>
            <h3 style="font-size:1.5rem;margin-bottom:1rem;color:#2d3748;">Secure & Reliable</h3>
            <p style="color:#718096;">Bank-level security with 99.9% uptime guarantee</p>
          </div>
          <div style="text-align:center;padding:2rem;background:white;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
            <div style="width:60px;height:60px;background:#ed8936;border-radius:50%;margin:0 auto 1rem;"></div>
            <h3 style="font-size:1.5rem;margin-bottom:1rem;color:#2d3748;">Easy to Use</h3>
            <p style="color:#718096;">Intuitive interface designed for everyone</p>
          </div>
        </div>
      </div>
    </section>`,
    attributes: { class: 'gjs-block-section' }
  });

  bm.add('section-pricing', {
    label: 'Pricing Table',
    category: 'Sections',
    media: '<div style="width:100%;height:50px;background:#9f7aea;border-radius:4px;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;">Pricing</div>',
    content: `<section class="pricing-section" style="padding:80px 20px;background:white;">
      <div style="max-width:1000px;margin:0 auto;">
        <h2 style="text-align:center;font-size:2.5rem;margin-bottom:3rem;color:#2d3748;">Choose Your Plan</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:2rem;">
          <div style="border:1px solid #e2e8f0;padding:2rem;border-radius:8px;text-align:center;">
            <h3 style="font-size:1.5rem;margin-bottom:1rem;color:#2d3748;">Starter</h3>
            <div style="font-size:3rem;font-weight:bold;color:#4299e1;margin-bottom:1rem;">$9<span style="font-size:1rem;color:#718096;">/mo</span></div>
            <ul style="list-style:none;padding:0;margin-bottom:2rem;">
              <li style="padding:0.5rem 0;color:#718096;">✓ 5 Projects</li>
              <li style="padding:0.5rem 0;color:#718096;">✓ 10GB Storage</li>
              <li style="padding:0.5rem 0;color:#718096;">✓ Email Support</li>
            </ul>
            <a href="#" style="background:#4299e1;color:white;padding:12px 30px;border-radius:6px;text-decoration:none;display:inline-block;width:100%;">Choose Plan</a>
          </div>
          <div style="border:2px solid #4299e1;padding:2rem;border-radius:8px;text-align:center;position:relative;">
            <div style="position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:#4299e1;color:white;padding:5px 15px;border-radius:15px;font-size:0.8rem;">Popular</div>
            <h3 style="font-size:1.5rem;margin-bottom:1rem;color:#2d3748;">Pro</h3>
            <div style="font-size:3rem;font-weight:bold;color:#4299e1;margin-bottom:1rem;">$19<span style="font-size:1rem;color:#718096;">/mo</span></div>
            <ul style="list-style:none;padding:0;margin-bottom:2rem;">
              <li style="padding:0.5rem 0;color:#718096;">✓ 25 Projects</li>
              <li style="padding:0.5rem 0;color:#718096;">✓ 100GB Storage</li>
              <li style="padding:0.5rem 0;color:#718096;">✓ Priority Support</li>
            </ul>
            <a href="#" style="background:#4299e1;color:white;padding:12px 30px;border-radius:6px;text-decoration:none;display:inline-block;width:100%;">Choose Plan</a>
          </div>
          <div style="border:1px solid #e2e8f0;padding:2rem;border-radius:8px;text-align:center;">
            <h3 style="font-size:1.5rem;margin-bottom:1rem;color:#2d3748;">Enterprise</h3>
            <div style="font-size:3rem;font-weight:bold;color:#4299e1;margin-bottom:1rem;">$49<span style="font-size:1rem;color:#718096;">/mo</span></div>
            <ul style="list-style:none;padding:0;margin-bottom:2rem;">
              <li style="padding:0.5rem 0;color:#718096;">✓ Unlimited Projects</li>
              <li style="padding:0.5rem 0;color:#718096;">✓ 1TB Storage</li>
              <li style="padding:0.5rem 0;color:#718096;">✓ 24/7 Support</li>
            </ul>
            <a href="#" style="background:#4299e1;color:white;padding:12px 30px;border-radius:6px;text-decoration:none;display:inline-block;width:100%;">Choose Plan</a>
          </div>
        </div>
      </div>
    </section>`,
    attributes: { class: 'gjs-block-section' }
  });
}

function addPublishButton(editor: Editor) {
  const pn = editor.Panels
  pn.addButton('options', {
    id: 'publish-btn',
    className: 'fa fa-rocket',
    attributes: { title: 'Publish' },
    command: 'publish-site',
  })
  editor.Commands.add('publish-site', {
    run: async () => {
      const params = new URLSearchParams(location.search)
      const project = params.get('project') || 'unknown'
      const page = params.get('page') || 'home'
      window.dispatchEvent(new CustomEvent('publish-request', { detail: { project, page } }))
    }
  })
}

export default function GrapesJSBuilder() {
  const elRef = useRef<HTMLDivElement | null>(null)
  const [editor, setEditor] = useState<Editor | null>(null)

  useEffect(() => {
    if (!elRef.current || editor) return

    const params = new URLSearchParams(location.search)
    const project = params.get('project') || 'unknown'
    const page = params.get('page') || 'home'

    const urlStore = `/api/builder?project=${project}&page=${page}`
    const urlLoad = `/api/builder?project=${project}&page=${page}`

    logger.info('Initializing GrapesJS editor...')

    try {
      const editorInstance = grapesjs.init({
        container: elRef.current,
        height: '100vh',
        width: 'auto',

        // Plugin configuration in proper order
        plugins: [
          basicBlocks,
          presetWebpage,
          forms,
          navbar,
          countdown,
          tabs,
          customCode,
          styleBg,
          exportPlg
        ],

        pluginsOpts: {
          'gjs-blocks-basic': {
            flexGrid: true,
            stylePrefix: 'gjs-',
            addBasicStyle: true,
            category: 'Basic',
            labelColumn1: '1 Column',
            labelColumn2: '2 Columns',
            labelColumn3: '3 Columns',
            labelText: 'Text',
            labelLink: 'Link',
            labelImage: 'Image',
            labelVideo: 'Video',
            labelMap: 'Map'
          },
          'gjs-preset-webpage': {
            modalImportTitle: 'Import Template',
            modalImportButton: 'Import',
            modalImportLabel: '',
            importViewerOptions: {},
            textViewerOptions: {},
            codeViewerOptions: {},
            blocksBasicOpts: {
              flexGrid: false
            },
            customCodeOpts: {},
            countdownOpts: {},
            formsOpts: {},
            navbarOpts: {},
            tabsOpts: {},
            styleBgOpts: {}
          },
          'grapesjs-plugin-forms': {
            category: 'Forms'
          },
          'grapesjs-navbar': {
            category: 'Navigation'
          },
          'grapesjs-component-countdown': {
            category: 'Extra'
          },
          'grapesjs-tabs': {
            category: 'Layout'
          },
          'grapesjs-custom-code': {
            category: 'Extra'
          },
          'grapesjs-style-bg': {},
          'grapesjs-plugin-export': {}
        },

        // Enhanced canvas configuration for better drag-and-drop
        canvas: {
          styles: [
            'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'
          ],
          scripts: []
        },

        // Storage manager disabled for now (we'll fix this separately)
        storageManager: false,

        // Don't load from element
        fromElement: false,

        // No default content - will be set later based on actual content
        components: '',

        // Enhanced drag-and-drop settings
        dragMode: 'absolute',

        // Device manager for responsive design
        deviceManager: {
          devices: [
            {
              name: 'Desktop',
              width: '',
            },
            {
              name: 'Tablet',
              width: '768px',
              widthMedia: '992px',
            },
            {
              name: 'Mobile',
              width: '320px',
              widthMedia: '768px',
            }
          ]
        },

        // Block manager settings
        blockManager: {
          appendTo: '.blocks-container',
          blocks: []
        }
      })

      editorInstance.StyleManager.getSectors().reset()
      editorInstance.StyleManager.addSectors(styleManagerConfig)

      // Wait for editor to be fully initialized
      editorInstance.on('load', () => {
        logger.info('Editor loaded, configuring blocks...')

        // Open all block categories
        const blockManager = editorInstance.BlockManager
        blockManager.getCategories().each((category: { set: (open: boolean) => void }) => {
          category.set(true)
        })

        // Add our custom blocks
        addCommonBlocks(editorInstance)

        logger.info('Available categories:', blockManager.getCategories().pluck('id'))
        logger.info('Available blocks:', blockManager.getAll().pluck('id'))
      })

      // Listen for storage:end:load event to properly handle content loading
      editorInstance.on('storage:end:load', () => {
        // Load saved content from API
        fetch(urlLoad)
          .then(r => r.ok ? r.json() : {})
          .then(data => {
            const gjsData: { 'gjs-html'?: string; 'gjs-css'?: string } = data;
            logger.info('Content loaded:', gjsData)

            // Check if current editor content is empty
            const currentHtml = editorInstance.getHtml().trim()
            const isEditorEmpty = !currentHtml || currentHtml === ''

            // If editor is empty and we have saved HTML content, load it
            if (isEditorEmpty && gjsData['gjs-html']) {
              try {
                editorInstance.setComponents(gjsData['gjs-html'])
                logger.info('Loaded saved HTML content')
              } catch (err) {
                console.warn('Could not apply saved HTML content:', err)
              }
            }

            // If we have saved CSS content, load it
            if (gjsData['gjs-css']) {
              try {
                editorInstance.setStyle(gjsData['gjs-css'])
                logger.info('Loaded saved CSS content')
              } catch (err) {
                console.warn('Could not apply saved CSS content:', err)
              }
            }

            // Only set fallback content if there's no real content
            if (isEditorEmpty && !gjsData['gjs-html']) {
              const fallbackContent = '<div style="padding: 40px; text-align: center;"><h1>Welcome to Designer Studio</h1><p>Start building your landing page by dragging blocks from the left panel</p></div>'
              editorInstance.setComponents(fallbackContent)
              logger.info('Set fallback content - no saved content found')
            }
          })
          .catch(err => {
            console.warn('Could not load saved content, using fallback:', err)
            // Set fallback content on error
            const fallbackContent = '<div style="padding: 40px; text-align: center;"><h1>Welcome to Designer Studio</h1><p>Start building your landing page by dragging blocks from the left panel</p></div>'
            editorInstance.setComponents(fallbackContent)
          })
      })

      // Set up autosave with debouncing
      let saveTimeout: NodeJS.Timeout
      editorInstance.on('update', () => {
        clearTimeout(saveTimeout)
        saveTimeout = setTimeout(async () => {
          try {
            const payload = {
              'gjs-html': editorInstance.getHtml(),
              'gjs-css': editorInstance.getCss(),
              'gjs-components': JSON.stringify(editorInstance.getComponents()),
              'gjs-styles': JSON.stringify(editorInstance.getStyle())
            }
            logger.info('Saving content...')
            const response = await fetch(urlStore, {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify(payload)
            })
            if (response.ok) {
              logger.info('Content saved successfully')
            }
          } catch (err) {
            console.warn('Save failed:', err)
          }
        }, 1000)
      })

      // Add publish button
      addPublishButton(editorInstance)

      // Store editor instance
      setEditor(editorInstance)
      logger.info('Editor ready!')

    } catch (err) {
      console.error('Failed to initialize editor:', err)
    }

    // Cleanup function
    return () => {
      if (editor && typeof (editor as Editor).destroy === 'function') {
        try {
          (editor as Editor).destroy();
        } catch (err) {
          console.warn('Error destroying editor:', err)
        }
      }
    }
  }, []) // Remove editor dependency to prevent recreation

  return (
    <div ref={elRef} className="grapesjs-editor">
      <style jsx global>{`
        .grapesjs-editor {
          height: 100vh;
          width: 100%;
        }
        
        /* Improve drag and drop visual feedback */
        .gjs-dashed *,
        .gjs-dashed {
          outline: 2px dashed #4299e1 !important;
          outline-offset: -2px;
        }
        
        /* Better block styling in sidebar */
        .gjs-block {
          min-height: 48px;
          transition: all 0.2s ease;
        }
        
        .gjs-block:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        /* Improve canvas area */
        .gjs-cv-canvas {
          background: #f8f9fa;
        }
        
        /* Better component selection */
        .gjs-selected {
          outline: 2px solid #4299e1 !important;
          outline-offset: -2px;
        }
        
        .gjs-selected-parent {
          outline: 1px solid #4299e1 !important;
          outline-offset: -1px;
          opacity: 0.7;
        }
      `}</style>
    </div>
  )
}
