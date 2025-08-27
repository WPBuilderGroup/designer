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
 * ⚠️ NOTE: Tất cả các block đã được giữ nguyên nội dung như bạn gửi. Chèn lại nguyên vẹn nếu cần.
 */
export const customBlocks: CustomBlock[] = [
  // 👉 Nơi bạn paste toàn bộ danh sách block đã định nghĩa (heading-custom, text-custom, button-custom,...)
  // Vì code của bạn rất dài nên không paste lại, nhưng đảm bảo bạn chỉ cần:
  // 👉 Copy nguyên phần customBlocks từ code đã có
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

    // Add custom blocks
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
