import { randomBytes } from 'node:crypto';

const BASE_SECURITY_HEADERS = Object.freeze({
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
});

/**
 * Generates a fresh 128-bit cryptographic nonce encoded in base64 for dev CSP scripts.
 * @returns {string}
 */
export function generateCspNonce() {
  return randomBytes(16).toString('base64');
}

/**
 * Builds the Content-Security-Policy string differentiated strictly between
 * development (allowing only Vite-injected scripts with a cryptographic nonce + HMR WS)
 * and production (strict `script-src 'self'` and `connect-src 'self'`).
 * @param {{ isDev?: boolean, nonce?: string }} [options]
 * @returns {string}
 */
export function buildCspPolicy(options = {}) {
  const isDev = Boolean(options.isDev);
  const nonce = typeof options.nonce === 'string' ? options.nonce.trim() : '';

  if (isDev && !nonce) {
    throw new Error('Development CSP policy requires a cryptographic nonce.');
  }

  const scriptSrc = isDev ? `script-src 'self' 'nonce-${nonce}'` : "script-src 'self'";
  const connectSrc = isDev ? "connect-src 'self' ws: wss:" : "connect-src 'self'";

  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data:",
    "media-src 'self'",
    connectSrc,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
}

/**
 * Returns the complete HTTP security headers map for development or production.
 * @param {{ isDev?: boolean, nonce?: string }} [options]
 * @returns {Record<string, string>}
 */
export function buildSecurityHeaders(options = {}) {
  return {
    ...BASE_SECURITY_HEADERS,
    'Content-Security-Policy': buildCspPolicy(options),
  };
}
