import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  calculateProposalTotals,
  formatShortDate,
  formatUsd,
  validateProposalDraft,
} from '../platform/formatters';
import { StatusLabel, type StatusTone } from '../platform/StatusLabel';
import type { Client, Lead, Proposal, ProposalItem, ProposalStatus } from '../platform/types';

interface ProposalsModuleProps {
  proposals: Proposal[];
  clients: Client[];
  prefillLead: Lead | null;
  onCreateProposal: (proposal: Proposal) => void;
  onUpdateProposalStatus: (proposalId: string, nextStatus: ProposalStatus) => void;
  onClearPrefillLead: () => void;
}

const PROPOSAL_STATUS_META: Record<ProposalStatus, { label: string; tone: StatusTone }> = {
  borrador: { label: 'Borrador', tone: 'neutral' },
  enviada: { label: 'Enviada', tone: 'accent' },
  aprobada: { label: 'Aprobada', tone: 'success' },
  requiere_ajustes: { label: 'Requiere ajustes', tone: 'warning' },
};

const PROPOSAL_STATUS_OPTIONS: { value: ProposalStatus | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todas' },
  { value: 'borrador', label: 'Borrador' },
  { value: 'enviada', label: 'Enviada' },
  { value: 'aprobada', label: 'Aprobada' },
  { value: 'requiere_ajustes', label: 'Requiere ajustes' },
];

export const ProposalsModule: React.FC<ProposalsModuleProps> = ({
  proposals,
  clients,
  prefillLead,
  onCreateProposal,
  onUpdateProposalStatus,
  onClearPrefillLead,
}) => {
  const [selectedId, setSelectedId] = useState<string>(proposals[0]?.id || '');
  const [statusFilter, setStatusFilter] = useState<ProposalStatus | 'todos'>('todos');
  const [showBuilder, setShowBuilder] = useState<boolean>(Boolean(prefillLead));
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const [clientId, setClientId] = useState<string>(clients[0]?.id || '');
  const [title, setTitle] = useState<string>(
    prefillLead ? `Propuesta web · ${prefillLead.business}` : ''
  );
  const [sector, setSector] = useState<string>(prefillLead?.sector || 'Restaurante');
  const [depositPercent, setDepositPercent] = useState<number>(50);
  const [estimatedWeeks, setEstimatedWeeks] = useState<string>('3 a 4 semanas');
  const [validUntil, setValidUntil] = useState<string>('2026-12-30');
  const [conditions, setConditions] = useState<string>(
    '50% de anticipo al aprobar el presupuesto y 50% al aprobar la vista previa final antes de publicar.'
  );
  const [items, setItems] = useState<ProposalItem[]>([
    {
      id: 'draft-item-1',
      title: 'Dirección visual y portada a medida',
      detail: 'Sistema tipográfico, paleta propia y arquitectura inicial.',
      amountUsd: 320,
    },
    {
      id: 'draft-item-2',
      title: 'Secciones de catálogo / servicios y contacto',
      detail: 'Diseño responsive y enlace directo a WhatsApp y correo.',
      amountUsd: 240,
    },
  ]);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!prefillLead) return;
    setShowBuilder(true);
    setTitle(`Propuesta web · ${prefillLead.business}`);
    setSector(prefillLead.sector || 'Otro');
    setErrors([]);
  }, [prefillLead]);

  const filteredProposals =
    statusFilter === 'todos'
      ? proposals
      : proposals.filter((p) => p.status === statusFilter);

  const selectedProposal =
    filteredProposals.find((p) => p.id === selectedId) || filteredProposals[0] || null;
  const clientById = new Map(clients.map((c) => [c.id, c]));
  const draftTotals = calculateProposalTotals(items, depositPercent);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `draft-item-${Date.now()}`,
        title: '',
        detail: '',
        amountUsd: 100,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateProposalDraft({
      clientId,
      title,
      sector,
      depositPercent,
      estimatedWeeks,
      validUntil,
      conditions,
      items,
    });
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    const newProp: Proposal = {
      id: `prop-demo-${Date.now()}`,
      code: `PRP-DEMO-${String(proposals.length + 1).padStart(2, '0')}`,
      clientId,
      leadId: prefillLead?.id,
      proposalGroupId: `grp-demo-${Date.now()}`,
      versionNumber: 1,
      title: title.trim(),
      sector: sector.trim() || 'Otro',
      items: items.filter((i) => i.title.trim().length > 0),
      depositPercent,
      validUntil,
      estimatedWeeks,
      conditions,
      status: 'borrador',
      issuedAt: '2026-11-18',
      isDemoData: true,
    };

    onCreateProposal(newProp);
    setSelectedId(newProp.id);
    setStatusFilter('todos');
    setShowBuilder(false);
    setErrors([]);
    setFeedbackMessage(`Borrador ${newProp.code} añadido temporalmente en memoria.`);
    if (prefillLead) onClearPrefillLead();
  };

  const handleCloseBuilder = () => {
    setShowBuilder(false);
    setErrors([]);
    if (prefillLead) onClearPrefillLead();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[rgba(23,23,23,0.13)]">
        <p className="text-[0.875rem] text-[#5C5B57] max-w-[68ch]">
          Visualización de presupuestos, entregables, anticipo y saldo. Los borradores creados aquí viven temporalmente en memoria.
        </p>
        <button
          type="button"
          onClick={() => {
            if (showBuilder) {
              handleCloseBuilder();
            } else {
              setFeedbackMessage(null);
              setShowBuilder(true);
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-[0.875rem] font-semibold bg-[#171717] text-[#F3F0E9] rounded-[4px] hover:bg-[#9E4A28] transition-colors whitespace-nowrap"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>{showBuilder ? 'Ver documento seleccionado' : 'Crear propuesta de muestra'}</span>
        </button>
      </div>

      {!showBuilder ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filtrar propuestas por estado">
            {PROPOSAL_STATUS_OPTIONS.map((opt) => {
              const active = statusFilter === opt.value;
              const count =
                opt.value === 'todos'
                  ? proposals.length
                  : proposals.filter((p) => p.status === opt.value).length;
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setStatusFilter(opt.value)}
                  className={`px-3.5 py-2 text-[0.8125rem] font-medium rounded-[4px] border transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#171717] text-[#F3F0E9] border-[#171717]'
                      : 'bg-[#FAF8F4] text-[#30302E] border-[rgba(23,23,23,0.13)] hover:border-[#171717]'
                  }`}
                >
                  {opt.label} ({count})
                </button>
              );
            })}
          </div>
          {feedbackMessage ? (
            <p role="status" className="text-[0.8125rem] font-medium text-[#166534]">
              {feedbackMessage}
            </p>
          ) : null}
        </div>
      ) : null}

      {showBuilder ? (
        <form
          onSubmit={handleSubmit}
          className="border border-[rgba(23,23,23,0.13)] bg-[#FFFFFF] rounded-[6px] p-6 space-y-6"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4 border-b border-[rgba(23,23,23,0.13)]">
            <h2 className="av-display text-[1.75rem] text-[#171717]">
              Constructor de propuesta comercial (demo visual)
            </h2>
            {prefillLead ? (
              <span className="text-[0.8125rem] font-semibold text-[#9E4A28]">
                Prellenado desde solicitud: {prefillLead.business}
              </span>
            ) : null}
          </div>

          {errors.length > 0 ? (
            <div
              role="alert"
              className="p-4 border border-[#991B1B] bg-[#FEF2F2] text-[#991B1B] rounded-[4px] text-[0.875rem] space-y-1"
            >
              {errors.map((err) => (
                <p key={err}>{err}</p>
              ))}
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="prop-client" className="block text-[0.75rem] font-semibold text-[#5C5B57] mb-1">
                Cliente vinculado *
              </label>
              <select
                id="prop-client"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-3 py-2 text-[0.875rem] bg-[#FAF8F4] border border-[rgba(23,23,23,0.2)] rounded-[4px]"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.businessName}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="prop-title" className="block text-[0.75rem] font-semibold text-[#5C5B57] mb-1">
                Título de la propuesta *
              </label>
              <input
                id="prop-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Diseño web personalizado · Restaurante"
                className="w-full px-3 py-2 text-[0.875rem] bg-[#FAF8F4] border border-[rgba(23,23,23,0.2)] rounded-[4px]"
              />
            </div>

            <div>
              <label htmlFor="prop-deposit" className="block text-[0.75rem] font-semibold text-[#5C5B57] mb-1">
                Anticipo (%)
              </label>
              <input
                id="prop-deposit"
                type="number"
                min={0}
                max={100}
                value={depositPercent}
                onChange={(e) => setDepositPercent(Number(e.target.value))}
                className="w-full px-3 py-2 text-[0.875rem] av-mono bg-[#FAF8F4] border border-[rgba(23,23,23,0.2)] rounded-[4px]"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[0.875rem] font-semibold text-[#171717]">
                Entregables y desglose en USD
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-[0.8125rem] font-semibold text-[#9E4A28] hover:underline"
              >
                + Añadir entregable
              </button>
            </div>

            {items.map((item, idx) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3.5 bg-[#FAF8F4] border border-[rgba(23,23,23,0.1)] rounded-[4px] items-start"
              >
                <div className="md:col-span-4">
                  <label className="block text-[0.7rem] font-semibold text-[#5C5B57] mb-1">
                    Entregable #{idx + 1}
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) =>
                      setItems((prev) =>
                        prev.map((p) => (p.id === item.id ? { ...p, title: e.target.value } : p))
                      )
                    }
                    placeholder="Nombre del entregable"
                    className="w-full px-2.5 py-1.5 text-[0.875rem] bg-[#FFFFFF] border border-[rgba(23,23,23,0.18)] rounded-[4px]"
                  />
                </div>
                <div className="md:col-span-5">
                  <label className="block text-[0.7rem] font-semibold text-[#5C5B57] mb-1">
                    Alcance incluido
                  </label>
                  <input
                    type="text"
                    value={item.detail}
                    onChange={(e) =>
                      setItems((prev) =>
                        prev.map((p) => (p.id === item.id ? { ...p, detail: e.target.value } : p))
                      )
                    }
                    placeholder="Detalle breve del entregable"
                    className="w-full px-2.5 py-1.5 text-[0.875rem] bg-[#FFFFFF] border border-[rgba(23,23,23,0.18)] rounded-[4px]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[0.7rem] font-semibold text-[#5C5B57] mb-1">
                    Valor (USD)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="10"
                    value={item.amountUsd}
                    onChange={(e) =>
                      setItems((prev) =>
                        prev.map((p) =>
                          p.id === item.id ? { ...p, amountUsd: Number(e.target.value) } : p
                        )
                      )
                    }
                    className="w-full px-2.5 py-1.5 text-[0.875rem] av-mono bg-[#FFFFFF] border border-[rgba(23,23,23,0.18)] rounded-[4px]"
                  />
                </div>
                <div className="md:col-span-1 flex md:justify-end pt-1 md:pt-5">
                  <button
                    type="button"
                    aria-label={`Quitar entregable ${idx + 1}`}
                    disabled={items.length <= 1}
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-2 text-[#5C5B57] hover:text-[#991B1B] disabled:opacity-35 disabled:pointer-events-none"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="prop-sector" className="block text-[0.75rem] font-semibold text-[#5C5B57] mb-1">
                Sector
              </label>
              <input
                id="prop-sector"
                type="text"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full px-3 py-2 text-[0.875rem] bg-[#FAF8F4] border border-[rgba(23,23,23,0.2)] rounded-[4px]"
              />
            </div>
            <div>
              <label htmlFor="prop-weeks" className="block text-[0.75rem] font-semibold text-[#5C5B57] mb-1">
                Plazo estimado
              </label>
              <input
                id="prop-weeks"
                type="text"
                value={estimatedWeeks}
                onChange={(e) => setEstimatedWeeks(e.target.value)}
                className="w-full px-3 py-2 text-[0.875rem] bg-[#FAF8F4] border border-[rgba(23,23,23,0.2)] rounded-[4px]"
              />
            </div>
            <div>
              <label htmlFor="prop-valid" className="block text-[0.75rem] font-semibold text-[#5C5B57] mb-1">
                Vigencia
              </label>
              <input
                id="prop-valid"
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full px-3 py-2 text-[0.875rem] av-mono bg-[#FAF8F4] border border-[rgba(23,23,23,0.2)] rounded-[4px]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="prop-cond" className="block text-[0.75rem] font-semibold text-[#5C5B57] mb-1">
              Condiciones comerciales
            </label>
            <textarea
              id="prop-cond"
              rows={2}
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
              className="w-full px-3 py-2 text-[0.875rem] bg-[#FAF8F4] border border-[rgba(23,23,23,0.2)] rounded-[4px]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[rgba(23,23,23,0.13)]">
            <div className="flex flex-wrap gap-6 text-[0.875rem]">
              <span>
                Total: <strong className="av-mono text-[#171717]">{formatUsd(draftTotals.subtotalUsd)}</strong>
              </span>
              <span>
                Anticipo ({draftTotals.depositPercent}%):{' '}
                <strong className="av-mono text-[#9E4A28]">{formatUsd(draftTotals.depositUsd)}</strong>
              </span>
              <span>
                Saldo: <strong className="av-mono text-[#171717]">{formatUsd(draftTotals.balanceUsd)}</strong>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleCloseBuilder}
                className="px-4 py-2 text-[0.875rem] font-medium border border-[rgba(23,23,23,0.2)] rounded-[4px]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-[0.875rem] font-semibold bg-[#9E4A28] text-[#FFFFFF] rounded-[4px] hover:bg-[#171717] transition-colors"
              >
                Previsualizar en listado (memoria)
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <section className="xl:col-span-5 border border-[rgba(23,23,23,0.13)] bg-[#FFFFFF] rounded-[6px] overflow-hidden">
            {filteredProposals.length === 0 ? (
              <div className="p-7 text-center space-y-3">
                <p className="text-[0.875rem] text-[#5C5B57]">
                  No hay propuestas en este estado.
                </p>
                <button
                  type="button"
                  onClick={() => setStatusFilter('todos')}
                  className="px-4 py-2 text-[0.8125rem] font-semibold bg-[#171717] text-[#F3F0E9] rounded-[4px]"
                >
                  Mostrar todas ({proposals.length})
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-[rgba(23,23,23,0.08)]">
                {filteredProposals.map((prop) => {
                  const totals = calculateProposalTotals(prop.items, prop.depositPercent);
                  const meta = PROPOSAL_STATUS_META[prop.status];
                  const isSelected = selectedProposal?.id === prop.id;
                  const client = clientById.get(prop.clientId);
                  return (
                    <li key={prop.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(prop.id);
                          setFeedbackMessage(null);
                        }}
                        className={`w-full text-left p-5 transition-colors space-y-2 ${
                          isSelected ? 'bg-[#F3F0E9]' : 'hover:bg-[#FAF8F4]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="av-mono text-[0.75rem] text-[#9E4A28]">
                            {prop.code} {prop.versionNumber ? `· v${prop.versionNumber}` : ''}
                          </span>
                          <StatusLabel label={meta.label} tone={meta.tone} />
                        </div>
                        <p className="font-semibold text-[#171717]">{prop.title}</p>
                        <div className="flex items-center justify-between text-[0.8125rem] text-[#5C5B57]">
                          <span>{client?.businessName || 'Cliente de ejemplo'}</span>
                          <span className="av-mono font-medium text-[#171717]">
                            {formatUsd(totals.subtotalUsd)}
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="xl:col-span-7 border border-[rgba(23,23,23,0.13)] bg-[#FFFFFF] rounded-[6px] p-5 sm:p-7">
            {selectedProposal ? (
              (() => {
                const totals = calculateProposalTotals(
                  selectedProposal.items,
                  selectedProposal.depositPercent
                );
                const client = clientById.get(selectedProposal.clientId);
                return (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[rgba(23,23,23,0.13)]">
                      <div className="min-w-0">
                        <p className="av-mono text-[0.75rem] text-[#9E4A28] mb-1">
                          AV·STUDIO · Propuesta de demostración ({selectedProposal.code})
                        </p>
                        <h2 className="av-display text-[1.75rem] sm:text-[1.95rem] text-[#171717]">
                          {selectedProposal.title}
                        </h2>
                        <p className="text-[0.875rem] text-[#5C5B57] mt-1">
                          Preparado para: {client?.businessName || 'Cliente de muestra'} · Sector {selectedProposal.sector}
                        </p>
                      </div>
                      <div className="sm:text-right text-[0.8125rem] text-[#5C5B57] av-mono">
                        <p>Emitida: {formatShortDate(selectedProposal.issuedAt)}</p>
                        <p>Válida hasta: {formatShortDate(selectedProposal.validUntil)}</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[rgba(23,23,23,0.13)] text-[0.75rem] font-semibold text-[#5C5B57]">
                            <th className="py-2.5 pr-4">Entregable incluido</th>
                            <th className="py-2.5 pl-4 text-right">Inversión (USD)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[rgba(23,23,23,0.08)] text-[0.875rem]">
                          {selectedProposal.items.map((item) => (
                            <tr key={item.id}>
                              <td className="py-3.5 pr-4">
                                <p className="font-semibold text-[#171717]">{item.title}</p>
                                <p className="text-[0.8125rem] text-[#5C5B57]">{item.detail}</p>
                              </td>
                              <td className="py-3.5 pl-4 text-right av-mono font-medium text-[#171717] whitespace-nowrap">
                                {formatUsd(item.amountUsd)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 border border-[rgba(23,23,23,0.13)] bg-[#FAF8F4] rounded-[4px] divide-y sm:divide-y-0 sm:divide-x divide-[rgba(23,23,23,0.13)]">
                      <div className="p-4">
                        <span className="text-[0.75rem] text-[#5C5B57] block">Total propuesta</span>
                        <span className="av-display text-[1.75rem] text-[#171717] av-tabular">
                          {formatUsd(totals.subtotalUsd)}
                        </span>
                      </div>
                      <div className="p-4">
                        <span className="text-[0.75rem] text-[#5C5B57] block">
                          Anticipo ({totals.depositPercent}%)
                        </span>
                        <span className="av-display text-[1.75rem] text-[#9E4A28] av-tabular">
                          {formatUsd(totals.depositUsd)}
                        </span>
                      </div>
                      <div className="p-4">
                        <span className="text-[0.75rem] text-[#5C5B57] block">Saldo contra entrega</span>
                        <span className="av-display text-[1.75rem] text-[#171717] av-tabular">
                          {formatUsd(totals.balanceUsd)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-[0.875rem] pt-2 border-t border-[rgba(23,23,23,0.1)]">
                      <p className="text-[#30302E]">
                        <strong className="text-[#171717]">Plazo estimado:</strong> {selectedProposal.estimatedWeeks}
                      </p>
                      <p className="text-[#30302E]">
                        <strong className="text-[#171717]">Condiciones:</strong> {selectedProposal.conditions}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[rgba(23,23,23,0.13)] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                      <div className="w-full sm:w-64">
                        <label
                          htmlFor="proposal-status-select"
                          className="block text-[0.75rem] font-semibold text-[#5C5B57] mb-1"
                        >
                          Estado de propuesta (en memoria)
                        </label>
                        <select
                          id="proposal-status-select"
                          value={selectedProposal.status}
                          onChange={(e) => {
                            const next = e.target.value as ProposalStatus;
                            onUpdateProposalStatus(selectedProposal.id, next);
                            setFeedbackMessage(
                              `Propuesta ${selectedProposal.code} marcada como "${PROPOSAL_STATUS_META[next].label}" en memoria.`
                            );
                          }}
                          className="w-full px-3 py-2 text-[0.875rem] bg-[#FAF8F4] border border-[rgba(23,23,23,0.2)] rounded-[4px]"
                        >
                          {(Object.keys(PROPOSAL_STATUS_META) as ProposalStatus[]).map((key) => (
                            <option key={key} value={key}>
                              {PROPOSAL_STATUS_META[key].label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <p className="text-[0.78rem] text-[#5C5B57]">
                        El versionado (<code className="av-mono">v{selectedProposal.versionNumber || 1}</code>) y envío real se activarán con Supabase.
                      </p>
                    </div>
                  </div>
                );
              })()
            ) : (
              <p className="text-[0.875rem] text-[#5C5B57]">
                Selecciona una propuesta de la lista o crea un borrador de muestra.
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
};
