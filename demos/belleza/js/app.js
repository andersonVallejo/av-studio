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

function renderServices() {
  const grid = document.getElementById('r-services-grid');
  if (!grid) return;

  const list = filterBeautyServices(BEAUTY_SERVICES, activeCategory);
  grid.innerHTML = '';

  list.forEach((srv) => {
    const card = document.createElement('article');
    card.className = 'r-card';

    const cat = document.createElement('span');
    cat.className = 'r-eyebrow';
    cat.style.marginBottom = '0.2rem';
    cat.textContent = `${srv.category} · ${srv.durationMin} min`;

    const head = document.createElement('div');
    head.style.display = 'flex';
    head.style.justifyContent = 'space-between';
    head.style.alignItems = 'baseline';
    head.style.gap = '0.5rem';

    const title = document.createElement('h3');
    title.style.margin = '0';
    title.style.fontFamily = 'var(--r-font-display)';
    title.style.fontSize = '1.35rem';
    title.textContent = srv.name;

    const price = document.createElement('span');
    price.className = 'r-card__price';
    price.textContent = `$${srv.price.toFixed(2)}`;

    head.append(title, price);

    const desc = document.createElement('p');
    desc.style.margin = '0.45rem 0 0';
    desc.style.fontSize = '0.9rem';
    desc.style.color = 'var(--r-muted)';
    desc.textContent = srv.description;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'r-btn r-btn--outline';
    btn.textContent = 'Reservar tratamiento';
    btn.addEventListener('click', () => {
      const sel = document.getElementById('r-service');
      if (sel) sel.value = srv.name;
      document.getElementById('reservas')?.scrollIntoView({ behavior: 'smooth' });
      document.getElementById('r-name')?.focus();
    });

    const body = document.createElement('div');
    body.append(cat, head, desc);

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
      activeCategory = btn.getAttribute('data-beauty-filter') || 'Todos';
      document.querySelectorAll('[data-beauty-filter]').forEach((item) => {
        item.classList.toggle('is-active', item === btn);
      });
      renderServices();
    });
  });

  renderServices();
  initForm();
  initMobileDrawer();
});
