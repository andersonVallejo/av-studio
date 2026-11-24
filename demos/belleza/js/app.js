/**
 * ATELIER ROSA Salón de Belleza & Estética (Demostración) — DOM & Interactions
 */

import {
  BEAUTY_SERVICES,
  filterBeautyServices,
  validateBeautyBooking,
  buildBeautyWhatsAppUrl,
} from './logic.js';

let activeCategory = 'Todos';

function syncSelectedPreview(serviceName) {
  const preview = document.getElementById('r-selected-preview');
  const nameEl = document.getElementById('r-preview-name');
  const metaEl = document.getElementById('r-preview-meta');
  if (!preview || !nameEl || !metaEl) return;

  const found = BEAUTY_SERVICES.find((item) => item.name === serviceName);
  if (!found) {
    preview.setAttribute('hidden', '');
    nameEl.textContent = '';
    metaEl.textContent = '';
    return;
  }

  nameEl.textContent = found.name;
  metaEl.textContent = `${found.category} · ${found.durationMin} min · $${found.price.toFixed(2)} USD (referencial)`;
  preview.removeAttribute('hidden');
}

function setActiveCategory(category) {
  activeCategory = category || 'Todos';
  document.querySelectorAll('[data-beauty-filter]').forEach((item) => {
    const isCurrent = (item.getAttribute('data-beauty-filter') || 'Todos') === activeCategory;
    item.classList.toggle('is-active', isCurrent);
    item.setAttribute('aria-pressed', String(isCurrent));
  });
  renderServices();
}

function renderServices() {
  const grid = document.getElementById('r-services-grid');
  const countEl = document.getElementById('r-service-count');
  if (!grid) return;

  const list = filterBeautyServices(BEAUTY_SERVICES, activeCategory);
  if (countEl) {
    const label = list.length === 1 ? 'tratamiento disponible' : 'tratamientos disponibles';
    countEl.textContent =
      activeCategory === 'Todos'
        ? `${list.length} ${label}`
        : `${list.length} ${label} · ${activeCategory}`;
  }

  grid.innerHTML = '';

  list.forEach((srv) => {
    const card = document.createElement('article');
    card.className = 'r-card';

    const body = document.createElement('div');

    const meta = document.createElement('span');
    meta.className = 'r-card__meta';
    meta.textContent = `${srv.category} · ${srv.durationMin} min`;

    const head = document.createElement('div');
    head.className = 'r-card__head';

    const title = document.createElement('h3');
    title.className = 'r-card__title';
    title.textContent = srv.name;

    const price = document.createElement('span');
    price.className = 'r-card__price';
    price.textContent = `$${srv.price.toFixed(2)} USD`;

    head.append(title, price);

    const desc = document.createElement('p');
    desc.className = 'r-card__desc';
    desc.textContent = srv.description;

    body.append(meta, head, desc);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'r-btn r-btn--outline r-card__cta';
    btn.textContent = 'Seleccionar tratamiento';
    btn.addEventListener('click', () => {
      const sel = document.getElementById('r-service');
      if (sel) {
        sel.value = srv.name;
        syncSelectedPreview(srv.name);
      }
      document.getElementById('reservas')?.scrollIntoView({ behavior: 'smooth' });
      document.getElementById('r-name')?.focus();
    });

    card.append(body, btn);
    grid.appendChild(card);
  });
}

function initForm() {
  const form = document.getElementById('r-booking-form');
  if (!form) return;

  const dateInput = document.getElementById('r-date');
  if (dateInput && !dateInput.value) {
    const tomorrow = new Date(Date.now() + 86400000);
    dateInput.value = tomorrow.toISOString().split('T')[0];
  }

  const serviceSelect = document.getElementById('r-service');
  if (serviceSelect) {
    serviceSelect.addEventListener('change', () => {
      syncSelectedPreview(serviceSelect.value);
    });
  }

  const prepared = document.getElementById('r-prepared');
  const preparedLink = document.getElementById('r-prepared-wa');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = {
      name: document.getElementById('r-name')?.value || '',
      phone: document.getElementById('r-phone')?.value || '',
      service: document.getElementById('r-service')?.value || '',
      date: document.getElementById('r-date')?.value || '',
      time: document.getElementById('r-time')?.value || '',
    };

    const res = validateBeautyBooking(data);
    ['name', 'phone', 'service', 'date', 'time'].forEach((field) => {
      const errEl = document.getElementById(`r-err-${field}`);
      if (errEl) errEl.textContent = res.errors[field] || '';
    });

    if (!res.valid) {
      if (prepared) prepared.setAttribute('hidden', '');
      return;
    }

    if (preparedLink) preparedLink.setAttribute('href', buildBeautyWhatsAppUrl(res.clean));
    if (prepared) prepared.removeAttribute('hidden');
  });
}

function initMobileDrawer() {
  const toggle = document.getElementById('r-mobile-toggle');
  const drawer = document.getElementById('r-mobile-drawer');
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
  document.querySelectorAll('[data-beauty-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setActiveCategory(btn.getAttribute('data-beauty-filter') || 'Todos');
    });
  });

  document.querySelectorAll('[data-jump-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-jump-filter') || 'Todos';
      setActiveCategory(cat);
      document.getElementById('tratamientos')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  renderServices();
  initForm();
  initMobileDrawer();
});
