#!/usr/bin/env node
import { mkdirSync, copyFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const src = resolve(process.cwd(), 'node_modules', 'grapesjs', 'dist', 'css', 'grapes.min.css')
const dest = resolve(process.cwd(), 'public', 'grapesjs', 'grapes.min.css')

try {
  if (!existsSync(src)) {
    console.warn('[copy-grapes-css] Source not found:', src)
    process.exit(0)
  }
  mkdirSync(dirname(dest), { recursive: true })
  copyFileSync(src, dest)
  console.log('[copy-grapes-css] Copied to', dest)
} catch (err) {
  console.warn('[copy-grapes-css] Failed:', err?.message || String(err))
}

