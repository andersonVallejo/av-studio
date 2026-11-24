/**
 * ANDES HOGAR Bienes Raíces Cuenca (Demostración) — DOM & Interactions
 */

import {
  PROPERTIES_CATALOG,
  filterProperties,
  buildPropertyWhatsAppUrl,
} from './logic.js';

const WHATSAPP_BASE = 'https://wa.me/593979290747';

const PROPERTY_MEDIA = {
  'AH-101': {
    src: './images/prop-casa-vergel.jpg',
    alt: 'Casa contemporánea de dos plantas con jardín interior y acabados en madera en El Vergel',
  },
  'AH-102': {
    src: './images/prop-depto-tomebamba.jpg',
    alt: 'Departamento luminoso con terraza panorámica hacia el río Tomebamba en Puertas del Sol',
  },
  'AH-103': {
    src: './images/prop-suite-yanuncay.jpg',
    alt: 'Suite familiar moderna con sala de estar y ventanales luminosos en Yanuncay',
  },
  'AH-104': {
    src: './images/prop-terreno-andino.jpg',
    alt: 'Terreno residencial plano rodeado de colinas verdes andinas al norte de Cuenca',
  },
  'AH-105': {
    src: './images/prop-casa-oficina.jpg',
    alt: 'Residencia contemporánea de ladrillo y madera con despacho en El Vergel',
  },
  'AH-106': {
    src: './images/prop-vivienda-yanuncay.jpg',
    alt: 'Vivienda de estreno de líneas limpias con jardín privado en Yanuncay',
  },
};

let activeDialogPropId = null;

function getPropertyMedia(propId) {
  return (
    PROPERTY_MEDIA[propId] || {
      src: './images/inmobiliaria.jpg',
      alt: 'Propiedad residencial demostrativa en Cuenca',
    }
  );
}

function getPropertyById(propId) {
  return PROPERTIES_CATALOG.find((item) => item.id === propId) || null;
}

function formatPropertySpecs(prop) {
  return prop.rooms > 0
    ? `${prop.type} · ${prop.rooms} hab. · ${prop.areaM2} m²`
    : `${prop.type} · ${prop.areaM2} m²`;
}

function buildGeneralWhatsAppUrl() {
  const msg = [
    'Hola Anderson, probé la demostración Inmobiliaria (ANDES HOGAR — Cuenca) en AV·STUDIO.',
    '',
    'Quisiera consultar por una página web para mi inmobiliaria o constructora.',
  ].join('\n');
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(msg)}`;
}

function createMediaFrame(media) {
  const frame = document.createElement('div');
  frame.className = 'i-media-frame i-prop-card__media';

  const img = document.createElement('img');
  img.src = media.src;
  img.width = 800;
  img.height = 600;
  img.decoding = 'sync';
  img.referrerPolicy = 'no-referrer';
  img.alt = media.alt;

  frame.appendChild(img);
  return frame;
}

function getCriteria() {
  return {
    operation: document.getElementById('i-f-op')?.value || 'Todos',
    type: document.getElementById('i-f-type')?.value || 'Todos',
    sector: document.getElementById('i-f-sector')?.value || 'Todos',
    minRooms: document.getElementById('i-f-rooms')?.value || '0',
  };
}

function resetAllFilters() {
  const op = document.getElementById('i-f-op');
  const type = document.getElementById('i-f-type');
  const sector = document.getElementById('i-f-sector');
  const rooms = document.getElementById('i-f-rooms');
  if (op) op.value = 'Todos';
  if (type) type.value = 'Todos';
  if (sector) sector.value = 'Todos';
  if (rooms) rooms.value = '0';
  renderProperties();
}

function selectSectorFilter(sectorName) {
  const op = document.getElementById('i-f-op');
  const type = document.getElementById('i-f-type');
  const sector = document.getElementById('i-f-sector');
  const rooms = document.getElementById('i-f-rooms');
  if (op) op.value = 'Todos';
  if (type) type.value = 'Todos';
  if (rooms) rooms.value = '0';
  if (sector) sector.value = sectorName;
  renderProperties();
  document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateSelectedConsultation(propId) {
  const selectEl = document.getElementById('i-c-prop');
  const boxMeta = document.getElementById('i-sel-meta');
  const boxTitle = document.getElementById('i-sel-title');
  const boxSpecs = document.getElementById('i-sel-specs');
  const boxNote = document.getElementById('i-sel-note');
  const contactWa = document.getElementById('i-contact-wa');

  if (selectEl && selectEl.value !== propId) {
    selectEl.value = propId || '';
  }

  const prop = propId ? getPropertyById(propId) : null;
  if (prop) {
    if (boxMeta) boxMeta.textContent = `${prop.id} · ${prop.operation} · ${prop.sector}, Cuenca`;
    if (boxTitle) boxTitle.textContent = prop.title;
    if (boxSpecs) boxSpecs.textContent = `${prop.priceLabel} · ${formatPropertySpecs(prop)}`;
    if (boxNote) {
      boxNote.textContent =
        'El enlace de WhatsApp incluirá automáticamente la referencia de este inmueble modelo.';
    }
    if (contactWa) {
      contactWa.setAttribute('href', buildPropertyWhatsAppUrl(prop));
      contactWa.textContent = `Consultar ${prop.id} por WhatsApp`;
    }
  } else {
    if (boxMeta) boxMeta.textContent = 'Consulta general · Catálogo completo (6 modelos)';
    if (boxTitle) boxTitle.textContent = 'Asesoría sobre portafolio residencial en Cuenca';
    if (boxSpecs) boxSpecs.textContent = 'Venta y Alquiler · Valores referenciales en USD';
    if (boxNote) {
      boxNote.textContent =
        'Selecciona un inmueble específico arriba o desde las tarjetas para incluir su ficha en el mensaje.';
    }
    if (contactWa) {
      contactWa.setAttribute('href', buildGeneralWhatsAppUrl());
      contactWa.textContent = 'Consultar por WhatsApp';
    }
  }
}

function openPropertyDialog(prop) {
  const dialog = document.getElementById('i-prop-dialog');
  if (!dialog) return;

  activeDialogPropId = prop.id;
  const media = getPropertyMedia(prop.id);
  const imgEl = document.getElementById('i-d-img');
  const metaEl = document.getElementById('i-d-meta');
  const titleEl = document.getElementById('i-d-title');
  const priceEl = document.getElementById('i-d-price');
  const sumEl = document.getElementById('i-d-summary');
  const specsEl = document.getElementById('i-d-specs');
  const waEl = document.getElementById('i-d-wa');

  if (imgEl) {
    imgEl.setAttribute('src', media.src);
    imgEl.setAttribute('alt', media.alt);
  }
  if (metaEl) metaEl.textContent = `Ficha ${prop.id} · ${prop.operation} · ${prop.sector}, Cuenca`;
  if (titleEl) titleEl.textContent = prop.title;
  if (priceEl) priceEl.textContent = prop.priceLabel;
  if (sumEl) sumEl.textContent = prop.summary;
  if (specsEl) {
    specsEl.textContent =
      prop.rooms > 0
        ? `${prop.type} · ${prop.rooms} habitaciones · ${prop.areaM2} m² de referencia · ${prop.operation}`
        : `${prop.type} · ${prop.areaM2} m² de superficie · ${prop.operation}`;
  }
  if (waEl) waEl.setAttribute('href', buildPropertyWhatsAppUrl(prop));

  if (typeof dialog.showModal === 'function') dialog.showModal();
}

function renderProperties() {
  const grid = document.getElementById('i-props-grid');
  const countEl = document.getElementById('i-props-count');
  if (!grid) return;

  const criteria = getCriteria();
  const list = filterProperties(PROPERTIES_CATALOG, criteria);

  if (countEl) {
    const sectorNote = criteria.sector !== 'Todos' ? ` · Sector: ${criteria.sector}` : '';
    const opNote = criteria.operation !== 'Todos' ? ` · ${criteria.operation}` : '';
    countEl.textContent = `Mostrando ${list.length} de ${PROPERTIES_CATALOG.length} propiedades de ejemplo${opNote}${sectorNote}`;
  }

  grid.innerHTML = '';
  if (list.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'i-props-empty';

    const msg = document.createElement('p');
    msg.textContent =
      'No hay propiedades ficticias con esa combinación de filtros. Puedes restablecer los criterios para ver las 6 opciones modelo.';

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'i-btn i-btn--outline';
    resetBtn.textContent = 'Ver todas las propiedades';
    resetBtn.addEventListener('click', resetAllFilters);

    empty.append(msg, resetBtn);
    grid.appendChild(empty);
    return;
  }

  list.forEach((prop) => {
    const media = getPropertyMedia(prop.id);
    const card = document.createElement('article');
    card.className = 'i-prop-card';
    card.dataset.propId = prop.id;

    const mediaFrame = createMediaFrame(media);

    const body = document.createElement('div');
    body.className = 'i-prop-card__body';

    const meta = document.createElement('span');
    meta.className = 'i-prop-card__meta';
    meta.textContent = `${prop.id} · ${prop.operation} · ${prop.sector}`;

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
    specs.textContent = formatPropertySpecs(prop);

    const actions = document.createElement('div');
    actions.className = 'i-prop-card__actions';

    const openBtn = document.createElement('button');
    openBtn.type = 'button';
    openBtn.className = 'i-btn i-btn--outline';
    openBtn.textContent = 'Ver ficha';
    openBtn.setAttribute('aria-label', `Ver ficha de ${prop.title}`);
    openBtn.addEventListener('click', () => openPropertyDialog(prop));

    const consultBtn = document.createElement('button');
    consultBtn.type = 'button';
    consultBtn.className = 'i-btn i-btn--navy';
    consultBtn.textContent = 'Consultar';
    consultBtn.setAttribute('aria-label', `Seleccionar ${prop.title} para consultar`);
    consultBtn.addEventListener('click', () => {
      updateSelectedConsultation(prop.id);
      document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    actions.append(openBtn, consultBtn);

    const top = document.createElement('div');
    top.append(meta, title, price, sum);

    const bottom = document.createElement('div');
    bottom.className = 'i-prop-card__foot';
    bottom.append(specs, actions);

    body.append(top, bottom);
    card.append(mediaFrame, body);
    grid.appendChild(card);
  });
}

function populateConsultationSelect() {
  const selectEl = document.getElementById('i-c-prop');
  if (!selectEl) return;

  PROPERTIES_CATALOG.forEach((prop) => {
    const opt = document.createElement('option');
    opt.value = prop.id;
    opt.textContent = `[${prop.id}] ${prop.title} (${prop.operation} · ${prop.priceLabel})`;
    selectEl.appendChild(opt);
  });

  selectEl.addEventListener('change', (e) => {
    updateSelectedConsultation(e.target.value);
  });
}

function initActionTriggers() {
  document.getElementById('i-f-reset')?.addEventListener('click', resetAllFilters);

  document.querySelectorAll('[data-open-prop]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const prop = getPropertyById(btn.getAttribute('data-open-prop'));
      if (prop) openPropertyDialog(prop);
    });
  });

  document.querySelectorAll('[data-select-prop]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-select-prop');
      updateSelectedConsultation(id);
      document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  document.querySelectorAll('[data-select-sector]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sector = btn.getAttribute('data-select-sector');
      if (sector) selectSectorFilter(sector);
    });
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
  const closeDialog = () => dialog?.close();

  document.getElementById('i-d-close')?.addEventListener('click', closeDialog);
  document.getElementById('i-d-close-x')?.addEventListener('click', closeDialog);
  document.getElementById('i-d-select')?.addEventListener('click', () => {
    if (activeDialogPropId) updateSelectedConsultation(activeDialogPropId);
    closeDialog();
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  dialog?.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });

  populateConsultationSelect();
  initActionTriggers();
  renderProperties();
  updateSelectedConsultation('AH-101');
  initMobileDrawer();
});
