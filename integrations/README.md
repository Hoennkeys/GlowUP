# Integrações Externas — GlowUP Plataforma de Influenciadores

> **Etapa 8** — adaptadores, webhooks, jobs e variáveis de ambiente

---

## Visão geral

| Integração     | Pasta                             | Status               | Modo mock                   |
| -------------- | --------------------------------- | -------------------- | --------------------------- |
| Storage S3     | `integrations/storage/s3.ts`      | Presigned URLs       | Sem `AWS_*`                 |
| Instagram      | `integrations/social/index.ts`    | Métricas públicas    | Sem access token            |
| TikTok         | `integrations/social/tiktok.ts`   | Métricas públicas    | Sem `TIKTOK_*`              |
| YouTube        | `integrations/social/youtube.ts`  | Métricas públicas    | Sem `YOUTUBE_*`             |
| Analytics GA4  | `integrations/analytics/ga4.ts`   | Eventos + UTM        | Sem `GA4_*`                 |
| Realtime       | `integrations/realtime/pusher.ts` | Eventos de entrega   | Sem `PUSHER_*`              |
| Pagamentos     | `integrations/payments/stripe.ts` | Milestones / payouts | Sem `STRIPE_*`              |
| E-sign         | `integrations/esign/docusign.ts`  | Envelopes            | Sem `DOCUSIGN_*`            |
| Webhook Stripe | `integrations/webhooks/stripe.ts` | Pagamentos           | Sem `STRIPE_WEBHOOK_SECRET` |
| OAuth social   | `integrations/webhooks/social.ts` | Callbacks            | Sem app secrets             |

Todos os adaptadores funcionam em **modo mock** por padrão — uploads, métricas, pagamentos e assinaturas simulados são suficientes para dev e E2E.

```bash
npm run test:integrations   # 12 testes dos adaptadores
npx tsx scripts/sync-social-metrics.ts --dry-run
```

---

## Storage (S3)

```bash
AWS_S3_BUCKET=glowup-uploads
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
CDN_BASE_URL=https://cdn.glowup.app   # opcional
```

**Uso:** `createPresignedUploadUrl()` via `getPresignedUploadUrlFn` (server function).

---

## Redes sociais

```bash
INSTAGRAM_ACCESS_TOKEN=...
INSTAGRAM_APP_SECRET=...
TIKTOK_CLIENT_KEY=...
TIKTOK_CLIENT_SECRET=...
YOUTUBE_API_KEY=...
YOUTUBE_CLIENT_SECRET=...
VITE_SOCIAL_METRICS_SYNC=true
```

**Uso:**

```typescript
import { fetchPublicMetrics, syncAllPlatformMetrics } from "../integrations/social";

const metrics = await fetchPublicMetrics({ platform: "instagram", handle: "@creator" });
```

**Job cron:** `npx tsx scripts/sync-social-metrics.ts` (diário 06:00 UTC)

---

## Analytics (GA4)

```bash
GA4_MEASUREMENT_ID=G-XXXXXXXX
GA4_API_SECRET=...
VITE_GA4_TRACKING=true
```

**Uso:**

```typescript
import { trackCampaignEvent, buildUtmUrl } from "../integrations/analytics/ga4";

await trackCampaignEvent({ event: "delivery_approved", campaignId: "c1", tenantId: "t1" });
const link = buildUtmUrl("https://glowup.app/c/1", {
  source: "instagram",
  medium: "creator",
  campaign: "launch",
});
```

---

## Realtime (Pusher)

```bash
PUSHER_APP_ID=...
PUSHER_KEY=...
PUSHER_SECRET=...
PUSHER_CLUSTER=sa1
VITE_REALTIME_NOTIFICATIONS=true
```

**Uso:** `publishDeliveryEvent()` ao aprovar/rejeitar entregas.

---

## Pagamentos (Stripe)

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_SANDBOX=true
```

**Uso:** `processMilestonePayment()` para milestones de contrato.

**Webhook:** `handleStripeWebhook(payload, signature)` — endpoint `POST /api/webhooks/stripe`

---

## E-sign (DocuSign)

```bash
DOCUSIGN_INTEGRATION_KEY=...
DOCUSIGN_ACCOUNT_ID=...
VITE_ESIGN_CONTRACTS=true
```

**Uso:** `createSigningRequest()` para contratos digitais.

---

## OAuth callbacks (redes sociais)

```bash
# Redirect URI registrado no app de cada plataforma
# POST /api/webhooks/social/callback
```

**Uso:** `handleSocialOAuthCallback({ platform, code, state, redirectUri })`

---

## Referências

- [`api-contracts.md`](../api-contracts.md) — contratos REST alvo
- [`src/modules/influencer/api/influencer.functions.ts`](../src/modules/influencer/api/influencer.functions.ts) — server functions
- [`.env.example`](../.env.example) — variáveis documentadas
- [`observability.md`](../observability.md) — monitoramento (etapa 10)
