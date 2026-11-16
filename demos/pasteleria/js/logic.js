/**
 * TRIGAL DORADO Panadería & Pastelería (Demostración) — Pure Logic Module
 */

export const BAKERY_CATALOG = [
  {
    id: 'pan-masa-madre',
    category: 'Panadería',
    name: 'Hogaza Masa Madre 750g',
    price: 4.5,
    description: 'Fermentación lenta de 24 horas con harina molida a piedra y corteza crujiente.',
  },
  {
    id: 'croissant-mantequilla',
    category: 'Panadería',
    name: 'Caja x4 Croissants Clásicos',
    price: 8.5,
    description: 'Laminado artesanal con mantequilla fresca horneado al alba.',
  },
  {
    id: 'torta-frutos-rojos',
    category: 'Pasteles enteros',
    name: 'Torta Cacao & Frutos Rojos (12 porciones)',
    price: 28.0,
    description: 'Bizcocho húmedo de cacao ecuatoriano, crema diplomática de vainilla y moras frescas.',
  },
  {
    id: 'torta-tres-leches',
    category: 'Pasteles enteros',
    name: 'Tres Leches de Maracuyá (12 porciones)',
    price: 25.0,
    description: 'Esponjoso bañado en tres leches con crema ligera de maracuyá natural.',
  },
  {
    id: 'tartaleta-limon',
    category: 'Postres individuales',
    name: 'Tartaleta de Limón & Merengue',
    price: 3.75,
    description: 'Masa sablé de almendra con crema cítrica horneada y merengue tostado.',
  },
  {
    id: 'milhojas',
    category: 'Temporada',
    name: 'Milhojas de Vainilla & Manjar Blanco',
    price: 4.25,
    description: 'Capas crujientes de hojaldre caramelizado con manjar artesanal de olla.',
  },
];

export function filterBakeryCatalog(items, category) {
  if (!category || category === 'Todos') return items;
  return items.filter((item) => item.category === category);
}

export function validateCustomCakeOrder(data) {
  const clean = {
    name: String(data?.name || '').trim(),
    phone: String(data?.phone || '').trim(),
    flavor: String(data?.flavor || '').trim(),
    portions: String(data?.portions || '').trim(),
    date: String(data?.date || '').trim(),
    notes: String(data?.notes || '').trim(),
  };

  const errors = {};
  if (clean.name.length < 2) errors.name = 'Ingresa tu nombre.';
  if (clean.phone.length < 6) errors.phone = 'Ingresa un WhatsApp de contacto.';
  if (!clean.flavor) errors.flavor = 'Selecciona un sabor base.';
  if (!clean.portions) errors.portions = 'Indica las porciones aproximadas.';
  if (!clean.date) errors.date = 'Elige la fecha del evento o entrega.';

  return { valid: Object.keys(errors).length === 0, errors, clean };
}

export function buildBakeryWhatsAppUrl(clean) {
  const msg = [
    'Hola Anderson, probé la demostración de Pastelería (TRIGAL DORADO — Cuenca) en AV·STUDIO.',
    '',
    `Pedido de ejemplo: ${clean.name} · Sabor: ${clean.flavor} · Porciones: ${clean.portions} · Fecha: ${clean.date} · Tel: ${clean.phone}${clean.notes ? ` · Detalle: ${clean.notes}` : ''}`,
    '',
    'Quisiera consultar por una web personalizada para mi panadería o pastelería.',
  ].join('\n');
  return `https://wa.me/593979290747?text=${encodeURIComponent(msg)}`;
}
