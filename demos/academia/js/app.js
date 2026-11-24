/**
 * INSTITUTO PAIDEIA Educación & Academias (Demostración) — DOM & Interactions
 */

import {
  ACADEMY_COURSES,
  filterAcademyCourses,
  validateEnrollmentForm,
  buildAcademyWhatsAppUrl,
} from './logic.js';

const SYLLABUS_TOPICS = {
  'ingles-b2': [
    'Conversación guiada y pronunciación cotidiana.',
    'Lectura de textos técnicos y redacción de correos formales.',
    'Simulacros de comprensión oral y escrita nivel B2.',
  ],
  'diseno-digital': [
    'Principios de retícula editorial, jerarquía y composición.',
    'Selección tipográfica, sistemas cromáticos e identidad visual.',
    'Preparación de entregables digitales para clientes y comercios.',
  ],
  'finanzas-pymes': [
    'Separación de cuentas personales y flujo mensual de caja.',
    'Estructura real de costos, márgenes y precios en USD.',
    'Orden tributario y calendarios preventivos de declaración.',
  ],
  preuniversitario: [
    'Resolución ágil de sucesiones, proporciones y ecuaciones.',
    'Comprensión lectora, analogías y síntesis argumentativa.',
    'Simulacros semanales con retroalimentación grupal.',
  ],
};

let activeArea = 'Todos';
let activeModality = 'Todas';

function mapCourseModalityToSelect(courseModality) {
  if (courseModality === 'Presencial Cuenca') return 'Presencial en Cuenca';
  if (courseModality === 'En línea') return 'En línea en vivo';
  return '';
}

function selectCourseForInquiry(course) {
  const courseSelect = document.getElementById('ac-course');
  const modalitySelect = document.getElementById('ac-modality');
  const selectedNote = document.getElementById('ac-selected-note');

  if (courseSelect) courseSelect.value = course.name;
  const mappedModality = mapCourseModalityToSelect(course.modality);
  if (modalitySelect && mappedModality) modalitySelect.value = mappedModality;

  if (selectedNote) {
    selectedNote.textContent = `Programa seleccionado: ${course.name} (${course.modality})`;
    selectedNote.removeAttribute('hidden');
  }

  document.getElementById('inscripciones')?.scrollIntoView({ behavior: 'smooth' });
  document.getElementById('ac-name')?.focus();
}

function syncAreaTabs() {
  document.querySelectorAll('[data-acad-area]').forEach((item) => {
    item.classList.toggle('is-active', item.getAttribute('data-acad-area') === activeArea);
  });
}

function renderCourses() {
  const grid = document.getElementById('ac-courses-grid');
  if (!grid) return;

  const list = filterAcademyCourses(ACADEMY_COURSES, activeArea, activeModality);
  grid.innerHTML = '';

  if (list.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'ac-courses-empty';
    empty.textContent = 'No hay programas demostrativos en esa combinación de área y modalidad.';
    grid.appendChild(empty);
    return;
  }

  list.forEach((course) => {
    const card = document.createElement('article');
    card.className = 'ac-course-card';

    const meta = document.createElement('span');
    meta.className = 'ac-course-card__meta';
    meta.textContent = `${course.area} · ${course.modality}`;

    const title = document.createElement('h3');
    title.className = 'ac-course-card__title';
    title.textContent = course.name;

    const info = document.createElement('p');
    info.className = 'ac-course-card__facts';
    info.textContent = `${course.duration} · ${course.tuitionLabel}`;

    const desc = document.createElement('p');
    desc.className = 'ac-course-card__desc';
    desc.textContent = course.description;

    const top = document.createElement('div');
    top.append(meta, title, info, desc);

    const topics = SYLLABUS_TOPICS[course.id];
    if (topics && topics.length > 0) {
      const details = document.createElement('details');
      details.className = 'ac-syllabus';

      const summary = document.createElement('summary');
      summary.textContent = 'Ver contenidos de ejemplo';

      const ul = document.createElement('ul');
      topics.forEach((topic) => {
        const li = document.createElement('li');
        li.textContent = topic;
        ul.appendChild(li);
      });

      details.append(summary, ul);
      top.appendChild(details);
    }

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ac-btn ac-btn--outline';
    btn.textContent = 'Solicitar pensum e inscripción';
    btn.addEventListener('click', () => {
      selectCourseForInquiry(course);
    });

    card.append(top, btn);
    grid.appendChild(card);
  });
}

function initQuickJumpsAndModalities() {
  document.querySelectorAll('[data-jump-area]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeArea = btn.getAttribute('data-jump-area') || 'Todos';
      activeModality = 'Todas';
      const modSelect = document.getElementById('ac-filter-modality');
      if (modSelect) modSelect.value = 'Todas';
      syncAreaTabs();
      renderCourses();
      document.getElementById('programas')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  document.querySelectorAll('[data-apply-modality]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeArea = 'Todos';
      activeModality = btn.getAttribute('data-apply-modality') || 'Todas';
      const modSelect = document.getElementById('ac-filter-modality');
      if (modSelect) modSelect.value = activeModality;
      syncAreaTabs();
      renderCourses();
      document.getElementById('programas')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function initSpaceLightbox() {
  const dialog = document.getElementById('ac-lightbox');
  const closeBtn = document.getElementById('ac-lightbox-close');
  const imgEl = document.getElementById('ac-lightbox-img');
  const titleEl = document.getElementById('ac-lightbox-title');
  const captionEl = document.getElementById('ac-lightbox-caption');

  if (!dialog || !imgEl || !titleEl || !captionEl) return;

  document.querySelectorAll('[data-space-img]').forEach((tile) => {
    tile.addEventListener('click', () => {
      const src = tile.getAttribute('data-space-img') || '';
      const title = tile.getAttribute('data-space-title') || '';
      const caption = tile.getAttribute('data-space-caption') || '';
      const thumbImg = tile.querySelector('img');

      imgEl.src = src;
      imgEl.alt = thumbImg ? thumbImg.alt : title;
      titleEl.textContent = title;
      captionEl.textContent = caption;

      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
    });
  });

  const closeDialog = () => {
    if (typeof dialog.close === 'function' && dialog.open) {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
  };

  closeBtn?.addEventListener('click', closeDialog);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
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
      syncAreaTabs();
      renderCourses();
    });
  });

  document.getElementById('ac-filter-modality')?.addEventListener('change', (e) => {
    activeModality = e.target.value || 'Todas';
    renderCourses();
  });

  renderCourses();
  initQuickJumpsAndModalities();
  initSpaceLightbox();
  initForm();
  initMobileDrawer();
});
