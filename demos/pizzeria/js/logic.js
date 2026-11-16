/**
 * FORNO BRAVO Pizzería (Demostración) — Pure Logic Module
 */

export const PIZZERIA_MENU = [
  {
    id: 'pizza-margherita',
    category: 'Pizzas',
    name: 'Margherita al Horno',
    price: 11.0,
    description: 'Masa madre de 48h, tomate San Marzano, mozzarella fior di latte y albahaca fresca (32 cm).',
  },
  {
    id: 'pizza-diavola',
    category: 'Pizzas',
    name: 'Diavola & Miel Picante',
    price: 13.5,
    description: 'Pepperoni artesanal, mozzarella fundida, chile serrano asado y toque de miel andina.',
  },
  {
    id: 'pizza-cuatro-quesos',
    category: 'Pizzas',
    name: 'Cuatro Quesos del Sur',
    price: 13.0,
    description: 'Mozzarella, queso maduro, provolone y queso azul con orégano de huerta.',
  },
  {
    id: 'burger-doble',
    category: 'Hamburguesas',
    name: 'Doble Smash Bravo',
    price: 8.5,
    description: 'Doble carne sellada a la plancha, doble cheddar fundido, pan brioche y salsa de la casa con papas.',
  },
  {
    id: 'burger-ahumada',
    category: 'Hamburguesas',
    name: 'Crispy Tocino & Cebolla',
    price: 9.25,
    description: 'Carne de res 160g, tocino crocante, cebolla caramelizada y papas rústicas.',
  },
  {
    id: 'combo-duo',
    category: 'Combos',
    name: 'Combo Dúo Cuenca',
    price: 19.5,
    description: '1 Pizza Margherita o Pepperoni (32 cm) + 2 gaseosas + pan de ajo artesanal.',
  },
  {
    id: 'combo-amigos',
    category: 'Combos',
    name: 'Combo Burgers x2',
    price: 15.9,
    description: '2 Doble Smash Bravo + 2 porciones de papas sazonadas + 2 bebidas personales.',
  },
  {
    id: 'comp-pan-ajo',
    category: 'Complementos',
    name: 'Bastones de Pan al Ajo',
    price: 4.0,
    description: 'Horneados al momento con mantequilla de hierbas y queso parmesano.',
  },
  {
    id: 'comp-papas',
    category: 'Complementos',
    name: 'Papas Bravas con Salsa',
    price: 4.5,
    description: 'Papas doradas con pimentón dulce y salsa alioli artesanal.',
  },
];

export function filterPizzeriaMenu(items, category) {
  if (!category || category === 'Todas') return items;
  return items.filter((item) => item.category === category);
}

export function updateCartItem(cart, item, delta) {
  const next = cart.map((c) => ({ ...c }));
  const idx = next.findIndex((c) => c.id === item.id);
  if (idx === -1 && delta > 0) {
    next.push({ id: item.id, name: item.name, price: item.price, qty: delta });
  } else if (idx !== -1) {
    next[idx].qty += delta;
    if (next[idx].qty <= 0) {
      next.splice(idx, 1);
    }
  }
  return next;
}

export function calculatePizzeriaTotal(cart) {
  return cart.reduce((acc, item) => acc + item.price * item.qty, 0);
}

export function buildPizzeriaWhatsAppUrl(cart, customerName, sector) {
  const total = calculatePizzeriaTotal(cart);
  const list = cart.map((c) => `- ${c.qty}x ${c.name} ($${(c.price * c.qty).toFixed(2)})`).join('\n');
  const msg = [
    'Hola Anderson, probé la demostración de Pizzería (FORNO BRAVO — Cuenca) en AV·STUDIO.',
    '',
    `Pedido de ejemplo (${customerName || 'Visitante'} · ${sector || 'Cuenca'}):`,
    list || '- Consulta general',
    `Subtotal de referencia: $${total.toFixed(2)} USD`,
    '',
    'Quisiera consultar sobre una página web similar para mi negocio.',
  ].join('\n');
  return `https://wa.me/593979290747?text=${encodeURIComponent(msg)}`;
}
