import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateCspNonce,
  buildCspPolicy,
  buildSecurityHeaders,
} from './csp-utils.mjs';

test('generateCspNonce generates unique 128-bit base64 nonces', () => {
  const a = generateCspNonce();
  const b = generateCspNonce();
  assert.ok(a.length >= 22);
  assert.notEqual(a, b);
});

test('production CSP keeps strict script-src self without unsafe-inline, unsafe-eval, nonces, or ws', () => {
  const headers = buildSecurityHeaders({ isDev: false });
  const csp = headers['Content-Security-Policy'];

  assert.equal(headers['X-Content-Type-Options'], 'nosniff');
  assert.equal(headers['Referrer-Policy'], 'strict-origin-when-cross-origin');
  assert.equal(headers['Permissions-Policy'], 'camera=(), microphone=(), geolocation=()');

  assert.match(csp, /(?:^|;\s*)script-src 'self'(?:;|$)/);
  assert.match(csp, /(?:^|;\s*)connect-src 'self'(?:;|$)/);
  assert.doesNotMatch(csp, /script-src[^;]*'unsafe-inline'/);
  assert.doesNotMatch(csp, /'unsafe-eval'/);
  assert.doesNotMatch(csp, /nonce-/);
  assert.doesNotMatch(csp, /\bws:|wss:/);
});

test('development CSP enables Vite React Refresh via cryptographic nonce without unsafe-inline in script-src', () => {
  const nonce = generateCspNonce();
  const headers = buildSecurityHeaders({ isDev: true, nonce });
  const csp = headers['Content-Security-Policy'];

  assert.match(csp, new RegExp(`script-src 'self' 'nonce-${nonce.replace(/[+/=]/g, '\\$&')}'`));
  assert.match(csp, /connect-src 'self' ws: wss:/);
  assert.doesNotMatch(csp, /script-src[^;]*'unsafe-inline'/);
  assert.doesNotMatch(csp, /'unsafe-eval'/);
  assert.match(csp, /object-src 'none'/);
  assert.match(csp, /media-src 'self'/);
});

test('buildCspPolicy rejects dev mode without a valid nonce', () => {
  assert.throws(() => buildCspPolicy({ isDev: true, nonce: '' }), /requires a cryptographic nonce/i);
});
