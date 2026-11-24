/**
 * ORIGEN CUENCA Cafetería de Especialidad (Demostración) — DOM & Interactions
 */

import {
  COFFEE_ORIGINS,
  CAFE_MENU,
  filterCafeMenu,
  calculateCafeTotal,
  buildCafeWhatsAppUrl,
} from './logic.js';

let activeOrigin = 'loja';
let activeCategory = 'Todos';
let tray = [];

function renderOrigin(key) {
  const data = COFFEE_ORIGINS[key] || COFFEE_ORIGINS.loja;
  activeOrigin = key in COFFEE_ORIGINS ? key : 'loja';

  const titleEl = document.getElementById('c-origin-title');
  const processEl = document.getElementById('c-origin-process');
  const notesEl = document.getElementById('c-origin-notes');
  const recEl = document.getElementById('c-origin-rec');

  if (titleEl) titleEl.textContent = data.name;
  if (processEl) processEl.textContent = data.process;
  if (notesEl) notesEl.textContent = data.notes;
  if (recEl) recEl.textContent = data.recommended;

  document.querySelectorAll('[data-origin-key]').forEach((btn) => {
    const selected = btn.getAttribute('data-origin-key') === activeOrigin;
    btn.classList.toggle('is-active', selected);
    btn.setAttribute('aria-pressed', String(selected));
  });

  renderTray();
}

function addToTray(item) {
  const existing = tray.find((t) => t.id === item.id);
  if (existing) existing.qty += 1;
  else tray.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
  renderTray();
}

function setActiveCategory(category) {
  activeCategory = category || 'Todos';
  document.querySelectorAll('[data-cafe-filter]').forEach((btn) => {
    const selected = btn.getAttribute('data-cafe-filter') === activeCategory;
    btn.classList.toggle('is-active', selected);
    btn.setAttribute('aria-pressed', String(selected));
  });
  renderMenu();
}

function renderMenu() {
  const grid = document.getElementById('c-menu-grid');
  if (!grid) return;

  const list = filterCafeMenu(CAFE_MENU, activeCategory);
  grid.innerHTML = '';

  list.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'c-item-card';

    const info = document.createElement('div');

    const cat = document.createElement('p');
    cat.className = 'c-item-card__meta';
    cat.textContent = item.category;

    const head = document.createElement('div');
    head.className = 'c-item-card__head';

    const title = document.createElement('h3');
    title.className = 'c-item-card__title';
    title.textContent = item.name;

    const price = document.createElement('span');
    price.className = 'c-item-card__price';
    price.textContent = `$${item.price.toFixed(2)} USD`;

    head.append(title, price);

    const desc = document.createElement('p');
    desc.className = 'c-item-card__desc';
    desc.textContent = item.description;

    info.append(cat, head, desc);

    const actions = document.createElement('div');
    actions.className = 'c-item-card__actions';

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'c-btn c-btn--outline c-item-card__add';
    addBtn.textContent = '+ Agregar';
    addBtn.addEventListener('click', () => addToTray(item));

    const consultBtn = document.createElement('button');
    consultBtn.type = 'button';
    consultBtn.className = 'c-btn c-btn--espresso c-item-card__consult';
    consultBtn.textContent = 'Consultar';
    consultBtn.addEventListener('click', () => {
      if (!tray.some((t) => t.id === item.id)) addToTray(item);
      const trayAside = document.querySelector('.c-tray');
      const waBtn = document.getElementById('c-tray-wa');
      if (trayAside) trayAside.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      if (waBtn) window.setTimeout(() => waBtn.focus({ preventScroll: true }), 180);
    });

    actions.append(addBtn, consultBtn);
    card.append(info, actions);
    grid.appendChild(card);
  });
}

function renderTray() {
  const listEl = document.getElementById('c-tray-list');
  const totalEl = document.getElementById('c-tray-total');
  const waLink = document.getElementById('c-tray-wa');
  const originEl = document.getElementById('c-tray-origin');
  const clearBtn = document.getElementById('c-tray-clear');
  if (!listEl || !totalEl) return;

  const currentOrigin = COFFEE_ORIGINS[activeOrigin] || COFFEE_ORIGINS.loja;
  if (originEl) {
    originEl.textContent = `Origen explorado: ${currentOrigin.name}`;
  }

  listEl.innerHTML = '';
  if (tray.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'c-tray__empty';
    empty.textContent = 'Agrega bebidas o repostería de la carta para generar un resumen demostrativo en USD.';
    listEl.appendChild(empty);
    if (clearBtn) clearBtn.setAttribute('hidden', '');
  } else {
    tray.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'c-tray__row';

      const text = document.createElement('span');
      text.textContent = `${item.qty}x ${item.name} ($${(item.price * item.qty).toFixed(2)})`;

      const rmBtn = document.createElement('button');
      rmBtn.type = 'button';
      rmBtn.className = 'c-tray__remove';
      rmBtn.setAttribute('aria-label', `Quitar ${item.name} de la selección`);
      rmBtn.textContent = 'Quitar';
      rmBtn.addEventListener('click', () => {
        tray = tray.filter((t) => t.id !== item.id);
        renderTray();
      });

      li.append(text, rmBtn);
      listEl.appendChild(li);
    });
    if (clearBtn) clearBtn.removeAttribute('hidden');
  }

  totalEl.textContent = `$${calculateCafeTotal(tray).toFixed(2)} USD`;
  if (waLink) {
    waLink.setAttribute('href', buildCafeWhatsAppUrl(tray, activeOrigin));
  }
}

function initLightbox() {
  const dialog = document.getElementById('c-lightbox');
  const imgEl = document.getElementById('c-lightbox-img');
  const captionEl = document.getElementById('c-lightbox-caption');
  const closeBtn = document.getElementById('c-lightbox-close');

  if (!dialog || !imgEl || !captionEl) return;

  document.querySelectorAll('[data-lightbox-src]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const src = trigger.getAttribute('data-lightbox-src') || '';
      const alt = trigger.getAttribute('data-lightbox-alt') || '';
      const caption = trigger.getAttribute('data-lightbox-caption') || '';
      imgEl.setAttribute('src', src);
      imgEl.setAttribute('alt', alt);
      captionEl.textContent = caption;
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    });
  }

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    }
  });
}

function initMobileDrawer() {
  const toggle = document.getElementById('c-mobile-toggle');
  const drawer = document.getElementById('c-mobile-drawer');
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
  document.querySelectorAll('[data-origin-key]').forEach((btn) => {
    btn.addEventListener('click', () => renderOrigin(btn.getAttribute('data-origin-key') || 'loja'));
  });

  document.querySelectorAll('[data-cafe-filter]').forEach((btn) => {
    btn.addEventListener('click', () => setActiveCategory(btn.getAttribute('data-cafe-filter') || 'Todos'));
  });

  document.querySelectorAll('[data-jump-category]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-jump-category') || 'Todos';
      setActiveCategory(category);
      const cartaSection = document.getElementById('carta');
      if (cartaSection) cartaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const clearBtn = document.getElementById('c-tray-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      tray = [];
      renderTray();
    });
  }

  renderOrigin('loja');
  renderMenu();
  initLightbox();
  initMobileDrawer();
});
