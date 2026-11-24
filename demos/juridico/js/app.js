/**
 * VALDIVIESO & ASOCIADOS Estudio Jurídico (Demostración) — DOM & Interactions
 */

import {
  LEGAL_PRACTICE_AREAS,
  validateLegalConsultForm,
  buildLegalWhatsAppUrl,
} from './logic.js';

const AREA_METADATA = {
  corporativo: {
    code: 'ÁREA I · FICHA DESCRIPTIVA',
    selectValue: 'Derecho Societario',
  },
  civil: {
    code: 'ÁREA II · FICHA DESCRIPTIVA',
    selectValue: 'Derecho Civil y Bienes',
  },
  laboral: {
    code: 'ÁREA III · FICHA DESCRIPTIVA',
    selectValue: 'Laboral Preventivo',
  },
  propiedad: {
    code: 'ÁREA IV · FICHA DESCRIPTIVA',
    selectValue: 'Propiedad Intelectual',
  },
};

let activeAreaKey = 'corporativo';

function renderPracticeArea(key) {
  activeAreaKey = key in LEGAL_PRACTICE_AREAS ? key : 'corporativo';
  const item = LEGAL_PRACTICE_AREAS[activeAreaKey];
  const meta = AREA_METADATA[activeAreaKey] || AREA_METADATA.corporativo;

  const codeEl = document.getElementById('j-area-code');
  const titleEl = document.getElementById('j-area-title');
  const sumEl = document.getElementById('j-area-summary');
  const scopeEl = document.getElementById('j-area-scope');

  if (codeEl) codeEl.textContent = meta.code;
  if (titleEl) titleEl.textContent = item.title;
  if (sumEl) sumEl.textContent = item.summary;
  if (scopeEl) {
    scopeEl.innerHTML = '';
    item.scope.forEach((line) => {
      const li = document.createElement('li');
      li.className = 'j-practice-scope__item';
      li.textContent = `— ${line}`;
      scopeEl.appendChild(li);
    });
  }

  document.querySelectorAll('[data-legal-area]').forEach((btn) => {
    const active = btn.getAttribute('data-legal-area') === activeAreaKey;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
}

function initAreaJumpLinks() {
  document.querySelectorAll('[data-jump-area]').forEach((link) => {
    link.addEventListener('click', () => {
      const key = link.getAttribute('data-jump-area') || 'corporativo';
      renderPracticeArea(key);
    });
  });
}

function initAreaPrefill() {
  const prefillBtn = document.getElementById('j-area-prefill');
  const areaSelect = document.getElementById('j-area');
  const nameInput = document.getElementById('j-name');
  const consultSection = document.getElementById('consulta');

  if (!prefillBtn || !areaSelect) return;

  prefillBtn.addEventListener('click', () => {
    const meta = AREA_METADATA[activeAreaKey];
    if (meta && meta.selectValue) {
      areaSelect.value = meta.selectValue;
    }

    const errArea = document.getElementById('j-err-area');
    if (errArea) errArea.textContent = '';

    if (consultSection) {
      consultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (nameInput) {
      window.setTimeout(() => nameInput.focus({ preventScroll: true }), 260);
    }
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

function initLightbox() {
  const dialog = document.getElementById('j-lightbox');
  const imgEl = document.getElementById('j-lightbox-img');
  const captionEl = document.getElementById('j-lightbox-caption');
  const closeBtn = document.getElementById('j-lightbox-close');

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
  initAreaJumpLinks();
  initAreaPrefill();
  initConsultForm();
  initLightbox();
  initMobileDrawer();
});
