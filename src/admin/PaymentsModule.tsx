import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { formatShortDate, formatUsd, validatePaymentDraft } from '../platform/formatters';
import { StatusLabel, type StatusTone } from '../platform/StatusLabel';
import type {
  Client,
  Payment,
  PaymentKind,
  PaymentVerificationStatus,
  Project,
} from '../platform/types';

interface PaymentsModuleProps {
  payments: Payment[];
  clients: Client[];
  projects: Project[];
  onVerifyPayment: (
    paymentId: string,
    status: PaymentVerificationStatus,
    note: string
  ) => void;
  onAddPaymentRecord: (payment: Payment) => void;
}

const PAYMENT_STATUS_META: Record<
  PaymentVerificationStatus,
  { label: string; tone: StatusTone }
> = {
  pendiente_verificacion: { label: 'Pendiente verificación', tone: 'warning' },
  verificado: { label: 'Verificado manualmente', tone: 'success' },
  observado: { label: 'Observado', tone: 'danger' },
};

const PAYMENT_FILTER_OPTIONS: {
  value: PaymentVerificationStatus | 'todos';
  label: string;
}[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'pendiente_verificacion', label: 'Pendientes' },
  { value: 'verificado', label: 'Verificados' },
  { value: 'observado', label: 'Observados' },
];

export const PaymentsModule: React.FC<PaymentsModuleProps> = ({
  payments,
  clients,
  projects,
  onVerifyPayment,
  onAddPaymentRecord,
}) => {
  const [statusFilter, setStatusFilter] = useState<PaymentVerificationStatus | 'todos'>('todos');
  const [selectedId, setSelectedId] = useState<string>(payments[0]?.id || '');
  const [showAddForm, setShowAddForm] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const initialClientId = clients[0]?.id || '';
  const [clientId, setClientId] = useState<string>(initialClientId);
  const [projectId, setProjectId] = useState<string>(
    projects.find((p) => p.clientId === initialClientId)?.id || ''
  );
  const [kind, setKind] = useState<PaymentKind>('anticipo');
  const [concept, setConcept] = useState('');
  const [amountUsd, setAmountUsd] = useState<number>(250);
  const [referenceCode, setReferenceCode] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const clientById = new Map(clients.map((c) => [c.id, c]));
  const projectById = new Map(projects.map((p) => [p.id, p]));
  const projectsForClient = projects.filter((p) => p.clientId === clientId);

  const filteredPayments =
    statusFilter === 'todos'
      ? payments
      : payments.filter((p) => p.status === statusFilter);

  const selectedPayment =
    filteredPayments.find((p) => p.id === selectedId) || filteredPayments[0] || null;

  const verifiedTotal = payments
    .filter((p) => p.status === 'verificado')
    .reduce((acc, p) => acc + p.amountUsd, 0);
  const pendingTotal = payments
    .filter((p) => p.status !== 'verificado')
    .reduce((acc, p) => acc + p.amountUsd, 0);

  const handleClientChange = (nextClientId: string) => {
    setClientId(nextClientId);
    const matchingProject = projects.find((p) => p.clientId === nextClientId);
    setProjectId(matchingProject?.id || '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedProject = projectById.get(projectId);
    const validation = validatePaymentDraft({
      clientId,
      projectId,
      projectClientId: matchedProject?.clientId,
      concept,
      amountUsd,
      referenceCode,
    });
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    const newPayment: Payment = {
      id: `pay-demo-${Date.now()}`,
      clientId,
      projectId,
      kind,
      concept: concept.trim(),
      amountUsd,
      method: 'Transferencia bancaria (Ejemplo)',
      referenceCode: referenceCode.trim(),
      receiptLabel: `comprobante-${referenceCode.trim().toLowerCase()}.pdf`,
      recordedAt: '2026-11-18',
      status: 'pendiente_verificacion',
      verificationNote: 'Registro de demostración pendiente de validación manual.',
      isDemoData: true,
    };

    onAddPaymentRecord(newPayment);
    setStatusFilter('todos');
    setSelectedId(newPayment.id);
    setShowAddForm(false);
    setConcept('');
    setReferenceCode('');
    setErrors([]);
    setFeedbackMessage(
      `Pago de muestra "${newPayment.concept}" añadido en memoria como pendiente de verificación.`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[rgba(23,23,23,0.13)]">
        <p className="text-[0.875rem] text-[#5C5B57] max-w-[68ch]">
          Registro administrativo de anticipos y saldos con verificación manual por el estudio (sin pasarela de pagos ni cobro en línea).
        </p>
        <button
          type="button"
          onClick={() => {
            setShowAddForm((prev) => !prev);
            setErrors([]);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-[0.875rem] font-semibold bg-[#171717] text-[#F3F0E9] rounded-[4px] hover:bg-[#9E4A28] transition-colors whitespace-nowrap"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>{showAddForm ? 'Volver al listado' : 'Registrar pago de muestra'}</span>
        </button>
      </div>

      {!showAddForm ? (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filtrar pagos por verificación">
            {PAYMENT_FILTER_OPTIONS.map((opt) => {
              const active = statusFilter === opt.value;
              const count =
                opt.value === 'todos'
                  ? payments.length
                  : payments.filter((p) => p.status === opt.value).length;
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
            Verificado: <strong className="av-mono text-[#166534]">{formatUsd(verifiedTotal)}</strong> · Por verificar:{' '}
            <strong className="av-mono text-[#171717]">{formatUsd(pendingTotal)}</strong>
          </p>
        </div>
      ) : null}

      {feedbackMessage && !showAddForm ? (
        <p role="status" className="text-[0.8125rem] font-medium text-[#166534]">
          {feedbackMessage}
        </p>
      ) : null}

      {showAddForm ? (
        <form
          onSubmit={handleSubmit}
          className="border border-[rgba(23,23,23,0.13)] bg-[#FFFFFF] rounded-[6px] p-5 sm:p-6 space-y-5"
        >
          <h2 className="av-display text-[1.65rem] text-[#171717]">
            Nuevo registro de anticipo o saldo (demostración en memoria)
          </h2>

          {errors.length > 0 ? (
            <div
              role="alert"
              className="p-3.5 border border-[#991B1B] bg-[#FEF2F2] text-[#991B1B] rounded-[4px] text-[0.875rem] space-y-1"
            >
              {errors.map((err) => (
                <p key={err}>{err}</p>
              ))}
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="pay-client" className="block text-[0.75rem] font-semibold text-[#5C5B57] mb-1">
                Cliente *
              </label>
              <select
                id="pay-client"
                value={clientId}
                onChange={(e) => handleClientChange(e.target.value)}
                className="w-full px-3 py-2 text-[0.875rem] bg-[#FAF8F4] border border-[rgba(23,23,23,0.2)] rounded-[4px]"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.businessName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="pay-project" className="block text-[0.75rem] font-semibold text-[#5C5B57] mb-1">
                Proyecto vinculado *
              </label>
              <select
                id="pay-project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                disabled={projectsForClient.length === 0}
                className="w-full px-3 py-2 text-[0.875rem] bg-[#FAF8F4] border border-[rgba(23,23,23,0.2)] rounded-[4px] disabled:opacity-60"
              >
                {projectsForClient.length === 0 ? (
                  <option value="">Sin proyecto activo vinculado</option>
                ) : (
                  projectsForClient.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} · {p.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label htmlFor="pay-kind" className="block text-[0.75rem] font-semibold text-[#5C5B57] mb-1">
                Tipo
              </label>
              <select
                id="pay-kind"
                value={kind}
                onChange={(e) => setKind(e.target.value as PaymentKind)}
                className="w-full px-3 py-2 text-[0.875rem] bg-[#FAF8F4] border border-[rgba(23,23,23,0.2)] rounded-[4px]"
              >
                <option value="anticipo">Anticipo</option>
                <option value="saldo">Saldo final</option>
                <option value="adicional">Alcance adicional</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="pay-concept" className="block text-[0.75rem] font-semibold text-[#5C5B57] mb-1">
                Concepto *
              </label>
              <input
                id="pay-concept"
                type="text"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="Ej. Anticipo 50% (Ejemplo)"
                className="w-full px-3 py-2 text-[0.875rem] bg-[#FAF8F4] border border-[rgba(23,23,23,0.2)] rounded-[4px]"
              />
            </div>
            <div>
              <label htmlFor="pay-amount" className="block text-[0.75rem] font-semibold text-[#5C5B57] mb-1">
                Monto (USD) *
              </label>
              <input
                id="pay-amount"
                type="number"
                min={1}
                step="0.01"
                value={amountUsd}
                onChange={(e) => setAmountUsd(Number(e.target.value))}
                className="w-full px-3 py-2 text-[0.875rem] av-mono bg-[#FAF8F4] border border-[rgba(23,23,23,0.2)] rounded-[4px]"
              />
            </div>
            <div>
              <label htmlFor="pay-ref" className="block text-[0.75rem] font-semibold text-[#5C5B57] mb-1">
                Referencia de comprobante *
              </label>
              <input
                id="pay-ref"
                type="text"
                value={referenceCode}
                onChange={(e) => setReferenceCode(e.target.value)}
                placeholder="Ej. TRF-DEMO-2026"
                className="w-full px-3 py-2 text-[0.875rem] av-mono bg-[#FAF8F4] border border-[rgba(23,23,23,0.2)] rounded-[4px]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-[0.875rem] font-medium border border-[rgba(23,23,23,0.2)] rounded-[4px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-[0.875rem] font-semibold bg-[#9E4A28] text-[#FFFFFF] rounded-[4px] hover:bg-[#171717]"
            >
              Añadir registro de muestra
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <section className="xl:col-span-7 border border-[rgba(23,23,23,0.13)] bg-[#FFFFFF] rounded-[6px] overflow-hidden">
            {filteredPayments.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <p className="text-[0.875rem] text-[#5C5B57]">
                  No hay registros de pago en este estado.
                </p>
                <button
                  type="button"
                  onClick={() => setStatusFilter('todos')}
                  className="px-4 py-2 text-[0.8125rem] font-semibold bg-[#171717] text-[#F3F0E9] rounded-[4px]"
                >
                  Mostrar todos ({payments.length})
                </button>
              </div>
            ) : (
              <>
                {/* Mobile stacked card list */}
                <ul className="md:hidden divide-y divide-[rgba(23,23,23,0.08)]">
                  {filteredPayments.map((pay) => {
                    const meta = PAYMENT_STATUS_META[pay.status];
                    const client = clientById.get(pay.clientId);
                    const isSelected = selectedPayment?.id === pay.id;
                    return (
                      <li key={pay.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedId(pay.id);
                            setFeedbackMessage(null);
                          }}
                          className={`w-full text-left p-4 space-y-2 transition-colors ${
                            isSelected ? 'bg-[#F3F0E9]' : 'hover:bg-[#FAF8F4]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <span className="block font-semibold text-[#171717] text-[0.9375rem]">
                                {pay.concept}
                              </span>
                              <span className="block text-[0.8125rem] text-[#5C5B57]">
                                {client?.businessName || 'Cliente de muestra'}
                              </span>
                            </div>
                            <span className="av-mono font-semibold text-[#171717] shrink-0">
                              {formatUsd(pay.amountUsd)}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="av-mono text-[0.78rem] text-[#5C5B57]">
                              {pay.referenceCode}
                            </span>
                            <StatusLabel label={meta.label} tone={meta.tone} />
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
                        <th className="py-3 px-4">Concepto y cliente</th>
                        <th className="py-3 px-4">Referencia</th>
                        <th className="py-3 px-4 text-right">Monto</th>
                        <th className="py-3 px-4 text-right">Verificación</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(23,23,23,0.08)] text-[0.875rem]">
                      {filteredPayments.map((pay) => {
                        const meta = PAYMENT_STATUS_META[pay.status];
                        const client = clientById.get(pay.clientId);
                        const isSelected = selectedPayment?.id === pay.id;
                        return (
                          <tr
                            key={pay.id}
                            className={`transition-colors ${
                              isSelected ? 'bg-[#F3F0E9]' : 'hover:bg-[#FAF8F4]'
                            }`}
                          >
                            <td className="py-3.5 px-4">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedId(pay.id);
                                  setFeedbackMessage(null);
                                }}
                                className="text-left w-full"
                              >
                                <span className="block font-semibold text-[#171717]">
                                  {pay.concept}
                                </span>
                                <span className="block text-[0.8125rem] text-[#5C5B57]">
                                  {client?.businessName || 'Cliente de muestra'}
                                </span>
                              </button>
                            </td>
                            <td className="py-3.5 px-4 av-mono text-[0.8125rem] text-[#30302E] whitespace-nowrap">
                              {pay.referenceCode}
                            </td>
                            <td className="py-3.5 px-4 text-right av-mono font-medium text-[#171717] whitespace-nowrap">
                              {formatUsd(pay.amountUsd)}
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
            {selectedPayment ? (
              <div className="space-y-5">
                <div className="pb-4 border-b border-[rgba(23,23,23,0.13)]">
                  <p className="av-mono text-[0.75rem] text-[#9E4A28] mb-1">
                    Detalle de comprobante · Verificación manual
                  </p>
                  <h2 className="av-display text-[1.75rem] text-[#171717]">
                    {formatUsd(selectedPayment.amountUsd)}
                  </h2>
                  <p className="text-[0.875rem] font-semibold text-[#30302E] mt-1">
                    {selectedPayment.concept}
                  </p>
                </div>

                <dl className="space-y-2.5 text-[0.875rem]">
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#5C5B57]">Proyecto:</dt>
                    <dd className="font-medium text-[#171717] text-right">
                      {projectById.get(selectedPayment.projectId)?.name || 'Proyecto de ejemplo'}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#5C5B57]">Método:</dt>
                    <dd className="text-[#171717] text-right">{selectedPayment.method}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#5C5B57]">Referencia:</dt>
                    <dd className="av-mono text-[#171717] break-all">{selectedPayment.referenceCode}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#5C5B57]">Archivo adjunto (referencia):</dt>
                    <dd className="av-mono text-[0.8125rem] text-[#30302E] text-right break-all">
                      {selectedPayment.receiptLabel}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#5C5B57]">Fecha registro:</dt>
                    <dd className="av-mono text-[#171717]">
                      {formatShortDate(selectedPayment.recordedAt)}
                    </dd>
                  </div>
                </dl>

                <p className="text-[0.8125rem] text-[#5C5B57] pt-3 border-t border-[rgba(23,23,23,0.1)]">
                  {selectedPayment.verificationNote}
                </p>

                <div className="pt-2 space-y-2">
                  <p className="text-[0.75rem] font-semibold text-[#30302E]">
                    Acciones de revisión manual (en memoria)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onVerifyPayment(
                          selectedPayment.id,
                          'verificado',
                          'Confirmado manualmente en la vista previa administrativa.'
                        );
                        setFeedbackMessage(
                          `Pago "${selectedPayment.referenceCode}" verificado temporalmente en memoria.`
                        );
                      }}
                      className="px-3.5 py-2 text-[0.8125rem] font-semibold bg-[#171717] text-[#F3F0E9] rounded-[4px] hover:bg-[#166534] transition-colors whitespace-nowrap"
                    >
                      Verificar manualmente
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onVerifyPayment(
                          selectedPayment.id,
                          'observado',
                          'Comprobante marcado como observado para revisión con el cliente.'
                        );
                        setFeedbackMessage(
                          `Pago "${selectedPayment.referenceCode}" marcado como observado en memoria.`
                        );
                      }}
                      className="px-3.5 py-2 text-[0.8125rem] font-semibold border border-[#991B1B] text-[#991B1B] rounded-[4px] hover:bg-[#FEF2F2] transition-colors whitespace-nowrap"
                    >
                      Marcar observado
                    </button>
                    {selectedPayment.status !== 'pendiente_verificacion' ? (
                      <button
                        type="button"
                        onClick={() => {
                          onVerifyPayment(
                            selectedPayment.id,
                            'pendiente_verificacion',
                            'Devuelto a revisión manual en la vista previa.'
                          );
                          setFeedbackMessage(
                            `Pago "${selectedPayment.referenceCode}" devuelto a pendiente en memoria.`
                          );
                        }}
                        className="px-3.5 py-2 text-[0.8125rem] font-medium border border-[rgba(23,23,23,0.22)] text-[#30302E] rounded-[4px] hover:border-[#171717] transition-colors whitespace-nowrap"
                      >
                        Devolver a pendiente
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[0.875rem] text-[#5C5B57]">
                Selecciona un pago para inspeccionar su comprobante y estado.
              </p>
            )}
          </aside>
        </div>
      )}
    </div>
  );
};
