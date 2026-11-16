import {
  PIZZERIA_MENU,
  filterPizzeriaMenu,
  updateCartItem,
  calculatePizzeriaTotal,
  buildPizzeriaWhatsAppUrl,
} from './logic.js';

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('p-items-grid');
  const cartList = document.getElementById('p-cart-items');
  const cartTotal = document.getElementById('p-cart-total');
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

    if (cart.length === 0) {
      const li = document.createElement('li');
      li.className = 'p-cart__row';
      li.textContent = 'Tu pedido demostrativo está vacío.';
      cartList.appendChild(li);
    } else {
      cart.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'p-cart__row';

        const info = document.createElement('span');
        info.textContent = `${item.name} ($${(item.price * item.qty).toFixed(2)})`;

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
        qtySpan.textContent = String(item.qty);
        qtySpan.style.minWidth = '1.2rem';
        qtySpan.style.textAlign = 'center';

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

  const renderItems = () => {
    if (!grid) return;
    const filtered = filterPizzeriaMenu(PIZZERIA_MENU, currentTab);
    grid.innerHTML = '';

    filtered.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'p-item-card';

      const body = document.createElement('div');

      const categorySpan = document.createElement('span');
      categorySpan.style.fontSize = '0.78rem';
      categorySpan.style.color = '#6B5E54';
      categorySpan.style.fontWeight = '600';
      categorySpan.textContent = item.category;

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
      desc.style.fontSize = '0.9rem';
      desc.style.color = '#4A443F';
      desc.style.margin = '0.45rem 0 0';
      desc.textContent = item.description;

      body.appendChild(categorySpan);
      body.appendChild(head);
      body.appendChild(desc);

      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'p-btn p-btn--outline';
      addBtn.style.width = '100%';
      addBtn.style.minHeight = '40px';
      addBtn.textContent = '+ Agregar al pedido';
      addBtn.addEventListener('click', () => {
        cart = updateCartItem(cart, item, 1);
        renderCart();
      });

      card.appendChild(body);
      card.appendChild(addBtn);
      grid.appendChild(card);
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      currentTab = tab.getAttribute('data-p-tab') || 'Todas';
      tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
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

  [customerNameInput, sectorInput].forEach((input) => {
    if (input) input.addEventListener('input', syncCartLink);
  });

  renderItems();
  renderCart();
});
