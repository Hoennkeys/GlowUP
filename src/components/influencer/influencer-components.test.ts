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

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
