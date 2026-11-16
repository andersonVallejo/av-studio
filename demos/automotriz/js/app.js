/**
 * TORQUE ANDINO Servicio Automotriz (Demostración) — DOM & Interactions
 */

import {
  AUTO_SERVICES,
  filterAutoServices,
  validateAutoTurn,
  buildAutoWhatsAppUrl,
} from './logic.js';

let activeCategory = 'Todos';

function renderServices() {
  const grid = document.getElementById('au-grid');
  if (!grid) return;

  const list = filterAutoServices(AUTO_SERVICES, activeCategory);
  grid.innerHTML = '';

  list.forEach((srv) => {
    const card = document.createElement('article');
    card.className = 'au-card';

    const cat = document.createElement('span');
    cat.className = 'au-eyebrow';
    cat.style.marginBottom = '0.2rem';
    cat.textContent = srv.category;

    const title = document.createElement('h3');
    title.style.margin = '0 0 0.35rem';
    title.style.fontSize = '1.08rem';
    title.textContent = srv.name;

    const price = document.createElement('div');
    price.className = 'au-card__price';
    price.textContent = srv.priceLabel;

    const desc = document.createElement('p');
    desc.style.margin = '0.5rem 0 0';
    desc.style.fontSize = '0.88rem';
    desc.style.color = 'var(--au-muted)';
    desc.textContent = srv.description;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'au-btn au-btn--dark';
    btn.textContent = 'Agendar revisión';
    btn.addEventListener('click', () => {
      const sel = document.getElementById('au-service');
      if (sel) sel.value = srv.name;
      document.getElementById('turnos')?.scrollIntoView({ behavior: 'smooth' });
      document.getElementById('au-name')?.focus();
    });

    const top = document.createElement('div');
    top.append(cat, title, price, desc);

    card.append(top, btn);
    grid.appendChild(card);
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
      activeCategory = btn.getAttribute('data-auto-filter') || 'Todos';
      document.querySelectorAll('[data-auto-filter]').forEach((item) => {
        item.classList.toggle('is-active', item === btn);
      });
      renderServices();
    });
  });

  renderServices();
  initForm();
  initMobileDrawer();
});
