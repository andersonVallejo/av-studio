import {
  DENTAL_TREATMENTS,
  validateDentalAppointment,
  buildDentalWhatsAppUrl,
} from './logic.js';

document.addEventListener('DOMContentLoaded', () => {
  const mobileBtn = document.getElementById('o-mobile-btn');
  const mobileDrawer = document.getElementById('o-mobile-drawer');
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

  // Treatment Tabs
  const tabs = Array.from(document.querySelectorAll('[data-treat-key]'));
  const tTitle = document.getElementById('o-treat-title');
  const tDuration = document.getElementById('o-treat-duration');
  const tSummary = document.getElementById('o-treat-summary');
  const tSteps = document.getElementById('o-treat-steps');

  const renderTreatment = (key) => {
    const item = DENTAL_TREATMENTS[key];
    if (!item) return;
    if (tTitle) tTitle.textContent = item.title;
    if (tDuration) tDuration.textContent = `Duración referencial: ${item.duration}`;
    if (tSummary) tSummary.textContent = item.summary;
    if (tSteps) {
      tSteps.innerHTML = '';
      item.steps.forEach((step) => {
        const li = document.createElement('li');
        li.textContent = `— ${step}`;
        li.style.marginBottom = '0.45rem';
        tSteps.appendChild(li);
      });
    }
    tabs.forEach((btn) => {
      const active = btn.getAttribute('data-treat-key') === key;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  };

  tabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      renderTreatment(btn.getAttribute('data-treat-key') || 'general');
    });
  });
  renderTreatment('general');

  // Appointment Form
  const form = document.getElementById('o-appt-form');
  const preparedBox = document.getElementById('o-prepared');
  const preparedWa = document.getElementById('o-prepared-wa');

  if (form) {
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
});
