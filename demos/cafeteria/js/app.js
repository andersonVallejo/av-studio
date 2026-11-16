/**
 * ORIGEN CUENCA Cafetería (Demostración) — DOM & Interactions
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
  activeOrigin = key;

  const titleEl = document.getElementById('c-origin-title');
  const processEl = document.getElementById('c-origin-process');
  const notesEl = document.getElementById('c-origin-notes');
  const recEl = document.getElementById('c-origin-rec');

  if (titleEl) titleEl.textContent = data.name;
  if (processEl) processEl.textContent = data.process;
  if (notesEl) notesEl.textContent = data.notes;
  if (recEl) recEl.textContent = data.recommended;

  document.querySelectorAll('[data-origin-key]').forEach((btn) => {
    const selected = btn.getAttribute('data-origin-key') === key;
    btn.classList.toggle('is-active', selected);
    btn.setAttribute('aria-pressed', String(selected));
  });

  renderTray();
}

function renderMenu() {
  const grid = document.getElementById('c-menu-grid');
  if (!grid) return;

  const list = filterCafeMenu(CAFE_MENU, activeCategory);
  grid.innerHTML = '';

  list.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'c-item-card';

    const head = document.createElement('div');
    head.className = 'c-item-card__head';

    const title = document.createElement('h3');
    title.style.margin = '0';
    title.style.fontSize = '1.05rem';
    title.textContent = item.name;

    const price = document.createElement('span');
    price.className = 'c-item-card__price';
    price.textContent = `$${item.price.toFixed(2)}`;

    head.append(title, price);

    const desc = document.createElement('p');
    desc.style.margin = '0.35rem 0 0';
    desc.style.fontSize = '0.88rem';
    desc.style.color = 'var(--c-muted)';
    desc.textContent = item.description;

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'c-btn c-btn--outline';
    addBtn.textContent = '+ Agregar a bandeja';
    addBtn.addEventListener('click', () => {
      const existing = tray.find((t) => t.id === item.id);
      if (existing) existing.qty += 1;
      else tray.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
      renderTray();
    });

    const top = document.createElement('div');
    top.append(head, desc);

    card.append(top, addBtn);
    grid.appendChild(card);
  });
}

function renderTray() {
  const listEl = document.getElementById('c-tray-list');
  const totalEl = document.getElementById('c-tray-total');
  const waLink = document.getElementById('c-tray-wa');
  if (!listEl || !totalEl) return;

  listEl.innerHTML = '';
  if (tray.length === 0) {
    const empty = document.createElement('li');
    empty.style.fontSize = '0.84rem';
    empty.style.opacity = '0.78';
    empty.textContent = 'Agrega bebidas o repostería para probar la lista demostrativa.';
    listEl.appendChild(empty);
  } else {
    tray.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'c-tray__row';

      const text = document.createElement('span');
      text.textContent = `${item.qty}x ${item.name} ($${(item.price * item.qty).toFixed(2)})`;

      const rmBtn = document.createElement('button');
      rmBtn.type = 'button';
      rmBtn.className = 'c-tray__remove';
      rmBtn.textContent = 'Quitar';
      rmBtn.addEventListener('click', () => {
        tray = tray.filter((t) => t.id !== item.id);
        renderTray();
      });

      li.append(text, rmBtn);
      listEl.appendChild(li);
    });
  }

  totalEl.textContent = `$${calculateCafeTotal(tray).toFixed(2)} USD`;
  if (waLink) {
    waLink.setAttribute('href', buildCafeWhatsAppUrl(tray, activeOrigin));
  }
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
    btn.addEventListener('click', () => {
      activeCategory = btn.getAttribute('data-cafe-filter') || 'Todos';
      document.querySelectorAll('[data-cafe-filter]').forEach((item) => {
        item.classList.toggle('is-active', item === btn);
      });
      renderMenu();
    });
  });

  renderOrigin('loja');
  renderMenu();
  initMobileDrawer();
});
