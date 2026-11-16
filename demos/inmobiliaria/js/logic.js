/**
 * ANDES HOGAR Bienes Raíces Cuenca (Demostración) — Pure Logic Module
 */

export const PROPERTIES_CATALOG = [
  {
    id: 'AH-101',
    operation: 'Venta',
    type: 'Casa',
    sector: 'El Vergel',
    rooms: 3,
    areaM2: 210,
    priceLabel: '$185,000 USD',
    title: 'Casa Contemporánea con Jardín Interior',
    summary: 'Residencia de dos plantas en conjunto cerrado tranquilo, acabados en madera y piedra andina.',
  },
  {
    id: 'AH-102',
    operation: 'Venta',
    type: 'Departamento',
    sector: 'Puertas del Sol',
    rooms: 2,
    areaM2: 112,
    priceLabel: '$129,500 USD',
    title: 'Departamento Luminoso con Terraza',
    summary: 'Vista despejada hacia el río Tomebamba, dos parqueaderos y bodega en edificio con ascensor.',
  },
  {
    id: 'AH-103',
    operation: 'Alquiler',
    type: 'Departamento',
    sector: 'Yanuncay',
    rooms: 2,
    areaM2: 95,
    priceLabel: '$650 USD / mes',
    title: 'Suite Familiar Cerca de Parques',
    summary: 'Cocina equipada, excelente iluminación natural y acceso cercano a ciclovía y servicios.',
  },
  {
    id: 'AH-104',
    operation: 'Venta',
    type: 'Terreno',
    sector: 'Ricaurte',
    rooms: 0,
    areaM2: 480,
    priceLabel: '$78,000 USD',
    title: 'Terreno Residencial Plano con Servicios',
    summary: 'Documentación al día, vía pavimentada y entorno tranquilo al norte de Cuenca.',
  },
  {
    id: 'AH-105',
    operation: 'Alquiler',
    type: 'Casa',
    sector: 'El Vergel',
    rooms: 4,
    areaM2: 245,
    priceLabel: '$1,100 USD / mes',
    title: 'Casa Amplia Ideal para Vivienda u Oficina',
    summary: 'Cuatro dormitorios, estudio independiente y patio posterior privado.',
  },
  {
    id: 'AH-106',
    operation: 'Venta',
    type: 'Casa',
    sector: 'Yanuncay',
    rooms: 3,
    areaM2: 178,
    priceLabel: '$158,000 USD',
    title: 'Vivienda de Estreno de Líneas Limpias',
    summary: 'Cocina tipo isla, sala de estar en planta alta y dos estacionamientos cubiertos.',
  },
];

export function filterProperties(items, criteria = {}) {
  const { operation = 'Todos', type = 'Todos', sector = 'Todos', minRooms = 0 } = criteria;
  const minR = Number(minRooms) || 0;
  return items.filter((item) => {
    if (operation !== 'Todos' && item.operation !== operation) return false;
    if (type !== 'Todos' && item.type !== type) return false;
    if (sector !== 'Todos' && item.sector !== sector) return false;
    if (minR > 0 && item.rooms < minR) return false;
    return true;
  });
}

export function buildPropertyWhatsAppUrl(property) {
  const msg = [
    'Hola Anderson, probé la demostración Inmobiliaria (ANDES HOGAR — Cuenca) en AV·STUDIO.',
    '',
    `Propiedad de ejemplo consultada: [${property.id}] ${property.title} (${property.operation} · ${property.sector} · ${property.priceLabel}).`,
    '',
    'Quisiera consultar por una página web para mi inmobiliaria o constructora.',
  ].join('\n');
  return `https://wa.me/593979290747?text=${encodeURIComponent(msg)}`;
}
