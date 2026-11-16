/**
 * AV·STUDIO — Pure Application Logic (Zero DOM side effects)
 * Handles sanitization, validation, sector metadata filtering,
 * and WhatsApp / Email URL generation.
 */

export const STUDIO_CONTACT = Object.freeze({
  brand: 'AV·STUDIO',
  owner: 'Anderson Vallejo',
  slogan: 'Ideas que toman forma.',
  whatsappNumber: '593979290747',
  whatsappDisplay: '+593 979 290 747',
  whatsappBaseUrl: 'https://wa.me/593979290747',
  email: 'andersonvallejo021@gmail.com',
  city: 'Cuenca, Azuay, Ecuador',
});

/**
 * Strips potentially unsafe control characters and trims input text.
 * @param {unknown} value
 * @returns {string}
 */
export function sanitizeText(value) {
  if (typeof value !== 'string') {
    return '';
  }
  return value
    .replace(/[<>]/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const SECTOR_OPTION_BY_KEY = Object.freeze({
  restaurantes: 'Restaurante',
  pizzerias: 'Pizzería',
  cafeterias: 'Cafetería',
  pasteleria: 'Panadería y pastelería',
  odontologia: 'Odontología',
  consultorio: 'Consultorio médico',
  juridico: 'Servicios jurídicos',
  barberia: 'Barbería',
  belleza: 'Belleza',
  inmobiliaria: 'Inmobiliaria',
  automotriz: 'Automotriz',
  hotel: 'Hotel y turismo',
  tienda: 'Tienda',
  gimnasio: 'Gimnasio',
  academia: 'Academia',
  eventos: 'Eventos',
});

/**
 * Resolves the form select option value for any of the 16 sector keys or names.
 * @param {string} sectorKey
 * @param {string} [sectorName]
 * @returns {string}
 */
export function resolveSectorOptionValue(sectorKey, sectorName = '') {
  if (sectorKey && SECTOR_OPTION_BY_KEY[sectorKey]) {
    return SECTOR_OPTION_BY_KEY[sectorKey];
  }
  const normalized = sanitizeText(sectorName).toLowerCase();
  if (!normalized) return '';
  const values = Object.values(SECTOR_OPTION_BY_KEY);
  return (
    values.find(
      (opt) =>
        opt.toLowerCase() === normalized ||
        normalized.includes(opt.toLowerCase()) ||
        opt.toLowerCase().includes(normalized)
    ) || ''
  );
}

export const SECTOR_CTA_MAP = Object.freeze({
  restaurantes: {
    label: 'Quiero una página para mi restaurante',
    optionValue: 'Restaurante',
    demoPath: './demos/restaurante/index.html',
  },
  pizzerias: {
    label: 'Quiero una página para mi pizzería',
    optionValue: 'Pizzería',
    demoPath: './demos/pizzeria/index.html',
  },
  cafeterias: {
    label: 'Quiero una página para mi cafetería',
    optionValue: 'Cafetería',
    demoPath: './demos/cafeteria/index.html',
  },
  pasteleria: {
    label: 'Quiero una página para mi pastelería',
    optionValue: 'Panadería y pastelería',
    demoPath: './demos/pasteleria/index.html',
  },
  odontologia: {
    label: 'Quiero una página para mi clínica dental',
    optionValue: 'Odontología',
    demoPath: './demos/odontologia/index.html',
  },
  consultorio: {
    label: 'Quiero una página para mi consultorio',
    optionValue: 'Consultorio médico',
    demoPath: './demos/consultorio/index.html',
  },
  juridico: {
    label: 'Quiero una página para mi estudio jurídico',
    optionValue: 'Servicios jurídicos',
    demoPath: './demos/juridico/index.html',
  },
  barberia: {
    label: 'Quiero una página para mi barbería',
    optionValue: 'Barbería',
    demoPath: './demos/barberia/index.html',
  },
  belleza: {
    label: 'Quiero una página para mi salón de belleza',
    optionValue: 'Belleza',
    demoPath: './demos/belleza/index.html',
  },
  inmobiliaria: {
    label: 'Quiero una página para mi inmobiliaria',
    optionValue: 'Inmobiliaria',
    demoPath: './demos/inmobiliaria/index.html',
  },
  automotriz: {
    label: 'Quiero una página para mi taller automotriz',
    optionValue: 'Automotriz',
    demoPath: './demos/automotriz/index.html',
  },
  hotel: {
    label: 'Quiero una página para mi hotel',
    optionValue: 'Hotel y turismo',
    demoPath: './demos/hotel/index.html',
  },
  tienda: {
    label: 'Quiero una página para mi tienda',
    optionValue: 'Tienda',
    demoPath: './demos/tienda/index.html',
  },
  gimnasio: {
    label: 'Quiero una página para mi gimnasio',
    optionValue: 'Gimnasio',
    demoPath: './demos/gimnasio/index.html',
  },
  academia: {
    label: 'Quiero una página para mi academia',
    optionValue: 'Academia',
    demoPath: './demos/academia/index.html',
  },
  eventos: {
    label: 'Quiero una página para mis eventos',
    optionValue: 'Eventos',
    demoPath: './demos/eventos/index.html',
  },
});

/**
 * Resolves a valid sector selection from a URL query string (?sector=...).
 * @param {string} search
 * @returns {{ sectorKey: string, optionValue: string } | null}
 */
export function resolveSectorFromQuery(search) {
  if (typeof search !== 'string' || !search) return null;
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const rawSector = sanitizeText(params.get('sector')).toLowerCase();
  if (!rawSector) return null;
  const optionValue = resolveSectorOptionValue(rawSector, rawSector);
  if (!optionValue) return null;
  return {
    sectorKey: rawSector,
    optionValue,
  };
}


export const INPUT_LIMITS = Object.freeze({
  name: 100,
  business: 120,
  sector: 80,
  siteType: 120,
  contactInfo: 120,
  budget: 80,
  timeline: 80,
  description: 1200,
});

const ALLOWED_CONTACT_CHANNELS = Object.freeze([
  'WhatsApp',
  'Correo electrónico',
  'Llamada o WhatsApp',
]);

/**
 * Validates the AV·STUDIO project inquiry form fields.
 * Optional fields (business, sector, budget, timeline) are cleanly preserved if supplied.
 * @param {Record<string, string>} rawData
 * @returns {{ valid: boolean, errors: Record<string, string>, clean: Record<string, string> }}
 */
export function validateContactForm(rawData) {
  const rawChannel = sanitizeText(rawData?.contactChannel);
  const clean = {
    name: sanitizeText(rawData?.name),
    business: sanitizeText(rawData?.business),
    sector: sanitizeText(rawData?.sector),
    siteType: sanitizeText(rawData?.siteType),
    contactChannel: ALLOWED_CONTACT_CHANNELS.includes(rawChannel) ? rawChannel : 'WhatsApp',
    contactInfo: sanitizeText(rawData?.contactInfo),
    budget: sanitizeText(rawData?.budget),
    timeline: sanitizeText(rawData?.timeline),
    description: sanitizeText(rawData?.description),
  };

  /** @type {Record<string, string>} */
  const errors = {};

  if (clean.name.length < 3) {
    errors.name = 'Ingresa tu nombre y apellido (mínimo 3 caracteres).';
  } else if (clean.name.length > INPUT_LIMITS.name) {
    errors.name = `El nombre no puede superar los ${INPUT_LIMITS.name} caracteres.`;
  }

  if (clean.business.length > INPUT_LIMITS.business) {
    errors.business = `El nombre del negocio no puede superar los ${INPUT_LIMITS.business} caracteres.`;
  }

  if (!clean.siteType) {
    errors.siteType = 'Selecciona el tipo de página web que necesitas.';
  } else if (clean.siteType.length > INPUT_LIMITS.siteType) {
    errors.siteType = 'Selecciona una opción válida para el tipo de página web.';
  }

  if (clean.timeline.length > INPUT_LIMITS.timeline) {
    errors.timeline = `El plazo deseado no puede superar los ${INPUT_LIMITS.timeline} caracteres.`;
  }

  const looksLikeEmail = clean.contactInfo.includes('@');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const digitCount = clean.contactInfo.replace(/\D/g, '').length;

  if (!clean.contactInfo) {
    errors.contactInfo = 'Ingresa tu número de teléfono (+593...) o correo electrónico.';
  } else if (clean.contactInfo.length > INPUT_LIMITS.contactInfo) {
    errors.contactInfo = `El teléfono o correo no puede superar los ${INPUT_LIMITS.contactInfo} caracteres.`;
  } else if (looksLikeEmail && !emailRegex.test(clean.contactInfo)) {
    errors.contactInfo = 'Verifica el formato de tu correo electrónico (ej. nombre@empresa.ec).';
  } else if (!looksLikeEmail && digitCount < 7) {
    errors.contactInfo = 'Ingresa un teléfono válido (ej. +593 99...) o un correo electrónico.';
  }

  if (clean.description.length < 12) {
    errors.description = 'Cuéntanos brevemente qué necesita tu página (mínimo 12 caracteres).';
  } else if (clean.description.length > INPUT_LIMITS.description) {
    errors.description = `La descripción no puede superar los ${INPUT_LIMITS.description} caracteres.`;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    clean,
  };
}

/**
 * Formats a structured Spanish inquiry message for Anderson Vallejo — AV·STUDIO.
 * @param {Record<string, string>} cleanData
 * @returns {string}
 */
export function formatInquiryMessage(cleanData) {
  const lines = [
    'Hola Anderson, te escribo desde AV·STUDIO para solicitar información sobre una página web.',
    '',
    `Nombre y apellido: ${cleanData.name}`,
  ];

  if (cleanData.business) {
    lines.push(`Negocio o proyecto: ${cleanData.business}`);
  }
  if (cleanData.sector) {
    lines.push(`Tipo de negocio o sector: ${cleanData.sector}`);
  }
  lines.push(`Tipo de página web: ${cleanData.siteType}`);
  lines.push(`Descripción de lo que desea: ${cleanData.description}`);
  if (cleanData.budget) {
    lines.push(`Presupuesto estimado (USD): ${cleanData.budget}`);
  }
  if (cleanData.timeline) {
    lines.push(`Fecha o plazo deseado: ${cleanData.timeline}`);
  }
  lines.push(`Medio de contacto preferido: ${cleanData.contactChannel || 'WhatsApp'}`);
  lines.push(`Teléfono o correo de contacto: ${cleanData.contactInfo}`);

  return lines.join('\n');
}

/**
 * Builds an official international WhatsApp link with pre-filled text.
 * @param {Record<string, string>} cleanData
 * @returns {string}
 */
export function buildWhatsAppUrl(cleanData) {
  const message = formatInquiryMessage(cleanData);
  return `${STUDIO_CONTACT.whatsappBaseUrl}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds an official mailto link with subject and formatted body.
 * @param {Record<string, string>} cleanData
 * @returns {string}
 */
export function buildMailtoUrl(cleanData) {
  const label = cleanData.business || cleanData.name;
  const subject = `Solicitud de proyecto web — ${label} | AV·STUDIO`;
  const body = formatInquiryMessage(cleanData);
  return `mailto:${STUDIO_CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Filters sector items by group key.
 * @template {{ group: string }} T
 * @param {T[]} items
 * @param {string} group
 * @returns {T[]}
 */
export function filterSectors(items, group) {
  if (!group || group === 'todos') {
    return items;
  }
  return items.filter((item) => item.group === group);
}

/**
 * Determines whether cinematic hero motion should run based on user motion preference
 * and connection data-saver signals.
 * @param {{ prefersReducedMotion?: boolean, saveData?: boolean, effectiveType?: string }} env
 * @returns {boolean}
 */
export function shouldEnableCinematicMotion(env = {}) {
  if (env.prefersReducedMotion) return false;
  if (env.saveData) return false;
  const net = typeof env.effectiveType === 'string' ? env.effectiveType.toLowerCase() : '';
  if (net === 'slow-2g' || net === '2g') return false;
  return true;
}

/**
 * Computes clamped vertical parallax offset (in px) for the hero section on scroll.
 * @param {{ rectTop: number, rectBottom: number, viewportHeight: number, heroHeight: number, maxShift?: number }} params
 * @returns {{ active: boolean, offsetY: number }}
 */
export function computeHeroParallax({
  rectTop,
  rectBottom,
  viewportHeight,
  heroHeight,
  maxShift = 28,
}) {
  if (heroHeight <= 0 || viewportHeight <= 0) {
    return { active: false, offsetY: 0 };
  }
  if (rectBottom < 0 || rectTop > viewportHeight) {
    return { active: false, offsetY: 0 };
  }
  const progress = Math.max(0, Math.min(1, -rectTop / heroHeight));
  return {
    active: true,
    offsetY: Number((progress * maxShift).toFixed(2)),
  };
}

/**
 * Computes subtle normalized pointer depth offsets (in px) around the hero stage center.
 * @param {{ clientX: number, clientY: number, left: number, top: number, width: number, height: number, maxTilt?: number }} params
 * @returns {{ x: number, y: number }}
 */
export function computeHeroDepthShift({
  clientX,
  clientY,
  left,
  top,
  width,
  height,
  maxTilt = 7,
}) {
  if (width <= 0 || height <= 0) {
    return { x: 0, y: 0 };
  }
  const normX = Math.max(-1, Math.min(1, ((clientX - left) / width - 0.5) * 2));
  const normY = Math.max(-1, Math.min(1, ((clientY - top) / height - 0.5) * 2));
  return {
    x: Number((normX * maxTilt).toFixed(2)),
    y: Number((normY * maxTilt).toFixed(2)),
  };
}

/**
 * Definitive AV·STUDIO brand identity tokens and surface matrix (Zero DOM side effects).
 */
export const BRAND_IDENTITY = Object.freeze({
  name: 'AV·STUDIO',
  signature: 'ANDERSON VALLEJO',
  monogram: 'HH',
  slogan: 'Ideas que toman forma.',
  description:
    'Estudio creativo especializado en diseño y desarrollo de experiencias digitales y páginas web para negocios.',
  palette: Object.freeze([
    { name: 'Carbón', hex: '#171717', role: 'Fondo oscuro y tinta principal' },
    { name: 'Marfil', hex: '#F3F0E9', role: 'Lienzo editorial claro' },
    { name: 'Gris piedra', hex: '#B8B5AE', role: 'Textos y acentos neutros sobre oscuro' },
    { name: 'Gris oscuro', hex: '#30302E', role: 'Subtítulos y estructura secundaria' },
    { name: 'Terracota', hex: '#C96F4A', role: 'Acento focal y nodo central' },
    { name: 'Blanco', hex: '#FFFFFF', role: 'Superficies limpias y contraste elevado' },
  ]),
  typographyRoles: Object.freeze([
    { role: 'Logotipo', spec: 'AV·STUDIO · Geometría editorial + sans espaciada' },
    { role: 'Títulos principales', spec: 'Cormorant Garamond · Peso 600 · -0.02em' },
    { role: 'Subtítulos', spec: 'Plus Jakarta Sans · Peso 400 · 1.0625rem' },
    { role: 'Textos descriptivos', spec: 'Plus Jakarta Sans · Peso 400 · 1.65 línea' },
    { role: 'Botones', spec: 'Plus Jakarta Sans · Peso 600 · 0.9375rem' },
    { role: 'Etiquetas', spec: 'Plus Jakarta Sans · Peso 600 · +0.08em' },
    { role: 'Elementos de navegación', spec: 'Plus Jakarta Sans · Peso 500 · 0.9rem' },
  ]),
});

/**
 * Resolves coherent chromatic surface styling for the AV·STUDIO brand showcase.
 * @param {string} mode
 * @returns {{ mode: 'oscuro' | 'claro' | 'monocromo', label: string, description: string, isDark: boolean }}
 */
export function resolveBrandSurfaceConfig(mode) {
  switch (mode) {
    case 'claro':
      return {
        mode: 'claro',
        label: 'Versión clara · Marfil #F3F0E9 y Carbón #171717',
        description: 'Contraste editorial sobre lienzo marfil con nodo focal terracota.',
        isDark: false,
      };
    case 'monocromo':
      return {
        mode: 'monocromo',
        label: 'Versión monocromática · Tinta pura #171717 sobre Blanco #FFFFFF',
        description: 'Aplicación técnica en una sola tinta para sellos, impresos y documentos.',
        isDark: false,
      };
    case 'oscuro':
    default:
      return {
        mode: 'oscuro',
        label: 'Versión oscura · Carbón #171717 y Marfil #F3F0E9',
        description: 'Aplicación principal sobre superficies oscuras con nodo focal #C96F4A.',
        isDark: true,
      };
  }
}
