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

function selectFormatForQuote(formatName) {
  const selectEl = document.getElementById('e-type');
  const noteEl = document.getElementById('e-selected-note');
  if (selectEl && formatName) {
    selectEl.value = formatName;
  }
  if (noteEl && formatName) {
    noteEl.textContent = `Referencia seleccionada: ${formatName}`;
    noteEl.removeAttribute('hidden');
  }
  document.getElementById('cotizacion')?.scrollIntoView({ behavior: 'smooth' });
  document.getElementById('e-name')?.focus();
}

function renderFormats() {
  const grid = document.getElementById('e-formats-grid');
  if (!grid) return;

  const list = filterEventFormats(EVENT_FORMATS, activeCategory);
  grid.innerHTML = '';

  list.forEach((fmt) => {
    const card = document.createElement('article');
    card.className = 'e-card';

    const cat = document.createElement('span');
    cat.className = 'e-card__meta';
    cat.textContent = `${fmt.category} · ${fmt.capacity}`;

    const title = document.createElement('h3');
    title.className = 'e-card__title';
    title.textContent = fmt.name;

    const desc = document.createElement('p');
    desc.className = 'e-card__desc';
    desc.textContent = fmt.description;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'e-btn e-btn--outline';
    btn.textContent = 'Cotizar este formato';
    btn.addEventListener('click', () => {
      selectFormatForQuote(fmt.name);
    });

    const top = document.createElement('div');
    top.append(cat, title, desc);

    card.append(top, btn);
    grid.appendChild(card);
  });
}

function initExperiencePrefills() {
  document.querySelectorAll('[data-prefill-format]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const formatName = btn.getAttribute('data-prefill-format') || '';
      selectFormatForQuote(formatName);
    });
  });
}

function initLightbox() {
  const dialog = document.getElementById('e-lightbox');
  const closeBtn = document.getElementById('e-lightbox-close');
  const imgEl = document.getElementById('e-lightbox-img');
  const titleEl = document.getElementById('e-lightbox-title');
  const captionEl = document.getElementById('e-lightbox-caption');

  if (!dialog || !imgEl || !titleEl || !captionEl) return;

  document.querySelectorAll('[data-gallery-img]').forEach((tile) => {
    tile.addEventListener('click', () => {
      const src = tile.getAttribute('data-gallery-img') || '';
      const title = tile.getAttribute('data-gallery-title') || '';
      const caption = tile.getAttribute('data-gallery-caption') || '';
      const thumbImg = tile.querySelector('img');

      imgEl.src = src;
      imgEl.alt = thumbImg ? thumbImg.alt : title;
      titleEl.textContent = title;
      captionEl.textContent = caption;

      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
    });
  });

  const closeDialog = () => {
    if (typeof dialog.close === 'function' && dialog.open) {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
  };

  closeBtn?.addEventListener('click', closeDialog);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
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
  initExperiencePrefills();
  initLightbox();
  initForm();
  initMobileDrawer();
});
