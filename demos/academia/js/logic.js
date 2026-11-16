/**
 * INSTITUTO PAIDEIA Educación & Academias (Demostración) — Pure Logic Module
 */

export const ACADEMY_COURSES = [
  {
    id: 'ingles-b2',
    area: 'Idiomas',
    modality: 'Presencial Cuenca',
    name: 'Inglés Comunicativo B1–B2',
    duration: '12 semanas · 6 horas/semana',
    tuitionLabel: '$95.00 USD / módulo',
    description: 'Grupos reducidos enfocados en conversación práctica, lectura técnica y preparación B2.',
  },
  {
    id: 'diseno-digital',
    area: 'Diseño Digital',
    modality: 'En línea',
    name: 'Fundamentos de Diseño Gráfico y Marca',
    duration: '8 semanas · Clases en vivo',
    tuitionLabel: '$120.00 USD',
    description: 'Composición visual, tipografía, color y entregables reales para proyectos comerciales.',
  },
  {
    id: 'finanzas-pymes',
    area: 'Finanzas',
    modality: 'En línea',
    name: 'Finanzas Prácticas para Emprendedores',
    duration: '6 semanas · Formato nocturno 19:00',
    tuitionLabel: '$85.00 USD',
    description: 'Flujo de caja, cálculo de costos reales en USD, márgenes y control tributario básico.',
  },
  {
    id: 'preuniversitario',
    area: 'Preuniversitario',
    modality: 'Presencial Cuenca',
    name: 'Razonamiento Numérico y Verbal',
    duration: '10 semanas · Simulacros semanales',
    tuitionLabel: '$110.00 USD',
    description: 'Metodología progresiva orientada a exámenes de ingreso universitario en Ecuador.',
  },
];

export function filterAcademyCourses(items, area, modality = 'Todas') {
  return items.filter((item) => {
    const matchArea = !area || area === 'Todos' || item.area === area;
    const matchModality = !modality || modality === 'Todas' || item.modality === modality;
    return matchArea && matchModality;
  });
}

export function validateEnrollmentForm(data) {
  const clean = {
    name: String(data?.name || '').trim(),
    phone: String(data?.phone || '').trim(),
    course: String(data?.course || '').trim(),
    modality: String(data?.modality || '').trim(),
  };

  const errors = {};
  if (clean.name.length < 2) errors.name = 'Ingresa el nombre del estudiante.';
  if (clean.phone.length < 6) errors.phone = 'Ingresa un WhatsApp de contacto.';
  if (!clean.course) errors.course = 'Selecciona el programa o curso.';
  if (!clean.modality) errors.modality = 'Elige modalidad preferida.';

  return { valid: Object.keys(errors).length === 0, errors, clean };
}

export function buildAcademyWhatsAppUrl(clean) {
  const msg = [
    'Hola Anderson, probé la demostración de Educación & Academias (INSTITUTO PAIDEIA — Cuenca) en AV·STUDIO.',
    '',
    `Inscripción de ejemplo: ${clean.name} · Curso: ${clean.course} · Modalidad: ${clean.modality} · Tel: ${clean.phone}`,
    '',
    'Quisiera consultar por una página web para mi academia, instituto o centro de formación.',
  ].join('\n');
  return `https://wa.me/593979290747?text=${encodeURIComponent(msg)}`;
}
