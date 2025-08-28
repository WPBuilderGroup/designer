import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

const window = new JSDOM('').window
const DOMPurify = createDOMPurify(window)

export function sanitizeHtml(value: string) {
  return DOMPurify.sanitize(value)
}

export function sanitizeCss(value: string) {
  // Remove any embedded HTML/script tags
  let css = value.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
  css = css.replace(/<[^>]*>/g, '')

  // Neutralize javascript: protocol and legacy expression()
  css = css.replace(/javascript\s*:/gi, '')
  css = css.replace(/expression\s*\(/gi, '/* expression removed */(')

  return css
}

