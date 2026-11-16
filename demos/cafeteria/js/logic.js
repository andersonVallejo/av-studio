/**
 * ORIGEN CUENCA Cafetería de Especialidad (Demostración) — Pure Logic Module
 */

export const COFFEE_ORIGINS = {
  loja: {
    name: 'Loja · Finca La Cordillera (1.850 m)',
    process: 'Lavado · Tueste medio claro',
    notes: 'Panela dorada, mandarina dulce y cacao suave.',
    recommended: 'Recomendado en V60 o Chemex para resaltar acidez limpia.',
  },
  azuay: {
    name: 'Azuay · Valle de Gualaceo (2.100 m)',
    process: 'Honey amarillo · Tueste medio',
    notes: 'Caramelo tostado, nuez andina y cuerpo cremoso.',
    recommended: 'Ideal para espresso doble, flat white o prensa francesa.',
  },
  zamora: {
    name: 'Zamora Chinchipe · Palanda (1.700 m)',
    process: 'Natural · Tueste medio',
    notes: 'Frutos rojos maduros, chocolate amargo y final floral.',
    recommended: 'Destaca en extracción fría (Cold Brew) y AeroPress.',
  },
};

export const CAFE_MENU = [
  {
    id: 'espresso-doble',
    category: 'Cafés de origen',
    name: 'Flat White de Altura',
    price: 3.25,
    description: 'Doble extracción de grano azuayo con leche microespumada sedosa.',
  },
  {
    id: 'latte-vainilla',
    category: 'Cafés de origen',
    name: 'Latte Artesanal de Panela',
    price: 3.75,
    description: 'Espresso balanceado endulzado sutilmente con sirope casero de panela y canela.',
  },
  {
    id: 'v60-loja',
    category: 'Métodos',
    name: 'Filtrado V60 · Grano de Loja',
    price: 4.0,
    description: 'Extracción manual en mesa con notas cítricas y dulzor limpio (280 ml).',
  },
  {
    id: 'prensa-francesa',
    category: 'Métodos',
    name: 'Prensa Francesa para Compartir',
    price: 5.5,
    description: 'Cuerpo intenso y aromático pensado para dos tazas (500 ml).',
  },
  {
    id: 'cold-brew',
    category: 'Bebidas frías',
    name: 'Cold Brew Naranja & Hielo',
    price: 4.25,
    description: 'Infusión lenta de 16 horas en frío servida con rodaja de naranja deshidratada.',
  },
  {
    id: 'croissant-almendras',
    category: 'Repostería',
    name: 'Croissant de Mantequilla y Almendra',
    price: 3.5,
    description: 'Hojaldre horneado cada mañana relleno de crema suave de almendra tostada.',
  },
  {
    id: 'tarta-zanahoria',
    category: 'Repostería',
    name: 'Porción de Tarta de Zanahoria y Nuez',
    price: 4.25,
    description: 'Bizcocho húmedo especiado con cobertura ligera de queso crema.',
  },
];

export function filterCafeMenu(items, category) {
  if (!category || category === 'Todos') return items;
  return items.filter((item) => item.category === category);
}

export function calculateCafeTotal(tray) {
  return tray.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function buildCafeWhatsAppUrl(tray, originKey) {
  const origin = COFFEE_ORIGINS[originKey] || COFFEE_ORIGINS.loja;
  const total = calculateCafeTotal(tray);
  const lines =
    tray.length > 0
      ? tray.map((t) => `- ${t.qty}x ${t.name} ($${(t.price * t.qty).toFixed(2)})`).join('\n')
      : '- Consulta general sobre carta de cafetería';

  const msg = [
    'Hola Anderson, probé la demostración de Cafetería (ORIGEN CUENCA) en AV·STUDIO.',
    '',
    `Origen explorado: ${origin.name}`,
    'Selección demostrativa:',
    lines,
    `Subtotal de referencia: $${total.toFixed(2)} USD`,
    '',
    'Quisiera cotizar una página web personalizada para mi cafetería.',
  ].join('\n');

  return `https://wa.me/593979290747?text=${encodeURIComponent(msg)}`;
}
