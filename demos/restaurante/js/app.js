import {
  RESTAURANT_MENU,
  filterMenuByCategory,
  calculateSelectionTotal,
  validateReservationForm,
  buildRestaurantWhatsApp,
} from './logic.js';

const DISH_MEDIA = {
  'ceviche-trucha': {
    src: './images/tiradito-trucha.jpg',
    alt: 'Tiradito de Trucha del Cajas con leche de tigre de maracuyá y choclo crocante',
  },
  llapingachos: {
    src: './images/llapingachos.jpg',
    alt: 'Trío de Llapingachos dorados con salsa de maní tostado y curtido criollo',
  },
  'trucha-brasa': {
    src: './images/plato-trucha.jpg',
    alt: 'Trucha Sellada en Puré de Melloco con aceite aromático de cilantro',
  },
  'seco-cordero': {
    src: './images/cordero-jora.jpg',
    alt: 'Cordero Braseado en Chicha de Jora con arroz con mote y maduro asado',
  },
  'lomo-leña': {
    src: './images/lomo-brasa.jpg',
    alt: 'Lomo Fino a la Brasa con chimichurri de hierbas, papas al romero y emulsión de ajo',
  },
  'higos-queso': {
    src: './images/higos-queso.jpg',
    alt: 'Higos Confitados en almíbar de panela con helado artesanal de queso tierno',
  },
  'canelazo-sin-licor': {
    src: './images/infusion-naranjilla.jpg',
    alt: 'Infusión Caliente de Naranjilla y Canela en vaso de vidrio acanalado',
  },
};

document.addEventListener('DOMContentLoaded', () => {
  const menuContainer = document.getElementById('menu-grid');
  const trayList = document.getElementById('tray-list');
  const trayTotalEl = document.getElementById('tray-total');
  const trayWaLink = document.getElementById('tray-wa-link');
  const trayClearBtn = document.getElementById('tray-clear');
  const headerCountEl = document.getElementById('k-header-count');
  const filterBtns = Array.from(document.querySelectorAll('[data-menu-filter]'));

  const mobileBtn = document.getElementById('k-mobile-toggle');
  const mobileDrawer = document.getElementById('k-mobile-drawer');
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

  /** @type {Array<{id: string, name: string, price: number, qty: number}>} */
  let selection = [];
  let activeCategory = 'Todos';

  const renderTray = () => {
    if (!trayList || !trayTotalEl || !trayWaLink) return;
    trayList.innerHTML = '';

    const totalItems = selection.reduce((sum, entry) => sum + entry.qty, 0);
    if (headerCountEl) {
      headerCountEl.textContent = String(totalItems);
    }
    if (trayClearBtn) {
      if (selection.length === 0) trayClearBtn.setAttribute('hidden', '');
      else trayClearBtn.removeAttribute('hidden');
    }

    if (selection.length === 0) {
      const li = document.createElement('li');
      li.className = 'k-tray__item k-tray__empty';
      li.textContent = 'Agrega platos de la carta para armar una selección demostrativa.';
      trayList.appendChild(li);
    } else {
      selection.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'k-tray__item';

        const label = document.createElement('span');
        label.textContent = `${item.qty}x ${item.name} ($${(item.price * item.qty).toFixed(2)})`;

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'k-tray__remove';
        removeBtn.textContent = 'Quitar';
        removeBtn.setAttribute('aria-label', `Quitar ${item.name}`);
        removeBtn.addEventListener('click', () => {
          selection = selection.filter((x) => x.id !== item.id);
          renderTray();
        });

        li.appendChild(label);
        li.appendChild(removeBtn);
        trayList.appendChild(li);
      });
    }

    const total = calculateSelectionTotal(selection);
    trayTotalEl.textContent = `$${total.toFixed(2)} USD`;

    const summaryText =
      selection.length > 0
        ? `Hola Anderson, vi la demostración de Restaurante KALLPA (selección de ejemplo: ${selection
            .map((s) => `${s.qty}x ${s.name}`)
            .join(', ')} · $${total.toFixed(2)} USD). Quisiera cotizar una web para mi restaurante.`
        : 'Hola Anderson, vi la demostración de Restaurante KALLPA y quiero cotizar una web para mi restaurante.';
    trayWaLink.setAttribute('href', `https://wa.me/593979290747?text=${encodeURIComponent(summaryText)}`);
  };

  const addDishById = (dishId, triggerBtn) => {
    const dish = RESTAURANT_MENU.find((d) => d.id === dishId);
    if (!dish) return;
    const existing = selection.find((s) => s.id === dish.id);
    if (existing) {
      existing.qty += 1;
    } else {
      selection.push({ id: dish.id, name: dish.name, price: dish.price, qty: 1 });
    }
    renderTray();

    if (triggerBtn) {
      const original = triggerBtn.dataset.originalLabel || triggerBtn.textContent;
      triggerBtn.dataset.originalLabel = original;
      triggerBtn.textContent = 'Agregado a selección';
      window.setTimeout(() => {
        if (triggerBtn.isConnected) {
          triggerBtn.textContent = original;
        }
      }, 1100);
    }
  };

  const renderMenu = () => {
    if (!menuContainer) return;
    const filtered = filterMenuByCategory(RESTAURANT_MENU, activeCategory);
    menuContainer.innerHTML = '';

    filtered.forEach((dish) => {
      const media = DISH_MEDIA[dish.id] || {
        src: './images/plato-trucha.jpg',
        alt: dish.name,
      };

      const card = document.createElement('article');
      card.className = 'k-dish';

      const mediaWrap = document.createElement('div');
      mediaWrap.className = 'k-dish__media';

      const img = document.createElement('img');
      img.src = media.src;
      img.alt = media.alt;
      img.width = 1200;
      img.height = 896;
      img.decoding = 'sync';
      img.referrerPolicy = 'no-referrer';
      mediaWrap.appendChild(img);

      const content = document.createElement('div');
      content.className = 'k-dish__content';

      const body = document.createElement('div');

      const catSpan = document.createElement('span');
      catSpan.className = 'k-dish__cat';
      catSpan.textContent = `${dish.category} · Referencial USD`;

      const topDiv = document.createElement('div');
      topDiv.className = 'k-dish__top';

      const nameEl = document.createElement('h3');
      nameEl.className = 'k-dish__name';
      nameEl.textContent = dish.name;

      const priceEl = document.createElement('span');
      priceEl.className = 'k-dish__price';
      priceEl.textContent = `$${dish.price.toFixed(2)}`;

      topDiv.appendChild(nameEl);
      topDiv.appendChild(priceEl);

      const descEl = document.createElement('p');
      descEl.className = 'k-dish__desc';
      descEl.textContent = dish.description;

      body.appendChild(catSpan);
      body.appendChild(topDiv);
      body.appendChild(descEl);

      const btnWrap = document.createElement('div');
      btnWrap.className = 'k-dish__actions';

      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'k-btn k-btn--outline k-btn--sm';
      addBtn.textContent = '+ Agregar a selección';
      addBtn.setAttribute('aria-label', `Agregar ${dish.name} a la selección`);
      addBtn.addEventListener('click', () => {
        addDishById(dish.id, addBtn);
      });

      const consultLink = document.createElement('a');
      consultLink.className = 'k-btn k-btn--ghost-ink k-btn--sm';
      const singleMsg = `Hola Anderson, vi el plato "${dish.name}" ($${dish.price.toFixed(2)} USD) en la demostración KALLPA y quiero consultar sobre una web para restaurante.`;
      consultLink.href = `https://wa.me/593979290747?text=${encodeURIComponent(singleMsg)}`;
      consultLink.target = '_blank';
      consultLink.rel = 'noopener noreferrer';
      consultLink.textContent = 'Consultar';
      consultLink.setAttribute('aria-label', `Consultar por ${dish.name} en WhatsApp`);

      btnWrap.appendChild(addBtn);
      btnWrap.appendChild(consultLink);

      content.appendChild(body);
      content.appendChild(btnWrap);

      card.appendChild(mediaWrap);
      card.appendChild(content);
      menuContainer.appendChild(card);
    });
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      activeCategory = btn.getAttribute('data-menu-filter') || 'Todos';
      filterBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', String(active));
      });
      renderMenu();
    });
  });

  document.querySelectorAll('[data-dish-add]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dishId = btn.getAttribute('data-dish-add');
      if (dishId) addDishById(dishId, btn);
    });
  });

  if (trayClearBtn) {
    trayClearBtn.addEventListener('click', () => {
      selection = [];
      renderTray();
    });
  }

  renderMenu();
  renderTray();

  // Gallery Lightbox
  const lightbox = document.getElementById('k-lightbox');
  const lightboxImg = document.getElementById('k-lightbox-img');
  const lightboxCap = document.getElementById('k-lightbox-caption');
  const lightboxClose = document.getElementById('k-lightbox-close');

  document.querySelectorAll('.k-gallery-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const img = btn.querySelector('img');
      if (!lightbox || !img) return;
      const src = img.getAttribute('src') || '';
      const title = btn.getAttribute('data-lightbox-title') || img.getAttribute('alt') || '';
      if (lightboxImg) {
        lightboxImg.setAttribute('src', src);
        lightboxImg.setAttribute('alt', img.getAttribute('alt') || title);
      }
      if (lightboxCap) lightboxCap.textContent = title;
      if (typeof lightbox.showModal === 'function') lightbox.showModal();
    });
  });

  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) lightbox.close();
    });
  }

  // Reservation Consultation Form
  const resForm = document.getElementById('k-res-form');
  const preparedBox = document.getElementById('k-prepared');
  const preparedWa = document.getElementById('k-prepared-wa');

  if (resForm) {
    resForm.addEventListener('submit', (e) => {
      e.preventDefault();
      ['name', 'guests', 'date', 'time', 'phone'].forEach((f) => {
        const el = document.getElementById(`k-err-${f}`);
        if (el) el.textContent = '';
      });

      const data = {
        name: document.getElementById('k-name')?.value,
        guests: document.getElementById('k-guests')?.value,
        date: document.getElementById('k-date')?.value,
        time: document.getElementById('k-time')?.value,
        phone: document.getElementById('k-phone')?.value,
      };

      const res = validateReservationForm(data);
      if (!res.valid) {
        if (preparedBox) preparedBox.setAttribute('hidden', '');
        Object.entries(res.errors).forEach(([k, msg]) => {
          const el = document.getElementById(`k-err-${k}`);
          if (el) el.textContent = msg;
        });
        return;
      }

      if (preparedWa) preparedWa.setAttribute('href', buildRestaurantWhatsApp(res.clean, selection));
      if (preparedBox) preparedBox.removeAttribute('hidden');
    });
  }
});
