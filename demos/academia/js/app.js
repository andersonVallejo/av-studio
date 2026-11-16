/**
 * INSTITUTO PAIDEIA Educación & Academias (Demostración) — DOM & Interactions
 */

import {
  ACADEMY_COURSES,
  filterAcademyCourses,
  validateEnrollmentForm,
  buildAcademyWhatsAppUrl,
} from './logic.js';

let activeArea = 'Todos';
let activeModality = 'Todas';

function renderCourses() {
  const grid = document.getElementById('ac-courses-grid');
  if (!grid) return;

  const list = filterAcademyCourses(ACADEMY_COURSES, activeArea, activeModality);
  grid.innerHTML = '';

  if (list.length === 0) {
    const empty = document.createElement('p');
    empty.style.gridColumn = '1 / -1';
    empty.style.color = 'var(--ac-muted)';
    empty.textContent = 'No hay programas demostrativos en esa combinación de área y modalidad.';
    grid.appendChild(empty);
    return;
  }

  list.forEach((course) => {
    const card = document.createElement('article');
    card.className = 'ac-course-card';

    const meta = document.createElement('span');
    meta.className = 'ac-eyebrow';
    meta.style.marginBottom = '0.2rem';
    meta.textContent = `${course.area} · ${course.modality}`;

    const title = document.createElement('h3');
    title.style.fontFamily = 'var(--ac-font-serif)';
    title.style.fontSize = '1.2rem';
    title.style.margin = '0 0 0.35rem';
    title.textContent = course.name;

    const info = document.createElement('p');
    info.style.fontFamily = 'var(--ac-font-mono)';
    info.style.fontSize = '0.8rem';
    info.style.color = 'var(--ac-blue)';
    info.style.margin = '0 0 0.5rem';
    info.textContent = `${course.duration} · ${course.tuitionLabel}`;

    const desc = document.createElement('p');
    desc.style.fontSize = '0.9rem';
    desc.style.color = 'var(--ac-muted)';
    desc.style.margin = '0';
    desc.textContent = course.description;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ac-btn ac-btn--outline';
    btn.textContent = 'Solicitar pensum e inscripción';
    btn.addEventListener('click', () => {
      const sel = document.getElementById('ac-course');
      if (sel) sel.value = course.name;
      document.getElementById('inscripciones')?.scrollIntoView({ behavior: 'smooth' });
      document.getElementById('ac-name')?.focus();
    });

    const top = document.createElement('div');
    top.append(meta, title, info, desc);

    card.append(top, btn);
    grid.appendChild(card);
  });
}

function initForm() {
  const form = document.getElementById('ac-enroll-form');
  if (!form) return;

  const prepared = document.getElementById('ac-prepared');
  const preparedLink = document.getElementById('ac-prepared-wa');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = {
      name: document.getElementById('ac-name')?.value || '',
      phone: document.getElementById('ac-phone')?.value || '',
      course: document.getElementById('ac-course')?.value || '',
      modality: document.getElementById('ac-modality')?.value || '',
    };

    const res = validateEnrollmentForm(data);
    ['name', 'phone', 'course', 'modality'].forEach((field) => {
      const errEl = document.getElementById(`ac-err-${field}`);
      if (errEl) errEl.textContent = res.errors[field] || '';
    });

    if (!res.valid) {
      if (prepared) prepared.setAttribute('hidden', '');
      return;
    }

    if (preparedLink) preparedLink.setAttribute('href', buildAcademyWhatsAppUrl(res.clean));
    if (prepared) prepared.removeAttribute('hidden');
  });
}

function initMobileDrawer() {
  const toggle = document.getElementById('ac-mobile-toggle');
  const drawer = document.getElementById('ac-mobile-drawer');
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
  document.querySelectorAll('[data-acad-area]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeArea = btn.getAttribute('data-acad-area') || 'Todos';
      document.querySelectorAll('[data-acad-area]').forEach((item) => {
        item.classList.toggle('is-active', item === btn);
      });
      renderCourses();
    });
  });

  document.getElementById('ac-filter-modality')?.addEventListener('change', (e) => {
    activeModality = e.target.value || 'Todas';
    renderCourses();
  });

  renderCourses();
  initForm();
  initMobileDrawer();
});
