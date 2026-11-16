/**
 * CENTRO MÉDICO TOMEBAMBA Consultorio (Demostración) — Pure Logic Module
 */

export const MEDICAL_SPECIALTIES = {
  general: {
    title: 'Medicina General y Preventiva',
    schedule: 'Lunes a viernes · 08:00 a 18:00 · Sábados 08:30 a 12:30',
    description:
      'Atención clínica primaria para adultos y jóvenes, control de signos vitales, chequeos preventivos anuales y derivación oportuna a especialidades.',
    notes: [
      'Duración estimada de consulta: 30 minutos.',
      'Revisión ordenada de antecedentes y exámenes de laboratorio.',
      'Sin afirmaciones terapéuticas engañosas ni promesas garantizadas.',
    ],
  },
  pediatria: {
    title: 'Pediatría y Control Infantil',
    schedule: 'Lunes a viernes · 09:00 a 17:30',
    description:
      'Seguimiento de crecimiento y desarrollo desde recién nacidos hasta adolescentes, orientación nutricional y control de calendario de vacunación.',
    notes: [
      'Ambiente tranquilo pensado para familias.',
      'Indicaciones claras por escrito tras cada consulta.',
      'Atención previa cita para evitar esperas prolongadas.',
    ],
  },
  cardiologia: {
    title: 'Cardiología Preventiva',
    schedule: 'Martes, jueves y viernes · 14:00 a 19:00',
    description:
      'Evaluación cardiovascular preventiva, control de presión arterial, interpretación de electrocardiograma en reposo y control metabólico.',
    notes: [
      'Recomendado traer exámenes recientes si se dispone de ellos.',
      'Evaluación integral orientada al estilo de vida y seguimiento.',
    ],
  },
  nutricion: {
    title: 'Nutrición Clínica',
    schedule: 'Lunes a sábado · 08:30 a 16:30',
    description:
      'Planes alimentarios prácticos adaptados a productos locales del Ecuador, objetivos de bienestar y hábitos sostenibles sin dietas restrictivas extremas.',
    notes: [
      'Primera sesión de valoración de 45 minutos.',
      'Seguimiento periódico ajustado a la rutina del paciente.',
    ],
  },
};

export function validateMedicalAppointment(data) {
  const clean = {
    name: String(data?.name || '').trim(),
    phone: String(data?.phone || '').trim(),
    specialty: String(data?.specialty || '').trim(),
    date: String(data?.date || '').trim(),
    time: String(data?.time || '').trim(),
    reason: String(data?.reason || '').trim(),
  };

  const errors = {};
  if (clean.name.length < 2) errors.name = 'Ingresa el nombre del paciente.';
  if (clean.phone.length < 6) errors.phone = 'Ingresa un teléfono o WhatsApp válido.';
  if (!clean.specialty) errors.specialty = 'Selecciona una especialidad médica.';
  if (!clean.date) errors.date = 'Selecciona una fecha tentativa.';
  if (!clean.time) errors.time = 'Elige un horario en formato 24h.';

  return { valid: Object.keys(errors).length === 0, errors, clean };
}

export function buildMedicalWhatsAppUrl(clean) {
  const msg = [
    'Hola Anderson, probé la demostración de Consultorio Médico (CENTRO MÉDICO TOMEBAMBA — Cuenca) en AV·STUDIO.',
    '',
    `Solicitud de ejemplo: ${clean.name} · Especialidad: ${clean.specialty} · Fecha: ${clean.date} a las ${clean.time} · Tel: ${clean.phone}${clean.reason ? ` · Motivo: ${clean.reason}` : ''}`,
    '',
    'Quisiera consultar por una página web para mi consultorio o centro médico.',
  ].join('\n');
  return `https://wa.me/593979290747?text=${encodeURIComponent(msg)}`;
}
