/**
 * KALLPA Restaurante (Demostración) — Pure Logic Module
 */

export const RESTAURANT_MENU = [
  {
    id: 'ceviche-trucha',
    category: 'Entradas',
    name: 'Tiradito de Trucha del Cajas',
    price: 9.5,
    description: 'Láminas frescas de trucha arcoíris, leche de tigre de maracuyá y choclo crocante.',
  },
  {
    id: 'llapingachos',
    category: 'Entradas',
    name: 'Trío de Llapingachos y Encurtido',
    price: 7.0,
    description: 'Tortillas de papa con queso fresco artesanal, salsa de maní tostado y curtido criollo.',
  },
  {
    id: 'trucha-brasa',
    category: 'Platos Fuertes',
    name: 'Trucha Sellada en Puré de Melloco',
    price: 16.5,
    description: 'Filete sellado a la plancha, crema suave de papa chaucha, aceite de cilantro y vegetales andinos.',
  },
  {
    id: 'seco-cordero',
    category: 'Platos Fuertes',
    name: 'Cordero Braseado en Chicha de Jora',
    price: 19.0,
    description: 'Cocción lenta de 6 horas con hierbas serranas, arroz con mote y maduro asado.',
  },
  {
    id: 'lomo-leña',
    category: 'De la Brasa',
    name: 'Lomo Fino a la Brasa y Chimichurri de Hierbas',
    price: 21.5,
    description: 'Corte sellado al carbón, papas rústicas con romero y emulsión de ajo asado.',
  },
  {
    id: 'higos-queso',
    category: 'Postres y Bebidas',
    name: 'Higos Confitados y Helado de Queso',
    price: 6.5,
    description: 'Higos en almíbar de panela con especias dulces y helado artesanal de queso tierno.',
  },
  {
    id: 'canelazo-sin-licor',
    category: 'Postres y Bebidas',
    name: 'Infusión Caliente de Naranjilla y Canela',
    price: 4.5,
    description: 'Bebida tradicional andina sin alcohol preparada con especias frescas y fruta local.',
  },
];

export function filterMenuByCategory(items, category) {
  if (!category || category === 'Todos') return items;
  return items.filter((item) => item.category === category);
}

export function calculateSelectionTotal(selection) {
  return selection.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function validateReservationForm(data) {
  const clean = {
    name: String(data?.name || '').trim(),
    guests: String(data?.guests || '').trim(),
    date: String(data?.date || '').trim(),
    time: String(data?.time || '').trim(),
    phone: String(data?.phone || '').trim(),
  };
  const errors = {};
  if (clean.name.length < 2) errors.name = 'Ingresa tu nombre.';
  if (!clean.guests || Number(clean.guests) < 1) errors.guests = 'Indica el número de personas.';
  if (!clean.date) errors.date = 'Selecciona una fecha.';
  if (!clean.time) errors.time = 'Selecciona una hora.';
  if (clean.phone.length < 6) errors.phone = 'Ingresa un teléfono de contacto.';
  return { valid: Object.keys(errors).length === 0, errors, clean };
}

export function buildRestaurantWhatsApp(clean, selection) {
  const dishesText =
    selection.length > 0
      ? '\nPlatos de interés (selección demostrativa):\n' +
        selection.map((s) => `- ${s.qty}x ${s.name} ($${(s.price * s.qty).toFixed(2)})`).join('\n')
      : '';
  const msg = [
    'Hola Anderson, probé la demostración de Restaurante (KALLPA — Cuenca) en AV·STUDIO y quiero consultar sobre una web similar para mi restaurante.',
    '',
    `Reserva de ejemplo: ${clean.name} · ${clean.guests} personas · ${clean.date} a las ${clean.time} · Contacto: ${clean.phone}${dishesText}`,
  ].join('\n');
  return `https://wa.me/593979290747?text=${encodeURIComponent(msg)}`;
}
