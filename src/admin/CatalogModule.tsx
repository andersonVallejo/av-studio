import React, { useMemo, useState } from 'react';
import { ExternalLink, Search, Star } from 'lucide-react';
import { filterCatalogEntries } from '../platform/formatters';
import { StatusLabel } from '../platform/StatusLabel';
import type { CatalogGroup, Category, Showcase } from '../platform/types';

interface CatalogModuleProps {
  categories: Category[];
  showcases: Showcase[];
  onToggleShowcaseFeatured: (showcaseId: string) => void;
}

const GROUPS: (CatalogGroup | 'todos')[] = [
  'todos',
  'Gastronomía',
  'Salud y Legal',
  'Imagen y Comercio',
  'Espacios y Cultura',
];

export const CatalogModule: React.FC<CatalogModuleProps> = ({
  categories,
  showcases,
  onToggleShowcaseFeatured,
}) => {
  const [groupFilter, setGroupFilter] = useState<CatalogGroup | 'todos'>('todos');
  const [query, setQuery] = useState('');

  const entries = useMemo(
    () => filterCatalogEntries(categories, showcases, groupFilter, query),
    [categories, showcases, groupFilter, query]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[rgba(23,23,23,0.13)]">
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filtrar categorías del catálogo">
          {GROUPS.map((grp) => {
            const active = groupFilter === grp;
            return (
              <button
                key={grp}
                type="button"
                aria-pressed={active}
                onClick={() => setGroupFilter(grp)}
                className={`px-3.5 py-2 text-[0.8125rem] font-medium rounded-[4px] border transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#171717] text-[#F3F0E9] border-[#171717]'
                    : 'bg-[#FAF8F4] text-[#30302E] border-[rgba(23,23,23,0.13)] hover:border-[#171717]'
                }`}
              >
                {grp === 'todos' ? `Todos (${categories.length})` : grp}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-72">
          <label htmlFor="catalog-search" className="sr-only">
            Buscar entre las 16 categorías y demostraciones
          </label>
          <Search
            className="h-4 w-4 text-[#5C5B57] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="catalog-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar sector o demo..."
            className="w-full pl-9 pr-3 py-2 text-[0.875rem] bg-[#FFFFFF] border border-[rgba(23,23,23,0.2)] rounded-[4px]"
          />
        </div>
      </div>

      <div className="border border-[rgba(23,23,23,0.13)] bg-[#FFFFFF] rounded-[6px] overflow-hidden">
        <div className="px-5 py-3.5 bg-[#FAF8F4] border-b border-[rgba(23,23,23,0.13)] flex flex-wrap items-center justify-between gap-2 text-[0.8125rem] text-[#5C5B57]">
          <span>
            Mostrando <strong className="text-[#171717] av-mono">{entries.length}</strong> de{' '}
            <strong className="text-[#171717] av-mono">{categories.length}</strong> sectores públicos reales
          </span>
          <span>Enlaces directos a las {categories.length} demostraciones activas</span>
        </div>

        {entries.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <p className="text-[0.9375rem] font-medium text-[#171717]">
              Ninguna categoría coincide con tu búsqueda o filtro actual.
            </p>
            <p className="text-[0.8125rem] text-[#5C5B57]">
              Ajusta el término de búsqueda o restablece el grupo para ver los 16 sectores del catálogo público.
            </p>
            <button
              type="button"
              onClick={() => {
                setGroupFilter('todos');
                setQuery('');
              }}
              className="px-4 py-2 text-[0.8125rem] font-semibold bg-[#171717] text-[#F3F0E9] rounded-[4px] hover:bg-[#9E4A28] transition-colors"
            >
              Ver todos los sectores
            </button>
          </div>
        ) : (
          <>
            {/* Mobile stacked cards */}
            <ul className="divide-y divide-[rgba(23,23,23,0.1)] md:hidden">
              {entries.map(({ category, showcase }) => {
                const statusLabel = !showcase
                  ? 'Sin demo'
                  : showcase.status === 'publicada'
                    ? 'Publicada'
                    : 'En mantenimiento';
                const statusTone = !showcase
                  ? 'neutral'
                  : showcase.status === 'publicada'
                    ? 'success'
                    : 'warning';
                return (
                  <li key={category.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[0.75rem]">
                          <span className="av-mono font-semibold text-[#9E4A28]">
                            {category.indexLabel}
                          </span>
                          <span className="text-[#5C5B57]">· {category.group}</span>
                        </div>
                        <p className="font-semibold text-[#171717] mt-0.5">{category.name}</p>
                        <p className="text-[0.8125rem] text-[#5C5B57] mt-0.5 leading-relaxed">
                          {category.summary}
                        </p>
                      </div>
                      <StatusLabel label={statusLabel} tone={statusTone} />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[rgba(23,23,23,0.08)]">
                      <span className="text-[0.8125rem] font-medium text-[#30302E] truncate max-w-[200px]">
                        {showcase?.title || 'Sin demo'}
                      </span>
                      <div className="flex items-center gap-2">
                        {showcase ? (
                          <button
                            type="button"
                            aria-pressed={showcase.featured}
                            onClick={() => onToggleShowcaseFeatured(showcase.id)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 text-[0.75rem] font-semibold rounded-[4px] border transition-colors ${
                              showcase.featured
                                ? 'bg-[#171717] text-[#F3F0E9] border-[#171717]'
                                : 'bg-[#FFFFFF] text-[#5C5B57] border-[rgba(23,23,23,0.2)] hover:border-[#171717]'
                            }`}
                          >
                            <Star className="h-3 w-3" aria-hidden="true" />
                            <span>{showcase.featured ? 'Destacada' : 'Destacar'}</span>
                          </button>
                        ) : null}
                        {showcase ? (
                          <a
                            href={showcase.demoPath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-[#9E4A28] hover:text-[#171717]"
                          >
                            <span>Abrir demo</span>
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[rgba(23,23,23,0.13)] text-[0.75rem] font-semibold text-[#5C5B57]">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Categoría y descripción</th>
                    <th className="py-3 px-4">Grupo</th>
                    <th className="py-3 px-4">Demostración</th>
                    <th className="py-3 px-4 text-center">Destacada (vista)</th>
                    <th className="py-3 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(23,23,23,0.08)] text-[0.875rem]">
                  {entries.map(({ category, showcase }) => (
                    <tr key={category.id} className="hover:bg-[#FAF8F4] transition-colors">
                      <td className="py-3.5 px-4 av-mono text-[0.8125rem] text-[#9E4A28] whitespace-nowrap">
                        {category.indexLabel}
                      </td>
                      <td className="py-3.5 px-4 max-w-md">
                        <p className="font-semibold text-[#171717]">{category.name}</p>
                        <p className="text-[0.8125rem] text-[#5C5B57] mt-0.5">{category.summary}</p>
                      </td>
                      <td className="py-3.5 px-4 text-[#30302E] whitespace-nowrap">
                        {category.group}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-[#171717]">
                          {showcase?.title || 'Sin demo'}
                        </p>
                        {showcase ? (
                          <StatusLabel
                            label={showcase.status === 'publicada' ? 'Publicada' : 'En mantenimiento'}
                            tone={showcase.status === 'publicada' ? 'success' : 'warning'}
                          />
                        ) : (
                          <StatusLabel label="Sin demo" tone="neutral" />
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {showcase ? (
                          <button
                            type="button"
                            aria-pressed={showcase.featured}
                            onClick={() => onToggleShowcaseFeatured(showcase.id)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 text-[0.78rem] font-semibold rounded-[4px] border transition-colors ${
                              showcase.featured
                                ? 'bg-[#171717] text-[#F3F0E9] border-[#171717]'
                                : 'bg-[#FFFFFF] text-[#5C5B57] border-[rgba(23,23,23,0.2)] hover:border-[#171717]'
                            }`}
                          >
                            <Star className="h-3 w-3" aria-hidden="true" />
                            <span>{showcase.featured ? 'Sí' : 'No'}</span>
                          </button>
                        ) : null}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {showcase ? (
                          <a
                            href={showcase.demoPath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-[#9E4A28] hover:text-[#171717]"
                          >
                            <span>Abrir demo</span>
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
