import { DEMO_DATA } from './demoData';
import type {
  Category,
  Client,
  ClientMembership,
  Lead,
  NotificationLog,
  Payment,
  Profile,
  Project,
  ProjectFile,
  ProjectUpdate,
  Proposal,
  Showcase,
  StudioWorkspaceDataset,
} from './types';

/**
 * Abstract repository contract decoupling all AV·STUDIO UI views from data storage.
 * Current implementation returns an in-memory demonstration dataset.
 * Next phase: provide `createSupabaseStudioRepository(supabase)` implementing this same interface.
 */
export interface StudioDataRepository {
  readonly mode: 'demo-in-memory' | 'supabase';
  loadWorkspaceDataset(): Promise<StudioWorkspaceDataset>;
  listProfiles(): Promise<Profile[]>;
  listClients(): Promise<Client[]>;
  listClientMemberships(): Promise<ClientMembership[]>;
  listLeads(): Promise<Lead[]>;
  listProposals(): Promise<Proposal[]>;
  listProjects(): Promise<Project[]>;
  listProjectUpdates(projectId: string): Promise<ProjectUpdate[]>;
  listProjectFiles(projectId: string): Promise<ProjectFile[]>;
  listPayments(): Promise<Payment[]>;
  listCategories(): Promise<Category[]>;
  listShowcases(): Promise<Showcase[]>;
  listNotificationLogs(): Promise<NotificationLog[]>;
}

export function createDemoStudioRepository(): StudioDataRepository {
  const cloneDataset = (): StudioWorkspaceDataset => structuredClone(DEMO_DATA);

  return {
    mode: 'demo-in-memory',
    async loadWorkspaceDataset() {
      return cloneDataset();
    },
    async listProfiles() {
      return cloneDataset().profiles;
    },
    async listClients() {
      return cloneDataset().clients;
    },
    async listClientMemberships() {
      return cloneDataset().clientMemberships || [];
    },
    async listLeads() {
      return cloneDataset().leads;
    },
    async listProposals() {
      return cloneDataset().proposals;
    },
    async listProjects() {
      return cloneDataset().projects;
    },
    async listProjectUpdates(projectId: string) {
      return cloneDataset().projectUpdates.filter((u) => u.projectId === projectId);
    },
    async listProjectFiles(projectId: string) {
      return cloneDataset().projectFiles.filter((f) => f.projectId === projectId);
    },
    async listPayments() {
      return cloneDataset().payments;
    },
    async listCategories() {
      return cloneDataset().categories;
    },
    async listShowcases() {
      return cloneDataset().showcases;
    },
    async listNotificationLogs() {
      return cloneDataset().notificationLogs || [];
    },
  };
}

export interface SupabaseTablePlan {
  table: keyof {
    profiles: true;
    clients: true;
    client_memberships: true;
    leads: true;
    proposals: true;
    projects: true;
    project_updates: true;
    project_files: true;
    payments: true;
    categories: true;
    showcases: true;
    notification_logs: true;
  };
  purpose: string;
  rlsPolicyPlan: string;
  currentStatus: string;
}

export const SUPABASE_MIGRATION_BLUEPRINT: SupabaseTablePlan[] = [
  {
    table: 'profiles',
    purpose: 'Perfiles vinculados a Supabase Auth (rol admin para Anderson Vallejo o client invitado).',
    rlsPolicyPlan: 'Cada usuario autenticado lee únicamente su propio perfil; admin lee y gestiona todos.',
    currentStatus: 'Contrato TypeScript preparado · Sin autenticación activa',
  },
  {
    table: 'clients',
    purpose: 'Ficha comercial y contacto de negocios clientes, con trazabilidad opcional converted_from_lead_id.',
    rlsPolicyPlan: 'Solo admin escribe; usuarios autenticados leen únicamente clientes donde poseen membresía activa.',
    currentStatus: 'Datos ficticios de demostración en memoria',
  },
  {
    table: 'client_memberships',
    purpose: 'Relación N:M entre usuarios autenticados (profiles) y cuentas cliente (owner / collaborator).',
    rlsPolicyPlan: 'Admin gestiona invitaciones y membresías; el usuario solo lee sus propias membresías.',
    currentStatus: 'Contrato preparado para RLS multiusuario · Sin Auth activo',
  },
  {
    table: 'leads',
    purpose: 'Bandeja persistente de solicitudes enviadas desde el formulario público y enlace converted_client_id.',
    rlsPolicyPlan: 'Inserción pública validada vía Edge Function/RPC; lectura y actualización solo admin.',
    currentStatus: 'Datos ficticios de demostración en memoria',
  },
  {
    table: 'proposals',
    purpose: 'Presupuestos versionados (proposal_group_id, version_number), entregables por ítem y condiciones.',
    rlsPolicyPlan: 'Admin gestiona versiones; cliente solo consulta propuestas asociadas a su membresía.',
    currentStatus: 'Cálculo local y constructor visual · Sin guardado en servidor',
  },
  {
    table: 'projects',
    purpose: 'Múltiples proyectos por cliente con etapas, fechas objetivo, estado general y vista previa.',
    rlsPolicyPlan: 'Admin actualiza etapas; cliente solo consulta proyectos donde tiene membresía vigente.',
    currentStatus: 'Vista de progreso visual · Sin persistencia',
  },
  {
    table: 'project_updates',
    purpose: 'Bitácora cronológica de avances compartidos con el cliente.',
    rlsPolicyPlan: 'Admin publica; cliente lee solo actualizaciones de sus proyectos.',
    currentStatus: 'Datos ficticios de demostración en memoria',
  },
  {
    table: 'project_files',
    purpose: 'Metadatos, visibilidad (client / admin_only), autor (uploaded_by_profile_id) y rutas de Storage.',
    rlsPolicyPlan: 'URLs firmadas temporales de Storage validando membresía y visibilidad.',
    currentStatus: 'Solo listado visual · Sin carga ni descarga real',
  },
  {
    table: 'payments',
    purpose: 'Múltiples pagos por proyecto (anticipos, saldos, adicionales) con verificación manual.',
    rlsPolicyPlan: 'Admin verifica manualmente; cliente visualiza sus pagos sin editar estado.',
    currentStatus: 'Flujo visual de verificación manual · Sin pasarela ni subida real',
  },
  {
    table: 'categories',
    purpose: 'Catálogo maestro de los 16 sectores de negocio de AV·STUDIO.',
    rlsPolicyPlan: 'Lectura pública; edición reservada al rol admin.',
    currentStatus: 'Sincronizado con las 16 categorías reales del sitio público',
  },
  {
    table: 'showcases',
    purpose: 'Demostraciones interactivas asociadas a cada categoría.',
    rlsPolicyPlan: 'Lectura pública de demos publicadas; gestión reservada al rol admin.',
    currentStatus: 'Enlazado a las 16 demos reales (/demos/*)',
  },
  {
    table: 'notification_logs',
    purpose: 'Registro auditable de avisos por correo/Edge Functions (solicitud, propuesta, avance, pago).',
    rlsPolicyPlan: 'Escritura exclusiva desde Edge Functions / service_role; lectura reservada al rol admin.',
    currentStatus: 'Contrato preparado · Sin envío automático conectado',
  },
];
