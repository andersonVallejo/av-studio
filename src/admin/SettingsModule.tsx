import React from 'react';
import { STUDIO_CONTACT } from '../../assets/js/studio-logic.js';
import { SUPABASE_MIGRATION_BLUEPRINT } from '../platform/repositories';
import { StudioBrandMark } from '../platform/StudioBrandMark';

export const SettingsModule: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Studio Identity Configuration */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 border border-[rgba(23,23,23,0.13)] bg-[#171717] text-[#F3F0E9] rounded-[6px] p-7 space-y-5">
          <StudioBrandMark variant="light" showSignature />
          <p className="av-display italic text-[1.25rem] text-[#F3F0E9]">
            {STUDIO_CONTACT.slogan}
          </p>
          <p className="text-[0.875rem] text-[#B8B5AE] leading-relaxed">
            Estudio creativo especializado en diseño y desarrollo de experiencias digitales y páginas web a medida para negocios en Cuenca y todo Ecuador.
          </p>
          <div className="pt-4 border-t border-[rgba(243,240,233,0.14)] text-[0.8125rem] text-[#B8B5AE] space-y-1">
            <p>Titular: <strong className="text-[#F3F0E9]">{STUDIO_CONTACT.owner}</strong></p>
            <p>Ubicación: <strong className="text-[#F3F0E9]">{STUDIO_CONTACT.city}</strong></p>
          </div>
        </div>

        <div className="lg:col-span-7 border border-[rgba(23,23,23,0.13)] bg-[#FFFFFF] rounded-[6px] p-6 space-y-5">
          <div className="pb-3 border-b border-[rgba(23,23,23,0.13)]">
            <h2 className="av-display text-[1.65rem] text-[#171717]">
              Configuración general y canales oficiales
            </h2>
            <p className="text-[0.8125rem] text-[#5C5B57] mt-0.5">
              Datos sincronizados con el sitio público y la política de privacidad vigente.
            </p>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[0.875rem]">
            <div>
              <dt className="text-[0.75rem] font-semibold text-[#5C5B57]">Nombre de marca</dt>
              <dd className="font-semibold text-[#171717]">{STUDIO_CONTACT.brand}</dd>
            </div>
            <div>
              <dt className="text-[0.75rem] font-semibold text-[#5C5B57]">Firma responsable</dt>
              <dd className="font-semibold text-[#171717]">{STUDIO_CONTACT.owner}</dd>
            </div>
            <div>
              <dt className="text-[0.75rem] font-semibold text-[#5C5B57]">WhatsApp oficial</dt>
              <dd className="av-mono text-[#171717]">{STUDIO_CONTACT.whatsappDisplay}</dd>
            </div>
            <div>
              <dt className="text-[0.75rem] font-semibold text-[#5C5B57]">Correo electrónico</dt>
              <dd className="av-mono text-[#171717] break-all">{STUDIO_CONTACT.email}</dd>
            </div>
            <div>
              <dt className="text-[0.75rem] font-semibold text-[#5C5B57]">Estado de autenticación</dt>
              <dd className="text-[#9E4A28] font-semibold">
                Pendiente de integración con Supabase Auth
              </dd>
            </div>
            <div>
              <dt className="text-[0.75rem] font-semibold text-[#5C5B57]">Modo de almacenamiento actual</dt>
              <dd className="text-[#30302E] font-medium">
                Vista de demostración en memoria (sin claves ni persistencia)
              </dd>
            </div>
          </dl>

          <div className="p-4 bg-[#FAF8F4] border border-[rgba(23,23,23,0.13)] rounded-[4px] text-[0.8125rem] text-[#30302E] leading-relaxed">
            <strong className="text-[#171717]">Seguridad previa al lanzamiento:</strong>{' '}
            las directivas <code className="av-mono text-[#9E4A28]">noindex, nofollow</code> en{' '}
            <code className="av-mono">admin.html</code> y <code className="av-mono">portal.html</code>{' '}
            evitan la indexación en buscadores, pero <strong>no sustituyen autenticación ni control de acceso</strong>. No deben alojarse datos reales de clientes hasta activar Supabase Auth, políticas RLS y Storage privado.
          </div>
        </div>
      </section>

      {/* Supabase Readiness Table */}
      <section className="border border-[rgba(23,23,23,0.13)] bg-[#FFFFFF] rounded-[6px] overflow-hidden">
        <div className="px-6 py-4 bg-[#FAF8F4] border-b border-[rgba(23,23,23,0.13)]">
          <h2 className="av-display text-[1.6rem] text-[#171717]">
            Arquitectura preparada para Supabase ({SUPABASE_MIGRATION_BLUEPRINT.length} entidades)
          </h2>
          <p className="text-[0.8125rem] text-[#5C5B57] mt-0.5">
            Todas las interfaces consultan un repositorio desacoplado listo para migrar a PostgreSQL (<code className="av-mono">client_memberships</code>, <code className="av-mono">notification_logs</code>, versionado de propuestas y visibilidad de archivos), Auth, RLS y Storage sin reescribir componentes.
          </p>
        </div>

        {/* Mobile stacked cards */}
        <ul className="divide-y divide-[rgba(23,23,23,0.1)] md:hidden">
          {SUPABASE_MIGRATION_BLUEPRINT.map((row) => (
            <li key={row.table} className="p-4 space-y-2 text-[0.8125rem]">
              <div className="flex items-center justify-between gap-2">
                <span className="av-mono font-semibold text-[#9E4A28]">{row.table}</span>
                <span className="text-[0.75rem] text-[#5C5B57]">{row.currentStatus}</span>
              </div>
              <p className="text-[#171717] font-medium">{row.purpose}</p>
              <p className="text-[#30302E] text-[0.78rem]">
                <strong className="text-[#5C5B57]">RLS previsto:</strong> {row.rlsPolicyPlan}
              </p>
            </li>
          ))}
        </ul>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[rgba(23,23,23,0.13)] text-[0.75rem] font-semibold text-[#5C5B57]">
                <th className="py-3 px-4">Tabla futura</th>
                <th className="py-3 px-4">Responsabilidad</th>
                <th className="py-3 px-4">Control de acceso (RLS previsto)</th>
                <th className="py-3 px-4">Estado actual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(23,23,23,0.08)] text-[0.8125rem]">
              {SUPABASE_MIGRATION_BLUEPRINT.map((row) => (
                <tr key={row.table} className="hover:bg-[#FAF8F4]">
                  <td className="py-3 px-4 av-mono font-semibold text-[#9E4A28] whitespace-nowrap">
                    {row.table}
                  </td>
                  <td className="py-3 px-4 text-[#171717]">{row.purpose}</td>
                  <td className="py-3 px-4 text-[#30302E]">{row.rlsPolicyPlan}</td>
                  <td className="py-3 px-4 text-[#5C5B57]">{row.currentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
