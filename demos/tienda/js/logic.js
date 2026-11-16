/**
 * MERCADO SERRANO Tienda de Diseño & Hogar (Demostración) — Pure Logic Module
 */

export const STORE_PRODUCTS = [
  {
    id: 'jarron-chordeleg',
    category: 'Cerámica',
    name: 'Jarrón Terracota Mate (24 cm)',
    price: 29.0,
    description: 'Pieza torneada en arcilla roja natural con acabado poroso para flores secas o ramas.',
  },
  {
    id: 'vajilla-cuenca',
    category: 'Cerámica',
    name: 'Set de 2 Tazas Gres Esmaltadas',
    price: 22.0,
    description: 'Cerámica de alta temperatura apta para bebidas calientes y lavavajillas.',
  },
  {
    id: 'manta-lana',
    category: 'Textiles',
    name: 'Manta Tejida en Lana Andina (140x190 cm)',
    price: 54.0,
    description: 'Tejido artesanal en tonos terracota y crudo con flecos anudados a mano.',
  },
  {
    id: 'cojin-lino',
    category: 'Textiles',
    name: 'Funda de Cojín Lino Natural 45x45',
    price: 18.5,
    description: 'Tela respirable con cierre oculto, lavable y combinable con sofás neutros.',
  },
  {
    id: 'lampara-lino',
    category: 'Iluminación',
    name: 'Lámpara de Mesa Base Roble & Lino',
    price: 68.0,
    description: 'Luz cálida difusa para mesa de noche o estudio; incluye cable textil trenzado.',
  },
  {
    id: 'bandeja-madera',
    category: 'Cerámica',
    name: 'Centro de Mesa Bajo en Piedra Clara',
    price: 34.0,
    description: 'Formato orgánico pensado para mesas de comedor o recibidores.',
  },
];

export function filterStoreProducts(items, category, query = '') {
  const q = String(query || '').trim().toLowerCase();
  return items.filter((item) => {
    const matchCat = !category || category === 'Todos' || item.category === category;
    const matchQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });
}

export function updateStoreCart(cart, product, delta) {
  const next = cart.map((c) => ({ ...c }));
  const idx = next.findIndex((c) => c.id === product.id);
  if (idx === -1 && delta > 0) {
    next.push({ id: product.id, name: product.name, price: product.price, qty: delta });
  } else if (idx !== -1) {
    next[idx].qty += delta;
    if (next[idx].qty <= 0) next.splice(idx, 1);
  }
  return next;
}

export function calculateStoreTotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function buildStoreWhatsAppUrl(cart) {
  const total = calculateStoreTotal(cart);
  const lines =
    cart.length > 0
      ? cart.map((c) => `- ${c.qty}x ${c.name} ($${(c.price * c.qty).toFixed(2)})`).join('\n')
      : '- Consulta general sobre catálogo de tienda';

  const msg = [
    'Hola Anderson, probé la demostración de Tienda & Comercio (MERCADO SERRANO — Cuenca) en AV·STUDIO.',
    '',
    'Carrito demostrativo:',
    lines,
    `Subtotal estimado: $${total.toFixed(2)} USD`,
    '',
    'Quisiera consultar por una tienda o catálogo web personalizado para mi comercio.',
  ].join('\n');

  return `https://wa.me/593979290747?text=${encodeURIComponent(msg)}`;
}
