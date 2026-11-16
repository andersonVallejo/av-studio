/**
 * TRES FILOS Barbería & Grooming (Demostración) — Pure Logic Module
 */

export const BARBER_SERVICES = [
  {
    id: 'corte-clasico',
    category: 'Cortes',
    name: 'Corte Clásico & Tijera',
    durationMin: 40,
    price: 12.0,
    description: 'Asesoría de forma craneal, corte a tijera y máquina de precisión, lavado capilar y acabado con cera mate.',
  },
  {
    id: 'corte-fade',
    category: 'Cortes',
    name: 'Degradado Skin Fade',
    durationMin: 45,
    price: 14.0,
    description: 'Transición limpia a navaja o shaver, texturizado superior y perfilado frontal con producto de peinado.',
  },
  {
    id: 'barba-ritual',
    category: 'Barba',
    name: 'Perfilado & Ritual de Barba',
    durationMin: 35,
    price: 10.0,
    description: 'Alineación simétrica a navaja, compresa de toalla caliente con eucalipto, bálsamo hidratante y aceite.',
  },
  {
    id: 'afeitado-tradicional',
    category: 'Barba',
    name: 'Afeitado Tradicional a Navaja',
    durationMin: 35,
    price: 11.0,
    description: 'Doble pasada con espuma tibia artesanal, toalla caliente de apertura de poro y tónico calmante frío.',
  },
  {
    id: 'ritual-tres-filos',
    category: 'Rituales',
    name: 'Ritual Completo Tres Filos',
    durationMin: 75,
    price: 21.0,
    description: 'Corte a elección + ritual completo de barba + exfoliación facial con carbón activo y bebida de cortesía.',
  },
  {
    id: 'limpieza-facial',
    category: 'Rituales',
    name: 'Cuidado Facial Masculino',
    durationMin: 30,
    price: 13.0,
    description: 'Vaporizador tibio, limpieza profunda de impurezas, mascarilla mineral negra y crema calmante sin brillo.',
  },
];

export const BARBER_TEAM = [
  {
    id: 'matias',
    name: 'Matías Ordóñez',
    role: 'Barbero Director · Cortes clásicos y tijera',
    bio: 'Perfil ficticio de ejemplo. Especialista en estructura clásica, cabello medio y acabado natural sin excesos.',
    hours: 'Martes a sábado · 09:00 a 19:00',
  },
  {
    id: 'sebastian',
    name: 'Sebastián Paredes',
    role: 'Maestro en Degradados · Skin Fade y Textura',
    bio: 'Perfil ficticio de ejemplo. Enfocado en degradados limpios, diseño de contornos y estilos urbanos actuales.',
    hours: 'Martes a domingo · 10:00 a 20:00',
  },
  {
    id: 'emilio',
    name: 'Emilio Cárdenas',
    role: 'Especialista en Barba & Afeitado Tradicional',
    bio: 'Perfil ficticio de ejemplo. Dedicado a rituales de toalla caliente, perfilado a navaja y cuidado de piel.',
    hours: 'Miércoles a domingo · 10:00 a 19:30',
  },
];

export function filterBarberServices(services, category) {
  if (!category || category === 'Todos') return services;
  return services.filter((item) => item.category === category);
}

export function validateBarberBooking(data) {
  const clean = {
    name: String(data?.name || '').trim(),
    phone: String(data?.phone || '').trim(),
    service: String(data?.service || '').trim(),
    barber: String(data?.barber || '').trim(),
    date: String(data?.date || '').trim(),
    time: String(data?.time || '').trim(),
  };

  const errors = {};
  if (clean.name.length < 2) errors.name = 'Ingresa tu nombre completo.';
  if (clean.phone.length < 6) errors.phone = 'Ingresa un teléfono o WhatsApp válido.';
  if (!clean.service) errors.service = 'Selecciona un servicio de la lista.';
  if (!clean.barber) errors.barber = 'Elige un barbero o cualquier disponible.';
  if (!clean.date) errors.date = 'Elige la fecha deseada.';
  if (!clean.time) errors.time = 'Selecciona una hora en formato 24h.';

  return { valid: Object.keys(errors).length === 0, errors, clean };
}

export function buildBarberWhatsAppUrl(clean) {
  const msg = [
    'Hola Anderson, probé la demostración de Barbería (TRES FILOS — Cuenca) en AV·STUDIO.',
    '',
    `Reserva de ejemplo: ${clean.name} · Servicio: ${clean.service} · Barbero: ${clean.barber} · Fecha: ${clean.date} a las ${clean.time} · Contacto: ${clean.phone}`,
    '',
    'Quisiera consultar por una página web personalizada para mi barbería o negocio.',
  ].join('\n');
  return `https://wa.me/593979290747?text=${encodeURIComponent(msg)}`;
}
