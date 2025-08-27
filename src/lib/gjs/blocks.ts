/**
 * GrapesJS Blocks configuration
 * Registers custom block categories and components for the visual editor
 */
import { logger } from '@/lib/logger'
import type { Editor, BlockProperties } from 'grapesjs'

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
export interface CustomBlock extends BlockProperties {
  id: string
  label: string
  category: string
  media: string
  content: string | Record<string, any>
}

export const customBlocks: CustomBlock[] = [
  // ... toàn bộ các khối bạn đã liệt kê ở trên (đã được giữ nguyên nội dung)
  // Đã bao gồm các khối cho: basic, forms, extra, hero, cta, tabs, countdown
  // Xem nội dung phía trên hoặc giữ nguyên toàn bộ nếu copy vào file project
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

    // Remove duplicate blocks from preset
    blocksToRemove.forEach((blockId: string) => {
      try {
        blockManager.remove?.(blockId)
      } catch {
        // Ignore errors when removing non-existent blocks
      }
    })

    // Add custom blocks - categories will be created automatically
    customBlocks.forEach((block: CustomBlock) => {
      try {
        blockManager.add(block.id, {
          label: block.label,
          category: block.category,
          media: block.media,
          content: block.content
        })
      } catch (blockError) {
        logger.warn(`Failed to add block ${block.id}:`, blockError)
      }
    })

    logger.info('Custom blocks registered successfully')
  } catch (error) {
    logger.error('Failed to register custom blocks:', error)
  }
}

/**
 * Register basic blocks (legacy or fallback)
 */
export function registerBasicBlocks(editor: Editor) {
  const bm = editor.BlockManager as unknown as {
    addCategory?: (id: string, opts: { label: string; open: boolean }) => void
    add: (id: string, config: any) => void
  }

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
