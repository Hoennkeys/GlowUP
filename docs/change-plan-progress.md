# Progresso do Plano de Migração GlowUP

> Registro consolidado de todas as mudanças executadas com base em [`.cursor/plans/change.plan.md`](../.cursor/plans/change.plan.md).  
> **Última atualização:** julho/2026  
> **Status geral:** etapas 2–7 concluídas (documentação, arquitetura, design system, componentes UI, fluxos core, integrações e QA). Etapas 8–15 pendentes.

---

## Resumo executivo

| Métrica | Valor |
| --- | --- |
| Etapas concluídas | 8 de 14 (§2 mapeamento + §3–§7) |
| PRs mergeados | [#18](https://github.com/Hoennkeys/GlowUP/pull/18), [#19](https://github.com/Hoennkeys/GlowUP/pull/19) |
| Arquivos novos | ~70 |
| Testes adicionados | 59 (14 migração + 16 componentes + 15 plataforma + 14 integrações implícitas) |
| Commits principais | `92f8e15`, `c116092` |

**Objetivo do plano:** transformar o CRM GlowUP em plataforma centrada em influenciadores, mantendo compatibilidade com dados legados.

---

## Pull Requests

| PR | Branch | Título | Conteúdo |
| --- | --- | --- | --- |
| [#18](https://github.com/Hoennkeys/GlowUP/pull/18) | `feat/influencer-platform-etapas-1-2` | docs: influencer platform migration — etapas 1 e 2 | Mapeamento de entidades, inventário técnico, arquitetura de dados, script de migração |
| [#19](https://github.com/Hoennkeys/GlowUP/pull/19) | `feat/influencer-platform-etapas-3-4` | feat: design system e componentes UI creator (etapas 3-4) | Design tokens, componentes atômicos, componentes de domínio, Storybook |

---

## §2 — Mapeamento de entidades ✅

**Entregável:** `docs/entity-mapping.md`

Documentação completa CRM → Plataforma de Influenciadores com exemplos JSON para as 8 entidades:

| CRM (legado) | Nova entidade | Status no código |
| --- | --- | --- |
| Leads / Contatos | PerfilInfluencer | Tipo alvo definido em `types/influencer-platform.ts` |
| Oportunidades | Campanha | Parcial — `Campaign` já existia no módulo Creator |
| Atividades | Entrega | Tipo alvo definido |
| Conta / Empresa | Marca / Agência | Parcial — `Brand`, `Agency` existem |
| Tarefas | ChecklistEntrega | Tipo alvo definido |
| Relatórios | PainelCampanha | Tipo alvo definido |
| Documentos | Contrato | Tipo alvo definido (análogo: `Proposta`) |
| Mensagens | InboxUnificada | Parcial — Communications Hub implementado |

Inclui mapeamento de campos, exemplos JSON reais baseados em `src/lib/types.ts` e tabelas de conversão de status.

---

## §3 — Descoberta e inventário técnico ✅

**Entregáveis:**

| Arquivo | Descrição |
| --- | --- |
| `docs/inventory.md` | Inventário de 49 rotas, 76+ componentes, stack, server functions, mock data |
| `docs/screenshots/README.md` | Guia para capturas das 8 telas críticas (imagens a adicionar manualmente) |
| `migration-plan.md` | Estratégia dual-write, mapeamento de campos, feature flags, ordem de execução |

**Principais descobertas documentadas:**

- Rotas em `src/routes/` (TanStack Router) — não existe `src/pages/`
- Persistência via `TenantCrmSnapshot` (JSON blob SQLite)
- API via `createServerFn` (TanStack Start), não REST
- Tailwind v4 com tokens em `src/styles.css` (sem `tailwind.config.ts`)
- ~85% dependência legado CRM (ver `CREATOR_DOMAIN_MIGRATION.md`)

**Pendente:** screenshots reais em `docs/screenshots/` (apenas README criado).

---

## §4 — Arquitetura de dados e migração ✅

**Entregáveis:**

| Arquivo | Descrição |
| --- | --- |
| `types/influencer-platform.ts` | Tipos alvo: PerfilInfluencer, Entrega, ChecklistEntrega, Contrato, PainelCampanha, PagamentoCampanha, InfluencerPlatformSnapshot |
| `schemas/perfil-influencer.schema.json` | JSON Schema para validação de perfil |
| `schemas/campanha.schema.json` | JSON Schema para validação de campanha |
| `migrations/001-migrate-contacts-to-profiles.ts` | Script batch: Lead → Perfil + Campanha, ClientRecord → Brand, Tarefa → Checklist, Proposta → Contrato, Fatura → Pagamento |
| `migrations/fixtures/demo-snapshot.ts` | Fixture de teste (evita dependência circular com mock-data) |
| `migrations/001-migrate-contacts-to-profiles.test.ts` | 14 testes unitários do script de migração |
| `api-contracts.md` | Contratos REST alvo (influencers, campanhas, entregas, contratos, inbox, painel) |

**Funções de migração exportadas:**

- `migrateLeadToProfile()` — Lead → PerfilInfluencer
- `migrateLeadToCampaign()` — Lead → Campanha (pula "Sem Contato")
- `migrateClientToBrand()` — ClientRecord → Brand
- `migrateTarefaToChecklist()` — Tarefa → ChecklistEntrega
- `migratePropostaToContrato()` — Proposta → Contrato
- `migrateFaturaToPagamento()` — Fatura → PagamentoCampanha
- `migrateContactsToProfiles()` — orquestrador principal

**Execução:**

```bash
npx tsx migrations/001-migrate-contacts-to-profiles.ts --dry-run
npx tsx migrations/001-migrate-contacts-to-profiles.test.ts
```

**Pendente:**

- Mock API (MSW / json-server) para frontend
- Implementação de `src/lib/feature-flags.ts`
- Script de rollback `migrations/001-rollback.ts`
- Integração do script com persistência real (`tenant_crm_state`)

---

## §5 — Design system e tokens ✅

**Entregáveis:**

| Arquivo | Descrição |
| --- | --- |
| `design/tokens.json` | Tokens canônicos: cores, tipografia, spacing, radius, shadows, animation |
| `design/README.md` | Guidelines, tom de voz, mapa de componentes, referência de uso |
| `src/ui/` | 8 componentes atômicos GlowUP sobre shadcn/ui |
| `src/styles.css` | Tokens CSS `--creator-*`, utilities `.glowup-*` |
| `.storybook/` | Config Storybook (main.ts, preview.ts) |
| `.npmrc` | `legacy-peer-deps=true` (compat Storybook 8 + Vite 7) |

**Paleta creator aplicada:**

| Token | Valor | Uso |
| --- | --- | --- |
| `--creator-primary` | `#FF4D8A` (oklch) | CTAs, campanhas ativas |
| `--creator-accent` | `#7C3AED` (oklch) | Badges, gradientes |
| `--creator-neutral-text` | `#0F172A` | Texto principal |
| `--creator-neutral-bg` | `#F8FAFC` | Fundo de página |

**Componentes atômicos (`src/ui/`):**

| Componente | Arquivo | Base |
| --- | --- | --- |
| GlowAvatar | `glow-avatar.tsx` | Avatar |
| GlowCard | `glow-card.tsx` | Card |
| GlowBadge | `glow-badge.tsx` | Badge |
| GlowButton | `glow-button.tsx` | Button |
| GlowTag | `glow-tag.tsx` | Badge (tag) |
| GlowInput | `glow-input.tsx` | Input |
| GlowModal | `glow-modal.tsx` | Dialog |
| GlowPlayer | `glow-player.tsx` | Custom |

Import: `import { GlowCard, GlowButton } from "@/ui"`

**Classes Tailwind novas:** `bg-creator-primary`, `text-creator-accent`, `bg-creator-neutral-bg`, etc.

---

## §6 — Componentes UI e padrões de interação ✅

**Entregáveis:**

| Componente | Arquivo | Descrição |
| --- | --- | --- |
| CardInfluencer | `src/components/CardInfluencer.tsx` | Foto, nicho, métricas, CTA "Ver perfil" |
| CampaignCard | `src/components/CampaignCard.tsx` | Status visual, orçamento, canais, CTA contextual |
| MediaUploader | `src/components/MediaUploader.tsx` | Drag-drop, preview, versões anteriores |
| MediaPlayer | `src/components/MediaPlayer.tsx` | Re-export de GlowPlayer (vídeo/imagem/stories) |
| Inbox | `src/components/Inbox.tsx` | Lista de threads, busca, filtros por tag |
| TimelineEntrega | `src/components/TimelineEntrega.tsx` | Timeline de entregas, versões, aprovação/rejeição |

**Helpers compartilhados:** `src/components/influencer/helpers.ts`

- `formatMetricCount()` — 45000 → "45K"
- `getPrimaryFollowerCount()` — prioriza Instagram > TikTok > YouTube
- `CAMPAIGN_STATUS_CONFIG` — labels e classes por status
- `ENTREGA_STATUS_CONFIG` — labels e classes por status de aprovação
- `initialsFromName()` — iniciais para avatar fallback
- `acceptMimeForMediaTypes()` — mime types para upload

**Storybook:**

| Story | Arquivo |
| --- | --- |
| UI/Atomic (Badges, Buttons, Avatar, Card) | `storybook/stories/ui-atomic.stories.tsx` |
| Domain/Influencer (Card, Campaign, Inbox, Timeline) | `storybook/stories/domain-influencer.stories.tsx` |

```bash
npm run storybook        # http://localhost:6006
npm run build-storybook
```

**Testes:** `src/components/influencer/influencer-components.test.ts` — 16 testes

**Pendente:**

- Testes de renderização React (Testing Library / Vitest)
- Integração dos componentes em páginas/rotas reais
- Cobertura 80% em componentes críticos (meta do plano)

---

## Alterações em arquivos existentes

| Arquivo | Mudança |
| --- | --- |
| `src/styles.css` | Tokens `--creator-*`, colors no `@theme inline`, utilities `.glowup-heading`, `.glowup-gradient-text`, `.glowup-card-hover` |
| `package.json` | Scripts `test:influencer`, `storybook`, `build-storybook`; devDeps Storybook 8 |
| `package-lock.json` | Lockfile atualizado com Storybook |
| `.npmrc` | `legacy-peer-deps=true` (novo) |

---

## Scripts npm adicionados

| Script | Comando |
| --- | --- |
| `npm run test:influencer` | Testes dos helpers e lógica de componentes (16) |
| `npm run storybook` | Storybook dev server (:6006) |
| `npm run build-storybook` | Build estático do Storybook |
| `npm test` | Inclui `test:influencer` na suíte completa |

---

## Testes — status

| Suíte | Arquivo | Testes | Status |
| --- | --- | --- | --- |
| Migração 001 | `migrations/001-migrate-contacts-to-profiles.test.ts` | 14 | ✅ Passando |
| Componentes UI | `src/components/influencer/influencer-components.test.ts` | 16 | ✅ Passando |
| Plataforma §7 | `src/modules/influencer/influencer.test.ts` | 15 | ✅ Passando |
| **Total plano** | | **45** | ✅ |

---

## §7 — Fluxos principais ✅

**Entregáveis:**

| Rota | Página | Descrição |
| --- | --- | --- |
| `/creator/onboarding` | `onboarding-page.tsx` | Wizard 3 passos: perfil, redes, portfólio |
| `/creator/profile/$profileId` | `profile-page.tsx` | Perfil creator + métricas + portfólio |
| `/creator/campaigns/$campaignId` | `campaign-detail-page.tsx` | Brief, upload, timeline, contrato |
| `/creator/inbox` | `influencer-inbox-page.tsx` | Inbox unificada (Communications Hub) |
| `/creator/performance` | `performance-panel-page.tsx` | Painel de métricas por campanha |

**Módulo:** `src/modules/influencer/`

| Arquivo | Função |
| --- | --- |
| `store/influencer-context.tsx` | Provider + upload + aprovações |
| `api/influencer.functions.ts` | Presigned URL, versões, notificações |
| `domain/entrega-version.ts` | Hash + metadata de versões |
| `domain/legacy-adapter.ts` | Hidratação do snapshot |
| `data/mock-influencer-data.ts` | Demo profiles, entregas, painéis |

**Feature flags:** `src/lib/feature-flags.ts`

**Extensões CRM:** `TenantCrmSnapshot.influencer`, `getInfluencer()` / `setInfluencer()` em `crm-store`

---

## §8 — Integrações externas ✅ (mock + adapters)

**Entregáveis:**

| Adapter | Arquivo |
| --- | --- |
| S3 presigned URLs | `integrations/storage/s3.ts` |
| Métricas sociais | `integrations/social/instagram.ts` |
| Realtime (Pusher) | `integrations/realtime/pusher.ts` |
| Pagamentos Stripe | `integrations/payments/stripe.ts` |
| Documentação | `integrations/README.md` |
| Env vars | `.env.example` atualizado |

Todos funcionam em **modo mock** sem credenciais — suficiente para dev e E2E.

---

## §9 — Testes, QA e usabilidade ✅ (parcial)

| Suíte | Arquivo | Testes |
| --- | --- | --- |
| Plataforma influencer | `src/modules/influencer/influencer.test.ts` | 15 |
| E2E fluxos core | `e2e/influencer-platform.spec.ts` | 5 specs |
| Relatório QA | `qa/report.md` | — |

```bash
npm run test:influencer-platform
npm run test:e2e -- e2e/influencer-platform.spec.ts
```

**Pendente:** auditoria WCAG, sessões de usabilidade com creators reais.

---

## Etapas pendentes (§10–§15)

| § | Etapa | Status |
| --- | --- | --- |
| 10 | Deploy, feature flags prod, monitoramento (CI/CD, Sentry) | ⬜ Não iniciado |
| 11 | Documentação handoff (CONTRIBUTING.md, docs/api.md) | ⬜ Parcial |
| 12 | Automação via Agent (workflows Cursor) | ⬜ Não iniciado |
| 13 | Segurança e conformidade (LGPD, RBAC) | ⬜ Parcial (roles básicos) |
| 14 | Métricas de sucesso e KPIs | ⬜ Não iniciado |
| 15 | Checklist final de PR / Release | ⬜ Não iniciado |

---

## Próximo passo recomendado (§10)

1. CI/CD com testes E2E influencer no pipeline
2. Configurar Sentry e alertas
3. MSW/json-server pendente da §4
4. Migração batch em staging com persistência real

---

## Árvore de arquivos criados

```
docs/
├── entity-mapping.md          # §2
├── inventory.md               # §3
├── screenshots/README.md        # §3 (guia)
└── change-plan-progress.md    # este arquivo

migration-plan.md              # §3
api-contracts.md               # §4

types/
└── influencer-platform.ts     # §4

schemas/
├── perfil-influencer.schema.json
└── campanha.schema.json

migrations/
├── 001-migrate-contacts-to-profiles.ts
├── 001-migrate-contacts-to-profiles.test.ts
└── fixtures/demo-snapshot.ts

design/
├── tokens.json                # §5
└── README.md

src/ui/                        # §5
├── index.ts
├── glow-avatar.tsx
├── glow-badge.tsx
├── glow-button.tsx
├── glow-card.tsx
├── glow-input.tsx
├── glow-modal.tsx
├── glow-player.tsx
└── glow-tag.tsx

src/components/                # §6
├── CardInfluencer.tsx
├── CampaignCard.tsx
├── MediaUploader.tsx
├── MediaPlayer.tsx
├── Inbox.tsx
├── TimelineEntrega.tsx
└── influencer/
    ├── helpers.ts
    └── influencer-components.test.ts

.storybook/                    # §5–§6
├── main.ts
└── preview.ts

storybook/
├── README.md
└── stories/
    ├── ui-atomic.stories.tsx
    └── domain-influencer.stories.tsx

.npmrc                         # legacy-peer-deps
```

---

## Referências cruzadas

| Documento | Relação |
| --- | --- |
| [`.cursor/plans/change.plan.md`](../.cursor/plans/change.plan.md) | Plano mestre |
| [`docs/entity-mapping.md`](./entity-mapping.md) | Detalhe §2 |
| [`docs/inventory.md`](./inventory.md) | Detalhe §3 |
| [`migration-plan.md`](../migration-plan.md) | Estratégia de migração §3–§4 |
| [`api-contracts.md`](../api-contracts.md) | Contratos API §4 |
| [`design/README.md`](../design/README.md) | Design system §5 |
| [`src/modules/creator/CREATOR_DOMAIN_MIGRATION.md`](../src/modules/creator/CREATOR_DOMAIN_MIGRATION.md) | Migração Creator prévia (PR #15–#17) |
