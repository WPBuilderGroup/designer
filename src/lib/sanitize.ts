import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

const window = new JSDOM('').window
const DOMPurify = createDOMPurify(window)

export function sanitizeHtml(value: string) {
  return DOMPurify.sanitize(value)
}

export function sanitizeCss(value: string) {
  return DOMPurify.sanitize(value)
}

