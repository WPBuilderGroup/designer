
// Simple regex-based sanitization as fallback when DOMPurify is unavailable.
// Removes script tags, dangerous attributes, and disallowed tags.
const ALLOWED_TAGS = ['a','b','i','em','strong','p','div','span','ul','ol','li','h1','h2','h3','h4','h5','h6','img','br'];
const ALLOWED_ATTR = ['href','src','alt','title','style'];

export function sanitizeHtml(html) {
  // Remove script tags and content
  let sanitized = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  // Remove event handler attributes
  sanitized = sanitized.replace(/\son\w+="[^"]*"/gi, '');
  // Remove disallowed tags
  sanitized = sanitized.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tag) => {
    return ALLOWED_TAGS.includes(tag.toLowerCase()) ? match : '';
  });
  // Remove disallowed attributes
  sanitized = sanitized.replace(/<([a-z][a-z0-9]*)([^>]*)>/gi, (match, tag, attrs) => {
    const safeAttrs = attrs
      .split(/\s+/)
      .filter(attr => {
        const eqIdx = attr.indexOf('=');
        if (eqIdx === -1) return false;
        const name = attr.slice(0, eqIdx).toLowerCase();
        return ALLOWED_ATTR.includes(name);
      })
      .join(' ');
    return `<${tag}${safeAttrs ? ' ' + safeAttrs : ''}>`;
  });
  return sanitized;
}

export function sanitizeCss(css) {
  let sanitized = css.replace(/expression\s*\([^)]*\)/gi, '');
  sanitized = sanitized.replace(/url\(\s*['"]?javascript:[^)]+\)/gi, '');
  return sanitized;
}

