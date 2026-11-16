import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';
import {buildRobotsTxt, buildSitemapXml, normalizeSiteUrl} from './assets/js/seo-utils.mjs';

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
};

function createOptionalSeoPlugin(): Plugin {
  const siteUrl = normalizeSiteUrl(process.env.SITE_URL || '');
  return {
    name: 'av-studio-optional-seo',
    transformIndexHtml(html, ctx) {
      if (!siteUrl) return html;
      const filename = path.basename(ctx.filename || '');
      const dirName = path.basename(path.dirname(ctx.filename || ''));
      if (dirName !== 'applet' && filename !== 'index.html' && filename !== 'politica-privacidad.html') {
        return html;
      }
      if (ctx.filename && ctx.filename.includes(`${path.sep}demos${path.sep}`)) {
        return html;
      }
      const canonicalUrl =
        filename === 'politica-privacidad.html'
          ? `${siteUrl}/politica-privacidad.html`
          : `${siteUrl}/`;
      const injection = `    <link rel="canonical" href="${canonicalUrl}" />\n    <meta property="og:url" content="${canonicalUrl}" />\n`;
      return html.replace('  </head>', `${injection}  </head>`);
    },
    generateBundle() {
      if (!siteUrl) return;
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: buildSitemapXml(siteUrl),
      });
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: buildRobotsTxt(siteUrl),
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), createOptionalSeoPlugin()],
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          privacidad: path.resolve(__dirname, 'politica-privacidad.html'),
          restaurante: path.resolve(__dirname, 'demos/restaurante/index.html'),
          pizzeria: path.resolve(__dirname, 'demos/pizzeria/index.html'),
          cafeteria: path.resolve(__dirname, 'demos/cafeteria/index.html'),
          pasteleria: path.resolve(__dirname, 'demos/pasteleria/index.html'),
          odontologia: path.resolve(__dirname, 'demos/odontologia/index.html'),
          consultorio: path.resolve(__dirname, 'demos/consultorio/index.html'),
          juridico: path.resolve(__dirname, 'demos/juridico/index.html'),
          barberia: path.resolve(__dirname, 'demos/barberia/index.html'),
          belleza: path.resolve(__dirname, 'demos/belleza/index.html'),
          inmobiliaria: path.resolve(__dirname, 'demos/inmobiliaria/index.html'),
          automotriz: path.resolve(__dirname, 'demos/automotriz/index.html'),
          hotel: path.resolve(__dirname, 'demos/hotel/index.html'),
          tienda: path.resolve(__dirname, 'demos/tienda/index.html'),
          gimnasio: path.resolve(__dirname, 'demos/gimnasio/index.html'),
          academia: path.resolve(__dirname, 'demos/academia/index.html'),
          eventos: path.resolve(__dirname, 'demos/eventos/index.html'),
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      headers: SECURITY_HEADERS,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      headers: SECURITY_HEADERS,
    },
  };
});
