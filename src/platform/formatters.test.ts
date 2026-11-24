import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDashboardSummary,
  calculateProjectProgress,
  calculateProposalTotals,
  filterCatalogEntries,
  filterLeads,
  formatUsd,
  getClientPortalBundle,
  validatePaymentDraft,
  validateProposalDraft,
} from './formatters';
import { DEMO_DATA } from './demoData';

test('formatUsd formats currency values cleanly in USD', () => {
  assert.equal(formatUsd(1250), '$1,250.00');
  assert.equal(formatUsd(425.5), '$425.50');
  assert.equal(formatUsd(Number.NaN), '$0.00');
});

test('calculateProposalTotals calculates subtotal, deposit, and remaining balance accurately', () => {
  const result = calculateProposalTotals(
    [
      { amountUsd: 550 },
      { amountUsd: 250 },
    ],
    50
  );
  assert.equal(result.subtotalUsd, 800);
  assert.equal(result.depositPercent, 50);
  assert.equal(result.depositUsd, 400);
  assert.equal(result.balanceUsd, 400);
});

test('calculateProjectProgress returns percentage completion across stages', () => {
  assert.equal(calculateProjectProgress([]), 0);
  assert.equal(
    calculateProjectProgress([
      { completed: true },
      { completed: true },
      { completed: false },
      { completed: false },
    ]),
    50
  );
  assert.equal(
    calculateProjectProgress([
      { completed: true },
      { completed: true },
      { completed: true },
    ]),
    100
  );
});

test('calculateDashboardSummary aggregates metrics from dataset without fabricating data', () => {
  const summary = calculateDashboardSummary(DEMO_DATA);
  assert.equal(summary.publicCategoriesCount, 16);
  assert.equal(summary.totalLeads, DEMO_DATA.leads.length);
  assert.equal(summary.pendingLeads, 2);
  assert.equal(summary.totalClients, 3);
  assert.equal(summary.activeClients, 2);
  assert.equal(summary.totalProjects, 2);
  assert.equal(summary.activeProjects, 2);
  assert.equal(summary.pendingProposals, 1);
  assert.equal(summary.verifiedPaymentsCount, 2);
  assert.equal(summary.pendingPaymentsCount, 2);
  assert.equal(summary.verifiedPaymentsUsd, 620);
  assert.equal(summary.pendingPaymentsUsd, 620);
});

test('filterLeads filters by status and search text case-insensitively', () => {
  const allNuevo = filterLeads(DEMO_DATA.leads, '', 'nuevo');
  assert.ok(allNuevo.every((lead) => lead.status === 'nuevo'));

  const searchCafeteria = filterLeads(DEMO_DATA.leads, 'café', 'todos');
  assert.ok(searchCafeteria.length >= 1);
  assert.ok(
    searchCafeteria.some((l) => l.business.toLowerCase().includes('caf') || l.sector.toLowerCase().includes('caf'))
  );
});

test('filterCatalogEntries preserves all 16 categories and supports group filtering', () => {
  const all = filterCatalogEntries(DEMO_DATA.categories, DEMO_DATA.showcases, 'todos', '');
  assert.equal(all.length, 16);
  assert.ok(all.every((entry) => Boolean(entry.showcase?.demoPath)));

  const gastro = filterCatalogEntries(DEMO_DATA.categories, DEMO_DATA.showcases, 'Gastronomía', '');
  assert.equal(gastro.length, 4);
});

test('validateProposalDraft and validatePaymentDraft enforce non-empty valid fields and relational consistency', () => {
  const invalidProposal = validateProposalDraft({
    clientId: '',
    title: 'Web',
    sector: 'Restaurante',
    depositPercent: 50,
    estimatedWeeks: '',
    validUntil: '',
    conditions: 'ok',
    items: [{ title: '', detail: '', amountUsd: -5 }],
  });
  assert.equal(invalidProposal.valid, false);
  assert.ok(invalidProposal.errors.length >= 4);

  const validProposal = validateProposalDraft({
    clientId: 'cli-demo-01',
    title: 'Propuesta sitio corporativo ejemplo',
    sector: 'Servicios jurídicos',
    depositPercent: 50,
    estimatedWeeks: '3 semanas',
    validUntil: '2026-12-30',
    conditions: '50% anticipo, 50% contra aprobación final',
    items: [{ title: 'Arquitectura editorial', detail: 'Portada y áreas', amountUsd: 480 }],
  });
  assert.equal(validProposal.valid, true);

  const invalidPayment = validatePaymentDraft({
    clientId: '',
    projectId: '',
    concept: 'ab',
    amountUsd: -10,
    referenceCode: '1',
  });
  assert.equal(invalidPayment.valid, false);

  const mismatchedPayment = validatePaymentDraft({
    clientId: 'cli-demo-01',
    projectId: 'prj-demo-02',
    projectClientId: 'cli-demo-02',
    concept: 'Anticipo 50%',
    amountUsd: 350,
    referenceCode: 'TRF-DEMO-900',
  });
  assert.equal(mismatchedPayment.valid, false);
  assert.ok(
    mismatchedPayment.errors.some((err) => err.includes('no pertenece al cliente'))
  );
});

test('getClientPortalBundle strictly scopes data to the requested client and filters admin-only files', () => {
  const bundleA = getClientPortalBundle('cli-demo-01', DEMO_DATA);
  assert.equal(bundleA.client?.id, 'cli-demo-01');
  assert.ok(bundleA.activeProject !== null);
  assert.ok(bundleA.updates.every((u) => u.clientId === 'cli-demo-01'));
  assert.ok(bundleA.files.every((f) => f.clientId === 'cli-demo-01'));
  assert.ok(bundleA.payments.every((p) => p.clientId === 'cli-demo-01'));

  const withHiddenFile = structuredClone(DEMO_DATA);
  withHiddenFile.projectFiles.push({
    id: 'fil-admin-hidden',
    projectId: 'prj-demo-01',
    clientId: 'cli-demo-01',
    visibility: 'admin_only',
    fileName: 'Notas-Internas-Estudio.pdf',
    category: 'entrega',
    mimeLabel: 'PDF interno',
    sizeLabel: '120 KB',
    sharedAt: '2026-11-18',
    storagePathPlaceholder: 'supabase://internal/notas.pdf',
    isDemoData: true,
  });
  const filteredBundle = getClientPortalBundle('cli-demo-01', withHiddenFile);
  assert.equal(
    filteredBundle.files.some((f) => f.id === 'fil-admin-hidden'),
    false
  );

  const bundleEmpty = getClientPortalBundle('cli-demo-03', DEMO_DATA);
  assert.equal(bundleEmpty.client?.id, 'cli-demo-03');
  assert.equal(bundleEmpty.activeProject, null);
  assert.equal(bundleEmpty.progressPercent, 0);

  const bundleUnknown = getClientPortalBundle('no-existe', DEMO_DATA);
  assert.equal(bundleUnknown.client, null);
  assert.equal(bundleUnknown.projects.length, 0);
});
