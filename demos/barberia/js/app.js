/**
 * TRES FILOS Barbería & Grooming (Demostración) — DOM & Interactions
 */

import {
  BARBER_SERVICES,
  filterBarberServices,
  validateBarberBooking,
  buildBarberWhatsAppUrl,
} from './logic.js';

let activeCategory = 'Todos';

function renderServices() {
  const grid = document.getElementById('b-services-grid');
  if (!grid) return;

  const list = filterBarberServices(BARBER_SERVICES, activeCategory);
  grid.innerHTML = '';

  list.forEach((srv) => {
    const card = document.createElement('article');
    card.className = 'b-service-card';

    const top = document.createElement('div');
    top.className = 'b-service-card__top';

    const cat = document.createElement('span');
    cat.className = 'b-service-card__cat';
    cat.textContent = srv.category;

    const price = document.createElement('span');
    price.className = 'b-service-card__price';
    price.textContent = `$${srv.price.toFixed(2)} USD`;

    top.append(cat, price);

    const title = document.createElement('h3');
    title.className = 'b-service-card__title';
    title.textContent = srv.name;

    const desc = document.createElement('p');
    desc.className = 'b-service-card__desc';
    desc.textContent = srv.description;

    const bodyWrap = document.createElement('div');
    bodyWrap.append(top, title, desc);

    const footer = document.createElement('div');
    footer.className = 'b-service-card__footer';

    const dur = document.createElement('span');
    dur.className = 'b-service-card__dur';
    dur.textContent = `${srv.durationMin} min`;

    const bookBtn = document.createElement('button');
    bookBtn.type = 'button';
    bookBtn.className = 'b-btn b-btn--outline b-btn--sm';
    bookBtn.textContent = 'Reservar servicio';
    bookBtn.setAttribute('data-prefill-service', `${srv.name} ($${srv.price.toFixed(2)} USD)`);

    footer.append(dur, bookBtn);
    card.append(bodyWrap, footer);
    grid.appendChild(card);
  });
}

function prefillServiceAndScroll(serviceLabel) {
  const select = document.getElementById('b-service');
  if (select && serviceLabel) {
    const option = Array.from(select.options).find((opt) => opt.value === serviceLabel);
    if (option) {
      select.value = option.value;
    }
  }
  const bookingSection = document.getElementById('reservas');
  if (bookingSection) {
    bookingSection.scrollIntoView({ behavior: 'smooth' });
  }
  const nameInput = document.getElementById('b-name');
  if (nameInput) {
    setTimeout(() => nameInput.focus(), 300);
  }
}

function initFiltersAndPrefills() {
  document.querySelectorAll('[data-barber-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeCategory = btn.getAttribute('data-barber-filter') || 'Todos';
      document.querySelectorAll('[data-barber-filter]').forEach((item) => {
        item.classList.toggle('is-active', item === btn);
      });
      renderServices();
    });
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const prefillBtn = target.closest('[data-prefill-service]');
    if (prefillBtn) {
      prefillServiceAndScroll(prefillBtn.getAttribute('data-prefill-service') || '');
    }
  });
}

function initLightbox() {
  const dialog = document.getElementById('b-lightbox');
  const webpSource = document.getElementById('b-lightbox-webp');
  const img = document.getElementById('b-lightbox-img');
  const cap = document.getElementById('b-lightbox-caption');
  const closeBtn = document.getElementById('b-lightbox-close');
  if (!dialog || !img) return;

  document.querySelectorAll('[data-b-gallery]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const pic = trigger.querySelector('img');
      if (!pic) return;
      const src = pic.getAttribute('src') || '';
      if (webpSource) {
        webpSource.setAttribute('srcset', src.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
      }
      img.setAttribute('src', src);
      img.setAttribute('alt', pic.getAttribute('alt') || '');
      if (cap) cap.textContent = trigger.getAttribute('data-b-gallery') || '';
      if (typeof dialog.showModal === 'function') dialog.showModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => dialog.close());
  }
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
}

function initBookingForm() {
  const form = document.getElementById('b-booking-form');
  if (!form) return;

  const prepared = document.getElementById('b-prepared');
  const preparedLink = document.getElementById('b-prepared-wa');
  const dateInput = document.getElementById('b-date');
  if (dateInput && !dateInput.value) {
    const tomorrow = new Date(Date.now() + 86400000);
    dateInput.value = tomorrow.toISOString().split('T')[0];
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = {
      name: document.getElementById('b-name')?.value || '',
      phone: document.getElementById('b-phone')?.value || '',
      service: document.getElementById('b-service')?.value || '',
      barber: document.getElementById('b-barber')?.value || '',
      date: document.getElementById('b-date')?.value || '',
      time: document.getElementById('b-time')?.value || '',
    };

    const result = validateBarberBooking(data);
    ['name', 'phone', 'service', 'barber', 'date', 'time'].forEach((field) => {
      const errEl = document.getElementById(`b-err-${field}`);
      if (errEl) errEl.textContent = result.errors[field] || '';
    });

    if (!result.valid) {
      if (prepared) prepared.setAttribute('hidden', '');
      return;
    }

    if (preparedLink) {
      preparedLink.setAttribute('href', buildBarberWhatsAppUrl(result.clean));
    }
    if (prepared) {
      prepared.removeAttribute('hidden');
    }
  });
}

function initMobileDrawer() {
  const toggle = document.getElementById('b-mobile-toggle');
  const drawer = document.getElementById('b-mobile-drawer');
  if (!toggle || !drawer) return;

  toggle.addEventListener('click', () => {
    const isHidden = drawer.hasAttribute('hidden');
    if (isHidden) {
      drawer.removeAttribute('hidden');
      toggle.setAttribute('aria-expanded', 'true');
    } else {
      drawer.setAttribute('hidden', '');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  drawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      drawer.setAttribute('hidden', '');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderServices();
  initFiltersAndPrefills();
  initLightbox();
  initBookingForm();
  initMobileDrawer();
});
