/**
 * ATELIER ROSA Salón de Belleza & Estética (Demostración) — Pure Logic Module
 */

export const BEAUTY_SERVICES = [
  {
    id: 'facial-hidratante',
    category: 'Facial',
    name: 'Limpieza Facial & Hidratación Profunda',
    durationMin: 60,
    price: 35.0,
    description: 'Higienización suave, exfoliación enzimática, extracción controlada y mascarilla calmante.',
  },
  {
    id: 'capilar-balayage',
    category: 'Capilar',
    name: 'Iluminación & Hidratación Capilar',
    durationMin: 120,
    price: 68.0,
    description: 'Diagnóstico previo de hebra capilar, diseño de color suave y sellado nutritivo de brillo.',
  },
  {
    id: 'capilar-corte',
    category: 'Capilar',
    name: 'Corte de Diseño & Brushing',
    durationMin: 50,
    price: 22.0,
    description: 'Asesoría según facciones, lavado relajante y peinado natural duradero.',
  },
  {
    id: 'spa-manicure',
    category: 'Manicure & Spa',
    name: 'Manicure Semipermanente & Spa de Manos',
    durationMin: 55,
    price: 18.0,
    description: 'Cuidado cuidadoso de cutícula, exfoliación con crema de karité y esmaltado duradero.',
  },
  {
    id: 'spa-pedicure',
    category: 'Manicure & Spa',
    name: 'Pedicure Clínico-Estético',
    durationMin: 60,
    price: 24.0,
    description: 'Instrumental esterilizado, hidratación profunda y masaje relajante en pies.',
  },
  {
    id: 'maquillaje-social',
    category: 'Maquillaje',
    name: 'Maquillaje Social & Preparación de Piel',
    durationMin: 65,
    price: 42.0,
    description: 'Acabado luminoso de larga duración adaptado a eventos de día o noche en Cuenca.',
  },
];

export function filterBeautyServices(items, category) {
  if (!category || category === 'Todos') return items;
  return items.filter((item) => item.category === category);
}

export function validateBeautyBooking(data) {
  const clean = {
    name: String(data?.name || '').trim(),
    phone: String(data?.phone || '').trim(),
    service: String(data?.service || '').trim(),
    date: String(data?.date || '').trim(),
    time: String(data?.time || '').trim(),
  };

  const errors = {};
  if (clean.name.length < 2) errors.name = 'Ingresa tu nombre completo.';
  if (clean.phone.length < 6) errors.phone = 'Ingresa un WhatsApp de contacto.';
  if (!clean.service) errors.service = 'Selecciona un servicio.';
  if (!clean.date) errors.date = 'Elige una fecha tentativa.';
  if (!clean.time) errors.time = 'Elige un horario en formato 24h.';

  return { valid: Object.keys(errors).length === 0, errors, clean };
}

export function buildBeautyWhatsAppUrl(clean) {
  const msg = [
    'Hola Anderson, probé la demostración de Salón de Belleza (ATELIER ROSA — Cuenca) en AV·STUDIO.',
    '',
    `Reserva de ejemplo: ${clean.name} · Servicio: ${clean.service} · Fecha: ${clean.date} a las ${clean.time} · Tel: ${clean.phone}`,
    '',
    'Quisiera consultar por una página web para mi salón o centro estético.',
  ].join('\n');
  return `https://wa.me/593979290747?text=${encodeURIComponent(msg)}`;
}
