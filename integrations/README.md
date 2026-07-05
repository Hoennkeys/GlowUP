# Integrações Externas — GlowUP Plataforma de Influenciadores

> **Etapa 6** — adaptadores, setup e variáveis de ambiente

---

## Visão geral

| Integração | Pasta | Status | Modo mock |
| --- | --- | --- | --- |
| Storage S3 | `integrations/storage/s3.ts` | Presigned URLs | Sem `AWS_*` |
| Redes sociais | `integrations/social/instagram.ts` | Métricas públicas | Sem access token |
| Realtime | `integrations/realtime/pusher.ts` | Eventos de entrega | Sem `PUSHER_*` |
| Pagamentos | `integrations/payments/stripe.ts` | Milestones / payouts | Sem `STRIPE_*` |

Todos os adaptadores funcionam em **modo mock** por padrão em desenvolvimento — uploads, métricas e pagamentos simulados são suficientes para fluxos E2E.

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
TIKTOK_CLIENT_KEY=...
TIKTOK_CLIENT_SECRET=...
YOUTUBE_API_KEY=...
VITE_SOCIAL_METRICS_SYNC=true
```

**Uso:** `fetchPublicMetrics()` / `syncAllPlatformMetrics()` no onboarding e sync jobs.

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

---

## E-sign (futuro)

DocuSign / HelloSign — integrar em `integrations/esign/` quando contratos digitais forem prioridade.

---

## Jobs de sincronização

Cron sugerido (staging/prod):

```bash
# Métricas sociais — diário 06:00 UTC
npx tsx scripts/sync-social-metrics.ts

# Webhooks Stripe — endpoint POST /api/webhooks/stripe
```

---

## Referências

- [`api-contracts.md`](../api-contracts.md) — contratos REST alvo
- [`src/modules/influencer/api/influencer.functions.ts`](../src/modules/influencer/api/influencer.functions.ts) — server functions
- [`.env.example`](../.env.example) — variáveis documentadas
