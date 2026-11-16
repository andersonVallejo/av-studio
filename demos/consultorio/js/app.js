/**
 * CENTRO MÉDICO TOMEBAMBA Consultorio (Demostración) — DOM & Interactions
 */

import {
  MEDICAL_SPECIALTIES,
  validateMedicalAppointment,
  buildMedicalWhatsAppUrl,
} from './logic.js';

function renderSpecialty(key) {
  const spec = MEDICAL_SPECIALTIES[key] || MEDICAL_SPECIALTIES.general;
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
      li.style.marginBottom = '0.35rem';
      li.textContent = `— ${n}`;
      notesEl.appendChild(li);
    });
  }

  document.querySelectorAll('[data-med-spec]').forEach((btn) => {
    const active = btn.getAttribute('data-med-spec') === key;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
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
  initForm();
  initMobileDrawer();
});
