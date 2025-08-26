/**
 * GrapesJS Blocks configuration
 * Registers custom block categories and components for the visual editor
 */

/**
 * Block categories configuration
 */
export const blockCategories = [
  { id: 'basic', label: 'Basic', open: true },
  { id: 'forms', label: 'Forms', open: false },
  { id: 'extra', label: 'Extra', open: false },
  { id: 'hero', label: 'Hero', open: false },
  { id: 'cta', label: 'Call to Action', open: false },
  { id: 'features', label: 'Features', open: false },
  { id: 'gallery', label: 'Gallery', open: false },
  { id: 'faq', label: 'FAQ', open: false },
  { id: 'footer', label: 'Footer', open: false },
  { id: 'navbar', label: 'Navbar', open: false },
  { id: 'tabs', label: 'Tabs', open: false },
  { id: 'countdown', label: 'Countdown', open: false }
]

/**
 * Custom blocks configuration
 */
export const customBlocks = [
  // Basic Category
  {
    id: 'heading-custom',
    label: 'Heading',
    category: 'basic',
    media: `<svg width="100%" height="50px" viewBox="0 0 24 24" fill="none">
      <path d="M6 4v4h4V4h2v8H4V4h2zM14 4h6v2h-2v6h2v2h-6v-2h2V6h-2V4z" fill="currentColor"/>
    </svg>`,
    content: {
      type: 'text',
      content: 'Heading Text',
      style: {
        'font-size': '32px',
        'font-weight': 'bold',
        'line-height': '1.2',
        'margin': '0 0 16px 0'
      }
    }
  },
  {
    id: 'text-custom',
    label: 'Text',
    category: 'basic',
    media: `<svg width="100%" height="50px" viewBox="0 0 24 24" fill="none">
      <path d="M3 17h18v2H3v-2zm0-4h18v2H3v-2zm0-4h18v2H3V9zm0-4h18v2H3V5z" fill="currentColor"/>
    </svg>`,
    content: {
      type: 'text',
      content: 'This is a text block. You can edit this text and style it as needed.',
      style: {
        'line-height': '1.6',
        'color': '#333'
      }
    }
  },
  {
    id: 'button-custom',
    label: 'Button',
    category: 'basic',
    media: `<svg width="100%" height="50px" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="8" width="16" height="8" rx="2" fill="currentColor"/>
    </svg>`,
    content: {
      type: 'link',
      content: 'Click me',
      style: {
        'display': 'inline-block',
        'padding': '12px 24px',
        'background-color': '#007bff',
        'color': 'white',
        'text-decoration': 'none',
        'border-radius': '6px',
        'font-weight': '500',
        'transition': 'background-color 0.2s'
      },
      attributes: { href: '#' }
    }
  },
  {
    id: 'section-custom',
    label: 'Section',
    category: 'basic',
    media: `<svg width="100%" height="50px" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
    </svg>`,
    content: `<section style="padding: 60px 20px; text-align: center;">
      <h2 style="font-size: 32px; margin-bottom: 16px;">Section Title</h2>
      <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0 auto;">Section description goes here.</p>
    </section>`
  },

  // Forms Category
  {
    id: 'contact-form',
    label: 'Contact Form',
    category: 'forms',
    media: `<svg width="100%" height="50px" viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M8 12h8M8 16h8M8 8h2" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    content: `<form style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Name</label>
        <input type="text" name="name" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px;">
      </div>
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Email</label>
        <input type="email" name="email" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px;">
      </div>
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Message</label>
        <textarea name="message" rows="5" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;"></textarea>
      </div>
      <button type="submit" style="background: #007bff; color: white; padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer;">Send Message</button>
    </form>`
  },
  {
    id: 'newsletter-form',
    label: 'Newsletter',
    category: 'forms',
    media: `<svg width="100%" height="50px" viewBox="0 0 24 24" fill="none">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M22 6l-10 7L2 6" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    content: `<div style="background: #f8f9fa; padding: 40px 20px; text-align: center;">
      <h3 style="margin-bottom: 10px;">Subscribe to our Newsletter</h3>
      <p style="color: #666; margin-bottom: 20px;">Get the latest updates and offers.</p>
      <form style="display: flex; max-width: 400px; margin: 0 auto; gap: 10px;">
        <input type="email" placeholder="Enter your email" style="flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 4px;">
        <button type="submit" style="background: #28a745; color: white; padding: 12px 20px; border: none; border-radius: 4px;">Subscribe</button>
      </form>
    </div>`
  },

  // Extra Category
  {
    id: 'two-columns',
    label: '2 Columns',
    category: 'extra',
    media: `<svg width="100%" height="50px" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="9" height="16" stroke="currentColor" stroke-width="2" fill="none"/>
      <rect x="13" y="4" width="9" height="16" stroke="currentColor" stroke-width="2" fill="none"/>
    </svg>`,
    content: `<div style="display: flex; gap: 20px; padding: 20px;">
      <div style="flex: 1;">
        <h3>Column 1</h3>
        <p>Content for the first column goes here.</p>
      </div>
      <div style="flex: 1;">
        <h3>Column 2</h3>
        <p>Content for the second column goes here.</p>
      </div>
    </div>`
  },
  {
    id: 'image-custom',
    label: 'Image',
    category: 'extra',
    media: `<svg width="100%" height="50px" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
      <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="2"/>
      <path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    content: {
      type: 'image',
      style: {
        'max-width': '100%',
        'height': 'auto'
      },
      attributes: {
        src: 'https://via.placeholder.com/600x400?text=Image',
        alt: 'Placeholder image'
      }
    }
  },
  {
    id: 'video-custom',
    label: 'Video',
    category: 'extra',
    media: `<svg width="100%" height="50px" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M10 8l6 4-6 4V8z" fill="currentColor"/>
    </svg>`,
    content: `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
      <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen></iframe>
    </div>`
  },

  // Hero Category
  {
    id: 'hero-simple',
    label: 'Simple Hero',
    category: 'hero',
    media: `<svg width="100%" height="50px" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="6" width="20" height="12" stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M7 10h10M9 14h6" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    content: `<section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 100px 20px; text-align: center;">
      <h1 style="font-size: 48px; margin-bottom: 20px; font-weight: bold;">Welcome to Our Platform</h1>
      <p style="font-size: 20px; margin-bottom: 30px; opacity: 0.9;">Discover amazing features and transform your business today</p>
      <a href="#" style="display: inline-block; background: white; color: #667eea; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">Get Started</a>
    </section>`
  },
  {
    id: 'hero-with-image',
    label: 'Hero with Image',
    category: 'hero',
    media: `<svg width="100%" height="50px" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="10" height="16" stroke="currentColor" stroke-width="2" fill="none"/>
      <rect x="14" y="6" width="8" height="12" stroke="currentColor" stroke-width="2" fill="none"/>
    </svg>`,
    content: `<section style="display: flex; align-items: center; min-height: 500px; padding: 60px 20px;">
      <div style="flex: 1; padding-right: 40px;">
        <h1 style="font-size: 42px; margin-bottom: 20px; color: #333;">Build Amazing Websites</h1>
        <p style="font-size: 18px; color: #666; margin-bottom: 30px; line-height: 1.6;">Create stunning, responsive websites with our powerful drag-and-drop builder.</p>
        <a href="#" style="display: inline-block; background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; margin-right: 15px;">Start Building</a>
        <a href="#" style="display: inline-block; color: #007bff; padding: 15px 30px; text-decoration: none; border: 2px solid #007bff; border-radius: 6px;">Learn More</a>
      </div>
      <div style="flex: 1;">
        <img src="https://via.placeholder.com/500x400?text=Hero+Image" alt="Hero Image" style="width: 100%; border-radius: 8px;">
      </div>
    </section>`
  },

  // CTA Category
  {
    id: 'cta-simple',
    label: 'Simple CTA',
    category: 'cta',
    media: `<svg width="100%" height="50px" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="8" width="18" height="8" rx="4" fill="currentColor"/>
      <path d="M16 12l-4-4v8l4-4z" fill="white"/>
    </svg>`,
    content: `<section style="background: #28a745; color: white; padding: 60px 20px; text-align: center;">
      <h2 style="font-size: 36px; margin-bottom: 15px;">Ready to Get Started?</h2>
      <p style="font-size: 18px; margin-bottom: 30px; opacity: 0.9;">Join thousands of satisfied customers today</p>
      <a href="#" style="display: inline-block; background: white; color: #28a745; padding: 15px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 18px;">Start Free Trial</a>
    </section>`
  },
  {
    id: 'cta-with-features',
    label: 'CTA with Features',
    category: 'cta',
    media: `<svg width="100%" height="50px" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M8 12l2 2 6-6" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    content: `<section style="background: #f8f9fa; padding: 60px 20px; text-align: center;">
      <h2 style="font-size: 36px; margin-bottom: 15px; color: #333;">Why Choose Us?</h2>
      <div style="display: flex; justify-content: center; gap: 40px; margin: 40px 0;">
        <div style="text-align: center;">
          <div style="width: 60px; height: 60px; background: #007bff; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">✓</div>
          <h4>Fast</h4>
        </div>
        <div style="text-align: center;">
          <div style="width: 60px; height: 60px; background: #007bff; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">✓</div>
          <h4>Secure</h4>
        </div>
        <div style="text-align: center;">
          <div style="width: 60px; height: 60px; background: #007bff; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">✓</div>
          <h4>Reliable</h4>
        </div>
      </div>
      <a href="#" style="display: inline-block; background: #007bff; color: white; padding: 15px 40px; text-decoration: none; border-radius: 6px; font-weight: 600;">Get Started Now</a>
    </section>`
  },

  // Tabs Category
  {
    id: 'tabs-simple',
    label: 'Simple Tabs',
    category: 'tabs',
    media: `<svg width="100%" height="50px" viewBox="0 0 24 24" fill="none">
      <path d="M3 4h6v2H3V4zM11 4h6v2h-6V4zM19 4h2v2h-2V4z" fill="currentColor"/>
      <rect x="3" y="8" width="18" height="12" stroke="currentColor" stroke-width="2" fill="none"/>
    </svg>`,
    content: `<div style="max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="border-bottom: 1px solid #ddd; margin-bottom: 20px;">
        <button style="padding: 10px 20px; border: none; background: #007bff; color: white; margin-right: 5px;">Tab 1</button>
        <button style="padding: 10px 20px; border: none; background: #f8f9fa; color: #333; margin-right: 5px;">Tab 2</button>
        <button style="padding: 10px 20px; border: none; background: #f8f9fa; color: #333;">Tab 3</button>
      </div>
      <div style="padding: 20px;">
        <h3>Tab Content 1</h3>
        <p>This is the content for the first tab. You can add any content here.</p>
      </div>
    </div>`
  },

  // Countdown Category
  {
    id: 'countdown-simple',
    label: 'Simple Countdown',
    category: 'countdown',
    media: `<svg width="100%" height="50px" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    content: `<div style="text-align: center; padding: 40px 20px; background: #f8f9fa;">
      <h2 style="margin-bottom: 30px; color: #333;">Special Offer Ends In</h2>
      <div style="display: flex; justify-content: center; gap: 20px;">
        <div style="text-align: center; background: white; padding: 20px; border-radius: 8px; min-width: 80px;">
          <div style="font-size: 36px; font-weight: bold; color: #007bff;">30</div>
          <div style="font-size: 14px; color: #666;">Days</div>
        </div>
        <div style="text-align: center; background: white; padding: 20px; border-radius: 8px; min-width: 80px;">
          <div style="font-size: 36px; font-weight: bold; color: #007bff;">12</div>
          <div style="font-size: 14px; color: #666;">Hours</div>
        </div>
        <div style="text-align: center; background: white; padding: 20px; border-radius: 8px; min-width: 80px;">
          <div style="font-size: 36px; font-weight: bold; color: #007bff;">45</div>
          <div style="font-size: 14px; color: #666;">Minutes</div>
        </div>
        <div style="text-align: center; background: white; padding: 20px; border-radius: 8px; min-width: 80px;">
          <div style="font-size: 36px; font-weight: bold; color: #007bff;">30</div>
          <div style="font-size: 14px; color: #666;">Seconds</div>
        </div>
      </div>
    </div>`
  }
]

/**
 * Blocks to remove from the default preset to avoid duplicates
 */
export const blocksToRemove = [
  'column1',
  'column2',
  'column3',
  'column3-7',
  'text',
  'image',
  'video',
  'link'
]

/**
 * Register custom blocks and configure the Block Manager
 * @param editor - The GrapesJS editor instance
 */
export function registerBlocks(editor: any): void {
  if (!editor) {
    console.warn('Editor instance not provided to registerBlocks')
    return
  }

  try {
    const blockManager = editor.BlockManager

    if (!blockManager) {
      console.warn('Block Manager not found in editor - blocks configuration skipped')
      return
    }

    // Remove duplicate blocks from preset
    blocksToRemove.forEach((blockId: string) => {
      try {
        blockManager.remove?.(blockId)
      } catch (e) {
        // Ignore errors when removing non-existent blocks
      }
    })

    // Don't manually create categories - let them be created automatically with blocks
    // Categories will be created automatically when blocks are added with category property

    // Add custom blocks - categories will be created automatically
    customBlocks.forEach((block: any) => {
      try {
        blockManager.add(block.id, {
          label: block.label,
          category: block.category, // Category will be created automatically if it doesn't exist
          media: block.media,
          content: block.content
        })
      } catch (blockError) {
        console.warn(`Failed to add block ${block.id}:`, blockError)
      }
    })

    console.log('Custom blocks registered successfully')
  } catch (error) {
    console.error('Failed to register custom blocks:', error)
  }
}

import type { Editor } from 'grapesjs'

export function registerBasicBlocks(editor: Editor) {
  const bm = editor.BlockManager
  // Attempt to create/open the 'basic' category when supported (GrapesJS >= 0.21)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(bm as any).addCategory?.('basic', { label: 'Basic', open: true })

  bm.add('section', {
    label: 'Section',
    category: 'basic',
    select: true,
    activate: true,
    content: '<section class="p-6">Section</section>',
  })

  bm.add('text', {
    label: 'Text',
    category: 'basic',
    select: true,
    activate: true,
    content: '<p>Insert your text</p>',
  })

  bm.add('image', {
    label: 'Image',
    category: 'basic',
    select: true,
    activate: true,
    content: '<img src="https://picsum.photos/800/400" alt="image" />',
  })
}
