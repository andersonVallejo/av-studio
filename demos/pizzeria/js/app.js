import {
  PIZZERIA_MENU,
  filterPizzeriaMenu,
  updateCartItem,
  calculatePizzeriaTotal,
  buildPizzeriaWhatsAppUrl,
} from './logic.js';

const PRODUCT_MEDIA = {
  'pizza-margherita': {
    src: './images/pizza-margherita.jpg',
    alt: 'Pizza Margherita al Horno con tomate San Marzano, mozzarella fior di latte y albahaca',
    format: '32 cm · Horno directo',
  },
  'pizza-diavola': {
    src: './images/pizza-diavola.jpg',
    alt: 'Pizza Diavola & Miel Picante con pepperoni artesanal, chile serrano y miel andina',
    format: '32 cm · Horno directo',
  },
  'pizza-cuatro-quesos': {
    src: './images/pizza-cuatro-quesos.jpg',
    alt: 'Pizza Cuatro Quesos del Sur con mozzarella, queso maduro, provolone y queso azul',
    format: '32 cm · Orégano de huerta',
  },
  'burger-doble': {
    src: './images/burger-combo.jpg',
    alt: 'Hamburguesa Doble Smash Bravo con doble queso cheddar y papas rústicas',
    format: 'Pan brioche · Con papas',
  },
  'burger-ahumada': {
    src: './images/burger-tocino.jpg',
    alt: 'Hamburguesa Crispy Tocino & Cebolla con carne de 160g, tocino crocante y cebolla caramelizada',
    format: '160 g · Con papas rústicas',
  },
  'combo-duo': {
    src: './images/combo-duo.jpg',
    alt: 'Combo Dúo Cuenca con pizza artesanal de 32 cm, pan de ajo y dos gaseosas',
    format: 'Combo para 2 · En USD',
  },
  'combo-amigos': {
    src: './images/combo-burgers.jpg',
    alt: 'Combo Burgers x2 con dos Doble Smash Bravo, papas sazonadas y dos bebidas',
    format: '2 burgers · 2 bebidas',
  },
  'comp-pan-ajo': {
    src: './images/pan-ajo.jpg',
    alt: 'Bastones de Pan al Ajo horneados con mantequilla de hierbas y queso parmesano',
    format: 'Horneado al momento',
  },
  'comp-papas': {
    src: './images/papas-bravas.jpg',
    alt: 'Papas Bravas doradas con pimentón dulce y salsa alioli artesanal',
    format: 'Porción compartible',
  },
};

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('p-items-grid');
  const cartList = document.getElementById('p-cart-items');
  const cartTotal = document.getElementById('p-cart-total');
  const headerCount = document.getElementById('p-header-count');
  const clearBtn = document.getElementById('p-cart-clear');
  const waBtn = document.getElementById('p-cart-wa');
  const customerNameInput = document.getElementById('p-customer-name');
  const sectorInput = document.getElementById('p-customer-sector');
  const tabs = Array.from(document.querySelectorAll('[data-p-tab]'));

  const mobileBtn = document.getElementById('p-mobile-btn');
  const mobileDrawer = document.getElementById('p-mobile-drawer');
  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      const open = mobileBtn.getAttribute('aria-expanded') === 'true';
      mobileBtn.setAttribute('aria-expanded', String(!open));
      if (open) mobileDrawer.setAttribute('hidden', '');
      else mobileDrawer.removeAttribute('hidden');
    });
    mobileDrawer.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        mobileBtn.setAttribute('aria-expanded', 'false');
        mobileDrawer.setAttribute('hidden', '');
      });
    });
  }

  let cart = [];
  let currentTab = 'Todas';

  const syncCartLink = () => {
    if (!waBtn) return;
    waBtn.setAttribute(
      'href',
      buildPizzeriaWhatsAppUrl(
        cart,
        customerNameInput?.value.trim() || '',
        sectorInput?.value.trim() || ''
      )
    );
  };

  const renderCart = () => {
    if (!cartList || !cartTotal) return;
    cartList.innerHTML = '';

    const totalItems = cart.reduce((sum, entry) => sum + entry.qty, 0);
    if (headerCount) {
      headerCount.textContent = String(totalItems);
    }
    if (clearBtn) {
      if (cart.length === 0) clearBtn.setAttribute('hidden', '');
      else clearBtn.removeAttribute('hidden');
    }

    if (cart.length === 0) {
      const li = document.createElement('li');
      li.className = 'p-cart__row p-cart__empty';
      li.textContent = 'Tu pedido demostrativo está vacío. Elige un plato de la carta.';
      cartList.appendChild(li);
    } else {
      cart.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'p-cart__row';

        const info = document.createElement('div');
        info.className = 'p-cart__item-info';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = item.name;

        const priceSpan = document.createElement('span');
        priceSpan.className = 'p-cart__item-sub';
        priceSpan.textContent = `$${(item.price * item.qty).toFixed(2)} USD`;

        info.appendChild(nameSpan);
        info.appendChild(priceSpan);

        const controls = document.createElement('div');
        controls.className = 'p-qty-controls';

        const minus = document.createElement('button');
        minus.type = 'button';
        minus.className = 'p-qty-btn';
        minus.textContent = '-';
        minus.setAttribute('aria-label', `Disminuir cantidad de ${item.name}`);
        minus.addEventListener('click', () => {
          cart = updateCartItem(cart, item, -1);
          renderCart();
        });

        const qtySpan = document.createElement('span');
        qtySpan.className = 'p-qty-value';
        qtySpan.textContent = String(item.qty);

        const plus = document.createElement('button');
        plus.type = 'button';
        plus.className = 'p-qty-btn';
        plus.textContent = '+';
        plus.setAttribute('aria-label', `Aumentar cantidad de ${item.name}`);
        plus.addEventListener('click', () => {
          cart = updateCartItem(cart, item, 1);
          renderCart();
        });

        controls.appendChild(minus);
        controls.appendChild(qtySpan);
        controls.appendChild(plus);
        li.appendChild(info);
        li.appendChild(controls);
        cartList.appendChild(li);
      });
    }

    cartTotal.textContent = `$${calculatePizzeriaTotal(cart).toFixed(2)} USD`;
    syncCartLink();
  };

  const addItemById = (id, triggerBtn) => {
    const item = PIZZERIA_MENU.find((entry) => entry.id === id);
    if (!item) return;
    cart = updateCartItem(cart, item, 1);
    renderCart();

    if (triggerBtn) {
      const original = triggerBtn.dataset.originalLabel || triggerBtn.textContent;
      triggerBtn.dataset.originalLabel = original;
      triggerBtn.textContent = 'Agregado a orden';
      window.setTimeout(() => {
        if (triggerBtn.isConnected) {
          triggerBtn.textContent = original;
        }
      }, 1100);
    }
  };

  const renderItems = () => {
    if (!grid) return;
    const filtered = filterPizzeriaMenu(PIZZERIA_MENU, currentTab);
    grid.innerHTML = '';

    filtered.forEach((item) => {
      const media = PRODUCT_MEDIA[item.id] || {
        src: './images/pizza-horno.jpg',
        alt: item.name,
        format: item.category,
      };

      const card = document.createElement('article');
      card.className = 'p-item-card';

      const mediaBox = document.createElement('div');
      mediaBox.className = 'p-item-card__media';

      const img = document.createElement('img');
      img.src = media.src;
      img.alt = media.alt;
      img.width = 1200;
      img.height = 900;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.referrerPolicy = 'no-referrer';
      mediaBox.appendChild(img);

      const content = document.createElement('div');
      content.className = 'p-item-card__content';

      const top = document.createElement('div');

      const meta = document.createElement('div');
      meta.className = 'p-item-card__meta';
      meta.textContent = `${item.category} · ${media.format}`;

      const head = document.createElement('div');
      head.className = 'p-item-card__head';

      const title = document.createElement('h3');
      title.className = 'p-item-card__name';
      title.textContent = item.name;

      const price = document.createElement('span');
      price.className = 'p-item-card__price';
      price.textContent = `$${item.price.toFixed(2)}`;

      head.appendChild(title);
      head.appendChild(price);

      const desc = document.createElement('p');
      desc.className = 'p-item-card__desc';
      desc.textContent = item.description;

      top.appendChild(meta);
      top.appendChild(head);
      top.appendChild(desc);

      const actions = document.createElement('div');
      actions.className = 'p-item-card__actions';

      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'p-btn p-btn--outline p-btn--sm';
      addBtn.textContent = '+ Agregar al pedido';
      addBtn.setAttribute('aria-label', `Agregar ${item.name} al pedido`);
      addBtn.addEventListener('click', () => {
        addItemById(item.id, addBtn);
      });

      const consultLink = document.createElement('a');
      consultLink.className = 'p-btn p-btn--ghost-ink p-btn--sm';
      consultLink.href = buildPizzeriaWhatsAppUrl([
        { id: item.id, name: item.name, price: item.price, qty: 1 },
      ]);
      consultLink.target = '_blank';
      consultLink.rel = 'noopener noreferrer';
      consultLink.textContent = 'Consultar';
      consultLink.setAttribute('aria-label', `Consultar por ${item.name} en WhatsApp`);

      actions.appendChild(addBtn);
      actions.appendChild(consultLink);

      content.appendChild(top);
      content.appendChild(actions);

      card.appendChild(mediaBox);
      card.appendChild(content);
      grid.appendChild(card);
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      currentTab = tab.getAttribute('data-p-tab') || 'Todas';
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });
      renderItems();
    });
  });

  document.querySelectorAll('[data-jump-tab]').forEach((link) => {
    link.addEventListener('click', () => {
      const targetTab = link.getAttribute('data-jump-tab');
      const matching = tabs.find((t) => t.getAttribute('data-p-tab') === targetTab);
      if (matching) matching.click();
    });
  });

  document.querySelectorAll('[data-quick-add]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-quick-add');
      if (id) addItemById(id, btn);
    });
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      cart = [];
      renderCart();
    });
  }

  [customerNameInput, sectorInput].forEach((input) => {
    if (input) input.addEventListener('input', syncCartLink);
  });

  // Gallery Lightbox
  const lightbox = document.getElementById('p-lightbox');
  const lightboxImg = document.getElementById('p-lightbox-img');
  const lightboxTitle = document.getElementById('p-lightbox-title');
  const lightboxCaption = document.getElementById('p-lightbox-caption');
  const lightboxClose = document.getElementById('p-lightbox-close');

  if (lightbox && lightboxImg && lightboxTitle && lightboxCaption) {
    document.querySelectorAll('[data-lightbox-src]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const src = btn.getAttribute('data-lightbox-src') || '';
        const title = btn.getAttribute('data-lightbox-title') || '';
        const caption = btn.getAttribute('data-lightbox-caption') || '';
        lightboxImg.src = src;
        lightboxImg.alt = title;
        lightboxTitle.textContent = title;
        lightboxCaption.textContent = caption;
        if (typeof lightbox.showModal === 'function') {
          lightbox.showModal();
        }
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => {
        lightbox.close();
      });
    }

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) {
        lightbox.close();
      }
    });
  }

  renderItems();
  renderCart();
});
