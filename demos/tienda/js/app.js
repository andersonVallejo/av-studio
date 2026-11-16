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

const PRODUCT_MEDIA = {
  'jarron-chordeleg': {
    base: 'ceramica',
    alt: 'Jarrón artesanal en cerámica terracota mate sobre mesa de roble claro',
  },
  'vajilla-cuenca': {
    base: 'ceramica',
    alt: 'Piezas de gres y cerámica artesanal cuencana esmaltadas en acabado natural',
  },
  'manta-lana': {
    base: 'textiles',
    alt: 'Manta tejida en lana andina en tonos terracota y crudo con flecos hechos a mano',
  },
  'cojin-lino': {
    base: 'textiles',
    alt: 'Textiles naturales andinos en lino y lana sobre mobiliario minimalista',
  },
  'lampara-lino': {
    base: 'lampara',
    alt: 'Lámpara de mesa en roble y pantalla de lino con luz cálida difusa',
  },
  'bandeja-madera': {
    base: 'hero',
    alt: 'Objetos de mesa y cerámica artesanal curados para el hogar',
  },
};

function createProductPicture(prod) {
  const media = PRODUCT_MEDIA[prod.id] || {
    base: 'hero',
    alt: `Fotografía referencial de ${prod.name}`,
  };
  const picture = document.createElement('picture');
  const source = document.createElement('source');
  source.srcset = `./images/${media.base}.webp`;
  source.type = 'image/webp';

  const img = document.createElement('img');
  img.src = `./images/${media.base}.jpg`;
  img.width = 800;
  img.height = 600;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.alt = media.alt;

  picture.append(source, img);
  return picture;
}

function renderProducts() {
  const grid = document.getElementById('s-products-grid');
  if (!grid) return;

  const list = filterStoreProducts(STORE_PRODUCTS, activeCategory, searchQuery);
  grid.innerHTML = '';

  if (list.length === 0) {
    const empty = document.createElement('p');
    empty.className = 's-products-empty';
    empty.textContent = 'No se encontraron artículos de ejemplo con ese término de búsqueda.';
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

    const cat = document.createElement('span');
    cat.className = 's-eyebrow s-product-card__cat';
    cat.textContent = prod.category;

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

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 's-btn s-btn--black s-product-card__btn';
    btn.textContent = '+ Agregar al carrito';
    btn.addEventListener('click', () => {
      cart = updateStoreCart(cart, prod, 1);
      renderCart();
    });

    const top = document.createElement('div');
    top.append(cat, head, desc);

    body.append(top, btn);
    card.append(mediaWrap, body);
    grid.appendChild(card);
  });
}

function renderCart() {
  const listEl = document.getElementById('s-cart-list');
  const totalEl = document.getElementById('s-cart-total');
  const waLink = document.getElementById('s-cart-wa');
  if (!listEl || !totalEl) return;

  listEl.innerHTML = '';
  if (cart.length === 0) {
    const empty = document.createElement('li');
    empty.style.fontSize = '0.84rem';
    empty.style.opacity = '0.78';
    empty.textContent = 'Tu carrito demostrativo está vacío.';
    listEl.appendChild(empty);
  } else {
    cart.forEach((item) => {
      const li = document.createElement('li');
      li.className = 's-cart__row';

      const name = document.createElement('span');
      name.textContent = `${item.name} ($${(item.price * item.qty).toFixed(2)})`;

      const controls = document.createElement('div');
      controls.style.display = 'inline-flex';
      controls.style.alignItems = 'center';
      controls.style.gap = '0.35rem';

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
      qty.style.fontFamily = 'var(--s-font-mono)';
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

  renderProducts();
  renderCart();
  initMobileDrawer();
});
