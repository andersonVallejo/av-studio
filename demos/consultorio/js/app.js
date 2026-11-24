/**
 * CENTRO MÉDICO TOMEBAMBA Consultorio (Demostración) — DOM & Interactions
 */

import {
  MEDICAL_SPECIALTIES,
  validateMedicalAppointment,
  buildMedicalWhatsAppUrl,
} from './logic.js';

const SPECIALTY_OPTION_MAP = {
  general: 'Medicina General',
  pediatria: 'Pediatría',
  cardiologia: 'Cardiología Preventiva',
  nutricion: 'Nutrición Clínica',
};

let activeSpecialtyKey = 'general';

function renderSpecialty(key) {
  activeSpecialtyKey = key in MEDICAL_SPECIALTIES ? key : 'general';
  const spec = MEDICAL_SPECIALTIES[activeSpecialtyKey];

  const titleEl = document.getElementById('m-spec-title');
  const schedEl = document.getElementById('m-spec-sched');
  const descEl = document.getElementById('m-spec-desc');
  const notesEl = document.getElementById('m-spec-notes');

  if (titleEl) titleEl.textContent = spec.title;
  if (schedEl) schedEl.textContent = spec.schedule;
  if (descEl) descEl.textContent = spec.description;

  if (notesEl) {
    notesEl.innerHTML = '';
    spec.notes.forEach((n) => {
      const li = document.createElement('li');
      li.className = 'm-spec-notes__item';
      li.textContent = `— ${n}`;
      notesEl.appendChild(li);
    });
  }

  document.querySelectorAll('[data-med-spec]').forEach((btn) => {
    const active = btn.getAttribute('data-med-spec') === activeSpecialtyKey;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
}

function initSpecialtyPrefill() {
  const prefillBtn = document.getElementById('m-spec-prefill');
  const selectEl = document.getElementById('m-specialty');
  const nameEl = document.getElementById('m-name');
  const citasSection = document.getElementById('citas');

  if (!prefillBtn || !selectEl) return;

  prefillBtn.addEventListener('click', () => {
    const mappedValue = SPECIALTY_OPTION_MAP[activeSpecialtyKey] || '';
    if (mappedValue) {
      selectEl.value = mappedValue;
    }

    const errSpec = document.getElementById('m-err-specialty');
    if (errSpec) errSpec.textContent = '';

    if (citasSection) {
      citasSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (nameEl) {
      window.setTimeout(() => nameEl.focus({ preventScroll: true }), 260);
    }
  });
}

function initForm() {
  const form = document.getElementById('m-appt-form');
  if (!form) return;

  const dateInput = document.getElementById('m-date');
  if (dateInput && !dateInput.value) {
    const tomorrow = new Date(Date.now() + 86400000);
    dateInput.value = tomorrow.toISOString().split('T')[0];
  }

  const prepared = document.getElementById('m-prepared');
  const preparedLink = document.getElementById('m-prepared-wa');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = {
      name: document.getElementById('m-name')?.value || '',
      phone: document.getElementById('m-phone')?.value || '',
      specialty: document.getElementById('m-specialty')?.value || '',
      date: document.getElementById('m-date')?.value || '',
      time: document.getElementById('m-time')?.value || '',
      reason: document.getElementById('m-reason')?.value || '',
    };

    const res = validateMedicalAppointment(data);
    ['name', 'phone', 'specialty', 'date', 'time'].forEach((field) => {
      const errEl = document.getElementById(`m-err-${field}`);
      if (errEl) errEl.textContent = res.errors[field] || '';
    });

    if (!res.valid) {
      if (prepared) prepared.setAttribute('hidden', '');
      return;
    }

    if (preparedLink) preparedLink.setAttribute('href', buildMedicalWhatsAppUrl(res.clean));
    if (prepared) prepared.removeAttribute('hidden');
  });
}

function initLightbox() {
  const dialog = document.getElementById('m-lightbox');
  const imgEl = document.getElementById('m-lightbox-img');
  const captionEl = document.getElementById('m-lightbox-caption');
  const closeBtn = document.getElementById('m-lightbox-close');

  if (!dialog || !imgEl || !captionEl) return;

  document.querySelectorAll('[data-lightbox-src]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const src = trigger.getAttribute('data-lightbox-src') || '';
      const alt = trigger.getAttribute('data-lightbox-alt') || '';
      const caption = trigger.getAttribute('data-lightbox-caption') || '';
      imgEl.setAttribute('src', src);
      imgEl.setAttribute('alt', alt);
      captionEl.textContent = caption;
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
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

function initMobileDrawer() {
  const toggle = document.getElementById('m-mobile-toggle');
  const drawer = document.getElementById('m-mobile-drawer');
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
  document.querySelectorAll('[data-med-spec]').forEach((btn) => {
    btn.addEventListener('click', () => renderSpecialty(btn.getAttribute('data-med-spec') || 'general'));
  });
  renderSpecialty('general');
  initSpecialtyPrefill();
  initForm();
  initLightbox();
  initMobileDrawer();
});
