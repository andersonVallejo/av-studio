import React, { useState } from 'react';
import { CheckSquare, ExternalLink, Square } from 'lucide-react';
import { calculateProjectProgress, formatShortDate } from '../platform/formatters';
import { StatusLabel, type StatusTone } from '../platform/StatusLabel';
import type {
  Client,
  Project,
  ProjectFile,
  ProjectStatus,
  ProjectUpdate,
} from '../platform/types';

interface ProjectsModuleProps {
  projects: Project[];
  clients: Client[];
  updates: ProjectUpdate[];
  files: ProjectFile[];
  onToggleStage: (projectId: string, stageId: string) => void;
  onUpdateProjectStatus: (projectId: string, nextStatus: ProjectStatus) => void;
}

const PROJECT_STATUS_META: Record<ProjectStatus, { label: string; tone: StatusTone }> = {
  diagnostico: { label: 'Diagnóstico', tone: 'neutral' },
  diseno_visual: { label: 'Diseño visual', tone: 'accent' },
  desarrollo: { label: 'En desarrollo', tone: 'accent' },
  revision_cliente: { label: 'Revisión del cliente', tone: 'warning' },
  publicado: { label: 'Publicado', tone: 'success' },
};

const PROJECT_STATUS_OPTIONS: { value: ProjectStatus | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'diagnostico', label: 'Diagnóstico' },
  { value: 'diseno_visual', label: 'Diseño visual' },
  { value: 'desarrollo', label: 'En desarrollo' },
  { value: 'revision_cliente', label: 'Revisión del cliente' },
  { value: 'publicado', label: 'Publicado' },
];

export const ProjectsModule: React.FC<ProjectsModuleProps> = ({
  projects,
  clients,
  updates,
  files,
  onToggleStage,
  onUpdateProjectStatus,
}) => {
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'todos'>('todos');
  const [selectedId, setSelectedId] = useState<string>(projects[0]?.id || '');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const clientById = new Map(clients.map((c) => [c.id, c]));
  const filteredProjects =
    statusFilter === 'todos'
      ? projects
      : projects.filter((p) => p.status === statusFilter);
  const selectedProject =
    filteredProjects.find((p) => p.id === selectedId) || filteredProjects[0] || null;
  const projectUpdates = selectedProject
    ? updates.filter((u) => u.projectId === selectedProject.id)
    : [];
  const projectFiles = selectedProject
    ? files.filter((f) => f.projectId === selectedProject.id)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[rgba(23,23,23,0.13)]">
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filtrar proyectos por estado">
          {PROJECT_STATUS_OPTIONS.map((opt) => {
            const active = statusFilter === opt.value;
            const count =
              opt.value === 'todos'
                ? projects.length
                : projects.filter((p) => p.status === opt.value).length;
            return (
              <button
                key={opt.value}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setStatusFilter(opt.value);
                  setFeedbackMessage(null);
                }}
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

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <section className="xl:col-span-5 border border-[rgba(23,23,23,0.13)] bg-[#FFFFFF] rounded-[6px] overflow-hidden">
          <div className="px-5 py-4 border-b border-[rgba(23,23,23,0.13)] bg-[#FAF8F4]">
            <h2 className="av-display text-[1.5rem] text-[#171717]">
              Proyectos en seguimiento ({filteredProjects.length})
            </h2>
            <p className="text-[0.8125rem] text-[#5C5B57]">
              Control de etapas, avance porcentual y vistas previas compartidas.
            </p>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="p-6 text-center space-y-3">
              <p className="text-[0.875rem] text-[#5C5B57]">
                No hay proyectos en este estado.
              </p>
              <button
                type="button"
                onClick={() => setStatusFilter('todos')}
                className="px-4 py-2 text-[0.8125rem] font-semibold bg-[#171717] text-[#F3F0E9] rounded-[4px]"
              >
                Mostrar todos ({projects.length})
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-[rgba(23,23,23,0.08)]">
              {filteredProjects.map((project) => {
                const progress = calculateProjectProgress(project.stages);
                const meta = PROJECT_STATUS_META[project.status];
                const isSelected = selectedProject?.id === project.id;
                const client = clientById.get(project.clientId);
                return (
                  <li key={project.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(project.id);
                        setFeedbackMessage(null);
                      }}
                      className={`w-full text-left p-5 space-y-2.5 transition-colors ${
                        isSelected ? 'bg-[#F3F0E9]' : 'hover:bg-[#FAF8F4]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="av-mono text-[0.75rem] text-[#9E4A28]">
                          {project.code} · {project.sector}
                        </span>
                        <StatusLabel label={meta.label} tone={meta.tone} />
                      </div>
                      <p className="font-semibold text-[#171717]">{project.name}</p>
                      <p className="text-[0.8125rem] text-[#5C5B57]">
                        {client?.businessName || 'Cliente de ejemplo'}
                      </p>
                      <div className="flex items-center gap-3 pt-1">
                        <div className="h-1.5 flex-1 bg-[#E8E3D8] rounded-[2px] overflow-hidden">
                          <div
                            className="h-full bg-[#C96F4A]"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="av-mono text-[0.8125rem] font-medium text-[#171717]">
                          {progress}%
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="xl:col-span-7 border border-[rgba(23,23,23,0.13)] bg-[#FAF8F4] rounded-[6px] p-5 sm:p-6">
          {selectedProject ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[rgba(23,23,23,0.13)]">
                <div className="min-w-0 flex-1">
                  <p className="av-mono text-[0.75rem] text-[#9E4A28] mb-1">
                    {selectedProject.code} · Inicio {formatShortDate(selectedProject.startDate)}
                  </p>
                  <h2 className="av-display text-[1.75rem] sm:text-[1.85rem] text-[#171717]">
                    {selectedProject.name}
                  </h2>
                  <p className="text-[0.875rem] text-[#30302E] mt-1 max-w-[60ch]">
                    {selectedProject.summary}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  {selectedProject.previewUrl ? (
                    <a
                      href={selectedProject.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[0.8125rem] font-semibold bg-[#171717] text-[#F3F0E9] rounded-[4px] hover:bg-[#9E4A28] transition-colors whitespace-nowrap"
                    >
                      <span>Ver vista previa</span>
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                  <span className="block text-[0.75rem] font-semibold text-[#5C5B57] mb-1">
                    Avance calculado
                  </span>
                  <p className="av-display text-[2rem] text-[#171717] av-tabular">
                    {calculateProjectProgress(selectedProject.stages)}%
                  </p>
                </div>
                <div>
                  <span className="block text-[0.75rem] font-semibold text-[#5C5B57] mb-1">
                    Entrega estimada
                  </span>
                  <p className="av-mono text-[0.9375rem] text-[#171717]">
                    {formatShortDate(selectedProject.estimatedLaunchDate)}
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="project-status-select"
                    className="block text-[0.75rem] font-semibold text-[#5C5B57] mb-1"
                  >
                    Estado general (en memoria)
                  </label>
                  <select
                    id="project-status-select"
                    value={selectedProject.status}
                    onChange={(e) => {
                      const next = e.target.value as ProjectStatus;
                      onUpdateProjectStatus(selectedProject.id, next);
                      setFeedbackMessage(
                        `Estado del proyecto actualizado a "${PROJECT_STATUS_META[next].label}" en memoria.`
                      );
                    }}
                    className="w-full px-3 py-2 text-[0.875rem] bg-[#FFFFFF] border border-[rgba(23,23,23,0.2)] rounded-[4px]"
                  >
                    {(Object.keys(PROJECT_STATUS_META) as ProjectStatus[]).map((key) => (
                      <option key={key} value={key}>
                        {PROJECT_STATUS_META[key].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Interactive Stages List */}
              <div className="pt-4 border-t border-[rgba(23,23,23,0.13)] space-y-3">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-[0.875rem] font-semibold text-[#171717]">
                    Etapas del proyecto (marca para probar recálculo visual)
                  </h3>
                </div>

                <ul className="divide-y divide-[rgba(23,23,23,0.1)] bg-[#FFFFFF] border border-[rgba(23,23,23,0.13)] rounded-[4px]">
                  {selectedProject.stages.map((stage) => (
                    <li key={stage.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onToggleStage(selectedProject.id, stage.id);
                          setFeedbackMessage('Etapa actualizada temporalmente en memoria.');
                        }}
                        className="w-full text-left px-4 py-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 hover:bg-[#FAF8F4] transition-colors"
                      >
                        <span className="flex items-start gap-3">
                          {stage.completed ? (
                            <CheckSquare className="h-4 w-4 text-[#166534] mt-0.5 shrink-0" aria-hidden="true" />
                          ) : (
                            <Square className="h-4 w-4 text-[#5C5B57] mt-0.5 shrink-0" aria-hidden="true" />
                          )}
                          <span>
                            <span className="block font-semibold text-[0.875rem] text-[#171717]">
                              {String(stage.order).padStart(2, '0')}. {stage.title}
                            </span>
                            <span className="block text-[0.8125rem] text-[#5C5B57]">
                              {stage.description}
                            </span>
                          </span>
                        </span>
                        <span className="av-mono text-[0.75rem] text-[#5C5B57] whitespace-nowrap pl-7 sm:pl-0 pt-0.5">
                          {formatShortDate(stage.targetDate)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Project Updates & Shared Files */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <h3 className="text-[0.8125rem] font-semibold text-[#30302E]">
                    Actualizaciones compartidas ({projectUpdates.length})
                  </h3>
                  {projectUpdates.length === 0 ? (
                    <p className="text-[0.8125rem] text-[#5C5B57]">Sin actualizaciones publicadas.</p>
                  ) : (
                    <ul className="space-y-2">
                      {projectUpdates.map((upd) => (
                        <li
                          key={upd.id}
                          className="p-3 bg-[#FFFFFF] border border-[rgba(23,23,23,0.1)] rounded-[4px] text-[0.8125rem]"
                        >
                          <p className="av-mono text-[0.72rem] text-[#9E4A28]">
                            {formatShortDate(upd.publishedAt)} · {upd.stageLabel}
                          </p>
                          <p className="font-semibold text-[#171717] mt-0.5">{upd.title}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-[0.8125rem] font-semibold text-[#30302E]">
                    Archivos vinculados ({projectFiles.length})
                  </h3>
                  {projectFiles.length === 0 ? (
                    <p className="text-[0.8125rem] text-[#5C5B57]">Sin archivos adjuntos aún.</p>
                  ) : (
                    <ul className="space-y-2">
                      {projectFiles.map((file) => (
                        <li
                          key={file.id}
                          className="p-3 bg-[#FFFFFF] border border-[rgba(23,23,23,0.1)] rounded-[4px] text-[0.8125rem]"
                        >
                          <p className="font-semibold text-[#171717] break-all">{file.fileName}</p>
                          <p className="text-[#5C5B57]">
                            {file.mimeLabel} · {file.sizeLabel}
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
              Selecciona un proyecto para ver su detalle y etapas.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};
