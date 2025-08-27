import assert from 'node:assert'
import { describe, it } from 'node:test'

import { sanitizeHtml, sanitizeCss } from './sanitize'

describe('sanitizeHtml', () => {
  it('removes scripts and event handlers', () => {
    const dirty = '<img src=x onerror="alert(1)"><script>alert(1)</script>'
    const clean = sanitizeHtml(dirty)
    assert(!clean.includes('script'))
    assert(!clean.includes('onerror'))
  })
})

describe('sanitizeCss', () => {
  it('strips script tags', () => {
    const dirty = 'body { color: red; }<script>alert(1)</script>'
    const clean = sanitizeCss(dirty)
    assert(!clean.includes('script'))
  })
})

