/**
 * VERBENA & ESTILO Eventos y Celebraciones (Demostración) — Pure Logic Module
 */

export const EVENT_FORMATS = [
  {
    id: 'boda-hacienda',
    category: 'Bodas',
    name: 'Bodas en Hacienda o Quinta Andina',
    capacity: '60 a 220 invitados',
    description: 'Dirección estética, montaje floral, iluminación cálida y coordinación completa del cronograma.',
  },
  {
    id: 'gala-corporativa',
    category: 'Corporativos',
    name: 'Lanzamientos & Cenas Corporativas',
    capacity: '30 a 180 asistentes',
    description: 'Ambientación sobria acorde a identidad de marca, sonido técnico y catering de tiempos.',
  },
  {
    id: 'celebracion-privada',
    category: 'Celebraciones',
    name: 'Aniversarios & Recepciones Íntimas',
    capacity: '20 a 70 invitados',
    description: 'Mesas largas con vajilla de autor, iluminación con velas y curaduría musical.',
  },
];

export function filterEventFormats(items, category) {
  if (!category || category === 'Todos') return items;
  return items.filter((item) => item.category === category);
}

export function validateEventQuote(data) {
  const clean = {
    name: String(data?.name || '').trim(),
    phone: String(data?.phone || '').trim(),
    eventType: String(data?.eventType || '').trim(),
    guests: String(data?.guests || '').trim(),
    date: String(data?.date || '').trim(),
    notes: String(data?.notes || '').trim(),
  };

  const errors = {};
  if (clean.name.length < 2) errors.name = 'Ingresa tu nombre o empresa.';
  if (clean.phone.length < 6) errors.phone = 'Ingresa un WhatsApp de contacto.';
  if (!clean.eventType) errors.eventType = 'Selecciona el tipo de evento.';
  if (!clean.guests || Number(clean.guests) < 10) errors.guests = 'Indica aforo estimado (mín. 10).';
  if (!clean.date) errors.date = 'Selecciona una fecha tentativa.';

  return { valid: Object.keys(errors).length === 0, errors, clean };
}

export function buildEventWhatsAppUrl(clean) {
  const msg = [
    'Hola Anderson, probé la demostración de Eventos y Celebraciones (VERBENA & ESTILO — Cuenca) en AV·STUDIO.',
    '',
    `Cotización de ejemplo: ${clean.name} · Tipo: ${clean.eventType} · Aforo: ${clean.guests} invitados · Fecha tentativa: ${clean.date} · Tel: ${clean.phone}${clean.notes ? ` · Notas: ${clean.notes}` : ''}`,
    '',
    'Quisiera información sobre una página web para mi empresa de eventos o recepciones.',
  ].join('\n');
  return `https://wa.me/593979290747?text=${encodeURIComponent(msg)}`;
}
