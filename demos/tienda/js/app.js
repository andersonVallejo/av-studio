/**
 * MERCADO SERRANO Tienda de Diseño & Hogar (Demostración) — DOM & Interactions
 */

import {
  STORE_PRODUCTS,
  filterStoreProducts,
  updateStoreCart,
  calculateStoreTotal,
  buildStoreWhatsAppUrl,
} from './logic.js';

let activeCategory = 'Todos';
let searchQuery = '';
let cart = [];
let activeSpotlightId = 'lampara-lino';
let activeQuickViewId = null;

const PRODUCT_MEDIA = {
  'jarron-chordeleg': {
    webp: new URL('../images/ceramica.webp', import.meta.url).href,
    jpg: new URL('../images/ceramica.jpg', import.meta.url).href,
    alt: 'Jarrón artesanal en cerámica terracota mate sobre mesa de piedra clara',
  },
  'vajilla-cuenca': {
    webp: null,
    jpg: new URL('../images/tazas-gres.jpg', import.meta.url).href,
    alt: 'Set de dos tazas en gres esmaltado crema y verde salvia sobre piedra travertino',
  },
  'manta-lana': {
    webp: new URL('../images/textiles.webp', import.meta.url).href,
    jpg: new URL('../images/textiles.jpg', import.meta.url).href,
    alt: 'Manta tejida en lana andina terracota y crudo doblada sobre banca de madera',
  },
  'cojin-lino': {
    webp: null,
    jpg: new URL('../images/cojin-lino.jpg', import.meta.url).href,
    alt: 'Funda de cojín en lino crudo natural con costura vista sobre banca de roble',
  },
  'lampara-lino': {
    webp: new URL('../images/lampara.webp', import.meta.url).href,
    jpg: new URL('../images/lampara.jpg', import.meta.url).href,
    alt: 'Lámpara de sobremesa con base cilíndrica de roble y pantalla de lino cálida',
  },
  'bandeja-madera': {
    webp: null,
    jpg: new URL('../images/centro-piedra.jpg', import.meta.url).href,
    alt: 'Centro de mesa bajo tallado en piedra travertino clara sobre mesa de comedor de madera',
  },
};

const PRODUCT_SPECS = {
  'jarron-chordeleg': {
    material: 'Arcilla roja natural sin esmaltado exterior',
    dimensions: '24 cm alto × 16 cm diámetro (referencial)',
    care: 'Limpiar en seco o con paño ligeramente húmedo; recomendado para tallos secos.',
    space: 'Recibidor, repisa o mesa auxiliar',
  },
  'vajilla-cuenca': {
    material: 'Gres cerámico cocido a alta temperatura con esmalte mineral',
    dimensions: 'Set de 2 unidades · 290 ml cada taza',
    care: 'Apta para bebidas calientes y lavado cotidiano sin abrasivos metálicos.',
    space: 'Cocina y mesa de desayuno',
  },
  'manta-lana': {
    material: 'Lana andina de trama media en tonos terracota y crudo',
    dimensions: '140 × 190 cm con flecos anudados',
    care: 'Airear con frecuencia; lavado delicado en frío sin secadora.',
    space: 'Pie de cama o sofá de lectura',
  },
  'cojin-lino': {
    material: 'Lino natural prelavado de textura orgánica y cierre oculto',
    dimensions: '45 × 45 cm (no incluye relleno en esta referencia)',
    care: 'Lavado suave con agua fría; secado a la sombra.',
    space: 'Sala de estar o dormitorio',
  },
  'lampara-lino': {
    material: 'Base en roble aceitado, pantalla de lino tejido y cable textil',
    dimensions: '38 cm altura total × 22 cm diámetro de pantalla',
    care: 'Compatible con foco LED cálido E27 de bajo consumo.',
    space: 'Velador, consola o escritorio de estudio',
  },
  'bandeja-madera': {
    material: 'Piedra travertino clara con acabado mate y porosidad natural',
    dimensions: '32 cm diámetro × 6 cm altura aproximada',
    care: 'Limpiar con paño suave humedecido en agua tibia; evitar ácidos.',
    space: 'Mesa de centro o comedor',
  },
};

const SCENE_IDS = ['manta-lana', 'lampara-lino', 'jarron-chordeleg', 'bandeja-madera'];

function createProductPicture(prod) {
  const media = PRODUCT_MEDIA[prod.id] || {
    webp: new URL('../images/hero.webp', import.meta.url).href,
    jpg: new URL('../images/hero.jpg', import.meta.url).href,
    alt: `Fotografía referencial de ${prod.name}`,
  };

  const picture = document.createElement('picture');

  if (media.webp) {
    const source = document.createElement('source');
    source.srcset = media.webp;
    source.type = 'image/webp';
    picture.appendChild(source);
  }

  const img = document.createElement('img');
  img.src = media.jpg;
  img.width = 1200;
  img.height = 900;
  img.loading = 'eager';
  img.decoding = 'async';
  img.alt = media.alt;

  picture.appendChild(img);
  return picture;
}

function addProductWithFeedback(product, buttonEl) {
  cart = updateStoreCart(cart, product, 1);
  renderCart();

  if (buttonEl) {
    const originalText = buttonEl.getAttribute('data-original-label') || buttonEl.textContent || '+ Agregar';
    buttonEl.setAttribute('data-original-label', originalText);
    buttonEl.textContent = 'Agregado a lista';
    window.setTimeout(() => {
      if (buttonEl.isConnected) {
        buttonEl.textContent = originalText;
      }
    }, 950);
  }
}

function openQuickView(productId) {
  const modal = document.getElementById('s-quickview');
  const product = STORE_PRODUCTS.find((p) => p.id === productId);
  if (!modal || !product) return;

  activeQuickViewId = product.id;
  const specs = PRODUCT_SPECS[product.id] || {};

  const mediaSlot = document.getElementById('s-qv-media');
  if (mediaSlot) {
    mediaSlot.innerHTML = '';
    mediaSlot.appendChild(createProductPicture(product));
  }

  const catEl = document.getElementById('s-qv-cat');
  const titleEl = document.getElementById('s-qv-title');
  const priceEl = document.getElementById('s-qv-price');
  const descEl = document.getElementById('s-qv-desc');
  const specsEl = document.getElementById('s-qv-specs');

  if (catEl) catEl.textContent = `${product.category} · Pieza demostrativa`;
  if (titleEl) titleEl.textContent = product.name;
  if (priceEl) priceEl.textContent = `$${product.price.toFixed(2)} USD`;
  if (descEl) descEl.textContent = product.description;

  if (specsEl) {
    specsEl.innerHTML = '';
    const rows = [
      ['Material', specs.material || 'Acabado natural'],
      ['Medidas', specs.dimensions || 'Formato estándar de hogar'],
      ['Uso sugerido', specs.space || 'Interiores residenciales'],
      ['Cuidado', specs.care || 'Limpieza suave según material'],
    ];
    rows.forEach(([label, value]) => {
      const wrap = document.createElement('div');
      wrap.className = 's-modal__spec-row';
      const dt = document.createElement('dt');
      dt.textContent = label;
      const dd = document.createElement('dd');
      dd.textContent = value;
      wrap.append(dt, dd);
      specsEl.appendChild(wrap);
    });
  }

  if (typeof modal.showModal === 'function') {
    if (!modal.open) modal.showModal();
  } else {
    modal.setAttribute('open', '');
  }
}

function closeQuickView() {
  const modal = document.getElementById('s-quickview');
  if (!modal) return;
  if (typeof modal.close === 'function' && modal.open) {
    modal.close();
  } else {
    modal.removeAttribute('open');
  }
}

function initQuickViewModal() {
  const modal = document.getElementById('s-quickview');
  if (!modal) return;

  document.getElementById('s-qv-close')?.addEventListener('click', closeQuickView);
  document.getElementById('s-qv-dismiss')?.addEventListener('click', closeQuickView);

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeQuickView();
    }
  });

  document.getElementById('s-qv-add')?.addEventListener('click', (event) => {
    const product = STORE_PRODUCTS.find((p) => p.id === activeQuickViewId);
    if (!product) return;
    addProductWithFeedback(product, event.currentTarget);
  });
}

function renderSpotlight() {
  const container = document.getElementById('s-spotlight-panel');
  if (!container) return;

  const product = STORE_PRODUCTS.find((p) => p.id === activeSpotlightId) || STORE_PRODUCTS[0];
  const specs = PRODUCT_SPECS[product.id] || {};

  container.innerHTML = '';

  const mediaWrap = document.createElement('div');
  mediaWrap.className = 's-spotlight__media';
  mediaWrap.appendChild(createProductPicture(product));

  const details = document.createElement('div');

  const kicker = document.createElement('p');
  kicker.className = 's-kicker';
  kicker.textContent = `${product.category} · Ficha curada`;

  const title = document.createElement('h3');
  title.className = 's-spotlight__title';
  title.textContent = product.name;

  const price = document.createElement('p');
  price.className = 's-spotlight__price';
  price.textContent = `$${product.price.toFixed(2)} USD`;

  const desc = document.createElement('p');
  desc.className = 's-spotlight__desc';
  desc.textContent = product.description;

  const specList = document.createElement('dl');
  specList.className = 's-spotlight__specs';
  [
    ['Materialidad', specs.material],
    ['Dimensiones', specs.dimensions],
    ['Cuidado', specs.care],
  ].forEach(([label, value]) => {
    if (!value) return;
    const row = document.createElement('div');
    row.className = 's-spotlight__spec-row';
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = value;
    row.append(dt, dd);
    specList.appendChild(row);
  });

  const actionRow = document.createElement('div');
  actionRow.className = 's-btn-row';

  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 's-btn s-btn--terracotta';
  addBtn.textContent = '+ Agregar a selección';
  addBtn.addEventListener('click', () => addProductWithFeedback(product, addBtn));

  const quickBtn = document.createElement('button');
  quickBtn.type = 'button';
  quickBtn.className = 's-btn s-btn--outline';
  quickBtn.textContent = 'Abrir consulta rápida';
  quickBtn.addEventListener('click', () => openQuickView(product.id));

  actionRow.append(addBtn, quickBtn);
  details.append(kicker, title, price, desc, specList, actionRow);
  container.append(mediaWrap, details);
}

function renderSceneItems() {
  const container = document.getElementById('s-scene-items');
  if (!container) return;

  container.innerHTML = '';
  SCENE_IDS.forEach((id) => {
    const prod = STORE_PRODUCTS.find((p) => p.id === id);
    if (!prod) return;

    const card = document.createElement('article');
    card.className = 's-scene-card';

    const info = document.createElement('div');

    const cat = document.createElement('div');
    cat.className = 's-scene-card__cat';
    cat.textContent = prod.category;

    const title = document.createElement('h3');
    title.className = 's-scene-card__title';
    title.textContent = prod.name;

    const price = document.createElement('div');
    price.className = 's-scene-card__price';
    price.textContent = `$${prod.price.toFixed(2)} USD`;

    info.append(cat, title, price);

    const actions = document.createElement('div');
    actions.className = 's-scene-card__actions';

    const inspectBtn = document.createElement('button');
    inspectBtn.type = 'button';
    inspectBtn.className = 's-btn s-btn--outline-light';
    inspectBtn.textContent = 'Ver ficha';
    inspectBtn.addEventListener('click', () => openQuickView(prod.id));

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 's-btn s-btn--terracotta';
    addBtn.textContent = '+ Agregar';
    addBtn.addEventListener('click', () => addProductWithFeedback(prod, addBtn));

    actions.append(inspectBtn, addBtn);
    card.append(info, actions);
    container.appendChild(card);
  });
}

function renderProducts() {
  const grid = document.getElementById('s-products-grid');
  const countEl = document.getElementById('s-catalog-count');
  if (!grid) return;

  const list = filterStoreProducts(STORE_PRODUCTS, activeCategory, searchQuery);
  grid.innerHTML = '';

  if (countEl) {
    const label = list.length === 1 ? '1 pieza demostrativa' : `${list.length} piezas demostrativas`;
    countEl.textContent = `Mostrando ${label} · Usa «Ver ficha» para abrir el detalle sin salir del catálogo.`;
  }

  if (list.length === 0) {
    const empty = document.createElement('p');
    empty.className = 's-products-empty';
    empty.textContent =
      'No se encontraron artículos de ejemplo con ese término. Prueba limpiando el buscador o cambiando a «Todos».';
    grid.appendChild(empty);
    return;
  }

  list.forEach((prod) => {
    const card = document.createElement('article');
    card.className = 's-product-card';

    const mediaWrap = document.createElement('div');
    mediaWrap.className = 's-product-card__media';
    mediaWrap.appendChild(createProductPicture(prod));

    const body = document.createElement('div');
    body.className = 's-product-card__body';

    const meta = document.createElement('div');
    meta.className = 's-product-card__meta';
    meta.textContent = `${prod.category} · Referencia USD`;

    const head = document.createElement('div');
    head.className = 's-product-card__head';

    const title = document.createElement('h3');
    title.className = 's-product-card__title';
    title.textContent = prod.name;

    const price = document.createElement('span');
    price.className = 's-product-card__price';
    price.textContent = `$${prod.price.toFixed(2)}`;

    head.append(title, price);

    const desc = document.createElement('p');
    desc.className = 's-product-card__desc';
    desc.textContent = prod.description;

    const actions = document.createElement('div');
    actions.className = 's-product-card__actions';

    const inspectBtn = document.createElement('button');
    inspectBtn.type = 'button';
    inspectBtn.className = 's-btn s-btn--outline s-product-card__inspect';
    inspectBtn.textContent = 'Ver ficha';
    inspectBtn.setAttribute('aria-label', `Ver ficha de ${prod.name}`);
    inspectBtn.addEventListener('click', () => openQuickView(prod.id));

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 's-btn s-btn--black s-product-card__btn';
    addBtn.textContent = '+ Agregar';
    addBtn.setAttribute('aria-label', `Agregar ${prod.name} a selección`);
    addBtn.addEventListener('click', () => addProductWithFeedback(prod, addBtn));

    actions.append(inspectBtn, addBtn);

    const top = document.createElement('div');
    top.append(meta, head, desc);

    body.append(top, actions);
    card.append(mediaWrap, body);
    grid.appendChild(card);
  });
}

function renderCart() {
  const listEl = document.getElementById('s-cart-list');
  const totalEl = document.getElementById('s-cart-total');
  const waLink = document.getElementById('s-cart-wa');
  const headerCount = document.getElementById('s-header-count');
  const clearBtn = document.getElementById('s-cart-clear');
  if (!listEl || !totalEl) return;

  const totalUnits = cart.reduce((acc, item) => acc + item.qty, 0);
  if (headerCount) headerCount.textContent = String(totalUnits);
  if (clearBtn) {
    if (cart.length > 0) clearBtn.removeAttribute('hidden');
    else clearBtn.setAttribute('hidden', '');
  }

  listEl.innerHTML = '';
  if (cart.length === 0) {
    const empty = document.createElement('li');
    empty.className = 's-cart__empty';
    empty.textContent = 'Tu lista demostrativa está vacía. Agrega cualquier pieza del catálogo.';
    listEl.appendChild(empty);
  } else {
    cart.forEach((item) => {
      const li = document.createElement('li');
      li.className = 's-cart__row';

      const name = document.createElement('span');
      name.textContent = `${item.name} ($${(item.price * item.qty).toFixed(2)})`;

      const controls = document.createElement('div');
      controls.className = 's-cart__controls';

      const minus = document.createElement('button');
      minus.type = 'button';
      minus.className = 's-qty-btn';
      minus.textContent = '-';
      minus.setAttribute('aria-label', `Quitar uno de ${item.name}`);
      minus.addEventListener('click', () => {
        cart = updateStoreCart(cart, item, -1);
        renderCart();
      });

      const qty = document.createElement('span');
      qty.className = 's-cart__qty';
      qty.textContent = String(item.qty);

      const plus = document.createElement('button');
      plus.type = 'button';
      plus.className = 's-qty-btn';
      plus.textContent = '+';
      plus.setAttribute('aria-label', `Agregar uno de ${item.name}`);
      plus.addEventListener('click', () => {
        cart = updateStoreCart(cart, item, 1);
        renderCart();
      });

      controls.append(minus, qty, plus);
      li.append(name, controls);
      listEl.appendChild(li);
    });
  }

  totalEl.textContent = `$${calculateStoreTotal(cart).toFixed(2)} USD`;
  if (waLink) waLink.setAttribute('href', buildStoreWhatsAppUrl(cart));
}

function initMobileDrawer() {
  const toggle = document.getElementById('s-mobile-toggle');
  const drawer = document.getElementById('s-mobile-drawer');
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
  document.querySelectorAll('[data-store-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeCategory = btn.getAttribute('data-store-filter') || 'Todos';
      document.querySelectorAll('[data-store-filter]').forEach((item) => {
        item.classList.toggle('is-active', item === btn);
      });
      renderProducts();
    });
  });

  document.getElementById('s-search')?.addEventListener('input', (event) => {
    searchQuery = event.target.value || '';
    renderProducts();
  });

  document.querySelectorAll('[data-spotlight-id]').forEach((tab) => {
    tab.addEventListener('click', () => {
      activeSpotlightId = tab.getAttribute('data-spotlight-id') || 'lampara-lino';
      document.querySelectorAll('[data-spotlight-id]').forEach((item) => {
        const isCurrent = item === tab;
        item.classList.toggle('is-active', isCurrent);
        item.setAttribute('aria-selected', String(isCurrent));
      });
      renderSpotlight();
    });
  });

  document.getElementById('s-cart-clear')?.addEventListener('click', () => {
    cart = [];
    renderCart();
  });

  initQuickViewModal();
  renderProducts();
  renderSpotlight();
  renderSceneItems();
  renderCart();
  initMobileDrawer();
});
