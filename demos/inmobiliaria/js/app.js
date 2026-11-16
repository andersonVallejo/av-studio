/**
 * ANDES HOGAR Bienes Raíces Cuenca (Demostración) — DOM & Interactions
 */

import {
  PROPERTIES_CATALOG,
  filterProperties,
  buildPropertyWhatsAppUrl,
} from './logic.js';

const PROPERTY_MEDIA = {
  'AH-101': {
    base: 'prop-casa-vergel',
    alt: 'Casa contemporánea de dos plantas con jardín interior y acabados de madera en El Vergel',
  },
  'AH-102': {
    base: 'prop-depto-tomebamba',
    alt: 'Departamento luminoso con terraza panorámica hacia el río Tomebamba en Puertas del Sol',
  },
  'AH-103': {
    base: 'prop-suite-yanuncay',
    alt: 'Suite familiar moderna con sala de estar y ventanales luminosos en Yanuncay',
  },
  'AH-104': {
    base: 'prop-terreno-andino',
    alt: 'Terreno residencial plano rodeado de colinas verdes andinas al norte de Cuenca',
  },
  'AH-105': {
    base: 'inmobiliaria',
    alt: 'Residencia amplia en piedra y madera ideal para vivienda u oficina en El Vergel',
  },
  'AH-106': {
    base: 'prop-casa-vergel',
    alt: 'Vivienda de estreno de líneas limpias con jardín privado en sector Yanuncay',
  },
};

function getPropertyMedia(propId) {
  return (
    PROPERTY_MEDIA[propId] || {
      base: 'inmobiliaria',
      alt: 'Propiedad residencial demostrativa en Cuenca',
    }
  );
}

function createPictureElement(base, alt, eager = false) {
  const picture = document.createElement('picture');
  const source = document.createElement('source');
  source.srcset = `./images/${base}.webp`;
  source.type = 'image/webp';

  const img = document.createElement('img');
  img.src = `./images/${base}.jpg`;
  img.width = 800;
  img.height = 600;
  img.decoding = 'async';
  if (!eager) img.loading = 'lazy';
  img.alt = alt;

  picture.append(source, img);
  return picture;
}

function getCriteria() {
  return {
    operation: document.getElementById('i-f-op')?.value || 'Todos',
    type: document.getElementById('i-f-type')?.value || 'Todos',
    sector: document.getElementById('i-f-sector')?.value || 'Todos',
    minRooms: document.getElementById('i-f-rooms')?.value || '0',
  };
}

function openPropertyDialog(prop) {
  const dialog = document.getElementById('i-prop-dialog');
  if (!dialog) return;

  const media = getPropertyMedia(prop.id);
  const webpEl = document.getElementById('i-d-webp');
  const imgEl = document.getElementById('i-d-img');
  const metaEl = document.getElementById('i-d-meta');
  const titleEl = document.getElementById('i-d-title');
  const priceEl = document.getElementById('i-d-price');
  const sumEl = document.getElementById('i-d-summary');
  const specsEl = document.getElementById('i-d-specs');
  const waEl = document.getElementById('i-d-wa');

  if (webpEl) webpEl.setAttribute('srcset', `./images/${media.base}.webp`);
  if (imgEl) {
    imgEl.setAttribute('src', `./images/${media.base}.jpg`);
    imgEl.setAttribute('alt', media.alt);
  }
  if (metaEl) metaEl.textContent = `${prop.id} · ${prop.operation} · ${prop.sector}, Cuenca`;
  if (titleEl) titleEl.textContent = prop.title;
  if (priceEl) priceEl.textContent = prop.priceLabel;
  if (sumEl) sumEl.textContent = prop.summary;
  if (specsEl) {
    specsEl.textContent =
      prop.rooms > 0
        ? `${prop.type} · ${prop.rooms} habitaciones · ${prop.areaM2} m² de referencia`
        : `${prop.type} · ${prop.areaM2} m² de superficie`;
  }
  if (waEl) waEl.setAttribute('href', buildPropertyWhatsAppUrl(prop));

  if (typeof dialog.showModal === 'function') dialog.showModal();
}

function renderProperties() {
  const grid = document.getElementById('i-props-grid');
  const countEl = document.getElementById('i-props-count');
  if (!grid) return;

  const list = filterProperties(PROPERTIES_CATALOG, getCriteria());
  if (countEl) {
    countEl.textContent = `Mostrando ${list.length} de ${PROPERTIES_CATALOG.length} propiedades de ejemplo`;
  }

  grid.innerHTML = '';
  if (list.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'i-props-empty';
    empty.textContent =
      'No hay propiedades ficticias con esa combinación de filtros. Ajusta los criterios para ver opciones.';
    grid.appendChild(empty);
    return;
  }

  list.forEach((prop) => {
    const media = getPropertyMedia(prop.id);
    const card = document.createElement('article');
    card.className = 'i-prop-card';

    const mediaWrap = document.createElement('div');
    mediaWrap.className = 'i-prop-card__media';
    const badge = document.createElement('span');
    badge.className = 'i-prop-card__badge';
    badge.textContent = prop.operation;
    mediaWrap.append(createPictureElement(media.base, media.alt), badge);

    const body = document.createElement('div');
    body.className = 'i-prop-card__body';

    const meta = document.createElement('span');
    meta.className = 'i-prop-card__meta';
    meta.textContent = `${prop.id} · ${prop.sector}`;

    const title = document.createElement('h3');
    title.className = 'i-prop-card__title';
    title.textContent = prop.title;

    const price = document.createElement('div');
    price.className = 'i-prop-card__price';
    price.textContent = prop.priceLabel;

    const sum = document.createElement('p');
    sum.className = 'i-prop-card__sum';
    sum.textContent = prop.summary;

    const specs = document.createElement('div');
    specs.className = 'i-prop-card__specs';
    specs.textContent =
      prop.rooms > 0 ? `${prop.type} · ${prop.rooms} hab. · ${prop.areaM2} m²` : `${prop.type} · ${prop.areaM2} m²`;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'i-btn i-btn--outline i-prop-card__btn';
    btn.textContent = 'Ver ficha de propiedad';
    btn.addEventListener('click', () => openPropertyDialog(prop));

    const top = document.createElement('div');
    top.append(meta, title, price, sum);

    const bottom = document.createElement('div');
    bottom.className = 'i-prop-card__foot';
    bottom.append(specs, btn);

    body.append(top, bottom);
    card.append(mediaWrap, body);
    grid.appendChild(card);
  });
}

function initMobileDrawer() {
  const toggle = document.getElementById('i-mobile-toggle');
  const drawer = document.getElementById('i-mobile-drawer');
  if (!toggle || !drawer) return;

  toggle.addEventListener('click', () => {
    const isHidden = drawer.hasAttribute('hidden');
    if (isHidden) drawer.removeAttribute('hidden');
    else drawer.setAttribute('hidden', '');
    toggle.setAttribute('aria-expanded', String(isHidden));
  });

  drawer.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      drawer.setAttribute('hidden', '');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  ['i-f-op', 'i-f-type', 'i-f-sector', 'i-f-rooms'].forEach((id) => {
    document.getElementById(id)?.addEventListener('change', renderProperties);
  });

  const dialog = document.getElementById('i-prop-dialog');
  document.getElementById('i-d-close')?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });

  renderProperties();
  initMobileDrawer();
});
