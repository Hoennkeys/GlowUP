/**
 * Unit tests for migration 001.
 * Run: npx tsx migrations/001-migrate-contacts-to-profiles.test.ts
 */

import {
  migrateContactsToProfiles,
  migrateLeadToProfile,
  migrateLeadToCampaign,
} from "./001-migrate-contacts-to-profiles";
import { DEMO_SNAPSHOT } from "./fixtures/demo-snapshot";

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

console.log("\n=== Migration 001 Tests ===\n");

// Lead → Profile
const profile = migrateLeadToProfile(DEMO_SNAPSHOT.leads[0], "tenant-demo");
assert(profile.nome === "João Cliente", "Profile nome from contato");
assert(profile.legacyLeadId === "lead-demo-jc-ativo", "Profile preserves legacyLeadId");
assert(profile.email === "cliente@demo.com", "Profile email preserved");

// Lead → Campaign (skip Sem Contato)
const campaignActive = migrateLeadToCampaign(
  DEMO_SNAPSHOT.leads[0],
  "tenant-demo",
  "brand_client-001",
);
assert(campaignActive?.status === "active", "Proposta Enviada → active campaign");
assert(campaignActive?.budget === 15000, "Campaign budget from lead.valor");

const campaignSkipped = migrateLeadToCampaign(
  DEMO_SNAPSHOT.leads[1],
  "tenant-demo",
  "brand_unknown",
);
assert(campaignSkipped === null, "Sem Contato lead skipped for campaign");

// Full migration
const result = migrateContactsToProfiles(DEMO_SNAPSHOT, "tenant-demo");
assert(result.stats.profiles === 2, "2 profiles migrated");
assert(result.stats.campaigns === 1, "1 campaign (Sem Contato skipped)");
assert(result.stats.brands === 1, "1 brand from client-001");
assert(result.stats.checklists === 1, "1 checklist from tarefa");
assert(result.stats.contratos === 1, "1 contrato from proposta");
assert(result.stats.pagamentos === 1, "1 pagamento from fatura");

// Legacy data preserved
assert(result.snapshot.leads.length === 2, "Legacy leads preserved");
assert(result.snapshot.propostas.length === 1, "Legacy propostas preserved");

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
