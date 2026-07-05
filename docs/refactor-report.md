# Relatório de Refatoração UI — GlowUP Creator Platform

> Gerado pelo workflow `agents/cursor/workflows/refactor-ui.yml`  
> Escopo: rotas em `src/routes/` (equivalente a `/src/pages` no plano legado)

## Resumo

| Status                                 | Quantidade |
| -------------------------------------- | ---------- |
| Rotas mapeadas                         | 56         |
| Com estética CRM legada                | 18         |
| Já migradas para GlowUP                | 12         |
| Admin / infra (fora do escopo creator) | 8          |
| Redirects / shells                     | 18         |

## Componentes de substituição

| Legado (CRM)         | GlowUP                            | Arquivo alvo                                 |
| -------------------- | --------------------------------- | -------------------------------------------- |
| LeadCard             | CardInfluencer                    | `src/components/CardInfluencer.tsx`          |
| OpportunityCard      | CampaignCard                      | `src/components/CampaignCard.tsx`            |
| Upload genérico      | MediaUploader                     | `src/components/MediaUploader.tsx`           |
| Player               | PlayerMultimidia                  | `src/components/MediaPlayer.tsx` (alias)     |
| Inbox antiga         | InboxUnificada                    | `src/components/Inbox.tsx` (alias)           |
| Timeline genérica    | TimelineEntrega                   | `src/components/TimelineEntrega.tsx`         |
| Relatórios de vendas | PainelCampanha                    | `src/components/PainelCampanha.tsx`          |
| PipelineCard (funil) | CampaignCard styling via GlowCard | `src/components/pipelines/pipeline-card.tsx` |

---

## Rotas com estética CRM legada (ação necessária)

### Dashboard e métricas

| Rota                                        | Arquivo                                                                      | Problema                                        | Ação                                          |
| ------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------- |
| `/t/$tenantSlug/app/painel`                 | `src/routes/t/$tenantSlug/app/painel.tsx`                                    | KPIs de receita, conversão, funil por etapa     | **Refatorado** → métricas de influenciador    |
| `/t/$tenantSlug/app/communications/reports` | `src/modules/communications/components/reports/communications-dashboard.tsx` | Cards shadcn genéricos, métricas de atendimento | Migrar para GlowCard (comms — escopo parcial) |

### Pipeline / Funil

| Rota                                   | Arquivo                                              | Problema                                         | Ação                                    |
| -------------------------------------- | ---------------------------------------------------- | ------------------------------------------------ | --------------------------------------- |
| `/t/$tenantSlug/app/funil`             | `src/routes/t/$tenantSlug/app/funil/index.tsx`       | Cards shadcn, terminologia pipeline              | GlowCard + labels creator               |
| `/t/$tenantSlug/app/funil/$pipelineId` | `src/routes/t/$tenantSlug/app/funil/$pipelineId.tsx` | PipelineBoard + PipelineCard CRM, drawer de lead | PipelineCard → GlowCard; labels creator |
| `/funil`                               | `src/routes/funil.tsx`                               | Redirect legado                                  | OK — redirect                           |

### Creator (parcialmente migrado)

| Rota                                  | Arquivo                                                | Problema                          | Ação                                |
| ------------------------------------- | ------------------------------------------------------ | --------------------------------- | ----------------------------------- |
| `/t/$tenantSlug/app/creator`          | `src/modules/creator/components/creator-dashboard.tsx` | Card/Badge shadcn                 | Migrar DashboardStatCard → GlowCard |
| `/t/$tenantSlug/app/creator/sponsors` | `src/modules/creator/components/sponsors-page.tsx`     | "Pipeline de sponsors", Table CRM | GlowCard + copy creator             |
| `/t/$tenantSlug/app/creator/brands`   | `src/modules/creator/components/brands-page.tsx`       | Card shadcn                       | GlowCard                            |
| `/t/$tenantSlug/app/creator/agencies` | `src/modules/creator/components/agencies-page.tsx`     | Card shadcn                       | GlowCard                            |

### Comunicação legada

| Rota                             | Arquivo                                        | Problema                       | Ação                             |
| -------------------------------- | ---------------------------------------------- | ------------------------------ | -------------------------------- |
| `/t/$tenantSlug/app/comunicacao` | `src/routes/t/$tenantSlug/app/comunicacao.tsx` | Painéis chats/emails separados | Redirect para Communications Hub |
| `/t/$tenantSlug/app/chats`       | `src/routes/t/$tenantSlug/app/chats.tsx`       | Panel CRM                      | Redirect                         |
| `/t/$tenantSlug/app/emails`      | `src/routes/t/$tenantSlug/app/emails.tsx`      | Panel CRM                      | Redirect                         |

### Portal cliente

| Rota                             | Arquivo                                        | Problema             | Ação                     |
| -------------------------------- | ---------------------------------------------- | -------------------- | ------------------------ |
| `/t/$tenantSlug/portal/projetos` | `src/routes/t/$tenantSlug/portal/projetos.tsx` | Card shadcn genérico | Portal — escopo separado |
| `/t/$tenantSlug/portal/index`    | `src/routes/t/$tenantSlug/portal/index.tsx`    | Cards CRM            | Portal — escopo separado |

### Login

| Rota     | Arquivo                | Problema                                 | Ação                                    |
| -------- | ---------------------- | ---------------------------------------- | --------------------------------------- |
| `/login` | `src/routes/login.tsx` | LoginPipelinePanel com animação de funil | Estética creator aplicada via gradiente |

---

## Rotas já migradas para GlowUP

| Rota                                               | Componentes GlowUP                           |
| -------------------------------------------------- | -------------------------------------------- |
| `/t/$tenantSlug/app/creator/campaigns`             | CampaignCard                                 |
| `/t/$tenantSlug/app/creator/campaigns/$campaignId` | CampaignCard, MediaUploader, TimelineEntrega |
| `/t/$tenantSlug/app/creator/profile/$profileId`    | CardInfluencer                               |
| `/t/$tenantSlug/app/creator/onboarding`            | CardInfluencer                               |
| `/t/$tenantSlug/app/creator/inbox`                 | InboxUnificada (Inbox)                       |
| `/t/$tenantSlug/app/creator/performance`           | PainelCampanha metrics, GlowCard             |
| `/t/$tenantSlug/app/communications/inbox`          | Communications Hub (InboxUnificada pattern)  |

---

## Design system — status dos tokens

| Token                    | Valor                          | Status                             |
| ------------------------ | ------------------------------ | ---------------------------------- |
| `--creator-primary`      | `#FF4D8A`                      | Aplicado em componentes GlowUP     |
| `--creator-accent`       | `#7C3AED`                      | Aplicado em badges e gradientes    |
| `--creator-neutral-text` | `#0F172A`                      | Aplicado via `--foreground`        |
| `--creator-neutral-bg`   | `#F8FAFC`                      | Aplicado via `--background`        |
| `--primary` (global)     | Alinhado a `--creator-primary` | **Atualizado** em `src/styles.css` |

---

## Storybook

| Story               | Arquivo                                           | Status         |
| ------------------- | ------------------------------------------------- | -------------- |
| CardInfluencer      | `storybook/stories/domain-influencer.stories.tsx` | OK             |
| CampaignCard        | `storybook/stories/domain-influencer.stories.tsx` | OK             |
| InboxUnificada      | `storybook/stories/domain-influencer.stories.tsx` | OK (alias)     |
| TimelineEntrega     | `storybook/stories/domain-influencer.stories.tsx` | OK             |
| PainelCampanha      | `storybook/stories/domain-influencer.stories.tsx` | **Adicionado** |
| UI atômico (Glow\*) | `storybook/stories/ui-atomic.stories.tsx`         | OK             |

---

## Testes

| Suite                  | Comando                   | Escopo              |
| ---------------------- | ------------------------- | ------------------- |
| Componentes influencer | `npm run test:influencer` | helpers + configs   |
| Creator terminology    | `npm run test:creator`    | labels GlowUP       |
| E2E                    | `npm run test:e2e`        | fluxos multi-portal |

---

## Próximos passos (fora deste PR)

1. Migrar portal cliente (`/portal/*`) para estética GlowUP
2. Substituir Communications Dashboard por PainelCampanha onde aplicável
3. Remover redirects legados (`/comunicacao`, `/chats`, `/emails`) após período de transição
4. Extrair PipelineBoard para CampaignPipelineBoard com CampaignCard nativo
