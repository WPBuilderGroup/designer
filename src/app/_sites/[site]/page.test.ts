import { describe, it, expect } from 'vitest'
import { sanitizeContent } from './page'

describe('sanitizeContent', () => {
  it('removes event handlers from html', () => {
    const maliciousHtml = '<img src=x onerror="alert(1)" />'
    const { html } = sanitizeContent(maliciousHtml, '')
    expect(html).not.toContain('onerror')
    expect(html).toContain('<img src="x">')
  })

  it('strips javascript urls from css', () => {
    const maliciousCss = 'body { background: url("javascript:alert(1)"); }'
    const { css } = sanitizeContent('', maliciousCss)
    expect(css).not.toContain('javascript:')
  })
})
