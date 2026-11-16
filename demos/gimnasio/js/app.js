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

let activeDiscipline = 'Todos';

function renderPrograms() {
  const grid = document.getElementById('g-programs-grid');
  if (!grid) return;

  const list = filterGymPrograms(GYM_PROGRAMS, activeDiscipline);
  grid.innerHTML = '';

  list.forEach((prog) => {
    const card = document.createElement('article');
    card.className = 'g-card';

    const tag = document.createElement('span');
    tag.className = 'g-eyebrow';
    tag.style.marginBottom = '0.25rem';
    tag.textContent = prog.discipline;

    const title = document.createElement('h3');
    title.style.fontFamily = 'var(--g-font-display)';
    title.style.fontSize = '1.35rem';
    title.style.margin = '0 0 0.45rem';
    title.textContent = prog.name;

    const sched = document.createElement('p');
    sched.style.fontFamily = 'var(--g-font-mono)';
    sched.style.fontSize = '0.78rem';
    sched.style.color = 'var(--g-orange-bright)';
    sched.style.margin = '0 0 0.6rem';
    sched.textContent = prog.schedule;

    const desc = document.createElement('p');
    desc.style.fontSize = '0.9rem';
    desc.style.color = 'var(--g-muted-dark)';
    desc.style.margin = '0';
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
    const card = document.createElement('article');
    card.className = 'g-plan-card';

    const title = document.createElement('h3');
    title.style.fontFamily = 'var(--g-font-display)';
    title.style.fontSize = '1.45rem';
    title.style.margin = '0 0 0.35rem';
    title.textContent = plan.name;

    const price = document.createElement('div');
    price.className = 'g-plan-card__price';
    price.textContent = `$${plan.priceUsd.toFixed(2)} USD`;

    const desc = document.createElement('p');
    desc.style.fontSize = '0.9rem';
    desc.style.color = 'var(--g-muted-light)';
    desc.style.margin = '0.5rem 0 0';
    desc.textContent = plan.detail;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'g-btn g-btn--orange';
    btn.textContent = 'Elegir este plan';
    btn.addEventListener('click', () => {
      const sel = document.getElementById('g-plan');
      if (sel) sel.value = `${plan.name} ($${plan.priceUsd.toFixed(2)} USD)`;
      document.getElementById('prueba')?.scrollIntoView({ behavior: 'smooth' });
      document.getElementById('g-name')?.focus();
    });

    const top = document.createElement('div');
    top.append(title, price, desc);

    card.append(top, btn);
    grid.appendChild(card);
  });
}

function initForm() {
  const form = document.getElementById('g-trial-form');
  if (!form) return;

  const prepared = document.getElementById('g-prepared');
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
      activeDiscipline = btn.getAttribute('data-gym-filter') || 'Todos';
      document.querySelectorAll('[data-gym-filter]').forEach((item) => {
        item.classList.toggle('is-active', item === btn);
      });
      renderPrograms();
    });
  });

  renderPrograms();
  renderPlans();
  initForm();
  initMobileDrawer();
});
