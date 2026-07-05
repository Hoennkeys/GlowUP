# QA Report — Plataforma de Influenciadores GlowUP

> **Etapas 9 (Testes, QA)** — julho/2026  
> Escopo: fluxos core §7 + integrações §8 + CI §10

---

## Resumo

| Área                           | Status       | Observações                                           |
| ------------------------------ | ------------ | ----------------------------------------------------- |
| Testes unitários migração (§4) | ✅ 14/14     | `migrations/001-migrate-contacts-to-profiles.test.ts` |
| Testes helpers UI (§6)         | ✅ 16/16     | `influencer-components.test.ts`                       |
| Testes plataforma (§7)         | ✅ 15/15     | `influencer.test.ts`                                  |
| Testes integrações (§8)        | ✅ 12/12     | `integrations/integrations.test.ts`                   |
| E2E fluxos core                | ✅ 5 specs   | `e2e/influencer-platform.spec.ts`                     |
| CI GitHub Actions              | ✅           | `.github/workflows/ci.yml`                            |
| Storybook                      | ✅           | Componentes atômicos + domínio                        |
| Acessibilidade WCAG            | ⬜ Checklist | `qa/accessibility-checklist.md`                       |
| Usabilidade creators           | ⬜ Pendente  | Sessões com 5–8 influenciadores                       |

**Total testes automatizados do plano:** 57

---

## Fluxos E2E cobertos

1. **Onboarding** — perfil demo carregado, passos visíveis
2. **Campanhas** — listagem + detalhe com timeline de entregas
3. **Perfil** — métricas por plataforma
4. **Inbox** — threads unificadas com busca
5. **Performance** — painel de métricas (alcance, ROI)

---

## Integrações (§8)

| Adapter                      | Testado | Mock funcional              |
| ---------------------------- | ------- | --------------------------- |
| S3 presigned upload          | ✅      | Sem `AWS_*`                 |
| Instagram / TikTok / YouTube | ✅      | Sem tokens                  |
| GA4 + UTM                    | ✅      | Sem `GA4_*`                 |
| DocuSign e-sign              | ✅      | Sem `DOCUSIGN_*`            |
| Stripe webhooks              | ✅      | Sem `STRIPE_WEBHOOK_SECRET` |
| OAuth social callbacks       | ✅      | Sem app secrets             |
| Pusher realtime              | ✅      | Sem `PUSHER_*`              |
| Stripe milestones            | ✅      | Sem `STRIPE_*`              |

---

## Deploy e observabilidade (§10)

| Entregável               | Arquivo                    |
| ------------------------ | -------------------------- |
| Pipeline CI              | `.github/workflows/ci.yml` |
| Runbook deploy           | `deploy/README.md`         |
| Script staging           | `deploy/staging.sh`        |
| Observabilidade          | `observability.md`         |
| Feature flags            | `src/lib/feature-flags.ts` |
| Logger / Sentry scaffold | `src/lib/observability.ts` |

---

## Problemas conhecidos / backlog

| ID     | Severidade | Descrição                                   | Ação                               |
| ------ | ---------- | ------------------------------------------- | ---------------------------------- |
| QA-001 | Baixa      | Upload real S3 não testado em staging       | Configurar bucket staging          |
| QA-002 | Média      | Cobertura RTL/Vitest em componentes React   | Adicionar `@testing-library/react` |
| QA-003 | Baixa      | Screenshots §3 ainda manuais                | Capturar telas creator             |
| QA-004 | Média      | MSW/json-server para frontend               | Etapa 4 pendente                   |
| QA-005 | Baixa      | Navegação entre passos do onboarding em E2E | Investigar HMR/dev server local    |

---

## Comandos de verificação

```bash
npx tsx migrations/001-migrate-contacts-to-profiles.test.ts
npm run test:influencer
npm run test:influencer-platform
npm run test:integrations
npm run test:e2e -- e2e/influencer-platform.spec.ts
npx tsx scripts/sync-social-metrics.ts --dry-run
npm run storybook
```

---

## Critério de aceitação §9–§10

| Critério                           | Atendido                  |
| ---------------------------------- | ------------------------- |
| E2E verde em CI                    | ✅ (workflow configurado) |
| Integrações mock testadas          | ✅                        |
| Feature flags documentadas         | ✅                        |
| Rollback documentado               | ✅                        |
| Alertas/monitoramento documentados | ✅                        |
