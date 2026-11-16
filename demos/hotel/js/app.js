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
    base: 'suite-balcon',
    alt: 'Suite Balcón del Río con cama king, ventanal luminoso y acabados en madera andina',
  },
  'doble-patio': {
    base: 'patio-doble',
    alt: 'Habitación Doble Patio Colonial con techos altos de madera y acceso al patio interior',
  },
  'familiar-cajas': {
    base: 'loft-cajas',
    alt: 'Loft Familiar El Cajas con dos ambientes amplios y vista hacia los tejados de Cuenca',
  },
};

function createRoomPicture(room) {
  const media = ROOM_MEDIA[room.id] || {
    base: 'hero',
    alt: `Fotografía referencial de ${room.name}`,
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

    const cap = document.createElement('span');
    cap.className = 'h-eyebrow h-room-card__cap';
    cap.textContent = room.capacity;

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
      if (sel) sel.value = room.name;
      document.getElementById('disponibilidad')?.scrollIntoView({ behavior: 'smooth' });
      document.getElementById('h-name')?.focus();
    });

    const top = document.createElement('div');
    top.append(cap, title, rate, desc);

    body.append(top, btn);
    card.append(mediaWrap, body);
    grid.appendChild(card);
  });
}

function initForm() {
  const form = document.getElementById('h-stay-form');
  if (!form) return;

  const inEl = document.getElementById('h-checkin');
  const outEl = document.getElementById('h-checkout');
  if (inEl && !inEl.value) {
    inEl.value = new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0];
  }
  if (outEl && !outEl.value) {
    outEl.value = new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0];
  }

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
  initForm();
  initMobileDrawer();
});
