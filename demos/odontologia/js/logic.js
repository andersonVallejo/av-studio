/**
 * ALBA DENTAL Clínica Odontológica (Demostración) — Pure Logic Module
 */

export const DENTAL_TREATMENTS = {
  general: {
    title: 'Odontología General y Preventiva',
    duration: '30 a 45 minutos por consulta',
    summary:
      'Diagnóstico inicial, profilaxis dental, control periodontal y restauraciones estéticas orientadas a conservar las piezas naturales.',
    steps: [
      'Evaluación clínica y plan preventivo explicado con claridad.',
      'Limpieza con ultrasonido y pulido dental.',
      'Control periódico cada 6 meses según indicación profesional.',
    ],
  },
  ortodoncia: {
    title: 'Ortodoncia y Alineación Dental',
    duration: 'Valoración inicial de 40 minutos',
    summary:
      'Estudio de mordida y alineación mediante brackets estéticos, metálicos o alineadores transparentes adaptados a cada paciente.',
    steps: [
      'Toma de registros y análisis funcional de la mordida.',
      'Explicación de alternativas y tiempos estimados reales.',
      'Controles mensuales programados.',
    ],
  },
  rehabilitacion: {
    title: 'Rehabilitación Oral',
    duration: 'Según plan diagnóstico',
    summary:
      'Restauración de función masticatoria y armonía dental mediante coronas, prótesis fijas o removibles planificadas por etapas.',
    steps: [
      'Estudio clínico integral del caso.',
      'Selección de materiales compatibles y confortables.',
      'Seguimiento posterior a la colocación.',
    ],
  },
  estetica: {
    title: 'Estética Dental Conservadora',
    duration: '45 a 60 minutos por sesión',
    summary:
      'Aclaramiento dental supervisado y resinas estéticas mínimamente invasivas respetando la estructura natural del diente.',
    steps: [
      'Evaluación previa de sensibilidad y salud gingival.',
      'Procedimiento controlado en consultorio.',
      'Indicaciones posteriores de cuidado diario.',
    ],
  },
};

export function validateDentalAppointment(data) {
  const clean = {
    name: String(data?.name || '').trim(),
    phone: String(data?.phone || '').trim(),
    specialty: String(data?.specialty || '').trim(),
    date: String(data?.date || '').trim(),
    time: String(data?.time || '').trim(),
    notes: String(data?.notes || '').trim(),
  };

  const errors = {};
  if (clean.name.length < 2) errors.name = 'Ingresa el nombre del paciente.';
  if (clean.phone.length < 6) errors.phone = 'Ingresa un teléfono o WhatsApp de contacto.';
  if (!clean.specialty) errors.specialty = 'Selecciona una especialidad.';
  if (!clean.date) errors.date = 'Elige una fecha tentativa.';
  if (!clean.time) errors.time = 'Elige un horario en formato 24h.';

  return { valid: Object.keys(errors).length === 0, errors, clean };
}

export function buildDentalWhatsAppUrl(clean) {
  const msg = [
    'Hola Anderson, probé la demostración de Clínica Odontológica (ALBA DENTAL — Cuenca) en AV·STUDIO.',
    '',
    `Solicitud de ejemplo: ${clean.name} · Especialidad: ${clean.specialty} · Fecha tentativa: ${clean.date} a las ${clean.time} · Tel: ${clean.phone}${clean.notes ? ` · Motivo: ${clean.notes}` : ''}`,
    '',
    'Quisiera información sobre una página web para clínica o consultorio.',
  ].join('\n');
  return `https://wa.me/593979290747?text=${encodeURIComponent(msg)}`;
}
