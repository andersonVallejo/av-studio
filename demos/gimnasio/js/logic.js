/**
 * PULSO 360 Centro de Entrenamiento (Demostración) — Pure Logic Module
 */

export const GYM_PROGRAMS = [
  {
    id: 'fuerza-base',
    discipline: 'Fuerza',
    name: 'Fuerza Funcional & Barra Olímpica',
    schedule: 'Lun / Mié / Vie · 06:30, 18:00 y 19:30',
    description: 'Progresión técnica en sentadilla, peso muerto y empuje con supervisión de entrenador.',
  },
  {
    id: 'metcon-360',
    discipline: 'Acondicionamiento',
    name: 'Circuito Metabólico 45',
    schedule: 'Mar / Jue / Sáb · 07:00, 17:30 y 19:00',
    description: 'Intervalos de remo, trineo, kettlebells y resistencia cardiovascular controlada.',
  },
  {
    id: 'movilidad-core',
    discipline: 'Movilidad',
    name: 'Movilidad Articular & Zona Media',
    schedule: 'Lun a Vie · 08:30 y 20:00',
    description: 'Prevención de molestias posturales, estabilidad lumbar y recuperación activa.',
  },
];

export const GYM_PLANS = [
  {
    id: 'mensual',
    name: 'Plan Mensual Libre',
    priceUsd: 38.0,
    detail: 'Acceso a sala de musculación + clases grupales sin contrato forzoso.',
  },
  {
    id: 'trimestral',
    name: 'Plan Trimestral',
    priceUsd: 99.0,
    detail: 'Evaluación inicial de composición corporal + acceso completo 90 días.',
  },
  {
    id: 'anual',
    name: 'Plan Anual Constancia',
    priceUsd: 340.0,
    detail: 'Valor preferencial anual + 2 congelamientos programados por viaje.',
  },
];

export function filterGymPrograms(items, discipline) {
  if (!discipline || discipline === 'Todos') return items;
  return items.filter((item) => item.discipline === discipline);
}

export function validateGymTrialForm(data) {
  const clean = {
    name: String(data?.name || '').trim(),
    phone: String(data?.phone || '').trim(),
    plan: String(data?.plan || '').trim(),
    timeSlot: String(data?.timeSlot || '').trim(),
  };

  const errors = {};
  if (clean.name.length < 2) errors.name = 'Ingresa tu nombre completo.';
  if (clean.phone.length < 6) errors.phone = 'Ingresa un WhatsApp válido.';
  if (!clean.plan) errors.plan = 'Elige un plan o pase de prueba.';
  if (!clean.timeSlot) errors.timeSlot = 'Selecciona una franja horaria (24h).';

  return { valid: Object.keys(errors).length === 0, errors, clean };
}

export function buildGymWhatsAppUrl(clean) {
  const msg = [
    'Hola Anderson, probé la demostración de Gimnasio (PULSO 360 — Cuenca) en AV·STUDIO.',
    '',
    `Pase de prueba de ejemplo: ${clean.name} · Interés: ${clean.plan} · Horario preferido: ${clean.timeSlot} · Tel: ${clean.phone}`,
    '',
    'Quisiera consultar por una página web para mi gimnasio o centro deportivo.',
  ].join('\n');
  return `https://wa.me/593979290747?text=${encodeURIComponent(msg)}`;
}
