/**
 * TORQUE ANDINO Servicio Automotriz (Demostración) — DOM & Interactions
 */

import {
  AUTO_SERVICES,
  filterAutoServices,
  validateAutoTurn,
  buildAutoWhatsAppUrl,
} from './logic.js';

const INSPECTION_ZONES = {
  motor: {
    kicker: 'Área 01 · Mantenimiento preventivo',
    price: 'Desde $48.00 USD',
    title: 'Motor, filtros y 25 puntos de control preventivo',
    desc: 'Verificación de estado de lubricante según especificación del fabricante, reemplazo de filtros y chequeo visual de fluidos, mangueras y correas.',
    checks: [
      'Nivel y condición de aceite, filtro de aceite y filtro de aire.',
      'Inspección de refrigerante, líquido limpiaparabrisas y posibles fugas.',
      'Control visual de bandas auxiliares y mangueras de presión.',
    ],
    service: 'Mantenimiento Preventivo (Cambio de Aceite & Filtros)',
  },
  frenos: {
    kicker: 'Área 02 · Seguridad activa',
    price: 'Desde $55.00 USD',
    title: 'Frenos hidráulicos, discos y pastillas',
    desc: 'Medición física de desgaste en pastillas delanteras y posteriores, superficie de discos, mordazas y estado del circuito hidráulico.',
    checks: [
      'Espesor útil de pastillas y uniformidad en pista de discos.',
      'Revisión de mordazas, pasadores y ausencia de humedad o fuga en líneas.',
      'Verificación de nivel de líquido hidráulico y purga del circuito si aplica.',
    ],
    service: 'Revisión & Cambio de Pastillas de Freno',
  },
  suspension: {
    kicker: 'Área 03 · Confort y estabilidad',
    price: 'Desde $25.00 USD',
    title: 'Suspensión, amortiguadores y tren delantero',
    desc: 'Inspección mecánica en elevador para detectar holguras en terminales, rótulas, bujes o fuga en amortiguadores antes de sugerir cambios.',
    checks: [
      'Control físico de holgura en terminales de dirección y rótulas.',
      'Inspección de bujes de mesa, bieletas y guardapolvos.',
      'Revisión visual de amortiguadores y soportes superiores.',
    ],
    service: 'Inspección de Amortiguadores & Terminales',
  },
  obd: {
    kicker: 'Área 04 · Diagnóstico electrónico',
    price: '$28.00 USD / $15.00 USD',
    title: 'Escaneo OBD-II, batería y sistema de carga',
    desc: 'Lectura ordenada de códigos almacenados en módulos de motor o ABS, complementada con prueba real en frío de batería y alternador.',
    checks: [
      'Lectura e interpretación de códigos OBD-II y datos de sensores clave.',
      'Medición de capacidad de arranque de batería y carga de alternador.',
      'Control de consumo en reposo y entrega de informe técnico claro.',
    ],
    service: 'Escaneo Electrónico Computarizado OBD-II',
  },
  alineacion: {
    kicker: 'Área 05 · Dirección y neumáticos',
    price: '$32.00 USD',
    title: 'Alineación computarizada y balanceo x4',
    desc: 'Corrección de geometría de ejes en rampa nivelada para mejorar estabilidad en recta y evitar desgaste irregular de llantas.',
    checks: [
      'Medición de convergencia y ángulos de dirección en las cuatro ruedas.',
      'Balanceo dinámico en las cuatro llantas para eliminar vibraciones.',
      'Rotación programada según desgaste y ajuste de presión recomendada.',
    ],
    service: 'Alineación Computarizada y Balanceo x4',
  },
};

let activeCategory = 'Todos';

function preselectServiceForTurn(serviceName) {
  const selectEl = document.getElementById('au-service');
  const noteEl = document.getElementById('au-selected-note');
  if (selectEl && serviceName) {
    selectEl.value = serviceName;
  }
  if (noteEl && serviceName) {
    noteEl.textContent = `Servicio preseleccionado: ${serviceName}`;
    noteEl.removeAttribute('hidden');
  }
  document.getElementById('turnos')?.scrollIntoView({ behavior: 'smooth' });
  window.setTimeout(() => {
    document.getElementById('au-name')?.focus();
  }, 250);
}

function setActiveCategoryFilter(category) {
  activeCategory = category || 'Todos';
  document.querySelectorAll('[data-auto-filter]').forEach((item) => {
    const isMatch = item.getAttribute('data-auto-filter') === activeCategory;
    item.classList.toggle('is-active', isMatch);
    item.setAttribute('aria-pressed', String(isMatch));
  });
  renderServices();
}

function renderServices() {
  const grid = document.getElementById('au-grid');
  if (!grid) return;

  const list = filterAutoServices(AUTO_SERVICES, activeCategory);
  grid.innerHTML = '';

  list.forEach((srv, idx) => {
    const card = document.createElement('article');
    card.className = 'au-card';

    const head = document.createElement('div');
    head.className = 'au-card__head';

    const cat = document.createElement('span');
    cat.className = 'au-card__cat';
    cat.textContent = srv.category;

    const num = document.createElement('span');
    num.className = 'au-card__num';
    num.textContent = String(idx + 1).padStart(2, '0');

    head.append(cat, num);

    const title = document.createElement('h3');
    title.className = 'au-card__title';
    title.textContent = srv.name;

    const price = document.createElement('div');
    price.className = 'au-card__price';
    price.textContent = srv.priceLabel;

    const desc = document.createElement('p');
    desc.className = 'au-card__desc';
    desc.textContent = srv.description;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'au-btn au-btn--dark';
    btn.textContent = 'Agendar revisión';
    btn.addEventListener('click', () => {
      preselectServiceForTurn(srv.name);
    });

    const top = document.createElement('div');
    top.className = 'au-card__top';
    top.append(head, title, price, desc);

    card.append(top, btn);
    grid.appendChild(card);
  });
}

function initInspectionExplorer() {
  const buttons = document.querySelectorAll('[data-inspect-zone]');
  const kickerEl = document.getElementById('au-zone-kicker');
  const priceEl = document.getElementById('au-zone-price');
  const titleEl = document.getElementById('au-zone-title');
  const descEl = document.getElementById('au-zone-desc');
  const checksEl = document.getElementById('au-zone-checks');
  const serviceEl = document.getElementById('au-zone-service');
  const prefillBtn = document.getElementById('au-zone-prefill');

  if (!buttons.length || !prefillBtn) return;

  let currentZoneKey = 'motor';

  const applyZone = (key) => {
    const zone = INSPECTION_ZONES[key];
    if (!zone) return;
    currentZoneKey = key;

    buttons.forEach((btn) => {
      const isActive = btn.getAttribute('data-inspect-zone') === key;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });

    if (kickerEl) kickerEl.textContent = zone.kicker;
    if (priceEl) priceEl.textContent = zone.price;
    if (titleEl) titleEl.textContent = zone.title;
    if (descEl) descEl.textContent = zone.desc;
    if (serviceEl) serviceEl.textContent = zone.service;

    if (checksEl) {
      checksEl.innerHTML = '';
      zone.checks.forEach((point) => {
        const li = document.createElement('li');
        li.textContent = point;
        checksEl.appendChild(li);
      });
    }
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-inspect-zone');
      if (key) applyZone(key);
    });
  });

  prefillBtn.addEventListener('click', () => {
    const zone = INSPECTION_ZONES[currentZoneKey];
    if (zone) preselectServiceForTurn(zone.service);
  });
}

function initGalleryLightbox() {
  const dialog = document.getElementById('au-lightbox');
  const imgEl = document.getElementById('au-lightbox-img');
  const titleEl = document.getElementById('au-lightbox-title');
  const captionEl = document.getElementById('au-lightbox-caption');
  const closeBtn = document.getElementById('au-lightbox-close');
  const triggers = document.querySelectorAll('[data-lightbox-src]');

  if (!dialog || !imgEl || !triggers.length) return;

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const src = trigger.getAttribute('data-lightbox-src') || '';
      const title = trigger.getAttribute('data-lightbox-title') || 'Galería del taller';
      const caption = trigger.getAttribute('data-lightbox-caption') || '';
      const thumbAlt = trigger.querySelector('img')?.getAttribute('alt') || title;

      imgEl.setAttribute('src', src);
      imgEl.setAttribute('alt', thumbAlt);
      if (titleEl) titleEl.textContent = title;
      if (captionEl) captionEl.textContent = caption;

      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
    });
  });

  closeBtn?.addEventListener('click', () => {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    }
  });
}

function initHeroSpecJumps() {
  document.querySelectorAll('[data-jump-category]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-jump-category') || 'Todos';
      setActiveCategoryFilter(category);
      document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function initForm() {
  const form = document.getElementById('au-turn-form');
  if (!form) return;

  const dateInput = document.getElementById('au-date');
  if (dateInput && !dateInput.value) {
    const tomorrow = new Date(Date.now() + 86400000);
    dateInput.value = tomorrow.toISOString().split('T')[0];
  }

  const prepared = document.getElementById('au-prepared');
  const preparedSummary = document.getElementById('au-prepared-summary');
  const preparedLink = document.getElementById('au-prepared-wa');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = {
      name: document.getElementById('au-name')?.value || '',
      phone: document.getElementById('au-phone')?.value || '',
      vehicle: document.getElementById('au-vehicle')?.value || '',
      service: document.getElementById('au-service')?.value || '',
      date: document.getElementById('au-date')?.value || '',
      time: document.getElementById('au-time')?.value || '',
    };

    const res = validateAutoTurn(data);
    ['name', 'phone', 'vehicle', 'service', 'date', 'time'].forEach((field) => {
      const errEl = document.getElementById(`au-err-${field}`);
      if (errEl) errEl.textContent = res.errors[field] || '';
    });

    if (!res.valid) {
      if (prepared) prepared.setAttribute('hidden', '');
      return;
    }

    if (preparedSummary) {
      preparedSummary.textContent = `${res.clean.vehicle} · ${res.clean.service} · ${res.clean.date} (${res.clean.time})`;
    }
    if (preparedLink) preparedLink.setAttribute('href', buildAutoWhatsAppUrl(res.clean));
    if (prepared) prepared.removeAttribute('hidden');
  });
}

function initMobileDrawer() {
  const toggle = document.getElementById('au-mobile-toggle');
  const drawer = document.getElementById('au-mobile-drawer');
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
  document.querySelectorAll('[data-auto-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setActiveCategoryFilter(btn.getAttribute('data-auto-filter') || 'Todos');
    });
  });

  initHeroSpecJumps();
  renderServices();
  initInspectionExplorer();
  initGalleryLightbox();
  initForm();
  initMobileDrawer();
});
