/**
 * TRES FILOS Barbería & Grooming (Demostración) — DOM & Interactions
 */

import {
  BARBER_SERVICES,
  filterBarberServices,
  validateBarberBooking,
  buildBarberWhatsAppUrl,
} from './logic.js';

const SERVICE_MEDIA = {
  'corte-clasico': {
    src: './images/corte-clasico.jpg',
    alt: 'Corte clásico masculino acabado con tijera en ambiente de barbería oscura',
  },
  'corte-fade': {
    src: './images/servicio-fade.jpg',
    alt: 'Degradado Skin Fade limpio con iluminación cálida de bronce',
  },
  'barba-ritual': {
    src: './images/servicio-barba.jpg',
    alt: 'Perfilado de barba junto a toallas oscuras y aceite botánico en piedra pizarra',
  },
  'afeitado-tradicional': {
    src: './images/servicio-afeitado.jpg',
    alt: 'Espuma tibia en cuenco de cerámica con brocha y navaja de acero sobre piedra oscura',
  },
  'ritual-tres-filos': {
    src: './images/servicio-ritual.jpg',
    alt: 'Toallas calientes enrolladas, cepillo, carbón activo y peine de bronce sobre madera',
  },
  'limpieza-facial': {
    src: './images/servicio-facial.jpg',
    alt: 'Estación de cuidado facial masculino con vapor suave, arcilla mineral y lino oscuro',
  },
};

let activeCategory = 'Todos';

function renderServices() {
  const grid = document.getElementById('b-services-grid');
  if (!grid) return;

  const list = filterBarberServices(BARBER_SERVICES, activeCategory);
  grid.innerHTML = '';

  list.forEach((srv) => {
    const media = SERVICE_MEDIA[srv.id] || {
      src: './images/corte-clasico.jpg',
      alt: srv.name,
    };

    const card = document.createElement('article');
    card.className = 'b-service-card';

    const mediaWrap = document.createElement('div');
    mediaWrap.className = 'b-service-card__media';

    const img = document.createElement('img');
    img.src = media.src;
    img.alt = media.alt;
    img.width = 1200;
    img.height = 896;
    img.decoding = 'sync';
    img.referrerPolicy = 'no-referrer';
    mediaWrap.appendChild(img);

    const body = document.createElement('div');
    body.className = 'b-service-card__body';

    const copyWrap = document.createElement('div');

    const top = document.createElement('div');
    top.className = 'b-service-card__top';

    const cat = document.createElement('span');
    cat.className = 'b-service-card__meta';
    cat.textContent = `${srv.category} · Referencial USD`;

    const price = document.createElement('span');
    price.className = 'b-service-card__price';
    price.textContent = `$${srv.price.toFixed(2)}`;

    top.append(cat, price);

    const title = document.createElement('h3');
    title.className = 'b-service-card__title';
    title.textContent = srv.name;

    const desc = document.createElement('p');
    desc.className = 'b-service-card__desc';
    desc.textContent = srv.description;

    copyWrap.append(top, title, desc);

    const footer = document.createElement('div');
    footer.className = 'b-service-card__footer';

    const dur = document.createElement('span');
    dur.className = 'b-service-card__dur';
    dur.textContent = `${srv.durationMin} min`;

    const bookBtn = document.createElement('button');
    bookBtn.type = 'button';
    bookBtn.className = 'b-btn b-btn--outline b-btn--sm';
    bookBtn.textContent = 'Preseleccionar';
    bookBtn.setAttribute('aria-label', `Preseleccionar servicio ${srv.name}`);
    bookBtn.setAttribute('data-prefill-service', `${srv.name} ($${srv.price.toFixed(2)} USD)`);

    footer.append(dur, bookBtn);
    body.append(copyWrap, footer);
    card.append(mediaWrap, body);
    grid.appendChild(card);
  });
}

function prefillBookingAndScroll({ serviceLabel, barberLabel }) {
  const serviceSelect = document.getElementById('b-service');
  if (serviceSelect && serviceLabel) {
    const option = Array.from(serviceSelect.options).find((opt) => opt.value === serviceLabel);
    if (option) {
      serviceSelect.value = option.value;
    }
  }

  const barberSelect = document.getElementById('b-barber');
  if (barberSelect && barberLabel) {
    const option = Array.from(barberSelect.options).find((opt) => opt.value === barberLabel);
    if (option) {
      barberSelect.value = option.value;
    }
  }

  const bookingSection = document.getElementById('reservas');
  if (bookingSection) {
    bookingSection.scrollIntoView({ behavior: 'smooth' });
  }
  const nameInput = document.getElementById('b-name');
  if (nameInput) {
    window.setTimeout(() => nameInput.focus(), 260);
  }
}

function initFiltersAndPrefills() {
  const filterBtns = Array.from(document.querySelectorAll('[data-barber-filter]'));
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      activeCategory = btn.getAttribute('data-barber-filter') || 'Todos';
      filterBtns.forEach((item) => {
        const active = item === btn;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
      });
      renderServices();
    });
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const serviceBtn = target.closest('[data-prefill-service]');
    if (serviceBtn) {
      prefillBookingAndScroll({
        serviceLabel: serviceBtn.getAttribute('data-prefill-service') || '',
      });
      return;
    }

    const barberBtn = target.closest('[data-prefill-barber]');
    if (barberBtn) {
      prefillBookingAndScroll({
        barberLabel: barberBtn.getAttribute('data-prefill-barber') || '',
      });
    }
  });
}

function initLightbox() {
  const dialog = document.getElementById('b-lightbox');
  const img = document.getElementById('b-lightbox-img');
  const cap = document.getElementById('b-lightbox-caption');
  const closeBtn = document.getElementById('b-lightbox-close');
  if (!dialog || !img) return;

  document.querySelectorAll('[data-b-gallery]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const pic = trigger.querySelector('img');
      if (!pic) return;
      const src = pic.getAttribute('src') || '';
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
