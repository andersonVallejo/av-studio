/**
 * PULSO 360 Centro de Entrenamiento (Demostración) — DOM & Interactions
 */

import {
  GYM_PROGRAMS,
  GYM_PLANS,
  filterGymPrograms,
  validateGymTrialForm,
  buildGymWhatsAppUrl,
} from './logic.js';

const GYM_ZONES = {
  fuerza: {
    kicker: 'Zona 01 · Peso libre y técnica',
    title: 'Fuerza & Barra Olímpica',
    desc: 'Racks de potencia con plataformas amortiguadas, barras olímpicas calibradas y discos bumper para trabajo técnico de sentadilla, peso muerto y empuje.',
    specs: [
      'Jaulas de potencia, plataformas de goma de alto impacto y espejos de postura.',
      'Juego completo de barras estándar, discos codificados y mancuernas hexagonales.',
      'Enlace directo con sesiones de Fuerza Funcional & Barra Olímpica.',
    ],
    discipline: 'Fuerza',
    img: './images/zona-fuerza.jpg',
    alt: 'Racks negros con barras olímpicas y discos de peso en zona de fuerza de Pulso 360',
    caption: 'Zona 01 · Área de fuerza libre y racks de potencia',
  },
  cardio: {
    kicker: 'Zona 02 · Pista y capacidad aeróbica',
    title: 'Acondicionamiento & Pista',
    desc: 'Ergómetros de remo, bicicletas de aire de alta resistencia y carril de césped sintético para trabajo por intervalos y empuje de trineo.',
    specs: [
      'Fila de máquinas de remo y bicicletas de aire para circuitos metabólicos.',
      'Pista lineal demarcada para sprints cortos, arrastres y desplazamiento con cargas.',
      'Enlace directo con bloques de Circuito Metabólico 45.',
    ],
    discipline: 'Acondicionamiento',
    img: './images/zona-cardio.jpg',
    alt: 'Ergómetros de remo, bicicleta de aire y pista verde de entrenamiento funcional',
    caption: 'Zona 02 · Ergómetros de remo, air bike y carril funcional',
  },
  movilidad: {
    kicker: 'Zona 03 · Control y rango articular',
    title: 'Movilidad & Recuperación',
    desc: 'Estudio luminoso con piso despejado, espalderas de madera, colchonetas, rodillos y balones medicinales para estabilidad y soltura postural.',
    specs: [
      'Superficie amplia con luz natural y colchonetas individuales para trabajo guiado.',
      'Espalderas de madera, bandas elásticas, bloques y rodillos de descarga.',
      'Enlace directo con sesiones de Movilidad Articular & Zona Media.',
    ],
    discipline: 'Movilidad',
    img: './images/zona-movilidad.jpg',
    alt: 'Estudio luminoso con colchonetas, barras de madera y equipamiento de movilidad',
    caption: 'Zona 03 · Estudio de movilidad articular, zona media y recuperación',
  },
};

const PLAN_CADENCE = {
  mensual: 'Vigencia 30 días',
  trimestral: 'Plan destacado · 90 días',
  anual: 'Vigencia 12 meses',
};

let activeDiscipline = 'Todos';

function setActiveDiscipline(discipline) {
  activeDiscipline = discipline || 'Todos';
  document.querySelectorAll('[data-gym-filter]').forEach((item) => {
    const isMatch = item.getAttribute('data-gym-filter') === activeDiscipline;
    item.classList.toggle('is-active', isMatch);
    item.setAttribute('aria-pressed', String(isMatch));
  });
  renderPrograms();
}

function selectPlanForTrial(planValue) {
  const sel = document.getElementById('g-plan');
  const note = document.getElementById('g-selected-plan');
  if (sel && planValue) {
    sel.value = planValue;
  }
  if (note && planValue) {
    note.textContent = `Plan seleccionado: ${planValue}`;
    note.removeAttribute('hidden');
  }
  document.getElementById('prueba')?.scrollIntoView({ behavior: 'smooth' });
  window.setTimeout(() => {
    document.getElementById('g-name')?.focus();
  }, 240);
}

function renderPrograms() {
  const grid = document.getElementById('g-programs-grid');
  if (!grid) return;

  const list = filterGymPrograms(GYM_PROGRAMS, activeDiscipline);
  grid.innerHTML = '';

  list.forEach((prog) => {
    const card = document.createElement('article');
    card.className = 'g-program-card';

    const tag = document.createElement('span');
    tag.className = 'g-program-card__disc';
    tag.textContent = prog.discipline;

    const title = document.createElement('h3');
    title.className = 'g-program-card__title';
    title.textContent = prog.name;

    const sched = document.createElement('p');
    sched.className = 'g-program-card__sched';
    sched.textContent = prog.schedule;

    const desc = document.createElement('p');
    desc.className = 'g-program-card__desc';
    desc.textContent = prog.description;

    card.append(tag, title, sched, desc);
    grid.appendChild(card);
  });
}

function renderPlans() {
  const grid = document.getElementById('g-plans-grid');
  if (!grid) return;

  grid.innerHTML = '';
  GYM_PLANS.forEach((plan) => {
    const isFeatured = plan.id === 'trimestral';
    const card = document.createElement('article');
    card.className = isFeatured ? 'g-plan-card g-plan-card--featured' : 'g-plan-card';

    const head = document.createElement('div');
    head.className = 'g-plan-card__head';

    const cadence = document.createElement('span');
    cadence.className = 'g-plan-card__cadence';
    cadence.textContent = PLAN_CADENCE[plan.id] || 'Referencial';

    head.appendChild(cadence);

    const title = document.createElement('h3');
    title.className = 'g-plan-card__title';
    title.textContent = plan.name;

    const price = document.createElement('div');
    price.className = 'g-plan-card__price';
    price.textContent = `$${plan.priceUsd.toFixed(2)} USD`;

    const desc = document.createElement('p');
    desc.className = 'g-plan-card__detail';
    desc.textContent = plan.detail;

    const planOptionValue = `${plan.name} ($${plan.priceUsd.toFixed(2)} USD)`;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = isFeatured ? 'g-btn g-btn--orange' : 'g-btn g-btn--dark';
    btn.textContent = 'Elegir este plan';
    btn.addEventListener('click', () => {
      selectPlanForTrial(planOptionValue);
    });

    const top = document.createElement('div');
    top.append(head, title, price, desc);

    card.append(top, btn);
    grid.appendChild(card);
  });
}

function initZonesExplorer() {
  const zoneButtons = document.querySelectorAll('[data-gym-zone]');
  const thumbButtons = document.querySelectorAll('[data-gym-zone-thumb]');
  const kickerEl = document.getElementById('g-zone-kicker');
  const titleEl = document.getElementById('g-zone-title');
  const descEl = document.getElementById('g-zone-desc');
  const specsEl = document.getElementById('g-zone-specs');
  const imgEl = document.getElementById('g-zone-img');
  const captionEl = document.getElementById('g-zone-caption');
  const jumpBtn = document.getElementById('g-zone-jump');

  if (!zoneButtons.length || !imgEl) return;

  const applyZone = (key) => {
    const zone = GYM_ZONES[key];
    if (!zone) return;

    zoneButtons.forEach((btn) => {
      const isMatch = btn.getAttribute('data-gym-zone') === key;
      btn.classList.toggle('is-active', isMatch);
      btn.setAttribute('aria-pressed', String(isMatch));
    });

    thumbButtons.forEach((thumb) => {
      const isMatch = thumb.getAttribute('data-gym-zone-thumb') === key;
      thumb.classList.toggle('is-active', isMatch);
    });

    if (kickerEl) kickerEl.textContent = zone.kicker;
    if (titleEl) titleEl.textContent = zone.title;
    if (descEl) descEl.textContent = zone.desc;
    if (captionEl) captionEl.textContent = zone.caption;

    imgEl.setAttribute('src', zone.img);
    imgEl.setAttribute('alt', zone.alt);

    if (specsEl) {
      specsEl.innerHTML = '';
      zone.specs.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        specsEl.appendChild(li);
      });
    }

    if (jumpBtn) {
      jumpBtn.setAttribute('data-target-discipline', zone.discipline);
    }
  };

  zoneButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-gym-zone');
      if (key) applyZone(key);
    });
  });

  thumbButtons.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const key = thumb.getAttribute('data-gym-zone-thumb');
      if (key) applyZone(key);
    });
  });

  jumpBtn?.addEventListener('click', () => {
    const disc = jumpBtn.getAttribute('data-target-discipline') || 'Todos';
    setActiveDiscipline(disc);
    document.getElementById('programas')?.scrollIntoView({ behavior: 'smooth' });
  });
}

function initGalleryLightbox() {
  const dialog = document.getElementById('g-lightbox');
  const imgEl = document.getElementById('g-lightbox-img');
  const titleEl = document.getElementById('g-lightbox-title');
  const captionEl = document.getElementById('g-lightbox-caption');
  const closeBtn = document.getElementById('g-lightbox-close');
  const triggers = document.querySelectorAll('[data-gym-lightbox-src]');

  if (!dialog || !imgEl || !triggers.length) return;

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const src = trigger.getAttribute('data-gym-lightbox-src') || '';
      const title = trigger.getAttribute('data-gym-lightbox-title') || 'Galería Pulso 360';
      const caption = trigger.getAttribute('data-gym-lightbox-caption') || '';
      const thumbAlt = trigger.querySelector('img')?.getAttribute('alt') || title;

      imgEl.setAttribute('src', src);
      imgEl.setAttribute('alt', thumbAlt);
      if (titleEl) titleEl.textContent = title;
      if (captionEl) captionEl.textContent = caption;

      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
    });
  });

  closeBtn?.addEventListener('click', () => {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    }
  });
}

function initForm() {
  const form = document.getElementById('g-trial-form');
  if (!form) return;

  const prepared = document.getElementById('g-prepared');
  const preparedSummary = document.getElementById('g-prepared-summary');
  const preparedLink = document.getElementById('g-prepared-wa');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = {
      name: document.getElementById('g-name')?.value || '',
      phone: document.getElementById('g-phone')?.value || '',
      plan: document.getElementById('g-plan')?.value || '',
      timeSlot: document.getElementById('g-timeslot')?.value || '',
    };

    const res = validateGymTrialForm(data);
    ['name', 'phone', 'plan', 'timeSlot'].forEach((field) => {
      const errEl = document.getElementById(`g-err-${field}`);
      if (errEl) errEl.textContent = res.errors[field] || '';
    });

    if (!res.valid) {
      if (prepared) prepared.setAttribute('hidden', '');
      return;
    }

    if (preparedSummary) {
      preparedSummary.textContent = `${res.clean.name} · ${res.clean.plan} · ${res.clean.timeSlot}`;
    }
    if (preparedLink) preparedLink.setAttribute('href', buildGymWhatsAppUrl(res.clean));
    if (prepared) prepared.removeAttribute('hidden');
  });
}

function initMobileDrawer() {
  const toggle = document.getElementById('g-mobile-toggle');
  const drawer = document.getElementById('g-mobile-drawer');
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
  document.querySelectorAll('[data-gym-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setActiveDiscipline(btn.getAttribute('data-gym-filter') || 'Todos');
    });
  });

  initZonesExplorer();
  renderPrograms();
  renderPlans();
  initGalleryLightbox();
  initForm();
  initMobileDrawer();
});
