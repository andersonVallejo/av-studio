/**
 * VALDIVIESO & ASOCIADOS Estudio Jurídico (Demostración) — DOM & Interactions
 */

import {
  LEGAL_PRACTICE_AREAS,
  validateLegalConsultForm,
  buildLegalWhatsAppUrl,
} from './logic.js';

function renderPracticeArea(key) {
  const item = LEGAL_PRACTICE_AREAS[key] || LEGAL_PRACTICE_AREAS.corporativo;
  const titleEl = document.getElementById('j-area-title');
  const sumEl = document.getElementById('j-area-summary');
  const scopeEl = document.getElementById('j-area-scope');

  if (titleEl) titleEl.textContent = item.title;
  if (sumEl) sumEl.textContent = item.summary;
  if (scopeEl) {
    scopeEl.innerHTML = '';
    item.scope.forEach((line) => {
      const li = document.createElement('li');
      li.style.marginBottom = '0.4rem';
      li.textContent = `— ${line}`;
      scopeEl.appendChild(li);
    });
  }

  document.querySelectorAll('[data-legal-area]').forEach((btn) => {
    const active = btn.getAttribute('data-legal-area') === key;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
}

function initConsultForm() {
  const form = document.getElementById('j-consult-form');
  if (!form) return;

  const prepared = document.getElementById('j-prepared');
  const preparedLink = document.getElementById('j-prepared-wa');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = {
      name: document.getElementById('j-name')?.value || '',
      phone: document.getElementById('j-phone')?.value || '',
      area: document.getElementById('j-area')?.value || '',
      modality: document.getElementById('j-modality')?.value || '',
      summary: document.getElementById('j-summary')?.value || '',
    };

    const res = validateLegalConsultForm(data);
    ['name', 'phone', 'area', 'modality', 'summary'].forEach((field) => {
      const errEl = document.getElementById(`j-err-${field}`);
      if (errEl) errEl.textContent = res.errors[field] || '';
    });

    if (!res.valid) {
      if (prepared) prepared.setAttribute('hidden', '');
      return;
    }

    if (preparedLink) preparedLink.setAttribute('href', buildLegalWhatsAppUrl(res.clean));
    if (prepared) prepared.removeAttribute('hidden');
  });
}

function initMobileDrawer() {
  const toggle = document.getElementById('j-mobile-toggle');
  const drawer = document.getElementById('j-mobile-drawer');
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
  document.querySelectorAll('[data-legal-area]').forEach((btn) => {
    btn.addEventListener('click', () => renderPracticeArea(btn.getAttribute('data-legal-area') || 'corporativo'));
  });
  renderPracticeArea('corporativo');
  initConsultForm();
  initMobileDrawer();
});
