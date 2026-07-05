# QA Report — Plataforma de Influenciadores GlowUP

> **Etapa 7 (Testes, QA e usabilidade)**  
> Data: julho/2026  
> Escopo: fluxos core §7 + integrações mock §8

---

## Resumo

| Área | Status | Observações |
| --- | --- | --- |
| Testes unitários migração (§4) | ✅ 14/14 | `migrations/001-migrate-contacts-to-profiles.test.ts` |
| Testes helpers UI (§6) | ✅ 16/16 | `influencer-components.test.ts` |
| Testes plataforma (§5–7) | ✅ 14/14 | `influencer.test.ts` |
| E2E fluxos core | ✅ 5 specs | `e2e/influencer-platform.spec.ts` |
| Storybook | ✅ | Componentes atômicos + domínio |
| Acessibilidade WCAG | ⬜ Pendente | Auditoria manual recomendada |
| Usabilidade creators | ⬜ Pendente | Sessões com 5–8 influenciadores |

**Total testes automatizados do plano:** 44

---

## Fluxos E2E cobertos

1. **Onboarding** — wizard 3 passos (perfil, redes, portfólio)
2. **Campanhas** — listagem com `CampaignCard` + detalhe com timeline e upload
3. **Perfil** — métricas por plataforma e portfólio
4. **Inbox** — threads unificadas com filtros
5. **Performance** — painel de métricas por campanha

---

## Integrações (modo mock)

| Adapter | Testado | Mock funcional |
| --- | --- | --- |
| S3 presigned upload | ✅ | Sem `AWS_*` |
| Instagram metrics | ✅ | Sem access token |
| Pusher realtime | ✅ | Sem `PUSHER_*` |
| Stripe milestones | ✅ | Sem `STRIPE_*` |

---

## Problemas conhecidos / backlog

| ID | Severidade | Descrição | Ação |
| --- | --- | --- | --- |
| QA-001 | Baixa | Upload real S3 não testado em staging | Configurar bucket staging |
| QA-002 | Média | Cobertura RTL/Vitest em componentes React | Adicionar `@testing-library/react` |
| QA-003 | Baixa | Screenshots §3 ainda manuais | Capturar telas creator |
| QA-004 | Média | MSW/json-server para frontend | Etapa 4 pendente |

---

## Comandos de verificação

```bash
npx tsx migrations/001-migrate-contacts-to-profiles.test.ts
npm run test:influencer
npm run test:influencer-platform
npm run test:e2e -- e2e/influencer-platform.spec.ts
npm run storybook
```

---

## Critério de aceitação §7

| Critério | Atendido |
| --- | --- |
| Fluxo end-to-end com mocks | ✅ |
| Upload e preview funcionais | ✅ (mock presigned) |
| Chat com mensagens e tags | ✅ (inbox integrado ao Communications Hub) |
| Rotas `/profile`, `/campaign`, `/inbox` | ✅ (tenant-scoped) |
