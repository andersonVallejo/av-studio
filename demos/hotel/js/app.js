/**
 * CASA DEL BARRANCO Hotel Boutique (Demostración) — DOM & Interactions
 */

import {
  HOTEL_ROOMS,
  validateHotelStay,
  buildHotelWhatsAppUrl,
} from './logic.js';

const ROOM_MEDIA = {
  'suite-tomebamba': {
    webp: new URL('../images/suite-balcon.webp', import.meta.url).href,
    jpg: new URL('../images/suite-balcon.jpg', import.meta.url).href,
    alt: 'Suite Balcón del Río con cama king, ventanal luminoso y vista hacia las cúpulas de Cuenca',
  },
  'doble-patio': {
    webp: null,
    jpg: new URL('../images/patio-doble-interior.jpg', import.meta.url).href,
    alt: 'Habitación Doble Patio Colonial con vigas de madera, escritorio y puertas hacia el jardín interior',
  },
  'familiar-cajas': {
    webp: new URL('../images/loft-cajas.webp', import.meta.url).href,
    jpg: new URL('../images/loft-cajas.jpg', import.meta.url).href,
    alt: 'Loft Familiar El Cajas con chimenea de piedra natural y vista amplia a los Andes',
  },
};

function createRoomPicture(room) {
  const media = ROOM_MEDIA[room.id] || {
    webp: new URL('../images/hero.webp', import.meta.url).href,
    jpg: new URL('../images/hero.jpg', import.meta.url).href,
    alt: `Fotografía referencial de ${room.name}`,
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

function updateEstimate() {
  const estimateEl = document.getElementById('h-estimate');
  const roomName = document.getElementById('h-room')?.value || '';
  const checkIn = document.getElementById('h-checkin')?.value || '';
  const checkOut = document.getElementById('h-checkout')?.value || '';
  if (!estimateEl) return;

  const selectedRoom = HOTEL_ROOMS.find((room) => room.name === roomName);
  if (!selectedRoom || !checkIn || !checkOut) {
    estimateEl.textContent =
      'Selecciona una habitación y fechas válidas para ver la referencia estimada en USD.';
    return;
  }

  const startMs = Date.parse(`${checkIn}T12:00:00Z`);
  const endMs = Date.parse(`${checkOut}T12:00:00Z`);
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) {
    estimateEl.textContent =
      'La fecha de salida debe ser posterior a la fecha de ingreso para calcular noches.';
    return;
  }

  const nights = Math.round((endMs - startMs) / 86400000);
  const totalUsd = nights * selectedRoom.rateUsd;
  const nightsLabel = nights === 1 ? '1 noche' : `${nights} noches`;

  estimateEl.textContent = `Referencia estimada: ${nightsLabel} · $${selectedRoom.rateUsd.toFixed(
    2
  )} USD/noche = $${totalUsd.toFixed(2)} USD (desayuno andino incluido, tarifa demostrativa).`;
}

function renderRooms() {
  const grid = document.getElementById('h-rooms-grid');
  if (!grid) return;

  grid.innerHTML = '';
  HOTEL_ROOMS.forEach((room) => {
    const card = document.createElement('article');
    card.className = 'h-room-card';

    const mediaWrap = document.createElement('div');
    mediaWrap.className = 'h-room-card__media';
    mediaWrap.appendChild(createRoomPicture(room));

    const body = document.createElement('div');
    body.className = 'h-room-card__body';

    const meta = document.createElement('div');
    meta.className = 'h-room-card__meta';
    meta.textContent = `${room.capacity} · Desayuno incluido`;

    const title = document.createElement('h3');
    title.className = 'h-room-card__title';
    title.textContent = room.name;

    const rate = document.createElement('div');
    rate.className = 'h-room-card__price';
    rate.textContent = `$${room.rateUsd.toFixed(2)} USD / noche`;

    const desc = document.createElement('p');
    desc.className = 'h-room-card__desc';
    desc.textContent = room.features;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'h-btn h-btn--outline h-room-card__btn';
    btn.textContent = 'Consultar disponibilidad';
    btn.addEventListener('click', () => {
      const sel = document.getElementById('h-room');
      if (sel) {
        sel.value = room.name;
        updateEstimate();
      }
      document.getElementById('disponibilidad')?.scrollIntoView({ behavior: 'smooth' });
      document.getElementById('h-name')?.focus();
    });

    const top = document.createElement('div');
    top.append(meta, title, rate, desc);

    body.append(top, btn);
    card.append(mediaWrap, body);
    grid.appendChild(card);
  });
}

function initGalleryFilters() {
  const filterBtns = Array.from(document.querySelectorAll('[data-gallery-filter]'));
  const cards = Array.from(document.querySelectorAll('#h-gallery-grid [data-gallery-cat]'));
  if (filterBtns.length === 0 || cards.length === 0) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-gallery-filter') || 'all';
      filterBtns.forEach((b) => b.classList.toggle('is-active', b === btn));

      cards.forEach((card) => {
        const cardCat = card.getAttribute('data-gallery-cat');
        const visible = category === 'all' || cardCat === category;
        if (visible) card.removeAttribute('hidden');
        else card.setAttribute('hidden', '');
      });
    });
  });
}

function initForm() {
  const form = document.getElementById('h-stay-form');
  if (!form) return;

  const roomEl = document.getElementById('h-room');
  const inEl = document.getElementById('h-checkin');
  const outEl = document.getElementById('h-checkout');

  if (inEl && !inEl.value) {
    inEl.value = new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0];
  }
  if (outEl && !outEl.value) {
    outEl.value = new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0];
  }

  [roomEl, inEl, outEl].forEach((el) => {
    el?.addEventListener('change', updateEstimate);
  });
  updateEstimate();

  const prepared = document.getElementById('h-prepared');
  const preparedLink = document.getElementById('h-prepared-wa');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = {
      name: document.getElementById('h-name')?.value || '',
      phone: document.getElementById('h-phone')?.value || '',
      room: document.getElementById('h-room')?.value || '',
      guests: document.getElementById('h-guests')?.value || '',
      checkIn: document.getElementById('h-checkin')?.value || '',
      checkOut: document.getElementById('h-checkout')?.value || '',
    };

    const res = validateHotelStay(data);
    ['name', 'phone', 'room', 'guests', 'checkIn', 'checkOut'].forEach((field) => {
      const errEl = document.getElementById(`h-err-${field}`);
      if (errEl) errEl.textContent = res.errors[field] || '';
    });

    if (!res.valid) {
      if (prepared) prepared.setAttribute('hidden', '');
      return;
    }

    if (preparedLink) preparedLink.setAttribute('href', buildHotelWhatsAppUrl(res.clean));
    if (prepared) prepared.removeAttribute('hidden');
  });
}

function initMobileDrawer() {
  const toggle = document.getElementById('h-mobile-toggle');
  const drawer = document.getElementById('h-mobile-drawer');
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
  renderRooms();
  initGalleryFilters();
  initForm();
  initMobileDrawer();
});
