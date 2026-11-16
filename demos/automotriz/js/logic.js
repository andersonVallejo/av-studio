/**
 * TORQUE ANDINO Servicio Automotriz (Demostración) — Pure Logic Module
 */

export const AUTO_SERVICES = [
  {
    id: 'abc-preventivo',
    category: 'Preventivo',
    name: 'Mantenimiento Preventivo (Cambio de Aceite & Filtros)',
    priceLabel: 'Desde $48.00 USD',
    description: 'Aceite sintético o semisintético según fabricante, filtros y revisión de 25 puntos de seguridad.',
  },
  {
    id: 'frenos-abs',
    category: 'Frenos y Suspensión',
    name: 'Revisión & Cambio de Pastillas de Freno',
    priceLabel: 'Desde $55.00 USD',
    description: 'Inspección de discos, calibradores, líquido hidráulico y purga segura del circuito.',
  },
  {
    id: 'suspension-cuenca',
    category: 'Frenos y Suspensión',
    name: 'Inspección de Amortiguadores & Terminales',
    priceLabel: 'Desde $25.00 USD',
    description: 'Diagnóstico físico de tren delantero, bujes y rótulas sin reemplazos innecesarios.',
  },
  {
    id: 'scanner-obd',
    category: 'Diagnóstico',
    name: 'Escaneo Electrónico Computarizado OBD-II',
    priceLabel: '$28.00 USD',
    description: 'Lectura de códigos de falla de motor, ABS y sensores con informe técnico impreso.',
  },
  {
    id: 'bateria-alternador',
    category: 'Diagnóstico',
    name: 'Prueba de Batería, Arranque y Alternador',
    priceLabel: '$15.00 USD',
    description: 'Medición de carga real en frío y verificación de consumo eléctrico en reposo.',
  },
  {
    id: 'alineacion-balanceo',
    category: 'Alineación',
    name: 'Alineación Computarizada y Balanceo x4',
    priceLabel: '$32.00 USD',
    description: 'Corrección de ángulos de dirección, rotación de neumáticos y calibración de presión.',
  },
];

export function filterAutoServices(items, category) {
  if (!category || category === 'Todos') return items;
  return items.filter((item) => item.category === category);
}

export function validateAutoTurn(data) {
  const clean = {
    name: String(data?.name || '').trim(),
    phone: String(data?.phone || '').trim(),
    vehicle: String(data?.vehicle || '').trim(),
    service: String(data?.service || '').trim(),
    date: String(data?.date || '').trim(),
    time: String(data?.time || '').trim(),
  };

  const errors = {};
  if (clean.name.length < 2) errors.name = 'Ingresa tu nombre.';
  if (clean.phone.length < 6) errors.phone = 'Ingresa un WhatsApp de contacto.';
  if (clean.vehicle.length < 3) errors.vehicle = 'Indica marca/modelo y año (ej. Mazda 3 2019).';
  if (!clean.service) errors.service = 'Selecciona el servicio requerido.';
  if (!clean.date) errors.date = 'Elige una fecha tentativa.';
  if (!clean.time) errors.time = 'Elige un horario en formato 24h.';

  return { valid: Object.keys(errors).length === 0, errors, clean };
}

export function buildAutoWhatsAppUrl(clean) {
  const msg = [
    'Hola Anderson, probé la demostración Automotriz (TORQUE ANDINO — Cuenca) en AV·STUDIO.',
    '',
    `Turno de ejemplo: ${clean.name} · Vehículo: ${clean.vehicle} · Servicio: ${clean.service} · Fecha: ${clean.date} a las ${clean.time} · Tel: ${clean.phone}`,
    '',
    'Quisiera consultar por una página web para mi taller o centro automotriz.',
  ].join('\n');
  return `https://wa.me/593979290747?text=${encodeURIComponent(msg)}`;
}
