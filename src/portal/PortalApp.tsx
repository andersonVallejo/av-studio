import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  FileText,
  Mail,
  MessageSquare,
} from 'lucide-react';
import { STUDIO_CONTACT } from '../../assets/js/studio-logic.js';
import {
  calculateProposalTotals,
  formatShortDate,
  formatUsd,
  getClientPortalBundle,
} from '../platform/formatters';
import { createDemoStudioRepository } from '../platform/repositories';
import { StatusLabel } from '../platform/StatusLabel';
import { StudioBrandMark } from '../platform/StudioBrandMark';
import type { ProjectStatus, StudioWorkspaceDataset } from '../platform/types';

const PORTAL_PROJECT_STATUS_LABEL: Record<
  ProjectStatus,
  { label: string; tone: 'neutral' | 'accent' | 'warning' | 'success' }
> = {
  diagnostico: { label: 'Diagnóstico', tone: 'neutral' },
  diseno_visual: { label: 'Diseño visual', tone: 'accent' },
  desarrollo: { label: 'En desarrollo', tone: 'accent' },
  revision_cliente: { label: 'En revisión contigo', tone: 'warning' },
  publicado: { label: 'Publicado', tone: 'success' },
};

function readInitialDemoClientId(): string {
  if (typeof window === 'undefined') return 'cli-demo-01';
  const params = new URLSearchParams(window.location.search);
  return params.get('demoClient') || 'cli-demo-01';
}

export const PortalApp: React.FC = () => {
  const repository = useMemo(() => createDemoStudioRepository(), []);
  const [dataset, setDataset] = useState<StudioWorkspaceDataset | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string>(readInitialDemoClientId);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    repository
      .loadWorkspaceDataset()
      .then((data) => {
        if (!cancelled) setDataset(data);
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError('No se pudo cargar la vista previa del portal del cliente.');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [repository]);

  const bundle = useMemo(() => {
    if (!dataset) return null;
    return getClientPortalBundle(selectedClientId, dataset, selectedProjectId ?? undefined);
  }, [dataset, selectedClientId, selectedProjectId]);

  const completedStages = bundle?.activeProject?.stages.filter((s) => s.completed) || [];
  const pendingStages = bundle?.activeProject?.stages.filter((s) => !s.completed) || [];
  const proposalTotals = bundle?.proposal
    ? calculateProposalTotals(bundle.proposal.items, bundle.proposal.depositPercent)
    : null;
  const activeStatusBadge = bundle?.activeProject
    ? PORTAL_PROJECT_STATUS_LABEL[bundle.activeProject.status]
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F0E9] text-[#171717]">
      {/* Clean 3-Zone Top Header */}
      <header className="bg-[#FAF8F4] border-b border-[rgba(23,23,23,0.13)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-5 lg:px-8 h-[68px] flex items-center justify-between gap-4">
          <a href="/index.html" aria-label="AV·STUDIO — Ir al sitio público" className="min-w-0 shrink-0">
            <StudioBrandMark variant="dark" compact />
          </a>

          <nav aria-label="Navegación del portal" className="hidden lg:flex items-center gap-6 text-[0.875rem] font-medium text-[#30302E]">
            <a href="#resumen-proyecto" className="hover:text-[#9E4A28] whitespace-nowrap">
              Proyecto
            </a>
            <a href="#etapas-avance" className="hover:text-[#9E4A28] whitespace-nowrap">
              Etapas
            </a>
            <a href="#propuesta-pagos" className="hover:text-[#9E4A28] whitespace-nowrap">
              Propuesta y pagos
            </a>
            <a href="#archivos-contacto" className="hover:text-[#9E4A28] whitespace-nowrap">
              Archivos y contacto
            </a>
          </nav>

          <a
            href={STUDIO_CONTACT.whatsappBaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 sm:px-4 py-2 text-[0.8125rem] font-semibold bg-[#171717] text-[#F3F0E9] rounded-[4px] hover:bg-[#9E4A28] transition-colors whitespace-nowrap shrink-0"
          >
            Contactar al estudio
          </a>
        </div>

        {/* Tablet & Mobile Section Navigation */}
        <nav
          aria-label="Secciones del portal"
          className="lg:hidden border-t border-[rgba(23,23,23,0.1)] bg-[#F3F0E9]/60"
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-5 py-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[0.8125rem] font-medium text-[#30302E]">
            <a href="#resumen-proyecto" className="hover:text-[#9E4A28] whitespace-nowrap">
              Proyecto
            </a>
            <a href="#etapas-avance" className="hover:text-[#9E4A28] whitespace-nowrap">
              Etapas
            </a>
            <a href="#propuesta-pagos" className="hover:text-[#9E4A28] whitespace-nowrap">
              Propuesta y pagos
            </a>
            <a href="#archivos-contacto" className="hover:text-[#9E4A28] whitespace-nowrap">
              Archivos y contacto
            </a>
          </div>
        </nav>
      </header>

      {/* Honest Architecture & RLS Scoping Bar */}
      <div className="bg-[#171717] text-[#F3F0E9] border-b border-[rgba(243,240,233,0.14)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-5 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-[0.8125rem]">
          <p className="text-[#B8B5AE]">
            <strong className="text-[#C96F4A]">Vista previa del Portal Privado del Cliente:</strong>{' '}
            En producción cada cliente invitado verá exclusivamente su proyecto tras autenticarse en Supabase (RLS). Los datos actuales son ficticios de demostración.
          </p>

          {dataset ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 w-full md:w-auto min-w-0">
              <label htmlFor="demo-client-scope" className="text-[#B8B5AE] shrink-0">
                Simular vista por cliente:
              </label>
              <select
                id="demo-client-scope"
                value={selectedClientId}
                onChange={(e) => {
                  setSelectedClientId(e.target.value);
                  setSelectedProjectId(null);
                }}
                className="w-full sm:w-auto max-w-full min-w-0 px-2.5 py-1.5 text-[0.8125rem] bg-[#21211F] text-[#F3F0E9] border border-[rgba(243,240,233,0.22)] rounded-[4px]"
              >
                {dataset.clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.businessName}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>
      </div>

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-5 lg:px-8 py-8 space-y-8">
        {loadError ? (
          <div role="alert" className="p-6 border border-[#991B1B] bg-[#FEF2F2] text-[#991B1B] rounded-[6px]">
            {loadError}
          </div>
        ) : !bundle || !bundle.client ? (
          <div className="p-8 border border-[rgba(23,23,23,0.13)] bg-[#FFFFFF] rounded-[6px] text-center space-y-2">
            <h1 className="av-display text-[1.75rem] text-[#171717]">
              Vista de cliente no encontrada
            </h1>
            <p className="text-[0.875rem] text-[#5C5B57]">
              Selecciona uno de los ejemplos de demostración en la barra superior.
            </p>
          </div>
        ) : !bundle.activeProject ? (
          <section className="border border-[rgba(23,23,23,0.13)] bg-[#FFFFFF] rounded-[6px] p-8 space-y-4">
            <span className="text-[0.75rem] font-semibold tracking-[0.08em] text-[#9E4A28]">
              Portal del cliente · {bundle.client.businessName}
            </span>
            <h1 className="av-display text-[2.1rem] text-[#171717]">
              Aún no hay un proyecto activo publicado en este espacio.
            </h1>
            <p className="text-[0.9375rem] text-[#5C5B57] max-w-[60ch]">
              Cuando iniciemos formalmente tu sitio web, aquí aparecerán el resumen de alcance, las etapas completadas y pendientes, los enlaces de vista previa, los archivos compartidos y el estado de pagos verificados.
            </p>
            <div className="pt-2">
              <a
                href={STUDIO_CONTACT.whatsappBaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-[0.875rem] font-semibold bg-[#9E4A28] text-[#FFFFFF] rounded-[4px]"
              >
                Escribir a Anderson Vallejo por WhatsApp
              </a>
            </div>
          </section>
        ) : (
          <>
            {/* 1. Resumen del proyecto + 2. Estado y avance + 5. Vista previa */}
            <section
              id="resumen-proyecto"
              className="border border-[rgba(23,23,23,0.13)] bg-[#FFFFFF] rounded-[6px] p-5 sm:p-6 lg:p-8 space-y-5"
            >
              {bundle.projects.length > 1 ? (
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[rgba(23,23,23,0.1)] text-[0.8125rem]">
                  <span className="font-medium text-[#5C5B57]">
                    Proyectos de {bundle.client.businessName} ({bundle.projects.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {bundle.projects.map((proj) => {
                      const active = proj.id === bundle.activeProject?.id;
                      return (
                        <button
                          key={proj.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setSelectedProjectId(proj.id)}
                          className={`px-3 py-1.5 rounded-[4px] border font-medium transition-colors ${
                            active
                              ? 'bg-[#171717] text-[#F3F0E9] border-[#171717]'
                              : 'bg-[#FAF8F4] text-[#30302E] border-[rgba(23,23,23,0.13)] hover:border-[#171717]'
                          }`}
                        >
                          {proj.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-4 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[0.8125rem] font-semibold text-[#9E4A28] av-mono">
                      {bundle.activeProject.code} · {bundle.activeProject.sector} · {bundle.client.businessName}
                    </p>
                    {activeStatusBadge ? (
                      <StatusLabel label={activeStatusBadge.label} tone={activeStatusBadge.tone} />
                    ) : null}
                  </div>
                  <h1 className="av-display text-[2.1rem] lg:text-[2.75rem] text-[#171717]">
                    {bundle.activeProject.name}
                  </h1>
                  <p className="text-[0.96875rem] text-[#30302E] leading-relaxed max-w-[62ch]">
                    {bundle.activeProject.summary}
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-[0.8125rem] text-[#5C5B57]">
                    <span>
                      Inicio: <strong className="av-mono text-[#171717]">{formatShortDate(bundle.activeProject.startDate)}</strong>
                    </span>
                    <span>
                      Entrega estimada: <strong className="av-mono text-[#171717]">{formatShortDate(bundle.activeProject.estimatedLaunchDate)}</strong>
                    </span>
                    <span>
                      Dirección del proyecto: <strong className="text-[#171717]">{STUDIO_CONTACT.owner}</strong>
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-4 border border-[rgba(23,23,23,0.13)] bg-[#FAF8F4] rounded-[6px] p-6 space-y-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[0.8125rem] font-semibold text-[#5C5B57]">
                      Avance general
                    </span>
                    <span className="av-display text-[2.4rem] text-[#171717] av-tabular">
                      {bundle.progressPercent}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#E8E3D8] rounded-[2px] overflow-hidden">
                    <div
                      className="h-full bg-[#C96F4A]"
                      style={{ width: `${bundle.progressPercent}%` }}
                    />
                  </div>
                  <p className="text-[0.8125rem] text-[#30302E]">
                    {completedStages.length} de {bundle.activeProject.stages.length} etapas completadas ·{' '}
                    {activeStatusBadge?.label || 'En curso'}
                  </p>

                  {bundle.activeProject.previewUrl ? (
                    <a
                      href={bundle.activeProject.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[0.875rem] font-semibold bg-[#171717] text-[#F3F0E9] rounded-[4px] hover:bg-[#9E4A28] transition-colors"
                    >
                      <span>Abrir enlace de vista previa</span>
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                  ) : (
                    <p className="text-[0.8125rem] text-[#5C5B57] pt-1">
                      El enlace de vista previa aparecerá aquí cuando se publique la primera versión navegable.
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* 3. Etapas completadas y pendientes + 4. Actualizaciones de AV·STUDIO */}
            <section id="etapas-avance" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 border border-[rgba(23,23,23,0.13)] bg-[#FFFFFF] rounded-[6px] p-6 space-y-6">
                <div className="pb-3 border-b border-[rgba(23,23,23,0.13)]">
                  <h2 className="av-display text-[1.7rem] text-[#171717]">
                    Etapas completadas y pendientes
                  </h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <h3 className="text-[0.8125rem] font-semibold text-[#166534] mb-2.5">
                      Completadas ({completedStages.length})
                    </h3>
                    <ul className="divide-y divide-[rgba(23,23,23,0.08)]">
                      {completedStages.map((st) => (
                        <li key={st.id} className="py-3 flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 sm:gap-4">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <CheckCircle2 className="h-4 w-4 text-[#166534] mt-0.5 shrink-0" aria-hidden="true" />
                            <div className="min-w-0">
                              <p className="font-semibold text-[0.875rem] text-[#171717]">
                                {String(st.order).padStart(2, '0')}. {st.title}
                              </p>
                              <p className="text-[0.8125rem] text-[#5C5B57]">{st.description}</p>
                            </div>
                          </div>
                          <span className="av-mono text-[0.75rem] text-[#5C5B57] whitespace-nowrap pl-6 sm:pl-0">
                            {formatShortDate(st.targetDate)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-[rgba(23,23,23,0.13)]">
                    <h3 className="text-[0.8125rem] font-semibold text-[#9E4A28] mb-2.5">
                      Pendientes ({pendingStages.length})
                    </h3>
                    {pendingStages.length === 0 ? (
                      <p className="text-[0.875rem] text-[#5C5B57]">
                        Todas las etapas del proyecto han sido completadas.
                      </p>
                    ) : (
                      <ul className="divide-y divide-[rgba(23,23,23,0.08)]">
                        {pendingStages.map((st) => (
                          <li key={st.id} className="py-3 flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 sm:gap-4">
                            <div className="flex items-start gap-2.5 min-w-0">
                              <Circle className="h-4 w-4 text-[#9E4A28] mt-0.5 shrink-0" aria-hidden="true" />
                              <div className="min-w-0">
                                <p className="font-semibold text-[0.875rem] text-[#171717]">
                                  {String(st.order).padStart(2, '0')}. {st.title}
                                </p>
                                <p className="text-[0.8125rem] text-[#5C5B57]">{st.description}</p>
                              </div>
                            </div>
                            <span className="av-mono text-[0.75rem] text-[#5C5B57] whitespace-nowrap pl-6 sm:pl-0">
                              {formatShortDate(st.targetDate)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 border border-[rgba(23,23,23,0.13)] bg-[#FAF8F4] rounded-[6px] p-6 space-y-4">
                <div className="pb-3 border-b border-[rgba(23,23,23,0.13)]">
                  <h2 className="av-display text-[1.7rem] text-[#171717]">
                    Actualizaciones de AV·STUDIO
                  </h2>
                </div>

                {bundle.updates.length === 0 ? (
                  <p className="text-[0.875rem] text-[#5C5B57]">
                    Aún no se han compartido novedades en esta bitácora.
                  </p>
                ) : (
                  <ul className="divide-y divide-[rgba(23,23,23,0.1)]">
                    {bundle.updates.map((upd) => (
                      <li key={upd.id} className="py-4 first:pt-1 space-y-1.5">
                        <p className="av-mono text-[0.75rem] text-[#9E4A28]">
                          {formatShortDate(upd.publishedAt)} · {upd.stageLabel}
                        </p>
                        <h3 className="font-semibold text-[0.9375rem] text-[#171717]">
                          {upd.title}
                        </h3>
                        <p className="text-[0.875rem] text-[#30302E] leading-relaxed">
                          {upd.message}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            {/* 6. Información de su propuesta + 7. Estado de sus pagos */}
            <section id="propuesta-pagos" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-6 border border-[rgba(23,23,23,0.13)] bg-[#FFFFFF] rounded-[6px] p-6 space-y-4">
                <div className="flex items-baseline justify-between gap-2 pb-3 border-b border-[rgba(23,23,23,0.13)]">
                  <h2 className="av-display text-[1.65rem] text-[#171717]">
                    Información de tu propuesta
                  </h2>
                  {bundle.proposal ? (
                    <span className="av-mono text-[0.75rem] text-[#9E4A28]">
                      {bundle.proposal.code}
                    </span>
                  ) : null}
                </div>

                {bundle.proposal && proposalTotals ? (
                  <div className="space-y-4">
                    <p className="font-semibold text-[#171717]">{bundle.proposal.title}</p>
                    <ul className="divide-y divide-[rgba(23,23,23,0.08)] text-[0.875rem]">
                      {bundle.proposal.items.map((item) => (
                        <li key={item.id} className="py-2.5 flex justify-between gap-4">
                          <div>
                            <p className="font-medium text-[#171717]">{item.title}</p>
                            <p className="text-[0.8125rem] text-[#5C5B57]">{item.detail}</p>
                          </div>
                          <span className="av-mono font-medium text-[#171717] whitespace-nowrap">
                            {formatUsd(item.amountUsd)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-3 border-t border-[rgba(23,23,23,0.13)] flex flex-wrap justify-between gap-4 text-[0.875rem]">
                      <span>
                        Total acordado:{' '}
                        <strong className="av-mono text-[#171717]">
                          {formatUsd(proposalTotals.subtotalUsd)}
                        </strong>
                      </span>
                      <span className="text-[#5C5B57]">Plazo: {bundle.proposal.estimatedWeeks}</span>
                    </div>
                    <p className="text-[0.8125rem] text-[#5C5B57]">{bundle.proposal.conditions}</p>
                  </div>
                ) : (
                  <p className="text-[0.875rem] text-[#5C5B57]">
                    No hay una propuesta vinculada todavía.
                  </p>
                )}
              </div>

              <div className="lg:col-span-6 border border-[rgba(23,23,23,0.13)] bg-[#FFFFFF] rounded-[6px] p-6 space-y-4">
                <div className="pb-3 border-b border-[rgba(23,23,23,0.13)]">
                  <h2 className="av-display text-[1.65rem] text-[#171717]">
                    Estado de pagos
                  </h2>
                  <p className="text-[0.8125rem] text-[#5C5B57] mt-0.5">
                    Verificación manual por transferencia directa con AV·STUDIO.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#FAF8F4] border border-[rgba(23,23,23,0.1)] rounded-[4px]">
                  <div>
                    <span className="block text-[0.75rem] text-[#5C5B57]">Verificado manualmente</span>
                    <span className="av-display text-[1.65rem] text-[#166534] av-tabular">
                      {formatUsd(bundle.paidVerifiedUsd)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[0.75rem] text-[#5C5B57]">Saldo por confirmar</span>
                    <span className="av-display text-[1.65rem] text-[#171717] av-tabular">
                      {formatUsd(bundle.pendingBalanceUsd)}
                    </span>
                  </div>
                </div>

                <ul className="divide-y divide-[rgba(23,23,23,0.08)] text-[0.875rem]">
                  {bundle.payments.map((pm) => (
                    <li key={pm.id} className="py-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-[#171717]">{pm.concept}</p>
                        <p className="av-mono text-[0.75rem] text-[#5C5B57]">
                          Ref: {pm.referenceCode} · {formatShortDate(pm.recordedAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="av-mono font-medium text-[#171717]">{formatUsd(pm.amountUsd)}</p>
                        <StatusLabel
                          label={
                            pm.status === 'verificado'
                              ? 'Verificado'
                              : pm.status === 'observado'
                                ? 'Observado'
                                : 'Pendiente verificación'
                          }
                          tone={
                            pm.status === 'verificado'
                              ? 'success'
                              : pm.status === 'observado'
                                ? 'danger'
                                : 'warning'
                          }
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 8. Archivos compartidos + 9. Información de contacto del estudio */}
            <section id="archivos-contacto" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 border border-[rgba(23,23,23,0.13)] bg-[#FFFFFF] rounded-[6px] p-6 space-y-4">
                <div className="pb-3 border-b border-[rgba(23,23,23,0.13)]">
                  <h2 className="av-display text-[1.65rem] text-[#171717]">
                    Archivos compartidos
                  </h2>
                  <p className="text-[0.8125rem] text-[#5C5B57] mt-0.5">
                    Documentos y guías preparadas para tu proyecto (descarga firmada disponible al conectar Supabase Storage).
                  </p>
                </div>

                {bundle.files.length === 0 ? (
                  <p className="text-[0.875rem] text-[#5C5B57]">
                    Aún no hay archivos compartidos en este proyecto.
                  </p>
                ) : (
                  <ul className="divide-y divide-[rgba(23,23,23,0.08)]">
                    {bundle.files.map((file) => (
                      <li key={file.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <FileText className="h-4 w-4 text-[#9E4A28] mt-1 shrink-0" aria-hidden="true" />
                          <div className="min-w-0">
                            <p className="font-semibold text-[0.875rem] text-[#171717] break-all">
                              {file.fileName}
                            </p>
                            <p className="text-[0.8125rem] text-[#5C5B57]">
                              {file.mimeLabel} · {file.sizeLabel} · {formatShortDate(file.sharedAt)}
                            </p>
                          </div>
                        </div>
                        <span className="av-mono text-[0.75rem] text-[#5C5B57]">
                          Vista previa visual
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <aside className="lg:col-span-5 border border-[rgba(23,23,23,0.13)] bg-[#171717] text-[#F3F0E9] rounded-[6px] p-6 space-y-5">
                <StudioBrandMark variant="light" showSignature compact />
                <div className="space-y-2">
                  <h2 className="av-display text-[1.6rem] text-[#F3F0E9]">
                    Contacto directo del estudio
                  </h2>
                  <p className="text-[0.875rem] text-[#B8B5AE]">
                    Atención personalizada desde {STUDIO_CONTACT.city} para dudas, revisiones o envío de comprobantes.
                  </p>
                </div>
                <div className="space-y-2.5 pt-2 border-t border-[rgba(243,240,233,0.14)] text-[0.875rem]">
                  <a
                    href={STUDIO_CONTACT.whatsappBaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-[#F3F0E9] hover:text-[#C96F4A]"
                  >
                    <MessageSquare className="h-4 w-4 text-[#C96F4A] shrink-0" aria-hidden="true" />
                    <span>WhatsApp: {STUDIO_CONTACT.whatsappDisplay}</span>
                  </a>
                  <a
                    href={`mailto:${STUDIO_CONTACT.email}`}
                    className="flex items-center gap-2.5 text-[#F3F0E9] hover:text-[#C96F4A]"
                  >
                    <Mail className="h-4 w-4 text-[#C96F4A] shrink-0" aria-hidden="true" />
                    <span className="break-all">{STUDIO_CONTACT.email}</span>
                  </a>
                </div>
              </aside>
            </section>
          </>
        )}
      </main>

      <footer className="border-t border-[rgba(23,23,23,0.13)] bg-[#FAF8F4] py-5 px-5 lg:px-8 text-[0.8125rem] text-[#5C5B57]">
        <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <span>AV·STUDIO · {STUDIO_CONTACT.owner} · {STUDIO_CONTACT.slogan}</span>
          <a href="/index.html" className="font-semibold text-[#171717] hover:text-[#9E4A28]">
            Volver al sitio público →
          </a>
        </div>
      </footer>
    </div>
  );
};
