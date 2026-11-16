/**
 * AV·STUDIO — Pure SEO & Indexing Build Utilities
 * Validates optional SITE_URL and generates clean sitemap.xml and robots.txt
 * excluding conceptual noindex demo pages and never inventing fake domains.
 */

export const INDEXABLE_PATHS = Object.freeze(['/', '/politica-privacidad.html']);

/**
 * Normalizes an optional public base URL (https:// or http://) without trailing slash.
 * Returns empty string if unset, placeholder, or invalid.
 * @param {unknown} rawUrl
 * @returns {string}
 */
export function normalizeSiteUrl(rawUrl) {
  if (typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (!trimmed || trimmed === 'MY_APP_URL') return '';
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return '';
    }
    const cleanPath = parsed.pathname.replace(/\/+$/, '');
    return `${parsed.origin}${cleanPath}`;
  } catch {
    return '';
  }
}

/**
 * Builds valid sitemap.xml containing only indexable public AV·STUDIO URLs.
 * @param {string} rawSiteUrl
 * @param {string} [lastMod]
 * @returns {string}
 */
export function buildSitemapXml(rawSiteUrl, lastMod = '2026-11-15') {
  const baseUrl = normalizeSiteUrl(rawSiteUrl);
  if (!baseUrl) return '';

  const entries = INDEXABLE_PATHS.map((routePath) => {
    const loc = routePath === '/' ? `${baseUrl}/` : `${baseUrl}${routePath}`;
    const priority = routePath === '/' ? '1.0' : '0.4';
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${lastMod}</lastmod>`,
      `    <priority>${priority}</priority>`,
      '  </url>',
    ].join('\n');
  }).join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    '</urlset>',
    '',
  ].join('\n');
}

/**
 * Builds robots.txt content, appending Sitemap directive only when a real SITE_URL exists.
 * Note: /demos/* uses <meta name="robots" content="noindex, follow"> and must remain crawlable.
 * @param {string} rawSiteUrl
 * @returns {string}
 */
export function buildRobotsTxt(rawSiteUrl = '') {
  const baseUrl = normalizeSiteUrl(rawSiteUrl);
  const lines = ['User-agent: *', 'Allow: /'];
  if (baseUrl) {
    lines.push('', `Sitemap: ${baseUrl}/sitemap.xml`);
  }
  return `${lines.join('\n')}\n`;
}
