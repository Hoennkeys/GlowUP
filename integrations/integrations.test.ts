/**
 * Testes de integrações externas (etapa 8)
 * Execução: npm run test:integrations
 */
import { createPresignedUploadUrl } from "../integrations/storage/s3";
import { fetchPublicMetrics, syncAllPlatformMetrics } from "../integrations/social";
import {
  trackCampaignEvent,
  buildUtmUrl,
  clearMockAnalyticsLog,
} from "../integrations/analytics/ga4";
import { createSigningRequest } from "../integrations/esign/docusign";
import { handleStripeWebhook } from "../integrations/webhooks/stripe";
import { handleSocialOAuthCallback } from "../integrations/webhooks/social";
import { processMilestonePayment } from "../integrations/payments/stripe";
import {
  publishDeliveryEvent,
  clearMockEventLog,
  getMockEventLog,
} from "../integrations/realtime/pusher";

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
  console.log("\n=== Integrations Tests (Etapa 8) ===\n");

  const upload = await createPresignedUploadUrl({
    fileName: "reels.mp4",
    mimeType: "video/mp4",
    sizeBytes: 1024,
  });
  assert(upload.mock && upload.publicUrl.includes("mock"), "S3 presigned mock");

  for (const platform of ["instagram", "tiktok", "youtube"] as const) {
    const m = await fetchPublicMetrics({ platform, handle: "@test" });
    assert(m.platform === platform && m.fetchedAt.length > 0, `${platform} metrics mock`);
  }

  const synced = await syncAllPlatformMetrics([
    { platform: "instagram", handle: "@a" },
    { platform: "tiktok", handle: "@a" },
  ]);
  assert(synced.length === 2, "syncAllPlatformMetrics");

  clearMockAnalyticsLog();
  const tracked = await trackCampaignEvent({
    event: "delivery_approved",
    campaignId: "c1",
    tenantId: "t1",
  });
  assert(tracked.mock && tracked.ok, "GA4 track mock");

  const utm = buildUtmUrl("https://glowup.app/c/1", {
    source: "instagram",
    medium: "creator",
    campaign: "launch_x3",
  });
  assert(utm.includes("utm_source=instagram"), "UTM builder");

  const signing = await createSigningRequest({
    contractId: "ctr1",
    signerEmail: "a@test.com",
    signerName: "Ana",
    documentUrl: "https://example.com/doc.pdf",
    returnUrl: "https://glowup.app/signed",
  });
  assert(signing.mock && signing.envelopeId.startsWith("env_mock_"), "DocuSign mock");

  const webhook = await handleStripeWebhook(
    JSON.stringify({
      id: "evt_1",
      type: "payment_intent.succeeded",
      data: { object: { id: "pi_1", metadata: { milestoneId: "ms1" } } },
    }),
  );
  assert(webhook.handled && webhook.action === "milestone_paid", "Stripe webhook mock");

  const oauth = await handleSocialOAuthCallback({
    platform: "instagram",
    code: "auth_code_123",
    state: "state_abc",
    redirectUri: "https://glowup.app/oauth/callback",
  });
  assert(oauth.mock && oauth.accessToken.startsWith("mock_token_"), "Social OAuth mock");

  const payment = await processMilestonePayment({
    milestoneId: "ms1",
    campaignId: "c1",
    amountCents: 500000,
  });
  assert(payment.mock && payment.status === "succeeded", "Stripe payment mock");

  clearMockEventLog();
  await publishDeliveryEvent({
    entregaId: "e1",
    event: "approved",
    recipientIds: ["u1"],
  });
  assert(getMockEventLog().length === 1, "Pusher realtime mock");

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
