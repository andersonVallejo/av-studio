/**
 * TRIGAL DORADO Panadería & Pastelería (Demostración) — DOM & Interactions
 */

import {
  BAKERY_CATALOG,
  filterBakeryCatalog,
  validateCustomCakeOrder,
  buildBakeryWhatsAppUrl,
} from './logic.js';

const PRODUCT_DETAILS = {
  'pan-masa-madre': {
    image: new URL('../images/pan-masa-madre.jpg', import.meta.url).href,
    alt: 'Hogaza rústica de masa madre partida sobre tabla de madera mostrando miga abierta',
    ingredients: 'Harina de trigo molida a piedra, agua filtrada, masa madre natural y sal marina.',
    format: 'Hogaza entera de 750 g · Corteza dorada',
    leadTime: 'Horneado matutino o pedido con 24h referenciales',
    mappedFlavor: '',
  },
  'croissant-mantequilla': {
    image: new URL('../images/croissants-laminados.jpg', import.meta.url).href,
    alt: 'Cuatro croissants hojaldrados dorados sobre papel vegetal y bandeja de cerámica',
    ingredients: 'Harina panadera, mantequilla fresca de laminado, leche, levadura y huevo.',
    format: 'Caja de 4 unidades clásicas horneadas al día',
    leadTime: 'Disponible en lotes diarios o encargo con 24h',
    mappedFlavor: '',
  },
  'torta-frutos-rojos': {
    image: new URL('../images/torta-cacao-frutos.jpg', import.meta.url).href,
    alt: 'Torta artesanal de tres capas de cacao oscuro con ganache, moras, frambuesas y arándanos',
    ingredients: 'Cacao fino ecuatoriano, crema diplomática de vainilla, moras, frambuesas y ganache.',
    format: '12 porciones estándar · Diámetro 22 cm aprox.',
    leadTime: '48 horas referenciales de anticipación',
    mappedFlavor: 'Cacao y frutos rojos',
  },
  'torta-tres-leches': {
    image: new URL('../images/tres-leches-maracuya.jpg', import.meta.url).href,
    alt: 'Torta tres leches artisanal bañada con glaseado natural de maracuyá y crema ligera',
    ingredients: 'Bizcocho esponjoso, mezcla de tres leches, pulpa natural de maracuyá y crema batida.',
    format: '12 porciones estándar · Acabado glaseado cítrico',
    leadTime: '48 horas referenciales de anticipación',
    mappedFlavor: 'Tres leches de maracuyá',
  },
  'tartaleta-limon': {
    image: new URL('../images/tartaleta-limon-merengue.jpg', import.meta.url).href,
    alt: 'Tartaleta individual de crema de limón y merengue suizo ligeramente dorado',
    ingredients: 'Masa sablé de almendra, crema cítrica de limón fresco y merengue suizo tostado.',
    format: 'Porción individual de vitrina · 140 g aprox.',
    leadTime: 'Vitrina diaria o cajas surtidas con 24h',
    mappedFlavor: '',
  },
  milhojas: {
    image: new URL('../images/milhojas-vainilla-manjar.jpg', import.meta.url).href,
    alt: 'Milhojas crujiente caramelizado relleno de crema de vainilla y manjar artesanal',
    ingredients: 'Hojaldre de mantequilla caramelizado, manjar blanco de olla y crema de vainilla.',
    format: 'Porción individual de vitrina · Edición de fin de semana',
    leadTime: 'Edición limitada de vitrina o encargo con 48h',
    mappedFlavor: 'Vainilla y amapola',
  },
};

let activeCategory = 'Todos';
let activeSpotlightId = 'torta-frutos-rojos';
let currentQuickItem = null;

function prefillOrderFromProduct(item) {
  const notes = document.getElementById('t-notes');
  const flavorSel = document.getElementById('t-flavor');
  const portionsSel = document.getElementById('t-portions');
  const details = PRODUCT_DETAILS[item.id];

  if (notes) notes.value = `Interés en: ${item.name}`;
  if (flavorSel && details?.mappedFlavor) {
    flavorSel.value = details.mappedFlavor;
  }
  if (portionsSel && item.category === 'Pasteles enteros' && !portionsSel.value) {
    portionsSel.value = '12 porciones';
  }

  document.getElementById('encargos')?.scrollIntoView({ behavior: 'smooth' });
  document.getElementById('t-name')?.focus();
}

function openQuickView(item) {
  const dialog = document.getElementById('t-quickview');
  if (!dialog) return;

  const details = PRODUCT_DETAILS[item.id];
  currentQuickItem = item;

  const img = document.getElementById('t-qv-img');
  const cat = document.getElementById('t-qv-cat');
  const title = document.getElementById('t-qv-title');
  const price = document.getElementById('t-qv-price');
  const desc = document.getElementById('t-qv-desc');
  const ing = document.getElementById('t-qv-ingredients');
  const format = document.getElementById('t-qv-format');

  if (img && details) {
    img.src = details.image;
    img.alt = details.alt;
  }
  if (cat) cat.textContent = item.category;
  if (title) title.textContent = item.name;
  if (price) price.textContent = `$${item.price.toFixed(2)} USD (referencial)`;
  if (desc) desc.textContent = item.description;
  if (ing && details) ing.textContent = details.ingredients;
  if (format && details) format.textContent = `${details.format} · ${details.leadTime}`;

  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
  } else {
    dialog.setAttribute('open', '');
  }
}

function closeQuickView() {
  const dialog = document.getElementById('t-quickview');
  if (!dialog) return;
  if (typeof dialog.close === 'function' && dialog.open) {
    dialog.close();
  } else {
    dialog.removeAttribute('open');
  }
}

function setActiveCategory(category) {
  activeCategory = category || 'Todos';
  document.querySelectorAll('[data-bakery-filter]').forEach((item) => {
    const isCurrent = (item.getAttribute('data-bakery-filter') || 'Todos') === activeCategory;
    item.classList.toggle('is-active', isCurrent);
    item.setAttribute('aria-pressed', String(isCurrent));
  });
  renderCatalog();
}

function renderCatalog() {
  const grid = document.getElementById('t-catalog-grid');
  const countEl = document.getElementById('t-catalog-count');
  if (!grid) return;

  const list = filterBakeryCatalog(BAKERY_CATALOG, activeCategory);
  if (countEl) {
    const word = list.length === 1 ? 'producto en vitrina' : 'productos en vitrina';
    countEl.textContent =
      activeCategory === 'Todos' ? `${list.length} ${word}` : `${list.length} ${word} · ${activeCategory}`;
  }

  grid.innerHTML = '';

  list.forEach((item) => {
    const details = PRODUCT_DETAILS[item.id];
    const card = document.createElement('article');
    card.className = 't-product-card';

    const media = document.createElement('div');
    media.className = 't-product-card__media';
    const img = document.createElement('img');
    img.src = details?.image || '';
    img.alt = details?.alt || item.name;
    img.width = 800;
    img.height = 600;
    img.loading = 'eager';
    img.decoding = 'async';
    media.appendChild(img);

    const body = document.createElement('div');
    body.className = 't-product-card__body';

    const info = document.createElement('div');

    const cat = document.createElement('span');
    cat.className = 't-product-card__cat';
    cat.textContent = item.category;

    const head = document.createElement('div');
    head.className = 't-product-card__head';

    const title = document.createElement('h3');
    title.className = 't-product-card__title';
    title.textContent = item.name;

    const price = document.createElement('span');
    price.className = 't-product-card__price';
    price.textContent = `$${item.price.toFixed(2)} USD`;

    head.append(title, price);

    const desc = document.createElement('p');
    desc.className = 't-product-card__desc';
    desc.textContent = item.description;

    info.append(cat, head, desc);

    const actions = document.createElement('div');
    actions.className = 't-product-card__actions';

    const quickBtn = document.createElement('button');
    quickBtn.type = 'button';
    quickBtn.className = 't-btn t-btn--outline';
    quickBtn.textContent = 'Ficha rápida';
    quickBtn.addEventListener('click', () => openQuickView(item));

    const quoteBtn = document.createElement('button');
    quoteBtn.type = 'button';
    quoteBtn.className = 't-btn t-btn--choco';
    quoteBtn.textContent = 'Cotizar similar';
    quoteBtn.addEventListener('click', () => prefillOrderFromProduct(item));

    actions.append(quickBtn, quoteBtn);
    body.append(info, actions);
    card.append(media, body);
    grid.appendChild(card);
  });
}

function renderSpotlight(id) {
  const item = BAKERY_CATALOG.find((entry) => entry.id === id);
  if (!item) return;
  activeSpotlightId = item.id;

  const details = PRODUCT_DETAILS[item.id];
  const cat = document.getElementById('t-sp-cat');
  const price = document.getElementById('t-sp-price');
  const title = document.getElementById('t-sp-title');
  const desc = document.getElementById('t-sp-desc');
  const yieldEl = document.getElementById('t-sp-yield');
  const leadEl = document.getElementById('t-sp-lead');

  if (cat) cat.textContent = item.category;
  if (price) price.textContent = `$${item.price.toFixed(2)} USD (ref.)`;
  if (title) title.textContent = item.name;
  if (desc) desc.textContent = item.description;
  if (yieldEl && details) yieldEl.textContent = details.format;
  if (leadEl && details) leadEl.textContent = details.leadTime;

  document.querySelectorAll('[data-spotlight-id]').forEach((tab) => {
    const selected = tab.getAttribute('data-spotlight-id') === item.id;
    tab.classList.toggle('is-active', selected);
    tab.setAttribute('aria-selected', String(selected));
  });
}

function initSpotlight() {
  document.querySelectorAll('[data-spotlight-id]').forEach((tab) => {
    tab.addEventListener('click', () => {
      const id = tab.getAttribute('data-spotlight-id');
      if (id) renderSpotlight(id);
    });
  });

  document.getElementById('t-sp-quote-btn')?.addEventListener('click', () => {
    const item = BAKERY_CATALOG.find((entry) => entry.id === activeSpotlightId);
    if (item) prefillOrderFromProduct(item);
  });

  document.getElementById('t-sp-quick-btn')?.addEventListener('click', () => {
    const item = BAKERY_CATALOG.find((entry) => entry.id === activeSpotlightId);
    if (item) openQuickView(item);
  });

  renderSpotlight(activeSpotlightId);
}

function initQuickViewDialog() {
  const dialog = document.getElementById('t-quickview');
  if (!dialog) return;

  document.getElementById('t-qv-close')?.addEventListener('click', closeQuickView);
  document.getElementById('t-qv-dismiss')?.addEventListener('click', closeQuickView);
  document.getElementById('t-qv-action')?.addEventListener('click', () => {
    const item = currentQuickItem;
    closeQuickView();
    if (item) prefillOrderFromProduct(item);
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeQuickView();
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
      setActiveCategory(btn.getAttribute('data-bakery-filter') || 'Todos');
    });
  });

  document.querySelectorAll('[data-jump-cat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setActiveCategory(btn.getAttribute('data-jump-cat') || 'Todos');
      document.getElementById('vitrina')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  document.querySelectorAll('[data-select-portions]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const portions = btn.getAttribute('data-select-portions') || '';
      const sel = document.getElementById('t-portions');
      if (sel && portions) sel.value = portions;
      document.getElementById('encargos')?.scrollIntoView({ behavior: 'smooth' });
      document.getElementById('t-name')?.focus();
    });
  });

  renderCatalog();
  initSpotlight();
  initQuickViewDialog();
  initOrderForm();
  initMobileDrawer();
});
