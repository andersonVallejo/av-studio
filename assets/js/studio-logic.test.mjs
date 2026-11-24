import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STUDIO_CONTACT,
  INPUT_LIMITS,
  BRAND_IDENTITY,
  SECTOR_CTA_MAP,
  resolveSectorOptionValue,
  resolveSectorFromQuery,
  sanitizeText,
  validateContactForm,
  formatInquiryMessage,
  buildWhatsAppUrl,
  buildMailtoUrl,
  filterSectors,
  shouldEnableCinematicMotion,
  shouldEnableHeroVideo,
  isValidHeroVideoResponse,
  computeHeroParallax,
  computeHeroDepthShift,
  TECHNOLOGY_STACK_GROUPS,
} from './studio-logic.js';
import {
  INDEXABLE_PATHS,
  normalizeSiteUrl,
  buildSitemapXml,
  buildRobotsTxt,
} from './seo-utils.mjs';

test('STUDIO_CONTACT preserves official AV·STUDIO and Anderson Vallejo contact details', () => {
  assert.equal(STUDIO_CONTACT.brand, 'AV·STUDIO');
  assert.equal(STUDIO_CONTACT.whatsappBaseUrl, 'https://wa.me/593979290747');
  assert.equal(STUDIO_CONTACT.email, 'andersonvallejo021@gmail.com');
  assert.equal(STUDIO_CONTACT.owner, 'Anderson Vallejo');
});

test('BRAND_IDENTITY maintains official AV·STUDIO naming without HH monogram, keeping 6-color palette and 7 typographic roles', () => {
  assert.equal(BRAND_IDENTITY.name, 'AV·STUDIO');
  assert.equal(BRAND_IDENTITY.signature, 'ANDERSON VALLEJO');
  assert.equal('monogram' in BRAND_IDENTITY, false);
  assert.equal(BRAND_IDENTITY.slogan, 'Ideas que toman forma.');
  assert.deepEqual(
    BRAND_IDENTITY.palette.map((c) => c.hex),
    ['#171717', '#F3F0E9', '#B8B5AE', '#30302E', '#C96F4A', '#FFFFFF']
  );
  assert.equal(BRAND_IDENTITY.typographyRoles.length, 7);
});

test('resolveSectorOptionValue maps all 16 sector keys to select options', () => {
  assert.equal(resolveSectorOptionValue('pasteleria', 'Panaderías y pastelerías'), 'Panadería y pastelería');
  assert.equal(resolveSectorOptionValue('juridico', 'Abogados y servicios jurídicos'), 'Servicios jurídicos');
  assert.equal(resolveSectorOptionValue('barberia', 'Barberías'), 'Barbería');
  assert.equal(resolveSectorOptionValue('hotel', 'Hoteles y turismo'), 'Hotel y turismo');
});

test('sanitizeText strips angle brackets and normalizes whitespace', () => {
  assert.equal(sanitizeText('  <script>Hola</script>   Cuenca  '), 'scriptHola/script Cuenca');
});

test('validateContactForm rejects empty or incomplete required inputs while keeping business, sector, budget, and timeline optional', () => {
  const result = validateContactForm({
    name: '',
    business: '',
    sector: '',
    siteType: '',
    contactChannel: 'WhatsApp',
    contactInfo: '123',
    budget: '',
    timeline: '',
    description: 'Corto',
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.name);
  assert.equal(result.errors.business, undefined);
  assert.equal(result.errors.sector, undefined);
  assert.equal(result.errors.budget, undefined);
  assert.equal(result.errors.timeline, undefined);
  assert.ok(result.errors.siteType);
  assert.ok(result.errors.contactInfo);
  assert.ok(result.errors.description);

  const badEmail = validateContactForm({
    name: 'Luis Paredes',
    siteType: 'Sitio web corporativo o profesional',
    contactChannel: 'Correo electrónico',
    contactInfo: 'luis@invalido',
    description: 'Sitio web corporativo para estudio de arquitectura en Cuenca.',
  });
  assert.equal(badEmail.valid, false);
  assert.ok(badEmail.errors.contactInfo);
});

test('validateContactForm passes with required and optional fields including timeline, building WhatsApp and Mailto URLs', () => {
  const result = validateContactForm({
    name: 'Carlos Mendoza',
    business: 'Cafetería El Barranco',
    sector: 'Cafetería',
    siteType: 'Página para restaurante o cafetería',
    contactChannel: 'WhatsApp',
    contactInfo: '+593 984 112 233',
    budget: '$300 – $600 USD',
    timeline: '15/12/2026',
    description: 'Necesitamos mostrar nuestra carta de café de especialidad y horarios en Cuenca.',
  });

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});

  const message = formatInquiryMessage(result.clean);
  assert.match(message, /AV·STUDIO/);
  assert.match(message, /Carlos Mendoza/);
  assert.match(message, /Cafetería El Barranco/);
  assert.match(message, /\$300 – \$600 USD/);
  assert.match(message, /15\/12\/2026/);

  const waUrl = buildWhatsAppUrl(result.clean);
  assert.ok(waUrl.startsWith('https://wa.me/593979290747?text='));
  assert.ok(decodeURIComponent(waUrl).includes('15/12/2026'));

  const mailUrl = buildMailtoUrl(result.clean);
  assert.ok(mailUrl.startsWith('mailto:andersonvallejo021@gmail.com?subject='));

  const minimal = validateContactForm({
    name: 'Sofía León',
    business: '',
    sector: '',
    siteType: 'Página de presentación de servicios',
    contactChannel: 'Correo electrónico',
    contactInfo: 'sofia@ejemplo.ec',
    budget: '',
    timeline: '',
    description: 'Necesito una página informativa clara para mi consulta profesional en Cuenca.',
  });
  assert.equal(minimal.valid, true);
  const minimalMsg = formatInquiryMessage(minimal.clean);
  assert.doesNotMatch(minimalMsg, /Presupuesto estimado/);
  assert.doesNotMatch(minimalMsg, /Fecha o plazo deseado/);
});

test('filterSectors returns all or matching group items', () => {
  const sample = [
    { id: 'restaurante', group: 'gastronomia' },
    { id: 'odontologia', group: 'salud' },
    { id: 'barberia', group: 'servicios' },
  ];
  assert.equal(filterSectors(sample, 'todos').length, 3);
  assert.deepEqual(
    filterSectors(sample, 'gastronomia').map((x) => x.id),
    ['restaurante']
  );
});

test('shouldEnableCinematicMotion respects reduced motion, saveData, and 2G networks', () => {
  assert.equal(shouldEnableCinematicMotion({ prefersReducedMotion: false, saveData: false, effectiveType: '4g' }), true);
  assert.equal(shouldEnableCinematicMotion({ prefersReducedMotion: true, saveData: false, effectiveType: '4g' }), false);
  assert.equal(shouldEnableCinematicMotion({ prefersReducedMotion: false, saveData: true, effectiveType: '4g' }), false);
  assert.equal(shouldEnableCinematicMotion({ prefersReducedMotion: false, saveData: false, effectiveType: '2g' }), false);
  assert.equal(shouldEnableCinematicMotion({ prefersReducedMotion: false, saveData: false, effectiveType: 'slow-2g' }), false);
});

test('computeHeroParallax clamps offset smoothly and disables outside viewport', () => {
  assert.deepEqual(
    computeHeroParallax({ rectTop: 0, rectBottom: 700, viewportHeight: 900, heroHeight: 700, maxShift: 28 }),
    { active: true, offsetY: 0 }
  );
  assert.deepEqual(
    computeHeroParallax({ rectTop: -350, rectBottom: 350, viewportHeight: 900, heroHeight: 700, maxShift: 28 }),
    { active: true, offsetY: 14 }
  );
  assert.deepEqual(
    computeHeroParallax({ rectTop: -900, rectBottom: -200, viewportHeight: 900, heroHeight: 700, maxShift: 28 }),
    { active: false, offsetY: 0 }
  );
});

test('computeHeroDepthShift normalizes and clamps pointer tilt offsets', () => {
  assert.deepEqual(
    computeHeroDepthShift({ clientX: 500, clientY: 300, left: 0, top: 0, width: 1000, height: 600, maxTilt: 6 }),
    { x: 0, y: 0 }
  );
  assert.deepEqual(
    computeHeroDepthShift({ clientX: 1200, clientY: -50, left: 0, top: 0, width: 1000, height: 600, maxTilt: 6 }),
    { x: 6, y: -6 }
  );
});

test('validateContactForm enforces INPUT_LIMITS max bounds and normalizes unknown contactChannel values', () => {
  const oversized = validateContactForm({
    name: 'A'.repeat(INPUT_LIMITS.name + 5),
    business: 'B'.repeat(INPUT_LIMITS.business + 5),
    siteType: 'Sitio web corporativo o profesional',
    contactChannel: '<script>alert(1)</script>',
    contactInfo: 'C'.repeat(INPUT_LIMITS.contactInfo + 5),
    timeline: 'D'.repeat(INPUT_LIMITS.timeline + 5),
    description: 'E'.repeat(INPUT_LIMITS.description + 20),
  });

  assert.equal(oversized.valid, false);
  assert.ok(oversized.errors.name);
  assert.ok(oversized.errors.business);
  assert.ok(oversized.errors.timeline);
  assert.ok(oversized.errors.contactInfo);
  assert.ok(oversized.errors.description);
  assert.equal(oversized.clean.contactChannel, 'WhatsApp');
});

test('SECTOR_CTA_MAP and resolveSectorFromQuery cover all 16 sectors and reject invalid query input', () => {
  assert.equal(Object.keys(SECTOR_CTA_MAP).length, 16);
  assert.deepEqual(resolveSectorFromQuery('?sector=restaurantes'), {
    sectorKey: 'restaurantes',
    optionValue: 'Restaurante',
  });
  assert.deepEqual(resolveSectorFromQuery('sector=consultorio'), {
    sectorKey: 'consultorio',
    optionValue: 'Consultorio médico',
  });
  assert.equal(resolveSectorFromQuery('?sector=desconocido'), null);
  assert.equal(resolveSectorFromQuery(''), null);
});

test('seo-utils validates real domains, excludes noindex demos from sitemap.xml, and preserves crawlable robots.txt', () => {
  assert.equal(normalizeSiteUrl(''), '');
  assert.equal(normalizeSiteUrl('MY_APP_URL'), '');
  assert.equal(normalizeSiteUrl('ftp://ejemplo.ec'), '');
  assert.equal(normalizeSiteUrl('https://ejemplo-real.ec/'), 'https://ejemplo-real.ec');

  assert.equal(buildSitemapXml(''), '');
  const xml = buildSitemapXml('https://ejemplo-real.ec/');
  assert.match(xml, /<loc>https:\/\/ejemplo-real\.ec\/<\/loc>/);
  assert.match(xml, /<loc>https:\/\/ejemplo-real\.ec\/politica-privacidad\.html<\/loc>/);
  assert.doesNotMatch(xml, /\/demos\//);
  assert.equal(INDEXABLE_PATHS.length, 2);

  const robotsNoDomain = buildRobotsTxt('');
  assert.match(robotsNoDomain, /Allow: \//);
  assert.doesNotMatch(robotsNoDomain, /Disallow: \/demos/);
  assert.doesNotMatch(robotsNoDomain, /Sitemap:/);

  const robotsWithDomain = buildRobotsTxt('https://ejemplo-real.ec');
  assert.match(robotsWithDomain, /Sitemap: https:\/\/ejemplo-real\.ec\/sitemap\.xml/);
});

test('shouldEnableHeroVideo and isValidHeroVideoResponse respect motion, network, source presence, and MIME type', () => {
  assert.equal(
    shouldEnableHeroVideo({ prefersReducedMotion: false, saveData: false, effectiveType: '4g', hasVideoSrc: true }),
    true
  );
  assert.equal(
    shouldEnableHeroVideo({ prefersReducedMotion: false, saveData: false, effectiveType: '4g', hasVideoSrc: false }),
    false
  );
  assert.equal(
    shouldEnableHeroVideo({ prefersReducedMotion: true, saveData: false, effectiveType: '4g', hasVideoSrc: true }),
    false
  );
  assert.equal(
    shouldEnableHeroVideo({ prefersReducedMotion: false, saveData: true, effectiveType: '4g', hasVideoSrc: true }),
    false
  );
  assert.equal(
    shouldEnableHeroVideo({ prefersReducedMotion: false, saveData: false, effectiveType: '2g', hasVideoSrc: true }),
    false
  );

  assert.equal(isValidHeroVideoResponse({ ok: true, contentType: 'video/mp4' }), true);
  assert.equal(isValidHeroVideoResponse({ ok: true, contentType: 'video/mp4; codecs="avc1.42E01E"' }), true);
  assert.equal(isValidHeroVideoResponse({ ok: true, contentType: 'text/html; charset=utf-8' }), false);
  assert.equal(isValidHeroVideoResponse({ ok: false, contentType: 'video/mp4' }), false);
});

test('TECHNOLOGY_STACK_GROUPS organizes current stack into 4 accurate categories without React/Vite language errors or unimplemented backend claims', () => {
  assert.equal(TECHNOLOGY_STACK_GROUPS.length, 4);
  const flatItems = TECHNOLOGY_STACK_GROUPS.flatMap((group) => group.items);
  const itemNames = flatItems.map((item) => item.name);

  assert.deepEqual(itemNames, [
    'HTML5',
    'CSS3',
    'JavaScript',
    'TypeScript',
    'React',
    'Tailwind CSS',
    'Vite',
    'Node.js',
    'npm',
    'Git',
    'GitHub',
    'Cloudflare',
  ]);

  const reactItem = flatItems.find((item) => item.name === 'React');
  const viteItem = flatItems.find((item) => item.name === 'Vite');
  assert.ok(reactItem && /biblioteca/i.test(reactItem.detail));
  assert.doesNotMatch(reactItem.detail, /lenguaje/i);
  assert.ok(viteItem && !/lenguaje/i.test(viteItem.detail));

  const serialized = JSON.stringify(TECHNOLOGY_STACK_GROUPS);
  assert.doesNotMatch(serialized, /supabase|postgresql/i);
});
