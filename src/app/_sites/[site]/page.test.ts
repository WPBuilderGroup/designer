import { describe, it, expect } from 'vitest'
import { sanitizeHtml, sanitizeCss } from '../../../lib/sanitize'

describe('sanitize functions (sites page)', () => {
  it('removes event handlers from html', () => {
    const maliciousHtml = '<img src=x onerror="alert(1)" />'
    const html = sanitizeHtml(maliciousHtml)
    expect(html).not.toContain('onerror')
    // Allow either quoted or unquoted attribute serialization
    expect(html.includes('<img src="x">') || html.includes('<img src=x>')).toBe(true)
  })

  it('strips javascript urls from css', () => {
    const maliciousCss = 'body { background: url("javascript:alert(1)"); }'
    const css = sanitizeCss(maliciousCss)
    expect(css).not.toContain('javascript:')
  })
})
