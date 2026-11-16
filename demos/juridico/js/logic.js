/**
 * VALDIVIESO & ASOCIADOS Estudio Jurídico (Demostración) — Pure Logic Module
 */

export const LEGAL_PRACTICE_AREAS = {
  corporativo: {
    title: 'Derecho Societario y Corporativo',
    summary:
      'Constitución de compañías (SAS y Cía. Ltda.), redacción de estatutos, pactos de socios, contratos comerciales y cumplimiento normativo para empresas del Ecuador.',
    scope: [
      'Estructuración legal de emprendimientos y pymes.',
      'Revisión preventiva de contratos mercantiles y alianzas.',
      'Acompañamiento en actas societarias y gobierno corporativo.',
    ],
  },
  civil: {
    title: 'Derecho Civil y Bienes Raíces',
    summary:
      'Estudio de títulos de propiedad, promesas de compraventa, arrendamientos comerciales o residenciales, particiones y contratos civiles.',
    scope: [
      'Debida diligencia documental previa a escrituración.',
      'Redacción clara de contratos y cláusulas de resguardo.',
      'Mediación y resolución ordenada de acuerdos.',
    ],
  },
  laboral: {
    title: 'Asesoría Laboral Preventiva',
    summary:
      'Contratos de trabajo bajo normativa vigente ecuatoriana, reglamentos internos, actas de finiquito y prevención de contingencias laborales para empleadores.',
    scope: [
      'Auditoría documental de carpetas laborales.',
      'Capacitación a equipos administrativos y gerencia.',
      'Asistencia técnica ante inspecciones o mediaciones.',
    ],
  },
  propiedad: {
    title: 'Propiedad Intelectual y Marcas',
    summary:
      'Búsqueda fonética, solicitud de registro de marcas y nombres comerciales ante SENADI, licencias de uso y protección de activos intangibles.',
    scope: [
      'Evaluación previa de registrabilidad marcaria.',
      'Contratos de cesión de derechos de autor y software.',
      'Vigilancia de renovaciones y oposiciones.',
    ],
  },
};

export function validateLegalConsultForm(data) {
  const clean = {
    name: String(data?.name || '').trim(),
    phone: String(data?.phone || '').trim(),
    area: String(data?.area || '').trim(),
    modality: String(data?.modality || '').trim(),
    summary: String(data?.summary || '').trim(),
  };

  const errors = {};
  if (clean.name.length < 2) errors.name = 'Ingresa tu nombre o razón social.';
  if (clean.phone.length < 6) errors.phone = 'Ingresa un teléfono o WhatsApp válido.';
  if (!clean.area) errors.area = 'Selecciona el área jurídica de consulta.';
  if (!clean.modality) errors.modality = 'Elige modalidad de reunión.';
  if (clean.summary.length < 8) errors.summary = 'Resume brevemente tu consulta (mín. 8 caracteres).';

  return { valid: Object.keys(errors).length === 0, errors, clean };
}

export function buildLegalWhatsAppUrl(clean) {
  const msg = [
    'Hola Anderson, probé la demostración de Servicios Jurídicos (VALDIVIESO & ASOCIADOS — Cuenca) en AV·STUDIO.',
    '',
    `Consulta de ejemplo: ${clean.name} · Área: ${clean.area} · Modalidad: ${clean.modality} · Tel: ${clean.phone}`,
    `Resumen: ${clean.summary}`,
    '',
    'Quisiera información sobre una web profesional para un estudio jurídico o consultora.',
  ].join('\n');
  return `https://wa.me/593979290747?text=${encodeURIComponent(msg)}`;
}
