import { test } from 'vitest'
import assert from 'node:assert/strict'
import { NextRequest } from 'next/server'
import { GET } from '../src/app/sites/[...site]/route'
import fs from 'fs/promises'
import path from 'path'

const baseDir = path.resolve(process.cwd(), '.next', 'cache', 'sites')

test('returns content for valid path', async () => {
  await fs.mkdir(path.join(baseDir, 'proj'), { recursive: true })
  await fs.writeFile(path.join(baseDir, 'proj', 'index.html'), '<h1>Hi</h1>')

  const res = await GET(new NextRequest('http://example.com'), {
    params: Promise.resolve({ site: ['proj', 'index.html'] })
  })
  assert.strictEqual(res.status, 200)
  assert.strictEqual(await res.text(), '<h1>Hi</h1>')
})

test('returns 400 for path traversal', async () => {
  const res = await GET(new NextRequest('http://example.com'), {
    params: Promise.resolve({ site: ['proj', '../secret'] })
  })
  assert.strictEqual(res.status, 400)
})
