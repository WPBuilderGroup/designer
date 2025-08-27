export const ALLOWED_TAGS = [
  'a','b','i','u','p','div','span','h1','h2','h3','h4','h5','h6',
  'ul','ol','li','strong','em','img','section','article','header','footer'
]

export const ALLOWED_ATTRS = ['href','src','alt','title','class','id','style']

export function sanitizeHtml(input) {
  if (!input) return ''
  // remove script tags completely
  let sanitized = input.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
  // remove event handlers
  sanitized = sanitized.replace(/ on[a-z]+="[^"]*"/gi, '')
  sanitized = sanitized.replace(/ on[a-z]+='[^']*'/gi, '')
  // filter tags and attributes
  sanitized = sanitized.replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (match, tag, attrs) => {
    tag = tag.toLowerCase()
    if (!ALLOWED_TAGS.includes(tag)) {
      return ''
    }
    if (match.startsWith('</')) {
      return `</${tag}>`
    }
    const safeAttrs = (attrs || '').replace(/\s([a-z0-9-:]+)(=([^\s"'>]+|"[^"]*"|'[^']*'))/gi, (m, attr) => {
      return ALLOWED_ATTRS.includes(attr.toLowerCase()) ? m : ''
    })
    return `<${tag}${safeAttrs}>`
  })
  return sanitized
}

export function sanitizeCss(input) {
  if (!input) return ''
  // strip out anything that looks like a script tag or javascript urls
  return input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/expression\s*\([^\)]*\)/gi, '')
    .replace(/url\s*\(\s*['"]?javascript:[^'"\)]*['"]?\s*\)/gi, '')
}
