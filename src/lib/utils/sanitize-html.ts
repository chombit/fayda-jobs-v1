import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Only allows safe HTML tags for job descriptions
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  
  const config = {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ol', 'ul', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre',
      'a', 'div', 'span'
    ],
    ALLOWED_ATTR: [
      'href', 'title', 'alt', 'class', 'id', 'target', 'rel'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    ADD_ATTR: ['target'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur'],
    SANITIZE_DOM: true,
    KEEP_CONTENT: true
  };

  return DOMPurify.sanitize(html, config);
}

/**
 * Sanitizes text content (removes all HTML)
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
}

/**
 * Validates and sanitizes URLs
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';
  
  try {
    const parsed = new URL(url);
    // Only allow http, https, mailto, tel protocols
    if (['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol)) {
      return parsed.href;
    }
    return '';
  } catch {
    return '';
  }
}

/**
 * Sanitizes user input for search and forms
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML brackets
    .slice(0, 1000); // Limit length
}
