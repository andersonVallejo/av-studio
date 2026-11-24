import React from 'react';
import { ArrowRight } from 'lucide-react';
import {
  calculateDashboardSummary,
  calculateProjectProgress,
  calculateProposalTotals,
  formatShortDate,
  formatUsd,
} from '../platform/formatters';
import { StatusLabel, type StatusTone } from '../platform/StatusLabel';
import type { AdminModuleKey, StudioWorkspaceDataset } from '../platform/types';

interface DashboardModuleProps {
  dataset: StudioWorkspaceDataset;
  onNavigate: (module: AdminModuleKey) => void;
}

const LEAD_STATUS_LABEL: Record<string, { label: string; tone: StatusTone }> = {
  nuevo: { label: 'Nuevo', tone: 'accent' },
  en_revision: { label: 'En revisión', tone: 'warning' },
  propuesta_enviada: { label: 'Propuesta enviada', tone: 'neutral' },
  convertido: { label: 'Convertido', tone: 'success' },
  archivado: { label: 'Archivado', tone: 'neutral' },
};

const PROPOSAL_STATUS_LABEL: Record<string, { label: string; tone: StatusTone }> = {
  borrador: { label: 'Borrador', tone: 'neutral' },
  enviada: { label: 'Enviada', tone: 'accent' },
  aprobada: { label: 'Aprobada', tone: 'success' },
  requiere_ajustes: { label: 'Ajustes solicitados', tone: 'warning' },
};

export const DashboardModule: React.FC<DashboardModuleProps> = ({ dataset, onNavigate }) => {
  const summary = calculateDashboardSummary(dataset);
  const clientById = new Map(dataset.clients.map((c) => [c.id, c]));

  const activeProjectsList = dataset.projects.filter((p) => p.status !== 'publicado');
  const pendingPayments = dataset.payments.filter((p) => p.status !== 'verificado');
  const pendingProposals = dataset.proposals.filter(
    (p) => p.status === 'borrador' || p.status === 'enviada' || p.status === 'requiere_ajustes'
  );

  return (
    <div className="space-y-8">
      {/* KPI Editorial Strip */}
      <section aria-label="Resumen operativo de demostración">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-px border border-[rgba(23,23,23,0.13)] bg-[rgba(23,23,23,0.13)] rounded-[6px] overflow-hidden">
          <div className="bg-[#FAF8F4] p-5 flex flex-col justify-between gap-2">
            <div>
              <span className="text-[0.8125rem] font-medium text-[#5C5B57] block">
                Solicitudes por atender
              </span>
              <span className="text-[0.72rem] text-[#5C5B57]">
                Nuevas o en revisión (de {summary.totalLeads} totales)
              </span>
            </div>
            <p className="av-display text-[2.25rem] text-[#171717] av-tabular leading-none py-1">
              {summary.pendingLeads}
            </p>
            <button
              type="button"
              onClick={() => onNavigate('leads')}
              className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-[#9E4A28] hover:text-[#171717] transition-colors self-start whitespace-nowrap"
            >
              <span>Abrir bandeja ({summary.totalLeads})</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="bg-[#FAF8F4] p-5 flex flex-col justify-between gap-2">
            <div>
              <span className="text-[0.8125rem] font-medium text-[#5C5B57] block">
                Clientes activos (demo)
              </span>
              <span className="text-[0.72rem] text-[#5C5B57]">
                De {summary.totalClients} fichas registradas
              </span>
            </div>
            <p className="av-display text-[2.25rem] text-[#171717] av-tabular leading-none py-1">
              {summary.activeClients}
            </p>
            <button
              type="button"
              onClick={() => onNavigate('clientes')}
              className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-[#30302E] hover:text-[#9E4A28] transition-colors self-start whitespace-nowrap"
            >
              <span>Ver directorio ({summary.totalClients})</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="bg-[#FAF8F4] p-5 flex flex-col justify-between gap-2">
            <div>
              <span className="text-[0.8125rem] font-medium text-[#5C5B57] block">
                Proyectos en curso
              </span>
              <span className="text-[0.72rem] text-[#5C5B57]">
                De {summary.totalProjects} proyectos de muestra
              </span>
            </div>
            <p className="av-display text-[2.25rem] text-[#171717] av-tabular leading-none py-1">
              {summary.activeProjects}
            </p>
            <button
              type="button"
              onClick={() => onNavigate('proyectos')}
              className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-[#30302E] hover:text-[#9E4A28] transition-colors self-start whitespace-nowrap"
            >
              <span>Seguir etapas</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="bg-[#FAF8F4] p-5 flex flex-col justify-between gap-2">
            <div>
              <span className="text-[0.8125rem] font-medium text-[#5C5B57] block">
                Propuestas pendientes
              </span>
              <span className="text-[0.72rem] text-[#5C5B57]">
                Por aprobar de {dataset.proposals.length} emitidas
              </span>
            </div>
            <p className="av-display text-[2.25rem] text-[#171717] av-tabular leading-none py-1">
              {summary.pendingProposals}
            </p>
            <button
              type="button"
              onClick={() => onNavigate('propuestas')}
              className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-[#30302E] hover:text-[#9E4A28] transition-colors self-start whitespace-nowrap"
            >
              <span>Revisar presupuestos</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="bg-[#FAF8F4] p-5 flex flex-col justify-between gap-2 sm:col-span-2 xl:col-span-1">
            <div>
              <span className="text-[0.8125rem] font-medium text-[#5C5B57] block">
                Pagos por verificar (demo)
              </span>
              <span className="text-[0.72rem] text-[#5C5B57]">
                {summary.pendingPaymentsCount} pagos pendientes / observados
              </span>
            </div>
            <p className="av-display text-[2.15rem] text-[#171717] av-tabular leading-none py-1">
              {formatUsd(summary.pendingPaymentsUsd)}
            </p>
            <button
              type="button"
              onClick={() => onNavigate('pagos')}
              className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-[#30302E] hover:text-[#9E4A28] transition-colors self-start whitespace-nowrap"
            >
              <span>
                Verificados: {formatUsd(summary.verifiedPaymentsUsd)} ({summary.verifiedPaymentsCount})
              </span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Split: Recent Leads + Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-7 border border-[rgba(23,23,23,0.13)] bg-[#FFFFFF] rounded-[6px] p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-4 pb-4 border-b border-[rgba(23,23,23,0.13)]">
            <div>
              <span className="text-[0.75rem] font-semibold tracking-[0.08em] text-[#9E4A28] block mb-1">
                Bandeja reciente · Muestra visual
              </span>
              <h2 className="av-display text-[1.65rem] text-[#171717]">
                Solicitudes del formulario público
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('leads')}
              className="text-[0.875rem] font-semibold text-[#171717] underline underline-offset-4 hover:text-[#9E4A28] whitespace-nowrap"
            >
              Ver todas
            </button>
          </div>

          {/* Mobile compact list */}
          <ul className="md:hidden divide-y divide-[rgba(23,23,23,0.08)] mt-2">
            {dataset.leads.map((lead) => {
              const statusMeta = LEAD_STATUS_LABEL[lead.status] || LEAD_STATUS_LABEL.nuevo;
              return (
                <li key={lead.id} className="py-3.5 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-[#171717] text-[0.9375rem]">{lead.business}</p>
                      <p className="text-[0.8125rem] text-[#5C5B57]">{lead.name}</p>
                    </div>
                    <StatusLabel label={statusMeta.label} tone={statusMeta.tone} />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[0.8125rem] text-[#30302E]">
                    <span>
                      {lead.sector} · <span className="av-mono">{lead.budget}</span>
                    </span>
                    <span className="av-mono text-[#5C5B57]">{formatShortDate(lead.receivedAt)}</span>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Desktop/Tablet table */}
          <div className="hidden md:block overflow-x-auto mt-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[rgba(23,23,23,0.13)] text-[0.75rem] font-semibold text-[#5C5B57]">
                  <th className="py-3 pr-4">Negocio / Solicitud</th>
                  <th className="py-3 px-4">Sector y alcance</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 pl-4 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(23,23,23,0.08)] text-[0.875rem]">
                {dataset.leads.map((lead) => {
                  const statusMeta = LEAD_STATUS_LABEL[lead.status] || LEAD_STATUS_LABEL.nuevo;
                  return (
                    <tr key={lead.id} className="hover:bg-[#FAF8F4] transition-colors">
                      <td className="py-3.5 pr-4">
                        <p className="font-semibold text-[#171717]">{lead.business}</p>
                        <p className="text-[0.8125rem] text-[#5C5B57]">{lead.name}</p>
                      </td>
                      <td className="py-3.5 px-4 text-[#30302E]">
                        <span>{lead.sector}</span>
                        <span className="mx-1.5 text-[#B8B5AE]" aria-hidden="true">·</span>
                        <span className="text-[0.8125rem] text-[#5C5B57]">{lead.budget}</span>
                      </td>
                      <td className="py-3.5 px-4 av-mono text-[0.8125rem] text-[#5C5B57] whitespace-nowrap">
                        {formatShortDate(lead.receivedAt)}
                      </td>
                      <td className="py-3.5 pl-4 text-right">
                        <StatusLabel label={statusMeta.label} tone={statusMeta.tone} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="lg:col-span-5 border border-[rgba(23,23,23,0.13)] bg-[#FFFFFF] rounded-[6px] p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-4 pb-4 border-b border-[rgba(23,23,23,0.13)]">
            <div>
              <span className="text-[0.75rem] font-semibold tracking-[0.08em] text-[#9E4A28] block mb-1">
                Seguimiento en curso · Muestra
              </span>
              <h2 className="av-display text-[1.65rem] text-[#171717]">
                Proyectos en curso ({activeProjectsList.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('proyectos')}
              className="text-[0.875rem] font-semibold text-[#171717] underline underline-offset-4 hover:text-[#9E4A28] whitespace-nowrap"
            >
              Gestionar
            </button>
          </div>

          {activeProjectsList.length === 0 ? (
            <p className="py-6 text-[0.875rem] text-[#5C5B57]">
              Todos los proyectos del conjunto de demostración figuran como publicados.
            </p>
          ) : (
            <div className="divide-y divide-[rgba(23,23,23,0.08)] mt-2">
              {activeProjectsList.map((project) => {
                const progress = calculateProjectProgress(project.stages);
                const client = clientById.get(project.clientId);
                return (
                  <div key={project.id} className="py-4 space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="av-mono text-[0.75rem] text-[#9E4A28]">
                          {project.code} · {project.sector}
                        </p>
                        <h3 className="font-semibold text-[0.96875rem] text-[#171717]">
                          {project.name}
                        </h3>
                        <p className="text-[0.8125rem] text-[#5C5B57]">
                          {client?.businessName || 'Cliente de muestra'}
                        </p>
                      </div>
                      <span className="av-mono text-[0.875rem] font-medium text-[#171717] shrink-0">
                        {progress}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-[#E8E3D8] rounded-[2px] overflow-hidden">
                      <div
                        className="h-full bg-[#C96F4A] transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[0.78rem] text-[#5C5B57]">
                      <span>Entrega estimada: {formatShortDate(project.estimatedLaunchDate)}</span>
                      {project.previewUrl ? (
                        <a
                          href={project.previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-[#9E4A28] hover:underline"
                        >
                          Abrir vista previa →
                        </a>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Bottom Split: Pending Proposals + Manual Payment Verification Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <section className="border border-[rgba(23,23,23,0.13)] bg-[#FAF8F4] rounded-[6px] p-6">
          <div className="flex items-baseline justify-between gap-4 pb-3 border-b border-[rgba(23,23,23,0.13)]">
            <h2 className="av-display text-[1.5rem] text-[#171717]">
              Propuestas por definir ({pendingProposals.length})
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('propuestas')}
              className="text-[0.8125rem] font-semibold text-[#9E4A28] hover:underline whitespace-nowrap"
            >
              Ir a propuestas
            </button>
          </div>
          {pendingProposals.length === 0 ? (
            <p className="py-6 text-[0.875rem] text-[#5C5B57]">
              No hay propuestas pendientes en el conjunto de demostración.
            </p>
          ) : (
            <ul className="divide-y divide-[rgba(23,23,23,0.08)]">
              {pendingProposals.map((prop) => {
                const totals = calculateProposalTotals(prop.items, prop.depositPercent);
                const meta = PROPOSAL_STATUS_LABEL[prop.status] || PROPOSAL_STATUS_LABEL.borrador;
                return (
                  <li key={prop.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="av-mono text-[0.75rem] text-[#5C5B57]">
                        {prop.code} · Válida hasta {formatShortDate(prop.validUntil)}
                      </p>
                      <p className="font-semibold text-[#171717] text-[0.9375rem]">{prop.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="av-mono text-[0.9375rem] font-medium text-[#171717]">
                        {formatUsd(totals.subtotalUsd)}
                      </p>
                      <StatusLabel label={meta.label} tone={meta.tone} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="border border-[rgba(23,23,23,0.13)] bg-[#FAF8F4] rounded-[6px] p-6">
          <div className="flex items-baseline justify-between gap-4 pb-3 border-b border-[rgba(23,23,23,0.13)]">
            <h2 className="av-display text-[1.5rem] text-[#171717]">
              Pagos pendientes de revisión manual ({pendingPayments.length})
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('pagos')}
              className="text-[0.8125rem] font-semibold text-[#9E4A28] hover:underline whitespace-nowrap"
            >
              Verificar pagos
            </button>
          </div>
          {pendingPayments.length === 0 ? (
            <p className="py-6 text-[0.875rem] text-[#5C5B57]">
              Todos los pagos de ejemplo figuran verificados.
            </p>
          ) : (
            <ul className="divide-y divide-[rgba(23,23,23,0.08)]">
              {pendingPayments.map((pay) => (
                <li key={pay.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="av-mono text-[0.75rem] text-[#5C5B57]">
                      {pay.referenceCode} · {formatShortDate(pay.recordedAt)}
                    </p>
                    <p className="font-semibold text-[#171717] text-[0.9375rem]">{pay.concept}</p>
                  </div>
                  <div className="text-right">
                    <p className="av-mono text-[0.9375rem] font-medium text-[#171717]">
                      {formatUsd(pay.amountUsd)}
                    </p>
                    <StatusLabel
                      label={pay.status === 'observado' ? 'Observado' : 'Pendiente de verificación'}
                      tone={pay.status === 'observado' ? 'danger' : 'warning'}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};
