import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { filterLeads, formatShortDate } from '../platform/formatters';
import { StatusLabel, type StatusTone } from '../platform/StatusLabel';
import type { Lead, LeadStatus } from '../platform/types';

interface LeadsModuleProps {
  leads: Lead[];
  onUpdateLeadStatus: (leadId: string, nextStatus: LeadStatus) => void;
  onStartProposalFromLead: (lead: Lead) => void;
}

const STATUS_OPTIONS: { value: LeadStatus | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'en_revision', label: 'En revisión' },
  { value: 'propuesta_enviada', label: 'Propuesta enviada' },
  { value: 'convertido', label: 'Convertido' },
  { value: 'archivado', label: 'Archivado' },
];

const STATUS_META: Record<LeadStatus, { label: string; tone: StatusTone }> = {
  nuevo: { label: 'Nuevo', tone: 'accent' },
  en_revision: { label: 'En revisión', tone: 'warning' },
  propuesta_enviada: { label: 'Propuesta enviada', tone: 'neutral' },
  convertido: { label: 'Convertido', tone: 'success' },
  archivado: { label: 'Archivado', tone: 'neutral' },
};

export const LeadsModule: React.FC<LeadsModuleProps> = ({
  leads,
  onUpdateLeadStatus,
  onStartProposalFromLead,
}) => {
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'todos'>('todos');
  const [query, setQuery] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || '');
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const filtered = useMemo(
    () => filterLeads(leads, query, statusFilter),
    [leads, query, statusFilter]
  );

  const selectedLead =
    filtered.find((l) => l.id === selectedLeadId) || filtered[0] || null;

  const handleStatusChange = (leadId: string, nextStatus: LeadStatus) => {
    onUpdateLeadStatus(leadId, nextStatus);
    const label = STATUS_META[nextStatus]?.label || nextStatus;
    setStatusFeedback(`Estado actualizado a "${label}" (cambio temporal en memoria).`);
  };

  return (
    <div className="space-y-6">
      {/* Filter & Search Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[rgba(23,23,23,0.13)]">
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filtrar solicitudes por estado">
          {STATUS_OPTIONS.map((opt) => {
            const active = statusFilter === opt.value;
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
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-72">
          <label htmlFor="leads-search" className="sr-only">
            Buscar solicitud por nombre, negocio o sector
          </label>
          <Search
            className="h-4 w-4 text-[#5C5B57] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="leads-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar negocio, sector o tipo..."
            className="w-full pl-9 pr-3 py-2 text-[0.875rem] bg-[#FFFFFF] border border-[rgba(23,23,23,0.2)] rounded-[4px] text-[#171717] placeholder:text-[#5C5B57]"
          />
        </div>
      </div>

      {/* Inbox + Detail View */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <section className="xl:col-span-7 border border-[rgba(23,23,23,0.13)] bg-[#FFFFFF] rounded-[6px] overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <p className="font-semibold text-[#171717]">
                No hay solicitudes que coincidan con este filtro.
              </p>
              <p className="text-[0.875rem] text-[#5C5B57]">
                Limpia la búsqueda o cambia el estado seleccionado para revisar los ejemplos de la bandeja.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setStatusFilter('todos');
                }}
                className="px-4 py-2 text-[0.8125rem] font-semibold bg-[#171717] text-[#F3F0E9] rounded-[4px]"
              >
                Mostrar todas las solicitudes
              </button>
            </div>
          ) : (
            <>
              {/* Mobile stacked card list */}
              <ul className="md:hidden divide-y divide-[rgba(23,23,23,0.08)]">
                {filtered.map((lead) => {
                  const isSelected = selectedLead?.id === lead.id;
                  const meta = STATUS_META[lead.status];
                  return (
                    <li key={lead.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedLeadId(lead.id);
                          setStatusFeedback(null);
                        }}
                        className={`w-full text-left p-4 space-y-2 transition-colors ${
                          isSelected ? 'bg-[#F3F0E9]' : 'hover:bg-[#FAF8F4]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <span className="block font-semibold text-[#171717] text-[0.9375rem]">
                              {lead.business}
                            </span>
                            <span className="block text-[0.8125rem] text-[#5C5B57]">
                              {lead.name} · {formatShortDate(lead.receivedAt)}
                            </span>
                          </div>
                          <StatusLabel label={meta.label} tone={meta.tone} />
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[0.8125rem] text-[#30302E]">
                          <span>{lead.sector}</span>
                          <span className="av-mono font-medium text-[#171717]">{lead.budget}</span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Desktop/Tablet table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[rgba(23,23,23,0.13)] bg-[#FAF8F4] text-[0.75rem] font-semibold text-[#5C5B57]">
                      <th className="py-3 px-4">Solicitud</th>
                      <th className="py-3 px-4">Sector</th>
                      <th className="py-3 px-4">Presupuesto</th>
                      <th className="py-3 px-4 text-right">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(23,23,23,0.08)] text-[0.875rem]">
                    {filtered.map((lead) => {
                      const isSelected = selectedLead?.id === lead.id;
                      const meta = STATUS_META[lead.status];
                      return (
                        <tr
                          key={lead.id}
                          className={`transition-colors ${
                            isSelected ? 'bg-[#F3F0E9]' : 'hover:bg-[#FAF8F4]'
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedLeadId(lead.id);
                                setStatusFeedback(null);
                              }}
                              className="text-left w-full focus-visible:underline"
                            >
                              <span className="block font-semibold text-[#171717]">
                                {lead.business}
                              </span>
                              <span className="block text-[0.8125rem] text-[#5C5B57]">
                                {lead.name} · {formatShortDate(lead.receivedAt)}
                              </span>
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-[#30302E]">{lead.sector}</td>
                          <td className="py-3.5 px-4 av-mono text-[0.8125rem] text-[#30302E] whitespace-nowrap">
                            {lead.budget}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <StatusLabel label={meta.label} tone={meta.tone} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        <aside className="xl:col-span-5 border border-[rgba(23,23,23,0.13)] bg-[#FAF8F4] rounded-[6px] p-5 sm:p-6">
          {selectedLead ? (
            <div className="space-y-5">
              <div className="pb-4 border-b border-[rgba(23,23,23,0.13)]">
                <p className="av-mono text-[0.75rem] text-[#9E4A28] mb-1">
                  Ficha de solicitud · Datos ficticios de muestra
                </p>
                <h2 className="av-display text-[1.75rem] text-[#171717]">
                  {selectedLead.business}
                </h2>
                <p className="text-[0.875rem] text-[#5C5B57] mt-1">
                  Contacto: {selectedLead.name} · Recibido el {formatShortDate(selectedLead.receivedAt)}
                </p>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-[0.875rem]">
                <div>
                  <dt className="text-[0.75rem] font-semibold text-[#5C5B57]">Sector</dt>
                  <dd className="text-[#171717] font-medium">{selectedLead.sector}</dd>
                </div>
                <div>
                  <dt className="text-[0.75rem] font-semibold text-[#5C5B57]">Tipo de sitio</dt>
                  <dd className="text-[#171717] font-medium">{selectedLead.pageType}</dd>
                </div>
                <div>
                  <dt className="text-[0.75rem] font-semibold text-[#5C5B57]">Presupuesto estimado</dt>
                  <dd className="av-mono text-[#171717]">{selectedLead.budget}</dd>
                </div>
                <div>
                  <dt className="text-[0.75rem] font-semibold text-[#5C5B57]">Plazo deseado</dt>
                  <dd className="text-[#171717]">{selectedLead.desiredTimeline}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[0.75rem] font-semibold text-[#5C5B57]">
                    Canal preferido ({selectedLead.contactChannel})
                  </dt>
                  <dd className="text-[#171717] break-all">{selectedLead.contactValue}</dd>
                </div>
              </dl>

              <div className="pt-3 border-t border-[rgba(23,23,23,0.1)] space-y-3">
                <div>
                  <h3 className="text-[0.75rem] font-semibold text-[#5C5B57] mb-1">
                    Descripción enviada en el formulario
                  </h3>
                  <p className="text-[0.9rem] text-[#171717] leading-relaxed">
                    {selectedLead.description}
                  </p>
                </div>
                {selectedLead.internalNotes ? (
                  <div>
                    <h3 className="text-[0.75rem] font-semibold text-[#5C5B57] mb-1">
                      Notas internas de seguimiento
                    </h3>
                    <p className="text-[0.8125rem] text-[#30302E] leading-relaxed">
                      {selectedLead.internalNotes}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="pt-3 border-t border-[rgba(23,23,23,0.1)] space-y-2">
                <label
                  htmlFor="lead-status-select"
                  className="block text-[0.75rem] font-semibold text-[#5C5B57]"
                >
                  Cambiar estado (solo vista en memoria)
                </label>
                <select
                  id="lead-status-select"
                  value={selectedLead.status}
                  onChange={(e) =>
                    handleStatusChange(selectedLead.id, e.target.value as LeadStatus)
                  }
                  className="w-full px-3 py-2 text-[0.875rem] bg-[#FFFFFF] border border-[rgba(23,23,23,0.2)] rounded-[4px] text-[#171717]"
                >
                  {STATUS_OPTIONS.filter((o) => o.value !== 'todos').map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {statusFeedback ? (
                  <p role="status" className="text-[0.78rem] text-[#166534] font-medium">
                    {statusFeedback}
                  </p>
                ) : null}
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onStartProposalFromLead(selectedLead)}
                  className="w-full sm:w-auto px-4 py-2.5 text-[0.875rem] font-semibold bg-[#9E4A28] text-[#FFFFFF] rounded-[4px] hover:bg-[#171717] transition-colors"
                >
                  Preparar borrador de propuesta
                </button>
              </div>
            </div>
          ) : (
            <p className="text-[0.875rem] text-[#5C5B57]">
              Selecciona una solicitud para inspeccionar sus detalles.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
};
