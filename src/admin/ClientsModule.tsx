import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { formatShortDate, formatUsd, calculateProposalTotals } from '../platform/formatters';
import { StatusLabel, type StatusTone } from '../platform/StatusLabel';
import type { Client, Payment, Project, Proposal } from '../platform/types';

interface ClientsModuleProps {
  clients: Client[];
  projects: Project[];
  proposals: Proposal[];
  payments: Payment[];
}

const CLIENT_STATUS_META: Record<Client['status'], { label: string; tone: StatusTone }> = {
  activo: { label: 'Activo', tone: 'success' },
  pausa: { label: 'En pausa', tone: 'warning' },
  completado: { label: 'Completado', tone: 'neutral' },
};

const CLIENT_STATUS_OPTIONS: { value: Client['status'] | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'activo', label: 'Activos' },
  { value: 'pausa', label: 'En pausa' },
  { value: 'completado', label: 'Completados' },
];

const PAYMENT_KIND_LABEL: Record<Payment['kind'], string> = {
  anticipo: 'Anticipo',
  saldo: 'Saldo final',
  adicional: 'Alcance adicional',
};

const PAYMENT_STATUS_LABEL: Record<Payment['status'], string> = {
  verificado: 'Verificado manualmente',
  pendiente_verificacion: 'Pendiente verificación',
  observado: 'Observado',
};

export const ClientsModule: React.FC<ClientsModuleProps> = ({
  clients,
  projects,
  proposals,
  payments,
}) => {
  const [statusFilter, setStatusFilter] = useState<Client['status'] | 'todos'>('todos');
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');

  const filteredClients =
    statusFilter === 'todos'
      ? clients
      : clients.filter((client) => client.status === statusFilter);

  const selectedClient =
    filteredClients.find((c) => c.id === selectedClientId) || filteredClients[0] || null;
  const clientProjects = selectedClient
    ? projects.filter((p) => p.clientId === selectedClient.id)
    : [];
  const clientProposals = selectedClient
    ? proposals.filter((pr) => pr.clientId === selectedClient.id)
    : [];
  const clientPayments = selectedClient
    ? payments.filter((pm) => pm.clientId === selectedClient.id)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[rgba(23,23,23,0.13)]">
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filtrar clientes por estado">
          {CLIENT_STATUS_OPTIONS.map((opt) => {
            const active = statusFilter === opt.value;
            const count =
              opt.value === 'todos'
                ? clients.length
                : clients.filter((c) => c.status === opt.value).length;
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
        <p className="text-[0.8125rem] text-[#5C5B57]">
          Registros ficticios alineados a la futura tabla <code className="av-mono">clients</code>.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <section className="xl:col-span-5 border border-[rgba(23,23,23,0.13)] bg-[#FFFFFF] rounded-[6px] overflow-hidden">
          <div className="px-5 py-4 border-b border-[rgba(23,23,23,0.13)] bg-[#FAF8F4]">
            <h2 className="av-display text-[1.5rem] text-[#171717]">
              Directorio de clientes ({filteredClients.length})
            </h2>
            <p className="text-[0.8125rem] text-[#5C5B57] mt-0.5">
              Selecciona una ficha para revisar proyectos, propuestas y abonos vinculados.
            </p>
          </div>

          {filteredClients.length === 0 ? (
            <div className="p-6 text-center space-y-3">
              <p className="text-[0.875rem] text-[#5C5B57]">
                No hay clientes ficticios en este estado.
              </p>
              <button
                type="button"
                onClick={() => setStatusFilter('todos')}
                className="px-4 py-2 text-[0.8125rem] font-semibold bg-[#171717] text-[#F3F0E9] rounded-[4px]"
              >
                Ver todos ({clients.length})
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-[rgba(23,23,23,0.08)]">
              {filteredClients.map((client) => {
                const isSelected = selectedClient?.id === client.id;
                const statusMeta = CLIENT_STATUS_META[client.status];
                return (
                  <li key={client.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedClientId(client.id)}
                      className={`w-full text-left px-5 py-4 flex items-start justify-between gap-3 transition-colors ${
                        isSelected ? 'bg-[#F3F0E9]' : 'hover:bg-[#FAF8F4]'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-[#171717] text-[0.9375rem]">
                          {client.businessName}
                        </p>
                        <p className="text-[0.8125rem] text-[#5C5B57]">
                          {client.contactName} · {client.sector}
                        </p>
                      </div>
                      <StatusLabel label={statusMeta.label} tone={statusMeta.tone} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="xl:col-span-7 border border-[rgba(23,23,23,0.13)] bg-[#FAF8F4] rounded-[6px] p-5 sm:p-6">
          {selectedClient ? (
            <div className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[rgba(23,23,23,0.13)]">
                <div className="min-w-0">
                  <p className="av-mono text-[0.75rem] text-[#9E4A28] mb-1">
                    Ficha individual · Cliente ficticio de muestra
                  </p>
                  <h2 className="av-display text-[1.75rem] sm:text-[1.85rem] text-[#171717]">
                    {selectedClient.businessName}
                  </h2>
                  <p className="text-[0.875rem] text-[#5C5B57] mt-1">
                    {selectedClient.contactName} · {selectedClient.city}
                  </p>
                </div>

                <a
                  href={`/portal.html?demoClient=${encodeURIComponent(selectedClient.id)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-[0.8125rem] font-semibold bg-[#171717] text-[#F3F0E9] rounded-[4px] hover:bg-[#9E4A28] transition-colors whitespace-nowrap"
                >
                  <span>Previsualizar portal del cliente</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[0.875rem]">
                <div>
                  <dt className="text-[0.75rem] font-semibold text-[#5C5B57]">Sector</dt>
                  <dd className="text-[#171717] font-medium">{selectedClient.sector}</dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-[0.75rem] font-semibold text-[#5C5B57]">Correo de muestra</dt>
                  <dd className="text-[#171717] av-mono text-[0.8125rem] break-all">{selectedClient.email}</dd>
                </div>
                <div>
                  <dt className="text-[0.75rem] font-semibold text-[#5C5B57]">Alta</dt>
                  <dd className="av-mono text-[#171717]">{formatShortDate(selectedClient.createdAt)}</dd>
                </div>
              </dl>

              <p className="text-[0.875rem] text-[#30302E] pt-3 border-t border-[rgba(23,23,23,0.1)]">
                {selectedClient.notes}
              </p>

              {/* Linked Projects */}
              <div className="pt-4 border-t border-[rgba(23,23,23,0.13)] space-y-2.5">
                <h3 className="text-[0.8125rem] font-semibold tracking-[0.04em] text-[#30302E]">
                  Proyectos vinculados ({clientProjects.length})
                </h3>
                {clientProjects.length === 0 ? (
                  <p className="text-[0.875rem] text-[#5C5B57]">
                    Este cliente de ejemplo no tiene proyectos activos todavía.
                  </p>
                ) : (
                  <ul className="divide-y divide-[rgba(23,23,23,0.08)] bg-[#FFFFFF] border border-[rgba(23,23,23,0.1)] rounded-[4px] px-4">
                    {clientProjects.map((prj) => (
                      <li key={prj.id} className="py-3 flex flex-wrap items-center justify-between gap-2 text-[0.875rem]">
                        <div>
                          <span className="av-mono text-[0.75rem] text-[#9E4A28] mr-2">{prj.code}</span>
                          <span className="font-semibold text-[#171717]">{prj.name}</span>
                        </div>
                        <span className="text-[0.8125rem] text-[#5C5B57]">
                          Lanzamiento est.: {formatShortDate(prj.estimatedLaunchDate)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Linked Proposals & Payments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <h3 className="text-[0.8125rem] font-semibold text-[#30302E] mb-2">
                    Propuestas ({clientProposals.length})
                  </h3>
                  {clientProposals.length === 0 ? (
                    <p className="text-[0.8125rem] text-[#5C5B57]">Sin propuestas emitidas.</p>
                  ) : (
                    <ul className="space-y-2">
                      {clientProposals.map((pr) => {
                        const totals = calculateProposalTotals(pr.items, pr.depositPercent);
                        return (
                          <li
                            key={pr.id}
                            className="p-3 bg-[#FFFFFF] border border-[rgba(23,23,23,0.1)] rounded-[4px] text-[0.8125rem]"
                          >
                            <p className="av-mono text-[#9E4A28]">{pr.code}</p>
                            <p className="font-semibold text-[#171717]">{pr.title}</p>
                            <p className="av-mono text-[#30302E] mt-1">
                              Total: {formatUsd(totals.subtotalUsd)}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <div>
                  <h3 className="text-[0.8125rem] font-semibold text-[#30302E] mb-2">
                    Movimientos de pago ({clientPayments.length})
                  </h3>
                  {clientPayments.length === 0 ? (
                    <p className="text-[0.8125rem] text-[#5C5B57]">Sin abonos registrados.</p>
                  ) : (
                    <ul className="space-y-2">
                      {clientPayments.map((pm) => (
                        <li
                          key={pm.id}
                          className="p-3 bg-[#FFFFFF] border border-[rgba(23,23,23,0.1)] rounded-[4px] text-[0.8125rem]"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-[#171717]">
                              {PAYMENT_KIND_LABEL[pm.kind]}
                            </span>
                            <span className="av-mono font-medium text-[#171717]">
                              {formatUsd(pm.amountUsd)}
                            </span>
                          </div>
                          <p className="text-[#5C5B57] mt-0.5">
                            {PAYMENT_STATUS_LABEL[pm.status]}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-[0.875rem] text-[#5C5B57]">
              Selecciona un cliente para ver su ficha completa.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};
