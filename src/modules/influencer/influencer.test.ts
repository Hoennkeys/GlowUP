/**
 * Testes unitários — módulo influencer (etapas 5–7)
 * Execução: npm run test:influencer-platform
 */
import { FEATURE_FLAGS, canApproveDeliveries, resolveInfluencerRole } from "@/lib/feature-flags";
import {
  buildEntregaVersionMeta,
  computeFileHash,
  inferTipoMidiaFromMime,
  nextVersionNumber,
} from "@/modules/influencer/domain/entrega-version";
import { hydrateInfluencerPlatform } from "@/modules/influencer/domain/legacy-adapter";
import { buildMockInfluencerForTenant } from "@/modules/influencer/data/mock-influencer-data";
import { createPresignedUploadUrl } from "../../../integrations/storage/s3";
import { fetchPublicMetrics } from "../../../integrations/social/instagram";
import { processMilestonePayment } from "../../../integrations/payments/stripe";
import { publishDeliveryEvent, clearMockEventLog, getMockEventLog } from "../../../integrations/realtime/pusher";

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${label}`);
  } else {
    failed++;
    console.log(`  ✗ ${label}`);
  }
}

async function run() {
  console.log("\n=== Influencer Platform Tests (Etapas 5–7) ===\n");

  // Feature flags & roles
  assert(typeof FEATURE_FLAGS.influencerPlatform === "boolean", "feature flags loaded");
  assert(resolveInfluencerRole({ id: "1", nome: "A", email: "a@t.com", platformRole: "SUPER_ADMIN" }) === "super_admin", "super admin role");
  assert(resolveInfluencerRole({ id: "1", nome: "A", email: "a@t.com", tenantMemberships: [{ tenantId: "t1", tenantSlug: "demo", role: "OWNER" }] }) === "brand_admin", "owner → brand_admin");
  assert(canApproveDeliveries("brand_admin"), "brand_admin can approve");

  // Entrega versioning
  assert(computeFileHash("video.mp4", 1024, "video/mp4").startsWith("vhash_"), "file hash prefix");
  assert(nextVersionNumber([1, 2]) === 3, "next version number");
  assert(inferTipoMidiaFromMime("video/mp4") === "video", "mime → video");
  const meta = buildEntregaVersionMeta({
    entregaId: "e1",
    versao: 1,
    fileName: "reels.mp4",
    mimeType: "video/mp4",
    sizeBytes: 2048,
    tipoMidia: "video",
    uploadedBy: "user-1",
    arquivoUrl: "https://cdn.example.com/reels.mp4",
  });
  assert(meta.versao === 1 && meta.hash.length > 0, "version meta built");

  // Mock data & hydration
  const mock = buildMockInfluencerForTenant("tenant-demo");
  assert(mock.profiles.length >= 2, "demo profiles");
  assert(mock.entregas.length >= 2, "demo entregas");
  const hydrated = hydrateInfluencerPlatform("tenant-demo", {});
  assert(hydrated.profiles.length > 0, "hydrate from empty state");

  // Integrations (mock mode)
  const upload = await createPresignedUploadUrl({
    fileName: "test.jpg",
    mimeType: "image/jpeg",
    sizeBytes: 500,
  });
  assert(upload.mock === true && upload.publicUrl.includes("mock"), "S3 mock upload");

  const metrics = await fetchPublicMetrics({ platform: "instagram", handle: "@test" });
  assert(metrics.seguidores != null && metrics.platform === "instagram", "instagram mock metrics");

  const payment = await processMilestonePayment({
    milestoneId: "ms1",
    campaignId: "c1",
    amountCents: 1500000,
  });
  assert(payment.mock === true && payment.status === "succeeded", "stripe mock payment");

  clearMockEventLog();
  await publishDeliveryEvent({
    entregaId: "e1",
    event: "approved",
    recipientIds: ["user-1"],
  });
  assert(getMockEventLog().length === 1, "realtime mock event published");

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
