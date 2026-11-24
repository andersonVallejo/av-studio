/**
 * ALBA DENTAL Clínica Odontológica (Demostración) — DOM & Interactions
 */

import {
  DENTAL_TREATMENTS,
  validateDentalAppointment,
  buildDentalWhatsAppUrl,
} from './logic.js';

const SPECIALTY_SELECT_MAP = {
  general: 'Odontología General',
  ortodoncia: 'Ortodoncia',
  rehabilitacion: 'Rehabilitación Oral',
  estetica: 'Estética Dental',
};

let activeTreatKey = 'general';

function initMobileMenu() {
  const mobileBtn = document.getElementById('o-mobile-btn');
  const mobileDrawer = document.getElementById('o-mobile-drawer');
  if (!mobileBtn || !mobileDrawer) return;

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

function renderTreatment(key) {
  activeTreatKey = key in DENTAL_TREATMENTS ? key : 'general';
  const item = DENTAL_TREATMENTS[activeTreatKey];
  if (!item) return;

  const tTitle = document.getElementById('o-treat-title');
  const tDuration = document.getElementById('o-treat-duration');
  const tSummary = document.getElementById('o-treat-summary');
  const tSteps = document.getElementById('o-treat-steps');

  if (tTitle) tTitle.textContent = item.title;
  if (tDuration) tDuration.textContent = `Duración referencial: ${item.duration}`;
  if (tSummary) tSummary.textContent = item.summary;
  if (tSteps) {
    tSteps.innerHTML = '';
    item.steps.forEach((step) => {
      const li = document.createElement('li');
      li.className = 'o-treat-steps__item';
      li.textContent = `— ${step}`;
      tSteps.appendChild(li);
    });
  }

  document.querySelectorAll('[data-treat-key]').forEach((btn) => {
    const active = btn.getAttribute('data-treat-key') === activeTreatKey;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
}

function initTreatmentControls() {
  document.querySelectorAll('[data-treat-key]').forEach((btn) => {
    btn.addEventListener('click', () => {
      renderTreatment(btn.getAttribute('data-treat-key') || 'general');
    });
  });

  document.querySelectorAll('[data-select-treat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-select-treat') || 'general';
      renderTreatment(key);
      const section = document.getElementById('tratamientos');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const prefillBtn = document.getElementById('o-treat-prefill');
  const specialtySelect = document.getElementById('o-specialty');
  const nameInput = document.getElementById('o-name');
  const citaSection = document.getElementById('cita');

  if (prefillBtn && specialtySelect) {
    prefillBtn.addEventListener('click', () => {
      const mapped = SPECIALTY_SELECT_MAP[activeTreatKey];
      if (mapped) specialtySelect.value = mapped;

      const errSpec = document.getElementById('o-err-specialty');
      if (errSpec) errSpec.textContent = '';

      if (citaSection) citaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (nameInput) window.setTimeout(() => nameInput.focus({ preventScroll: true }), 260);
    });
  }

  renderTreatment('general');
}

function initLightbox() {
  const dialog = document.getElementById('o-lightbox');
  const imgEl = document.getElementById('o-lightbox-img');
  const captionEl = document.getElementById('o-lightbox-caption');
  const closeBtn = document.getElementById('o-lightbox-close');

  if (!dialog || !imgEl || !captionEl) return;

  document.querySelectorAll('[data-lightbox-src]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const src = trigger.getAttribute('data-lightbox-src') || '';
      const alt = trigger.getAttribute('data-lightbox-alt') || '';
      const caption = trigger.getAttribute('data-lightbox-caption') || '';
      imgEl.setAttribute('src', src);
      imgEl.setAttribute('alt', alt);
      captionEl.textContent = caption;
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    });
  }

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    }
  });
}

function initForm() {
  const form = document.getElementById('o-appt-form');
  if (!form) return;

  const dateInput = document.getElementById('o-date');
  if (dateInput && !dateInput.value) {
    const tomorrow = new Date(Date.now() + 86400000);
    dateInput.value = tomorrow.toISOString().split('T')[0];
  }

  const preparedBox = document.getElementById('o-prepared');
  const preparedWa = document.getElementById('o-prepared-wa');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    ['name', 'phone', 'specialty', 'date', 'time'].forEach((k) => {
      const errEl = document.getElementById(`o-err-${k}`);
      if (errEl) errEl.textContent = '';
    });

    const data = {
      name: document.getElementById('o-name')?.value,
      phone: document.getElementById('o-phone')?.value,
      specialty: document.getElementById('o-specialty')?.value,
      date: document.getElementById('o-date')?.value,
      time: document.getElementById('o-time')?.value,
      notes: document.getElementById('o-notes')?.value,
    };

    const res = validateDentalAppointment(data);
    if (!res.valid) {
      if (preparedBox) preparedBox.setAttribute('hidden', '');
      Object.entries(res.errors).forEach(([k, msg]) => {
        const errEl = document.getElementById(`o-err-${k}`);
        if (errEl) errEl.textContent = msg;
      });
      return;
    }

    if (preparedWa) preparedWa.setAttribute('href', buildDentalWhatsAppUrl(res.clean));
    if (preparedBox) preparedBox.removeAttribute('hidden');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initTreatmentControls();
  initLightbox();
  initForm();
});
