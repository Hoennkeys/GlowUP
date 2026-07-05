/**
 * Unit tests for influencer platform UI helpers and component logic.
 * Run: npx tsx src/components/influencer/influencer-components.test.ts
 */

import {
  formatMetricCount,
  getPrimaryFollowerCount,
  CAMPAIGN_STATUS_CONFIG,
  ENTREGA_STATUS_CONFIG,
  initialsFromName,
  acceptMimeForMediaTypes,
  aggregatePainelMetricas,
  countEntregasAprovadas,
} from "./helpers";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ ${message}`);
  }
}

console.log("\n=== Influencer Components Tests ===\n");

// formatMetricCount
assert(formatMetricCount(500) === "500", "500 stays as-is");
assert(formatMetricCount(45000) === "45K", "45000 → 45K");
assert(formatMetricCount(1200000) === "1.2M", "1200000 → 1.2M");

// getPrimaryFollowerCount
assert(
  getPrimaryFollowerCount({ instagram: { seguidores: 10000 }, tiktok: { seguidores: 5000 } }) ===
    10000,
  "Instagram followers prioritized",
);
assert(getPrimaryFollowerCount({}) === 0, "Empty metrics → 0");

// initialsFromName
assert(initialsFromName("João Cliente") === "JC", "Initials from full name");
assert(initialsFromName("Ana") === "A", "Single name initial");

// CAMPAIGN_STATUS_CONFIG
assert(CAMPAIGN_STATUS_CONFIG.active.label === "Ativa", "Active campaign label");
assert(CAMPAIGN_STATUS_CONFIG.draft.label === "Rascunho", "Draft campaign label");
assert(Object.keys(CAMPAIGN_STATUS_CONFIG).length === 4, "All 4 campaign statuses");

// ENTREGA_STATUS_CONFIG
assert(ENTREGA_STATUS_CONFIG.aprovado.label === "Aprovado", "Approved delivery label");
assert(ENTREGA_STATUS_CONFIG.rejeitado.label === "Rejeitado", "Rejected delivery label");
assert(Object.keys(ENTREGA_STATUS_CONFIG).length === 5, "All 5 delivery statuses");

// acceptMimeForMediaTypes
assert(acceptMimeForMediaTypes(["imagem"]).includes("image/*"), "Image mime type");
assert(acceptMimeForMediaTypes(["video"]).includes("video/*"), "Video mime type");
assert(acceptMimeForMediaTypes(["imagem", "video"]).includes("image/*"), "Multiple types");

// aggregatePainelMetricas
const emptyAgg = aggregatePainelMetricas([]);
assert(emptyAgg.alcance === 0, "Empty paineis → zero alcance");
assert(emptyAgg.roi === null, "Empty paineis → null ROI");

const samplePaineis = [
  {
    id: "p1",
    tenantId: "t1",
    campanhaId: "c1",
    periodo: { inicio: "2026-01-01", fim: "2026-02-01" },
    metricas: {
      alcance: 100000,
      impressoes: 200000,
      cliques: 5000,
      engajamento: 4.0,
      conversoes: 100,
      roi: 2.0,
      receitaParceria: 10000,
      cpm: 50,
    },
    porPlataforma: {},
    exportMediaKit: false,
    atualizadoEm: "2026-01-01",
  },
  {
    id: "p2",
    tenantId: "t1",
    campanhaId: "c2",
    periodo: { inicio: "2026-02-01", fim: "2026-03-01" },
    metricas: {
      alcance: 200000,
      impressoes: 400000,
      cliques: 8000,
      engajamento: 6.0,
      conversoes: 200,
      roi: 3.0,
      receitaParceria: 20000,
      cpm: 60,
    },
    porPlataforma: {},
    exportMediaKit: false,
    atualizadoEm: "2026-02-01",
  },
];
const agg = aggregatePainelMetricas(samplePaineis);
assert(agg.alcance === 300000, "Aggregated alcance");
assert(agg.engajamento === 5, "Average engajamento");
assert(agg.roi === 2.5, "Average ROI");

// countEntregasAprovadas
assert(
  countEntregasAprovadas([
    {
      id: "e1",
      tenantId: "t1",
      campanhaId: "c1",
      influencerId: "i1",
      titulo: "Test",
      tipoMidia: "reels",
      versao: 1,
      statusAprovacao: "aprovado",
      comentarios: [],
      criadoEm: "2026-01-01",
      atualizadoEm: "2026-01-01",
    },
    {
      id: "e2",
      tenantId: "t1",
      campanhaId: "c1",
      influencerId: "i1",
      titulo: "Test 2",
      tipoMidia: "stories",
      versao: 1,
      statusAprovacao: "pendente",
      comentarios: [],
      criadoEm: "2026-01-01",
      atualizadoEm: "2026-01-01",
    },
  ]) === 1,
  "Count approved deliveries",
);

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
