import type {
  CatalogGroup,
  Category,
  ClientPortalBundle,
  Lead,
  LeadStatus,
  Payment,
  Project,
  ProjectStage,
  Proposal,
  ProposalItem,
  Showcase,
  StudioWorkspaceDataset,
} from './types';

export function formatUsd(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safe);
}

export function formatShortDate(isoOrDate: string): string {
  if (!isoOrDate) return 'Por definir';
  const parsed = new Date(isoOrDate);
  if (Number.isNaN(parsed.getTime())) return isoOrDate;
  return new Intl.DateTimeFormat('es-EC', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
}

export interface ProposalTotals {
  subtotalUsd: number;
  depositPercent: number;
  depositUsd: number;
  balanceUsd: number;
}

export function calculateProposalTotals(
  items: Pick<ProposalItem, 'amountUsd'>[],
  depositPercent: number
): ProposalTotals {
  const subtotalUsd = items.reduce((acc, item) => {
    const val = Number.isFinite(item.amountUsd) && item.amountUsd > 0 ? item.amountUsd : 0;
    return acc + val;
  }, 0);
  const clampedPercent = Math.min(100, Math.max(0, Number.isFinite(depositPercent) ? depositPercent : 50));
  const depositUsd = Math.round((subtotalUsd * clampedPercent) / 100 * 100) / 100;
  const balanceUsd = Math.round((subtotalUsd - depositUsd) * 100) / 100;
  return {
    subtotalUsd: Math.round(subtotalUsd * 100) / 100,
    depositPercent: clampedPercent,
    depositUsd,
    balanceUsd,
  };
}

export function calculateProjectProgress(stages: Pick<ProjectStage, 'completed'>[]): number {
  if (!Array.isArray(stages) || stages.length === 0) return 0;
  const completedCount = stages.filter((stage) => stage.completed).length;
  return Math.round((completedCount / stages.length) * 100);
}

export interface DashboardSummary {
  totalLeads: number;
  pendingLeads: number;
  totalClients: number;
  activeClients: number;
  totalProjects: number;
  activeProjects: number;
  pendingProposals: number;
  verifiedPaymentsCount: number;
  pendingPaymentsCount: number;
  verifiedPaymentsUsd: number;
  pendingPaymentsUsd: number;
  publicCategoriesCount: number;
}

export function calculateDashboardSummary(dataset: StudioWorkspaceDataset): DashboardSummary {
  const pendingLeads = dataset.leads.filter(
    (lead) => lead.status === 'nuevo' || lead.status === 'en_revision'
  ).length;
  const activeClients = dataset.clients.filter((client) => client.status === 'activo').length;
  const activeProjects = dataset.projects.filter(
    (project) => project.status !== 'publicado'
  ).length;
  const pendingProposals = dataset.proposals.filter(
    (prop) => prop.status === 'borrador' || prop.status === 'enviada' || prop.status === 'requiere_ajustes'
  ).length;

  let verifiedPaymentsCount = 0;
  let pendingPaymentsCount = 0;
  let verifiedPaymentsUsd = 0;
  let pendingPaymentsUsd = 0;

  for (const payment of dataset.payments) {
    if (payment.status === 'verificado') {
      verifiedPaymentsCount += 1;
      verifiedPaymentsUsd += payment.amountUsd;
    } else {
      pendingPaymentsCount += 1;
      pendingPaymentsUsd += payment.amountUsd;
    }
  }

  return {
    totalLeads: dataset.leads.length,
    pendingLeads,
    totalClients: dataset.clients.length,
    activeClients,
    totalProjects: dataset.projects.length,
    activeProjects,
    pendingProposals,
    verifiedPaymentsCount,
    pendingPaymentsCount,
    verifiedPaymentsUsd: Math.round(verifiedPaymentsUsd * 100) / 100,
    pendingPaymentsUsd: Math.round(pendingPaymentsUsd * 100) / 100,
    publicCategoriesCount: dataset.categories.filter((c) => c.isPublic).length,
  };
}

function normalizeSearchText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function filterLeads(
  leads: Lead[],
  query: string,
  statusFilter: LeadStatus | 'todos'
): Lead[] {
  const q = normalizeSearchText(query.trim());
  return leads.filter((lead) => {
    if (statusFilter !== 'todos' && lead.status !== statusFilter) {
      return false;
    }
    if (!q) return true;
    const haystack = normalizeSearchText(
      [
        lead.name,
        lead.business,
        lead.sector,
        lead.pageType,
        lead.contactValue,
        lead.description,
      ].join(' ')
    );
    return haystack.includes(q);
  });
}

export interface CatalogEntry {
  category: Category;
  showcase: Showcase | undefined;
}

export function filterCatalogEntries(
  categories: Category[],
  showcases: Showcase[],
  groupFilter: CatalogGroup | 'todos',
  query: string
): CatalogEntry[] {
  const showcaseByCat = new Map<string, Showcase>();
  for (const s of showcases) {
    showcaseByCat.set(s.categoryId, s);
  }
  const q = normalizeSearchText(query.trim());

  return categories
    .filter((cat) => {
      if (groupFilter !== 'todos' && cat.group !== groupFilter) return false;
      if (!q) return true;
      const sc = showcaseByCat.get(cat.id);
      const haystack = normalizeSearchText(
        `${cat.indexLabel} ${cat.name} ${cat.group} ${cat.summary} ${sc?.title || ''}`
      );
      return haystack.includes(q);
    })
    .map((category) => ({
      category,
      showcase: showcaseByCat.get(category.id),
    }));
}

export interface ProposalDraftInput {
  clientId: string;
  title: string;
  sector: string;
  depositPercent: number;
  estimatedWeeks: string;
  validUntil: string;
  conditions: string;
  items: { title: string; detail: string; amountUsd: number }[];
}

export function validateProposalDraft(draft: ProposalDraftInput): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (!draft.clientId.trim()) errors.push('Selecciona un cliente para vincular la propuesta.');
  if (draft.title.trim().length < 4) errors.push('Ingresa un título descriptivo para la propuesta.');
  if (!Number.isFinite(draft.depositPercent) || draft.depositPercent < 0 || draft.depositPercent > 100) {
    errors.push('El porcentaje de anticipo debe ubicarse entre 0% y 100%.');
  }
  if (!draft.estimatedWeeks.trim()) {
    errors.push('Indica el plazo estimado de entrega.');
  }
  if (!draft.validUntil.trim()) {
    errors.push('Define la fecha de vigencia de la propuesta.');
  }
  if (draft.conditions.trim().length < 6) {
    errors.push('Describe brevemente las condiciones comerciales.');
  }
  const hasNegativeItem = draft.items.some(
    (item) => !Number.isFinite(item.amountUsd) || item.amountUsd < 0
  );
  if (hasNegativeItem) {
    errors.push('Ningún entregable puede tener un monto negativo.');
  }
  const validItems = draft.items.filter(
    (item) => item.title.trim().length > 0 && Number.isFinite(item.amountUsd) && item.amountUsd > 0
  );
  if (validItems.length === 0) {
    errors.push('Agrega al menos un entregable con nombre y valor mayor a $0.00 USD.');
  }
  return { valid: errors.length === 0, errors };
}

export interface PaymentDraftInput {
  clientId: string;
  projectId: string;
  projectClientId?: string;
  concept: string;
  amountUsd: number;
  referenceCode: string;
}

export function validatePaymentDraft(draft: PaymentDraftInput): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (!draft.clientId.trim() || !draft.projectId.trim()) {
    errors.push('Selecciona un cliente y proyecto válidos.');
  } else if (draft.projectClientId && draft.projectClientId !== draft.clientId) {
    errors.push('El proyecto seleccionado no pertenece al cliente elegido.');
  }
  if (draft.concept.trim().length < 3) {
    errors.push('Describe el concepto del abono o saldo.');
  }
  if (!Number.isFinite(draft.amountUsd) || draft.amountUsd <= 0) {
    errors.push('El monto debe ser mayor a $0.00 USD.');
  }
  if (draft.referenceCode.trim().length < 3) {
    errors.push('Registra un número o referencia de comprobante.');
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Strictly isolates portal data to a single clientId — directly mirroring
 * the future Supabase RLS contract (auth.uid() -> client_memberships -> clients.id).
 */
export function getClientPortalBundle(
  clientId: string,
  dataset: StudioWorkspaceDataset,
  requestedProjectId?: string
): ClientPortalBundle {
  const client = dataset.clients.find((c) => c.id === clientId) || null;
  if (!client) {
    return {
      client: null,
      projects: [],
      activeProject: null,
      progressPercent: 0,
      updates: [],
      files: [],
      proposal: null,
      payments: [],
      paidVerifiedUsd: 0,
      pendingBalanceUsd: 0,
    };
  }

  const projects = dataset.projects.filter((p) => p.clientId === client.id);
  const activeProject =
    (requestedProjectId && projects.find((p) => p.id === requestedProjectId)) ||
    projects[0] ||
    null;

  if (!activeProject) {
    return {
      client,
      projects: [],
      activeProject: null,
      progressPercent: 0,
      updates: [],
      files: [],
      proposal: dataset.proposals.find((pr) => pr.clientId === client.id) || null,
      payments: dataset.payments.filter((pm) => pm.clientId === client.id),
      paidVerifiedUsd: 0,
      pendingBalanceUsd: 0,
    };
  }

  const progressPercent = calculateProjectProgress(activeProject.stages);
  const updates = dataset.projectUpdates
    .filter((u) => u.clientId === client.id && u.projectId === activeProject.id)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const files = dataset.projectFiles.filter(
    (f) =>
      f.clientId === client.id &&
      f.projectId === activeProject.id &&
      f.visibility !== 'admin_only'
  );
  const proposal =
    (activeProject.proposalId &&
      dataset.proposals.find((pr) => pr.id === activeProject.proposalId && pr.clientId === client.id)) ||
    dataset.proposals.find((pr) => pr.clientId === client.id) ||
    null;
  const payments = dataset.payments.filter(
    (pm) => pm.clientId === client.id && pm.projectId === activeProject.id
  );

  const proposalTotal = proposal
    ? calculateProposalTotals(proposal.items, proposal.depositPercent).subtotalUsd
    : 0;
  const paidVerifiedUsd = payments
    .filter((pm) => pm.status === 'verificado')
    .reduce((sum, pm) => sum + pm.amountUsd, 0);
  const pendingBalanceUsd = Math.max(0, Math.round((proposalTotal - paidVerifiedUsd) * 100) / 100);

  return {
    client,
    projects,
    activeProject,
    progressPercent,
    updates,
    files,
    proposal,
    payments,
    paidVerifiedUsd: Math.round(paidVerifiedUsd * 100) / 100,
    pendingBalanceUsd,
  };
}
