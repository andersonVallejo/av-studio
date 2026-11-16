/**
 * TRIGAL DORADO Panadería & Pastelería (Demostración) — DOM & Interactions
 */

import {
  BAKERY_CATALOG,
  filterBakeryCatalog,
  validateCustomCakeOrder,
  buildBakeryWhatsAppUrl,
} from './logic.js';

let activeCategory = 'Todos';

function renderCatalog() {
  const grid = document.getElementById('t-catalog-grid');
  if (!grid) return;

  const list = filterBakeryCatalog(BAKERY_CATALOG, activeCategory);
  grid.innerHTML = '';

  list.forEach((item) => {
    const card = document.createElement('article');
    card.className = 't-product-card';

    const cat = document.createElement('span');
    cat.className = 't-eyebrow';
    cat.style.marginBottom = '0.2rem';
    cat.textContent = item.category;

    const head = document.createElement('div');
    head.style.display = 'flex';
    head.style.justifyContent = 'space-between';
    head.style.alignItems = 'baseline';
    head.style.gap = '0.5rem';

    const title = document.createElement('h3');
    title.style.margin = '0';
    title.style.fontFamily = 'var(--t-font-display)';
    title.style.fontSize = '1.35rem';
    title.textContent = item.name;

    const price = document.createElement('span');
    price.className = 't-product-card__price';
    price.textContent = `$${item.price.toFixed(2)}`;

    head.append(title, price);

    const desc = document.createElement('p');
    desc.style.margin = '0.45rem 0 0';
    desc.style.fontSize = '0.9rem';
    desc.style.color = 'var(--t-muted)';
    desc.textContent = item.description;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 't-btn t-btn--outline';
    btn.textContent = 'Cotizar similar';
    btn.addEventListener('click', () => {
      const notes = document.getElementById('t-notes');
      if (notes) notes.value = `Interés en: ${item.name}`;
      document.getElementById('encargos')?.scrollIntoView({ behavior: 'smooth' });
      document.getElementById('t-name')?.focus();
    });

    const body = document.createElement('div');
    body.append(cat, head, desc);

    card.append(body, btn);
    grid.appendChild(card);
  });
}

function initOrderForm() {
  const form = document.getElementById('t-order-form');
  if (!form) return;

  const dateInput = document.getElementById('t-date');
  if (dateInput && !dateInput.value) {
    const future = new Date(Date.now() + 2 * 86400000);
    dateInput.value = future.toISOString().split('T')[0];
  }

  const prepared = document.getElementById('t-prepared');
  const preparedLink = document.getElementById('t-prepared-wa');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = {
      name: document.getElementById('t-name')?.value || '',
      phone: document.getElementById('t-phone')?.value || '',
      flavor: document.getElementById('t-flavor')?.value || '',
      portions: document.getElementById('t-portions')?.value || '',
      date: document.getElementById('t-date')?.value || '',
      notes: document.getElementById('t-notes')?.value || '',
    };

    const res = validateCustomCakeOrder(data);
    ['name', 'phone', 'flavor', 'portions', 'date'].forEach((field) => {
      const errEl = document.getElementById(`t-err-${field}`);
      if (errEl) errEl.textContent = res.errors[field] || '';
    });

    if (!res.valid) {
      if (prepared) prepared.setAttribute('hidden', '');
      return;
    }

    if (preparedLink) preparedLink.setAttribute('href', buildBakeryWhatsAppUrl(res.clean));
    if (prepared) prepared.removeAttribute('hidden');
  });
}

function initMobileDrawer() {
  const toggle = document.getElementById('t-mobile-toggle');
  const drawer = document.getElementById('t-mobile-drawer');
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
  document.querySelectorAll('[data-bakery-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeCategory = btn.getAttribute('data-bakery-filter') || 'Todos';
      document.querySelectorAll('[data-bakery-filter]').forEach((item) => {
        item.classList.toggle('is-active', item === btn);
      });
      renderCatalog();
    });
  });

  renderCatalog();
  initOrderForm();
  initMobileDrawer();
});
