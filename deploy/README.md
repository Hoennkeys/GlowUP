# Deploy — GlowUP Plataforma de Influenciadores

> **Etapa 10** — scripts, runbooks e rollback

---

## Ambientes

| Ambiente | Branch | URL (exemplo) | Feature flags |
| --- | --- | --- | --- |
| Local | — | `http://localhost:8080` | `.env` |
| Staging | `main` | `https://staging.glowup.app` | flags parciais |
| Produção | tag `v*` | `https://app.glowup.app` | rollout gradual |

---

## Deploy staging (manual)

```bash
# 1. Verificar testes
npm test
npm run test:integrations
npm run test:e2e -- e2e/influencer-platform.spec.ts

# 2. Build
npm run build

# 3. Preview local (smoke test)
npm run preview

# 4. Deploy (adaptar ao host — Vercel, Railway, VPS, etc.)
./deploy/staging.sh
```

---

## Script `staging.sh`

Executa build + validação mínima antes do deploy. Adapte o passo final ao seu provedor.

```bash
chmod +x deploy/staging.sh
./deploy/staging.sh
```

---

## Rollback

1. **Imediato:** reverter feature flags no `.env` ou painel do host:
   ```bash
   VITE_INFLUENCER_PLATFORM=false
   ```
2. **Deploy anterior:** redeploy do artefato/commit anterior (tag ou SHA).
3. **Dados:** restaurar backup SQLite/Postgres antes da migração batch (ver `migration-plan.md`).

### Checklist rollback

- [ ] Feature flag `VITE_INFLUENCER_PLATFORM=false` aplicada
- [ ] Build anterior redeployado
- [ ] Sentry/Datadog sem spike de erros (5 min)
- [ ] Smoke test login + painel CRM legado

---

## Backups antes de migração

```bash
# SQLite
cp data/vendapro.sqlite data/backups/vendapro-$(date +%Y%m%d).sqlite

# Dry-run migração
npx tsx migrations/001-migrate-contacts-to-profiles.ts --dry-run
```

---

## Cron jobs (staging/prod)

| Job | Comando | Frequência |
| --- | --- | --- |
| Sync métricas sociais | `npx tsx scripts/sync-social-metrics.ts` | Diário 06:00 UTC |
| Backup SQLite | `cp data/vendapro.sqlite data/backups/...` | Diário |

---

## Referências

- [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) — pipeline CI
- [`observability.md`](../observability.md) — Sentry, logs, alertas
- [`integrations/README.md`](../integrations/README.md) — secrets e webhooks
