# Observabilidade — GlowUP

> **Etapa 10** — erros, métricas, logs e alertas

---

## Stack recomendada

| Camada | Ferramenta | Variável | Status |
| --- | --- | --- | --- |
| Erros | Sentry | `SENTRY_DSN` | Scaffold em `src/lib/observability.ts` |
| Logs | JSON estruturado | — | `logger.*` em observability |
| Métricas | Prometheus / Datadog | — | `incrementMetric()` placeholder |
| Uptime | GitHub Actions CI | — | `.github/workflows/ci.yml` |

---

## Sentry (erros)

### Setup

1. Criar projeto em [sentry.io](https://sentry.io)
2. Adicionar ao `.env`:
   ```bash
   SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
   VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
   ```
3. Instalar SDK (quando ativar em prod):
   ```bash
   npm install @sentry/react
   ```
4. Inicializar no entrypoint da app e usar `captureException()` nos boundaries.

### Uso

```typescript
import { captureException, logger } from "@/lib/observability";

try {
  await uploadMedia(file);
} catch (err) {
  captureException(err, { tenantId, userId, route: "/creator/campaigns" });
  logger.error("upload_failed", { campaignId });
}
```

---

## Logs estruturados

Todos os logs via `logger` saem em JSON:

```json
{
  "level": "error",
  "message": "upload_failed",
  "timestamp": "2026-07-05T13:00:00.000Z",
  "context": { "campaignId": "campaign_demo_launch_x3" }
}
```

Em produção, encaminhar stdout para Datadog Agent, CloudWatch ou Loki.

---

## Alertas sugeridos

| Alerta | Condição | Severidade | Ação |
| --- | --- | --- | --- |
| Error rate spike | > 10 erros/min no Sentry | Crítico | Rollback flag + investigar |
| CI failing | Workflow `CI` falhou | Alto | Bloquear merge |
| Upload failures | `upload_failed` > 5% | Médio | Verificar S3 credenciais |
| Stripe webhook | `payment_failed` | Médio | Revisar sandbox/prod keys |
| Sync métricas | Job cron falhou 2x | Baixo | Verificar tokens sociais |

---

## Dashboards

### Sentry — painel mínimo

- Errors by release
- Top transactions: `/creator/campaigns`, `/creator/onboarding`
- User impact (tenantId tag)

### Métricas de produto (KPIs §14)

Instrumentar via GA4 (`integrations/analytics/ga4.ts`):

- `delivery_submitted`, `delivery_approved`
- `contract_signed`, `milestone_paid`
- Tempo médio de aprovação (derivado de timestamps)

---

## Feature flags em produção

Flags via env vars (`src/lib/feature-flags.ts`):

| Flag | Rollout sugerido |
| --- | --- |
| `VITE_INFLUENCER_PLATFORM` | 10% → 50% → 100% |
| `VITE_SOCIAL_METRICS_SYNC` | Staging first |
| `VITE_STRIPE_SANDBOX` | false em prod |

Para rollout avançado, migrar para LaunchDarkly/Unleash mantendo a mesma interface `isFeatureEnabled()`.

---

## Referências

- [`deploy/README.md`](deploy/README.md) — rollback
- [`src/lib/observability.ts`](src/lib/observability.ts) — implementação
- [`.github/workflows/ci.yml`](.github/workflows/ci.yml) — CI como gate de qualidade
