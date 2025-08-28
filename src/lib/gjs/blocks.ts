/**
 * GrapesJS Blocks configuration
 * Registers custom block categories and components for the visual editor
 */
import type { Editor, BlockProperties } from 'grapesjs'
import { logger } from '@/lib/logger'

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
  { id: 'countdown', label: 'Countdown', open: false },
]

/**
 * Interface for custom blocks
 */
export interface CustomBlock extends BlockProperties {
  id: string
  label: string
  category: string
  media: string
  content: string | Record<string, any>
}

/**
 * Array of custom block definitions
 * ⚠️ NOTE: Bạn cần thêm lại customBlocks vào đây nếu có
 */
export const customBlocks: CustomBlock[] = [
  {
    id: 'section-hero',
    label: 'Hero Section',
    category: 'hero',
    media:
      '<div style="width:100%;height:40px;background:#667eea;border-radius:4px;display:flex;align-items:center;justify-content:center;color:white;font-size:11px;">Hero</div>',
    content:
      `<section class="hero-section" style="padding:80px 20px;text-align:center;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;">
        <div style="max-width:800px;margin:0 auto;">
          <h1 style="font-size:3rem;margin-bottom:1rem;font-weight:bold;">Your Amazing Hero Title</h1>
          <p style="font-size:1.2rem;margin-bottom:2rem;opacity:0.9;">A compelling subtitle that explains your value proposition</p>
          <a href="#" style="background:#ff6b6b;color:white;padding:12px 30px;border-radius:6px;text-decoration:none;display:inline-block;font-weight:600;">Get Started</a>
        </div>
      </section>`
  },
  {
    id: 'section-features',
    label: 'Features Grid',
    category: 'features',
    media:
      '<div style="width:100%;height:40px;background:#48bb78;border-radius:4px;display:flex;align-items:center;justify-content:center;color:white;font-size:11px;">Features</div>',
    content:
      `<section class="features-section" style="padding:80px 20px;background:#f7fafc;">
        <div style="max-width:1200px;margin:0 auto;">
          <h2 style="text-align:center;font-size:2.0rem;margin-bottom:2rem;color:#2d3748;">Our Features</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:2rem;">
            <div style="text-align:center;padding:2rem;background:white;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
              <div style="width:60px;height:60px;background:#4299e1;border-radius:50%;margin:0 auto 1rem;"></div>
              <h3 style="font-size:1.25rem;margin-bottom:0.5rem;color:#2d3748;">Fast Performance</h3>
              <p style="color:#718096;">Lightning-fast loading times for the best user experience</p>
            </div>
            <div style="text-align:center;padding:2rem;background:white;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
              <div style="width:60px;height:60px;background:#48bb78;border-radius:50%;margin:0 auto 1rem;"></div>
              <h3 style="font-size:1.25rem;margin-bottom:0.5rem;color:#2d3748;">Secure & Reliable</h3>
              <p style="color:#718096;">Bank-level security with 99.9% uptime guarantee</p>
            </div>
            <div style="text-align:center;padding:2rem;background:white;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
              <div style="width:60px;height:60px;background:#ed8936;border-radius:50%;margin:0 auto 1rem;"></div>
              <h3 style="font-size:1.25rem;margin-bottom:0.5rem;color:#2d3748;">Easy to Use</h3>
              <p style="color:#718096;">Intuitive interface designed for everyone</p>
            </div>
          </div>
        </div>
      </section>`
  },
  {
    id: 'section-pricing',
    label: 'Pricing Table',
    category: 'pricing',
    media:
      '<div style="width:100%;height:40px;background:#9f7aea;border-radius:4px;display:flex;align-items:center;justify-content:center;color:white;font-size:11px;">Pricing</div>',
    content:
      `<section class="pricing-section" style="padding:80px 20px;background:white;">
        <div style="max-width:1000px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;">
          <div style="border:1px solid #e2e8f0;padding:1.5rem;border-radius:8px;text-align:center;">
            <h3 style="font-size:1.25rem;margin-bottom:0.5rem;color:#2d3748;">Starter</h3>
            <div style="font-size:2rem;font-weight:bold;color:#4299e1;margin-bottom:0.5rem;">$9<span style="font-size:0.875rem;color:#718096;">/mo</span></div>
            <ul style="list-style:none;padding:0;margin-bottom:1rem;color:#718096;">
              <li style="padding:0.25rem 0;">✓ 5 Projects</li>
              <li style="padding:0.25rem 0;">✓ 10GB Storage</li>
              <li style="padding:0.25rem 0;">✓ Email Support</li>
            </ul>
            <a href="#" style="display:inline-block;padding:10px 20px;border-radius:6px;background:#4299e1;color:white;text-decoration:none;">Choose</a>
          </div>
          <div style="border:2px solid #9f7aea;padding:1.5rem;border-radius:8px;text-align:center;">
            <h3 style="font-size:1.25rem;margin-bottom:0.5rem;color:#2d3748;">Pro</h3>
            <div style="font-size:2rem;font-weight:bold;color:#9f7aea;margin-bottom:0.5rem;">$29<span style="font-size:0.875rem;color:#718096;">/mo</span></div>
            <ul style="list-style:none;padding:0;margin-bottom:1rem;color:#718096;">
              <li style="padding:0.25rem 0;">✓ Unlimited Projects</li>
              <li style="padding:0.25rem 0;">✓ 1TB Storage</li>
              <li style="padding:0.25rem 0;">✓ Priority Support</li>
            </ul>
            <a href="#" style="display:inline-block;padding:10px 20px;border-radius:6px;background:#9f7aea;color:white;text-decoration:none;">Choose</a>
          </div>
        </div>
      </section>`
  },
]

/**
 * Blocks to remove from default preset
 */
export const blocksToRemove = [
  'column1',
  'column2',
  'column3',
  'column3-7',
  'text',
  'image',
  'video',
  'link',
]

/**
 * Register all custom blocks
 */
export function registerBlocks(editor: Editor): void {
  if (!editor) {
    logger.warn('Editor instance not provided to registerBlocks')
    return
  }

  try {
    const blockManager = editor.BlockManager

    if (!blockManager) {
      logger.warn('Block Manager not found in editor - blocks configuration skipped')
      return
    }

    // Remove default blocks
    blocksToRemove.forEach((blockId: string) => {
      try {
        blockManager.remove?.(blockId)
      } catch {
        // Silent fail if block doesn't exist
      }
    })

    // Add custom blocks (if defined)
    if (customBlocks.length > 0) {
      customBlocks.forEach((block: CustomBlock) => {
        try {
          blockManager.add(block.id, {
            label: block.label,
            category: block.category,
            media: block.media,
            content: block.content,
          })
        } catch (blockError) {
          logger.warn(`Failed to add block ${block.id}:`, blockError)
        }
      })
    }

    logger.info('Custom blocks registered successfully')
  } catch (error) {
    logger.error('Failed to register custom blocks:', error)
  }
}

/**
 * Fallback for basic blocks (in case custom ones fail or for minimal setups)
 */
export function registerBasicBlocks(editor: Editor) {
  const bm = editor.BlockManager as unknown as {
    addCategory?: (id: string, opts: { label: string; open: boolean }) => void
    add: (id: string, config: any) => void
  }

  // Create/open the 'basic' category when supported (GrapesJS >= 0.21)
  bm.addCategory?.('basic', { label: 'Basic', open: true })

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
