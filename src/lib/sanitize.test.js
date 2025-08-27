import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeHtml, sanitizeCss } from './sanitize.mjs';

describe('sanitize', () => {
  it('removes script tags from html', () => {
    const dirty = '<div>ok</div><script>alert(1)</script>';
    const clean = sanitizeHtml(dirty);
    assert.equal(clean.includes('<script>'), false);
  });

  it('removes dangerous urls from css', () => {
    const dirty = "body { background-image: url('javascript:alert(1)'); }";
    const clean = sanitizeCss(dirty);
    assert.equal(clean.includes('javascript:'), false);
  });
});
