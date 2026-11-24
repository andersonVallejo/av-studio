import React, { useEffect, useMemo, useState } from 'react';
import {
  Briefcase,
  CreditCard,
  ExternalLink,
  FileSpreadsheet,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  Menu,
  Settings,
  Users,
  X,
} from 'lucide-react';
import { DEMO_DATASET_NOTICE } from '../platform/demoData';
import { createDemoStudioRepository } from '../platform/repositories';
import { StudioBrandMark } from '../platform/StudioBrandMark';
import type {
  AdminModuleKey,
  Lead,
  LeadStatus,
  Payment,
  PaymentVerificationStatus,
  ProjectStatus,
  Proposal,
  ProposalStatus,
  StudioWorkspaceDataset,
} from '../platform/types';
import { CatalogModule } from './CatalogModule';
import { ClientsModule } from './ClientsModule';
import { DashboardModule } from './DashboardModule';
import { LeadsModule } from './LeadsModule';
import { PaymentsModule } from './PaymentsModule';
import { ProjectsModule } from './ProjectsModule';
import { ProposalsModule } from './ProposalsModule';
import { SettingsModule } from './SettingsModule';

const NAV_ITEMS: {
  key: AdminModuleKey;
  label: string;
  subtitle: string;
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}[] = [
  { key: 'dashboard', label: 'Dashboard', subtitle: 'Resumen general del estudio', Icon: LayoutDashboard },
  { key: 'leads', label: 'Leads', subtitle: 'Bandeja de solicitudes públicas', Icon: Inbox },
  { key: 'clientes', label: 'Clientes', subtitle: 'Directorio y ficha individual', Icon: Users },
  { key: 'propuestas', label: 'Propuestas', subtitle: 'Presupuestos, anticipos y condiciones', Icon: FileSpreadsheet },
  { key: 'proyectos', label: 'Proyectos', subtitle: 'Etapas, avances y vistas previas', Icon: FolderKanban },
  { key: 'pagos', label: 'Pagos', subtitle: 'Anticipos, saldos y verificación manual', Icon: CreditCard },
  { key: 'catalogo', label: 'Catálogo', subtitle: '16 categorías y demostraciones', Icon: Briefcase },
  { key: 'configuracion', label: 'Configuración', subtitle: 'Identidad AV·STUDIO y Supabase', Icon: Settings },
];

export const AdminApp: React.FC = () => {
  const repository = useMemo(() => createDemoStudioRepository(), []);
  const [dataset, setDataset] = useState<StudioWorkspaceDataset | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<AdminModuleKey>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prefillLead, setPrefillLead] = useState<Lead | null>(null);

  useEffect(() => {
    let cancelled = false;
    repository
      .loadWorkspaceDataset()
      .then((data) => {
        if (!cancelled) setDataset(data);
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError('No se pudo cargar la vista previa de datos de demostración.');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [repository]);

  const currentMeta = NAV_ITEMS.find((item) => item.key === activeModule) || NAV_ITEMS[0];

  const handleSelectModule = (module: AdminModuleKey) => {
    setActiveModule(module);
    setMobileMenuOpen(false);
  };

  const handleUpdateLeadStatus = (leadId: string, nextStatus: LeadStatus) => {
    setDataset((prev) =>
      prev
        ? {
            ...prev,
            leads: prev.leads.map((l) => (l.id === leadId ? { ...l, status: nextStatus } : l)),
          }
        : prev
    );
  };

  const handleStartProposalFromLead = (lead: Lead) => {
    setPrefillLead(lead);
    setActiveModule('propuestas');
  };

  const handleCreateProposal = (proposal: Proposal) => {
    setDataset((prev) =>
      prev ? { ...prev, proposals: [proposal, ...prev.proposals] } : prev
    );
  };

  const handleUpdateProposalStatus = (proposalId: string, nextStatus: ProposalStatus) => {
    setDataset((prev) =>
      prev
        ? {
            ...prev,
            proposals: prev.proposals.map((pr) =>
              pr.id === proposalId ? { ...pr, status: nextStatus } : pr
            ),
          }
        : prev
    );
  };

  const handleToggleProjectStage = (projectId: string, stageId: string) => {
    setDataset((prev) =>
      prev
        ? {
            ...prev,
            projects: prev.projects.map((prj) =>
              prj.id === projectId
                ? {
                    ...prj,
                    stages: prj.stages.map((st) =>
                      st.id === stageId ? { ...st, completed: !st.completed } : st
                    ),
                  }
                : prj
            ),
          }
        : prev
    );
  };

  const handleUpdateProjectStatus = (projectId: string, nextStatus: ProjectStatus) => {
    setDataset((prev) =>
      prev
        ? {
            ...prev,
            projects: prev.projects.map((prj) =>
              prj.id === projectId ? { ...prj, status: nextStatus } : prj
            ),
          }
        : prev
    );
  };

  const handleVerifyPayment = (
    paymentId: string,
    status: PaymentVerificationStatus,
    note: string
  ) => {
    setDataset((prev) =>
      prev
        ? {
            ...prev,
            payments: prev.payments.map((pm) =>
              pm.id === paymentId ? { ...pm, status, verificationNote: note } : pm
            ),
          }
        : prev
    );
  };

  const handleAddPaymentRecord = (payment: Payment) => {
    setDataset((prev) =>
      prev ? { ...prev, payments: [payment, ...prev.payments] } : prev
    );
  };

  const handleToggleShowcaseFeatured = (showcaseId: string) => {
    setDataset((prev) =>
      prev
        ? {
            ...prev,
            showcases: prev.showcases.map((sc) =>
              sc.id === showcaseId ? { ...sc, featured: !sc.featured } : sc
            ),
          }
        : prev
    );
  };

  return (
    <div className="min-h-screen flex bg-[#F3F0E9] text-[#171717]">
      {/* Mobile Sidebar Backdrop */}
      {mobileMenuOpen ? (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      {/* Editorial Charcoal Sidebar (260px desktop) */}
      <aside
        aria-label="Navegación del panel administrativo"
        className={`fixed inset-y-0 left-0 z-40 w-[264px] shrink-0 bg-[#171717] text-[#F3F0E9] border-r border-[rgba(243,240,233,0.14)] flex flex-col justify-between overflow-y-auto transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 space-y-8">
          <div className="flex items-start justify-between gap-2">
            <a href="/index.html" aria-label="Volver al sitio público AV·STUDIO">
              <StudioBrandMark variant="light" showSignature compact />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Cerrar menú lateral"
              className="lg:hidden p-1.5 text-[#B8B5AE] hover:text-[#F3F0E9]"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Módulos administrativos">
            <ul className="space-y-1">
              {NAV_ITEMS.map(({ key, label, Icon }) => {
                const active = activeModule === key;
                return (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => handleSelectModule(key)}
                      aria-current={active ? 'page' : undefined}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-[0.875rem] font-medium rounded-[4px] transition-colors whitespace-nowrap ${
                        active
                          ? 'bg-[#C96F4A] text-[#171717] font-semibold'
                          : 'text-[#B8B5AE] hover:text-[#F3F0E9] hover:bg-[#21211F]'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden={true} />
                      <span>{label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="p-6 border-t border-[rgba(243,240,233,0.14)] space-y-3 text-[0.8125rem]">
          <p className="text-[#B8B5AE] leading-snug">
            Ideas que toman forma. · Entorno visual sin conexión ni autenticación activa.
          </p>
          <div className="flex flex-col gap-1.5 pt-1">
            <a
              href="/portal.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between text-[#F3F0E9] hover:text-[#C96F4A] font-medium"
            >
              <span>Vista previa Portal Cliente</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            <a
              href="/index.html"
              className="inline-flex items-center justify-between text-[#B8B5AE] hover:text-[#F3F0E9]"
            >
              <span>Ir al sitio público</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </aside>

      {/* Main Workspace Canvas */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Workspace Bar */}
        <header className="sticky top-0 z-20 bg-[#F3F0E9]/95 backdrop-blur-sm border-b border-[rgba(23,23,23,0.13)] px-5 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menú de navegación administrativa"
              className="lg:hidden p-2 border border-[rgba(23,23,23,0.2)] rounded-[4px] bg-[#FAF8F4] text-[#171717]"
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
            </button>
            <div className="min-w-0">
              <p className="text-[0.75rem] text-[#5C5B57] truncate">
                <span className="hidden sm:inline">AV·STUDIO Plataforma / </span>
                <strong className="text-[#171717]">{currentMeta.label}</strong>
              </p>
              <h1 className="av-display text-[1.5rem] sm:text-[1.6rem] lg:text-[1.95rem] text-[#171717] truncate">
                {currentMeta.label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/portal.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-[0.8125rem] font-semibold border border-[rgba(23,23,23,0.22)] bg-[#FAF8F4] text-[#171717] rounded-[4px] hover:border-[#171717] whitespace-nowrap"
            >
              <span>Abrir Portal Cliente (demo)</span>
            </a>
            <a
              href="/index.html"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[0.8125rem] font-semibold bg-[#171717] text-[#F3F0E9] rounded-[4px] hover:bg-[#9E4A28] transition-colors whitespace-nowrap"
            >
              <span>Sitio público</span>
            </a>
          </div>
        </header>

        {/* Honest Preview Disclaimer Strip */}
        <div className="border-b border-[rgba(23,23,23,0.13)] bg-[#EAE4D8] px-5 lg:px-8 py-2.5 text-[0.8125rem] text-[#30302E] flex flex-col xl:flex-row xl:items-center justify-between gap-x-6 gap-y-1.5">
          <p className="min-w-0">
            <strong className="text-[#9E4A28]">{DEMO_DATASET_NOTICE.badgeText}:</strong>{' '}
            {DEMO_DATASET_NOTICE.disclaimer}
          </p>
          <span className="av-mono text-[0.75rem] text-[#5C5B57] shrink-0">
            Protección real pendiente de Supabase Auth + RLS
          </span>
        </div>

        <main className="flex-1 px-5 lg:px-8 py-7 max-w-[1360px] w-full">
          {loadError ? (
            <div
              role="alert"
              className="p-6 border border-[#991B1B] bg-[#FEF2F2] text-[#991B1B] rounded-[6px]"
            >
              {loadError}
            </div>
          ) : !dataset ? (
            <div className="space-y-4" aria-busy="true" aria-label="Cargando vista de demostración">
              <div className="h-28 bg-[#E8E3D8] rounded-[6px] animate-pulse" />
              <div className="h-64 bg-[#E8E3D8] rounded-[6px] animate-pulse" />
            </div>
          ) : (
            <>
              {activeModule === 'dashboard' ? (
                <DashboardModule dataset={dataset} onNavigate={handleSelectModule} />
              ) : null}
              {activeModule === 'leads' ? (
                <LeadsModule
                  leads={dataset.leads}
                  onUpdateLeadStatus={handleUpdateLeadStatus}
                  onStartProposalFromLead={handleStartProposalFromLead}
                />
              ) : null}
              {activeModule === 'clientes' ? (
                <ClientsModule
                  clients={dataset.clients}
                  projects={dataset.projects}
                  proposals={dataset.proposals}
                  payments={dataset.payments}
                />
              ) : null}
              {activeModule === 'propuestas' ? (
                <ProposalsModule
                  proposals={dataset.proposals}
                  clients={dataset.clients}
                  prefillLead={prefillLead}
                  onCreateProposal={handleCreateProposal}
                  onUpdateProposalStatus={handleUpdateProposalStatus}
                  onClearPrefillLead={() => setPrefillLead(null)}
                />
              ) : null}
              {activeModule === 'proyectos' ? (
                <ProjectsModule
                  projects={dataset.projects}
                  clients={dataset.clients}
                  updates={dataset.projectUpdates}
                  files={dataset.projectFiles}
                  onToggleStage={handleToggleProjectStage}
                  onUpdateProjectStatus={handleUpdateProjectStatus}
                />
              ) : null}
              {activeModule === 'pagos' ? (
                <PaymentsModule
                  payments={dataset.payments}
                  clients={dataset.clients}
                  projects={dataset.projects}
                  onVerifyPayment={handleVerifyPayment}
                  onAddPaymentRecord={handleAddPaymentRecord}
                />
              ) : null}
              {activeModule === 'catalogo' ? (
                <CatalogModule
                  categories={dataset.categories}
                  showcases={dataset.showcases}
                  onToggleShowcaseFeatured={handleToggleShowcaseFeatured}
                />
              ) : null}
              {activeModule === 'configuracion' ? <SettingsModule /> : null}
            </>
          )}
        </main>
      </div>
    </div>
  );
};
