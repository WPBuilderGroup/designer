/**
 * GrapesJS Assets Manager configuration
 * Manages the media library and sample assets
 */
import { GrapesJSEditor } from '@/types/grapesjs-editor'

/**
 * Sample assets configuration
 * These assets will be available in the Assets Manager
 */
export const sampleAssets = [
  {
    type: 'image',
    src: '/assets-sample/hero-bg-1.jpg',
    name: 'Hero Background 1',
    category: 'Backgrounds'
  },
  {
    type: 'image',
    src: '/assets-sample/hero-bg-2.jpg',
    name: 'Hero Background 2',
    category: 'Backgrounds'
  },
  {
    type: 'image',
    src: '/assets-sample/team-1.jpg',
    name: 'Team Member 1',
    category: 'People'
  },
  {
    type: 'image',
    src: '/assets-sample/team-2.jpg',
    name: 'Team Member 2',
    category: 'People'
  },
  {
    type: 'image',
    src: '/assets-sample/team-3.jpg',
    name: 'Team Member 3',
    category: 'People'
  },
  {
    type: 'image',
    src: '/assets-sample/product-1.jpg',
    name: 'Product Image 1',
    category: 'Products'
  },
  {
    type: 'image',
    src: '/assets-sample/product-2.jpg',
    name: 'Product Image 2',
    category: 'Products'
  },
  {
    type: 'image',
    src: '/assets-sample/feature-icon-1.png',
    name: 'Feature Icon 1',
    category: 'Icons'
  },
  {
    type: 'image',
    src: '/assets-sample/feature-icon-2.png',
    name: 'Feature Icon 2',
    category: 'Icons'
  },
  {
    type: 'image',
    src: '/assets-sample/feature-icon-3.png',
    name: 'Feature Icon 3',
    category: 'Icons'
  },
  {
    type: 'image',
    src: '/assets-sample/logo-sample.png',
    name: 'Sample Logo',
    category: 'Logos'
  },
  {
    type: 'image',
    src: '/assets-sample/gallery-1.jpg',
    name: 'Gallery Image 1',
    category: 'Gallery'
  },
  {
    type: 'image',
    src: '/assets-sample/gallery-2.jpg',
    name: 'Gallery Image 2',
    category: 'Gallery'
  },
  {
    type: 'image',
    src: '/assets-sample/gallery-3.jpg',
    name: 'Gallery Image 3',
    category: 'Gallery'
  },
  {
    type: 'image',
    src: '/assets-sample/testimonial-1.jpg',
    name: 'Testimonial Avatar 1',
    category: 'Testimonials'
  },
  {
    type: 'image',
    src: '/assets-sample/testimonial-2.jpg',
    name: 'Testimonial Avatar 2',
    category: 'Testimonials'
  }
]

/**
 * Fallback assets using placeholder service for development
 * These will be used if the sample assets are not available
 */
export const fallbackAssets = [
  {
    type: 'image',
    src: 'https://via.placeholder.com/1920x1080/667eea/ffffff?text=Hero+Background+1',
    name: 'Hero Background 1',
    category: 'Backgrounds'
  },
  {
    type: 'image',
    src: 'https://via.placeholder.com/1920x1080/764ba2/ffffff?text=Hero+Background+2',
    name: 'Hero Background 2',
    category: 'Backgrounds'
  },
  {
    type: 'image',
    src: 'https://via.placeholder.com/400x400/007bff/ffffff?text=Team+Member+1',
    name: 'Team Member 1',
    category: 'People'
  },
  {
    type: 'image',
    src: 'https://via.placeholder.com/400x400/28a745/ffffff?text=Team+Member+2',
    name: 'Team Member 2',
    category: 'People'
  },
  {
    type: 'image',
    src: 'https://via.placeholder.com/400x400/dc3545/ffffff?text=Team+Member+3',
    name: 'Team Member 3',
    category: 'People'
  },
  {
    type: 'image',
    src: 'https://via.placeholder.com/600x400/6c757d/ffffff?text=Product+1',
    name: 'Product Image 1',
    category: 'Products'
  },
  {
    type: 'image',
    src: 'https://via.placeholder.com/600x400/17a2b8/ffffff?text=Product+2',
    name: 'Product Image 2',
    category: 'Products'
  },
  {
    type: 'image',
    src: 'https://via.placeholder.com/100x100/ffc107/000000?text=Icon+1',
    name: 'Feature Icon 1',
    category: 'Icons'
  },
  {
    type: 'image',
    src: 'https://via.placeholder.com/100x100/fd7e14/ffffff?text=Icon+2',
    name: 'Feature Icon 2',
    category: 'Icons'
  },
  {
    type: 'image',
    src: 'https://via.placeholder.com/100x100/e83e8c/ffffff?text=Icon+3',
    name: 'Feature Icon 3',
    category: 'Icons'
  },
  {
    type: 'image',
    src: 'https://via.placeholder.com/200x80/343a40/ffffff?text=Logo',
    name: 'Sample Logo',
    category: 'Logos'
  },
  {
    type: 'image',
    src: 'https://via.placeholder.com/800x600/20c997/ffffff?text=Gallery+1',
    name: 'Gallery Image 1',
    category: 'Gallery'
  },
  {
    type: 'image',
    src: 'https://via.placeholder.com/800x600/6f42c1/ffffff?text=Gallery+2',
    name: 'Gallery Image 2',
    category: 'Gallery'
  },
  {
    type: 'image',
    src: 'https://via.placeholder.com/800x600/fd7e14/ffffff?text=Gallery+3',
    name: 'Gallery Image 3',
    category: 'Gallery'
  },
  {
    type: 'image',
    src: 'https://via.placeholder.com/150x150/495057/ffffff?text=Avatar+1',
    name: 'Testimonial Avatar 1',
    category: 'Testimonials'
  },
  {
    type: 'image',
    src: 'https://via.placeholder.com/150x150/6c757d/ffffff?text=Avatar+2',
    name: 'Testimonial Avatar 2',
    category: 'Testimonials'
  }
]

/**
 * Configure and populate the Assets Manager
 * @param editor - The GrapesJS editor instance
 */
export function configureAssets(editor: GrapesJSEditor): void {
  if (!editor) {
    console.warn('Editor instance not provided to configureAssets')
    return
  }

  try {
    const assetManager = editor.AssetManager

    // Configure asset manager settings
    assetManager.setTarget(assetManager.getContainer())

    // Add sample assets (use fallback for development)
    const assetsToAdd = process.env.NODE_ENV === 'development' ? fallbackAssets : sampleAssets

    // Add assets to the manager
    assetManager.add(assetsToAdd)

    // Configure asset manager behavior
    editor.on('asset:add', (asset: unknown) => {
      if (asset && typeof (asset as { get?: (key: string) => unknown }).get === 'function') {
        console.log('Asset added:', (asset as { get: (key: string) => unknown }).get('src'))
      }
    })

    // Configure drag and drop for assets
    editor.on('canvas:dragover', (e: unknown) => {
      e.preventDefault()
    })

    editor.on('canvas:drop', (e: unknown) => {
      e.preventDefault()
      // Handle file drops here if needed
    })

    console.log('Assets Manager configured successfully')
  } catch (error) {
    console.error('Failed to configure Assets Manager:', error)
  }
}

/**
 * Create the assets directory structure for sample images
 * This is a reference for the expected directory structure
 */
export const expectedAssetsStructure = {
  '/public/assets-sample/': [
    'hero-bg-1.jpg',
    'hero-bg-2.jpg',
    'team-1.jpg',
    'team-2.jpg',
    'team-3.jpg',
    'product-1.jpg',
    'product-2.jpg',
    'feature-icon-1.png',
    'feature-icon-2.png',
    'feature-icon-3.png',
    'logo-sample.png',
    'gallery-1.jpg',
    'gallery-2.jpg',
    'gallery-3.jpg',
    'testimonial-1.jpg',
    'testimonial-2.jpg'
  ]
}
