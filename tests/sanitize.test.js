import { test } from 'node:test'
import assert from 'node:assert/strict'
import { sanitizeHtml, sanitizeCss } from '../src/lib/sanitize.js'

test('sanitizeHtml removes scripts and disallowed attrs', () => {
  const dirty = '<img src=x onerror="alert(1)"><script>alert("xss")</script><p>ok</p>'
  const clean = sanitizeHtml(dirty)
  assert(!clean.includes('script'))
  assert(!clean.includes('onerror'))
  assert.equal(clean.includes('<p>ok</p>'), true)
})

test('sanitizeCss strips script tags', () => {
  const dirty = 'body { color: red; }<script>alert(1)</script>'
  const clean = sanitizeCss(dirty)
  assert(!clean.includes('script'))
})
