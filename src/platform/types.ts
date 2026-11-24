/**
 * AV·STUDIO — Platform Domain Entities & Supabase Schema Alignment
 * Defines clean TypeScript contracts mirroring the 12 planned Supabase tables:
 * profiles, clients, client_memberships, leads, proposals, projects,
 * project_updates, project_files, payments, categories, showcases, notification_logs.
 */

export type UserRole = 'admin' | 'client';

export interface Profile {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export type ClientStatus = 'activo' | 'pausa' | 'completado';

export interface Client {
  id: string;
  profileId?: string;
  convertedFromLeadId?: string;
  businessName: string;
  contactName: string;
  sector: string;
  city: string;
  whatsapp: string;
  email: string;
  status: ClientStatus;
  notes: string;
  createdAt: string;
  isDemoData: true;
}

export type ClientMembershipRole = 'owner' | 'collaborator';

export interface ClientMembership {
  id: string;
  clientId: string;
  profileId: string;
  memberRole: ClientMembershipRole;
  invitedAt: string;
  isDemoData: true;
}

export type LeadStatus =
  | 'nuevo'
  | 'en_revision'
  | 'propuesta_enviada'
  | 'convertido'
  | 'archivado';

export interface Lead {
  id: string;
  name: string;
  business: string;
  sector: string;
  pageType: string;
  description: string;
  budget: string;
  desiredTimeline: string;
  contactChannel: 'WhatsApp' | 'Correo electrónico' | 'Llamada o WhatsApp';
  contactValue: string;
  sourceDemoSlug?: string;
  status: LeadStatus;
  convertedClientId?: string;
  convertedAt?: string;
  receivedAt: string;
  internalNotes: string;
  isDemoData: true;
}

export type ProposalStatus = 'borrador' | 'enviada' | 'aprobada' | 'requiere_ajustes';

export interface ProposalItem {
  id: string;
  title: string;
  detail: string;
  amountUsd: number;
}

export interface Proposal {
  id: string;
  code: string;
  clientId: string;
  leadId?: string;
  proposalGroupId?: string;
  versionNumber?: number;
  supersedesProposalId?: string;
  title: string;
  sector: string;
  items: ProposalItem[];
  depositPercent: number;
  validUntil: string;
  estimatedWeeks: string;
  conditions: string;
  status: ProposalStatus;
  issuedAt: string;
  respondedAt?: string;
  isDemoData: true;
}

export type ProjectStatus =
  | 'diagnostico'
  | 'diseno_visual'
  | 'desarrollo'
  | 'revision_cliente'
  | 'publicado';

export interface ProjectStage {
  id: string;
  order: number;
  title: string;
  description: string;
  completed: boolean;
  targetDate: string;
}

export interface Project {
  id: string;
  code: string;
  clientId: string;
  proposalId?: string;
  name: string;
  sector: string;
  summary: string;
  status: ProjectStatus;
  startDate: string;
  estimatedLaunchDate: string;
  previewUrl?: string;
  stages: ProjectStage[];
  isDemoData: true;
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  clientId: string;
  title: string;
  message: string;
  stageLabel: string;
  authorName: string;
  publishedAt: string;
  isDemoData: true;
}

export type ProjectFileCategory = 'propuesta' | 'diseno' | 'activos' | 'entrega';
export type ProjectFileVisibility = 'client' | 'admin_only';

export interface ProjectFile {
  id: string;
  projectId: string;
  clientId: string;
  uploadedByProfileId?: string;
  visibility?: ProjectFileVisibility;
  fileName: string;
  category: ProjectFileCategory;
  mimeLabel: string;
  sizeLabel: string;
  sharedAt: string;
  storagePathPlaceholder: string;
  isDemoData: true;
}

export type PaymentKind = 'anticipo' | 'saldo' | 'adicional';
export type PaymentVerificationStatus = 'pendiente_verificacion' | 'verificado' | 'observado';

export interface Payment {
  id: string;
  clientId: string;
  projectId: string;
  proposalId?: string;
  kind: PaymentKind;
  concept: string;
  amountUsd: number;
  method: string;
  referenceCode: string;
  receiptLabel: string;
  recordedAt: string;
  status: PaymentVerificationStatus;
  verificationNote: string;
  isDemoData: true;
}

export type NotificationChannel = 'email' | 'whatsapp_manual';
export type NotificationDeliveryStatus = 'pendiente' | 'enviado' | 'fallido';

export interface NotificationLog {
  id: string;
  recipientProfileId?: string;
  recipientEmail: string;
  channel: NotificationChannel;
  eventType:
    | 'lead_recibido'
    | 'propuesta_enviada'
    | 'proyecto_actualizado'
    | 'pago_verificado';
  relatedEntityType: 'lead' | 'proposal' | 'project' | 'payment';
  relatedEntityId: string;
  status: NotificationDeliveryStatus;
  createdAt: string;
  isDemoData: true;
}

export type CatalogGroup =
  | 'Gastronomía'
  | 'Salud y Legal'
  | 'Imagen y Comercio'
  | 'Espacios y Cultura';

export interface Category {
  id: string;
  indexLabel: string;
  slug: string;
  name: string;
  group: CatalogGroup;
  summary: string;
  isPublic: boolean;
}

export interface Showcase {
  id: string;
  categoryId: string;
  title: string;
  demoPath: string;
  highlights: string[];
  featured: boolean;
  status: 'publicada' | 'mantenimiento';
}

export interface StudioWorkspaceDataset {
  profiles: Profile[];
  clients: Client[];
  clientMemberships?: ClientMembership[];
  leads: Lead[];
  proposals: Proposal[];
  projects: Project[];
  projectUpdates: ProjectUpdate[];
  projectFiles: ProjectFile[];
  payments: Payment[];
  categories: Category[];
  showcases: Showcase[];
  notificationLogs?: NotificationLog[];
}

export type AdminModuleKey =
  | 'dashboard'
  | 'leads'
  | 'clientes'
  | 'propuestas'
  | 'proyectos'
  | 'pagos'
  | 'catalogo'
  | 'configuracion';

export interface ClientPortalBundle {
  client: Client | null;
  projects: Project[];
  activeProject: Project | null;
  progressPercent: number;
  updates: ProjectUpdate[];
  files: ProjectFile[];
  proposal: Proposal | null;
  payments: Payment[];
  paidVerifiedUsd: number;
  pendingBalanceUsd: number;
}
