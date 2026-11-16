/**
 * CASA DEL BARRANCO Hotel Boutique (Demostración) — Pure Logic Module
 */

export const HOTEL_ROOMS = [
  {
    id: 'suite-tomebamba',
    name: 'Suite Balcón del Río',
    capacity: '2 huéspedes',
    rateUsd: 118,
    features: 'Cama king, balcón privado hacia el barranco del Tomebamba y desayuno andino incluido.',
  },
  {
    id: 'doble-patio',
    name: 'Habitación Doble Patio Colonial',
    capacity: '2 a 3 huéspedes',
    rateUsd: 88,
    features: 'Techos altos de madera, patio interior silencioso y escritorio para trabajo remoto.',
  },
  {
    id: 'familiar-cajas',
    name: 'Loft Familiar El Cajas',
    capacity: '4 huéspedes',
    rateUsd: 145,
    features: 'Dos ambientes independientes, calefacción silenciosa y vista a tejados cuencanos.',
  },
];

export function validateHotelStay(data) {
  const clean = {
    name: String(data?.name || '').trim(),
    phone: String(data?.phone || '').trim(),
    room: String(data?.room || '').trim(),
    guests: String(data?.guests || '').trim(),
    checkIn: String(data?.checkIn || '').trim(),
    checkOut: String(data?.checkOut || '').trim(),
  };

  const errors = {};
  if (clean.name.length < 2) errors.name = 'Ingresa el nombre del huésped.';
  if (clean.phone.length < 6) errors.phone = 'Ingresa un WhatsApp o teléfono.';
  if (!clean.room) errors.room = 'Elige un tipo de habitación.';
  if (!clean.guests || Number(clean.guests) < 1) errors.guests = 'Indica número de huéspedes.';
  if (!clean.checkIn) errors.checkIn = 'Elige fecha de ingreso.';
  if (!clean.checkOut) errors.checkOut = 'Elige fecha de salida.';
  if (clean.checkIn && clean.checkOut && clean.checkOut <= clean.checkIn) {
    errors.checkOut = 'La fecha de salida debe ser posterior al ingreso.';
  }

  return { valid: Object.keys(errors).length === 0, errors, clean };
}

export function buildHotelWhatsAppUrl(clean) {
  const msg = [
    'Hola Anderson, probé la demostración de Hotel & Turismo (CASA DEL BARRANCO — Cuenca) en AV·STUDIO.',
    '',
    `Consulta de estadía de ejemplo: ${clean.name} · Habitación: ${clean.room} · Huéspedes: ${clean.guests} · Ingreso: ${clean.checkIn} · Salida: ${clean.checkOut} · Tel: ${clean.phone}`,
    '',
    'Quisiera información sobre una página web para mi hotel, hostería o agencia turística.',
  ].join('\n');
  return `https://wa.me/593979290747?text=${encodeURIComponent(msg)}`;
}
