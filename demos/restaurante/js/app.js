import {
  RESTAURANT_MENU,
  filterMenuByCategory,
  calculateSelectionTotal,
  validateReservationForm,
  buildRestaurantWhatsApp,
} from './logic.js';

document.addEventListener('DOMContentLoaded', () => {
  const menuContainer = document.getElementById('menu-grid');
  const trayList = document.getElementById('tray-list');
  const trayTotalEl = document.getElementById('tray-total');
  const trayWaLink = document.getElementById('tray-wa-link');
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
    if (selection.length === 0) {
      const li = document.createElement('li');
      li.className = 'k-tray__item';
      li.textContent = 'Agrega platos del menú para armar una selección demostrativa.';
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

  const renderMenu = () => {
    if (!menuContainer) return;
    const filtered = filterMenuByCategory(RESTAURANT_MENU, activeCategory);
    menuContainer.innerHTML = '';

    filtered.forEach((dish) => {
      const card = document.createElement('article');
      card.className = 'k-dish';

      const body = document.createElement('div');

      const catSpan = document.createElement('span');
      catSpan.className = 'k-dish__cat';
      catSpan.textContent = dish.category;

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
      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'k-btn k-btn--outline';
      addBtn.style.width = '100%';
      addBtn.style.minHeight = '40px';
      addBtn.textContent = '+ Agregar a selección';
      addBtn.addEventListener('click', () => {
        const existing = selection.find((s) => s.id === dish.id);
        if (existing) {
          existing.qty += 1;
        } else {
          selection.push({ id: dish.id, name: dish.name, price: dish.price, qty: 1 });
        }
        renderTray();
      });

      btnWrap.appendChild(addBtn);
      card.appendChild(body);
      card.appendChild(btnWrap);
      menuContainer.appendChild(card);
    });
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      activeCategory = btn.getAttribute('data-menu-filter') || 'Todos';
      filterBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
      renderMenu();
    });
  });

  renderMenu();
  renderTray();

  // Gallery Lightbox
  const lightbox = document.getElementById('k-lightbox');
  const lightboxWebp = document.getElementById('k-lightbox-webp');
  const lightboxImg = document.getElementById('k-lightbox-img');
  const lightboxCap = document.getElementById('k-lightbox-caption');
  const lightboxClose = document.getElementById('k-lightbox-close');

  document.querySelectorAll('.k-gallery-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const img = btn.querySelector('img');
      if (!lightbox || !img) return;
      const src = img.getAttribute('src') || '';
      if (lightboxWebp) {
        lightboxWebp.setAttribute('srcset', src.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
      }
      if (lightboxImg) {
        lightboxImg.setAttribute('src', src);
        lightboxImg.setAttribute('alt', img.getAttribute('alt') || '');
      }
      if (lightboxCap) lightboxCap.textContent = img.getAttribute('alt') || '';
      if (typeof lightbox.showModal === 'function') lightbox.showModal();
    });
  });

  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) lightbox.close();
    });
  }

  // Reservation Form
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
