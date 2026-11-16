/**
 * VERBENA & ESTILO Eventos y Celebraciones (Demostración) — DOM & Interactions
 */

import {
  EVENT_FORMATS,
  filterEventFormats,
  validateEventQuote,
  buildEventWhatsAppUrl,
} from './logic.js';

let activeCategory = 'Todos';

function renderFormats() {
  const grid = document.getElementById('e-formats-grid');
  if (!grid) return;

  const list = filterEventFormats(EVENT_FORMATS, activeCategory);
  grid.innerHTML = '';

  list.forEach((fmt) => {
    const card = document.createElement('article');
    card.className = 'e-card';

    const cat = document.createElement('span');
    cat.className = 'e-eyebrow';
    cat.style.marginBottom = '0.2rem';
    cat.textContent = `${fmt.category} · ${fmt.capacity}`;

    const title = document.createElement('h3');
    title.style.fontFamily = 'var(--e-font-display)';
    title.style.fontSize = '1.45rem';
    title.style.margin = '0 0 0.45rem';
    title.textContent = fmt.name;

    const desc = document.createElement('p');
    desc.style.fontSize = '0.9rem';
    desc.style.color = 'var(--e-muted)';
    desc.style.margin = '0';
    desc.textContent = fmt.description;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'e-btn e-btn--outline';
    btn.textContent = 'Cotizar este formato';
    btn.addEventListener('click', () => {
      const sel = document.getElementById('e-type');
      if (sel) sel.value = fmt.name;
      document.getElementById('cotizacion')?.scrollIntoView({ behavior: 'smooth' });
      document.getElementById('e-name')?.focus();
    });

    const top = document.createElement('div');
    top.append(cat, title, desc);

    card.append(top, btn);
    grid.appendChild(card);
  });
}

function initForm() {
  const form = document.getElementById('e-quote-form');
  if (!form) return;

  const dateInput = document.getElementById('e-date');
  if (dateInput && !dateInput.value) {
    const future = new Date(Date.now() + 30 * 86400000);
    dateInput.value = future.toISOString().split('T')[0];
  }

  const prepared = document.getElementById('e-prepared');
  const preparedLink = document.getElementById('e-prepared-wa');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = {
      name: document.getElementById('e-name')?.value || '',
      phone: document.getElementById('e-phone')?.value || '',
      eventType: document.getElementById('e-type')?.value || '',
      guests: document.getElementById('e-guests')?.value || '',
      date: document.getElementById('e-date')?.value || '',
      notes: document.getElementById('e-notes')?.value || '',
    };

    const res = validateEventQuote(data);
    ['name', 'phone', 'eventType', 'guests', 'date'].forEach((field) => {
      const errEl = document.getElementById(`e-err-${field}`);
      if (errEl) errEl.textContent = res.errors[field] || '';
    });

    if (!res.valid) {
      if (prepared) prepared.setAttribute('hidden', '');
      return;
    }

    if (preparedLink) preparedLink.setAttribute('href', buildEventWhatsAppUrl(res.clean));
    if (prepared) prepared.removeAttribute('hidden');
  });
}

function initMobileDrawer() {
  const toggle = document.getElementById('e-mobile-toggle');
  const drawer = document.getElementById('e-mobile-drawer');
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
  document.querySelectorAll('[data-event-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeCategory = btn.getAttribute('data-event-filter') || 'Todos';
      document.querySelectorAll('[data-event-filter]').forEach((item) => {
        item.classList.toggle('is-active', item === btn);
      });
      renderFormats();
    });
  });

  renderFormats();
  initForm();
  initMobileDrawer();
});
