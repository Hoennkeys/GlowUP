# Plano de Migração de Dados — GlowUP

> **Etapa 2 (Descoberta)** — campos a migrar, estratégia e scripts  
> Última atualização: julho/2026

---

## 1. Estratégia geral

### Abordagem: dual-write com rollout gradual

1. **Fase 0 (atual):** CRM legado + labels Creator na UI
2. **Fase 1:** Adapters de leitura — ler dados legados, expor como entidades alvo
3. **Fase 2:** Dual-write — gravar em legado + novo formato simultaneamente
4. **Fase 3:** Migração batch — script `migrations/001-migrate-contacts-to-profiles.ts`
5. **Fase 4:** Cutover — feature flag `VITE_CREATOR_DOMAIN_READ=true`, desativar legado

**Padrão de referência:** Communications Hub já usa dual-write via `legacy-adapter.ts` e `chamado-ticket-sync.ts`.

### Armazenamento

Todos os dados CRM vivem em um único JSON blob por tenant:

```
tenant_crm_state.state_json → TenantCrmSnapshot
```

Scripts de migração devem ler/escrever este snapshot — não há endpoints REST separados.

---

## 2. Tabela de migração por coleção

| Coleção legada | Entidade alvo | Campos-chave | Storage | Prioridade |
| --- | --- | --- | --- | --- |
| `leads[]` | PerfilInfluencer + Campanha | contato, email, telefone, valor, etapa, timeline | `TenantCrmSnapshot` | P0 |
| `tarefas[]` | ChecklistEntrega | titulo, prazo, concluida, leadId | `TenantCrmSnapshot` | P1 |
| `propostas[]` | Contrato | numero, valor, itens, status, leadId, clientId | `TenantCrmSnapshot` | P1 |
| `conversas[]`, `emails[]` | InboxUnificada | → `communications.conversations/messages` | dual-write | P0 (parcial) |
| `chamados[]` | Ticket | → `communications.tickets` via `legacyChamadoId` | dual-write | P0 (feito) |
| `faturas[]` | Pagamento campanha | valor, vencimento, status, clientId | `TenantCrmSnapshot` | P2 |
| `pipelineItems[]` | Entrega | stageId, dados, timeline | `TenantCrmSnapshot` | P1 |
| `CLIENT_REGISTRY` | Marca (Brand) | clientId, empresa, cnpj | static + `creator.brands` | P0 |
| `creator.*` | Já no formato alvo | estender com `legacy*Id` | embedded | P1 |
| `usuarios[]` | Membros equipe | papel → roles influencer/manager/brand_admin | `TenantCrmSnapshot` + DB | P2 |
| `configuracoes` | Workspace settings | metaMensal, empresaNome, smtp | `TenantCrmSnapshot` | P3 |

---

## 3. Mapeamento detalhado de campos

### 3.1 Lead → PerfilInfluencer + Campanha

```
Lead.contato        → PerfilInfluencer.nome
Lead.email          → PerfilInfluencer.email
Lead.telefone       → PerfilInfluencer.telefone
Lead.id             → PerfilInfluencer.legacyLeadId
Lead.clientId       → PerfilInfluencer.legacyClientId

Lead.cliente        → Campanha.title (prefixo "Parceria —")
Lead.valor          → Campanha.budget
Lead.etapa          → Campanha.status (ver entity-mapping.md)
Lead.responsavelId  → Campanha.assignedMemberId (novo campo)
Lead.criadoEm       → Campanha.startDate + createdAt
Lead.clientId       → Campanha.brandId (via ClientRecord → Brand)
Lead.id             → Campanha.legacyLeadId
```

**Regra:** 1 Lead gera 1 PerfilInfluencer + 1 Campanha (quando etapa ≠ "Sem Contato").

### 3.2 ClientRecord → Brand

```
ClientRecord.clientId  → Brand.id (prefixo "brand_")
ClientRecord.empresa   → Brand.name
ClientRecord.empresa   → Brand.slug (slugify)
ClientRecord.tenantId  → Brand.tenantId
ClientRecord.clientId  → Brand.legacyClientId
```

### 3.3 Tarefa → ChecklistEntrega

```
Tarefa.id             → ChecklistEntrega.legacyTarefaId
Tarefa.titulo         → ChecklistEntrega.itens[0].titulo
Tarefa.concluida      → ChecklistEntrega.itens[0].concluido
Tarefa.responsavelId  → ChecklistEntrega.responsavelId
Tarefa.prazo          → ChecklistEntrega.prazo
Tarefa.leadId         → ChecklistEntrega.campanhaId (via Lead→Campanha)
```

### 3.4 Proposta → Contrato

```
Proposta.id           → Contrato.legacyPropostaId
Proposta.numero       → Contrato.numero (prefixo CTR-)
Proposta.valor        → Contrato.valor
Proposta.status       → Contrato.assinaturaStatus
Proposta.itens        → Contrato.milestones (1 milestone por item)
Proposta.leadId       → Contrato.campanhaId
Proposta.clientId     → Contrato.partes.marcaId
```

| Proposta.status | Contrato.assinaturaStatus |
| --- | --- |
| Pendente | pendente |
| Aceita | aceita |
| Vencida | expirada |

### 3.5 PipelineItem → Entrega

```
PipelineItem.id       → Entrega.id
PipelineItem.titulo   → Entrega.titulo (novo campo)
PipelineItem.stageId  → Entrega.statusAprovacao (map por stage)
PipelineItem.timeline → Entrega.comentarios (converter TimelineItem)
PipelineItem.clientId → Entrega.influencerId (via Brand→Perfil)
```

| Pipeline stage (projetos) | Entrega.statusAprovacao |
| --- | --- |
| briefing | rascunho |
| execucao | pendente |
| revisao | em_revisao |
| entregue | aprovado |

### 3.6 Fatura → Pagamento campanha

```
Fatura.valor          → PagamentoCampanha.valor
Fatura.vencimento     → PagamentoCampanha.vencimento
Fatura.status         → PagamentoCampanha.status
Fatura.clientId       → PagamentoCampanha.campanhaId (via Brand)
Fatura.numero         → PagamentoCampanha.referencia
```

### 3.7 Conversa/Email → Conversation/Message

Já migrado parcialmente. Campos adicionais necessários:

```
Conversa.leadId       → Conversation.leadId (existente)
Conversa.id           → Conversation.legacyConversaId (existente)
(novo)                → Conversation.campaignId
(novo)                → Conversation.tags (auto por status campanha)
```

---

## 4. Feature flags

| Flag | Default | Descrição |
| --- | --- | --- |
| `VITE_CREATOR_DOMAIN_READ` | `false` | Ler entidades alvo em vez de legado |
| `VITE_CREATOR_DOMAIN_WRITE` | `false` | Dual-write ao salvar |
| `VITE_INFLUENCER_PROFILES` | `false` | Expor perfis de influenciador |
| `VITE_DELIVERY_TIMELINE` | `false` | Timeline de entregas |

Implementação sugerida: `src/lib/feature-flags.ts`

---

## 5. Scripts de migração

### 5.1 Script principal

```
migrations/001-migrate-contacts-to-profiles.ts
```

**Input:** `TenantCrmSnapshot` (JSON)  
**Output:** `TenantCrmSnapshot` enriquecido com:

```typescript
{
  // ... campos legados preservados ...
  influencer?: InfluencerPlatformSnapshot  // novo
  creator?: CreatorSnapshot                // enriquecido
}
```

**Execução:**

```bash
npx tsx migrations/001-migrate-contacts-to-profiles.ts --tenant tenant-demo --dry-run
npx tsx migrations/001-migrate-contacts-to-profiles.ts --tenant tenant-demo
```

### 5.2 Validação pós-migração

Checklist por tenant:

- [ ] Todo `Lead` com etapa ≠ "Sem Contato" tem `Campanha` correspondente
- [ ] Todo `Lead` tem `PerfilInfluencer` correspondente
- [ ] Todo `ClientRecord` tem `Brand` correspondente
- [ ] Todo `Proposta` "Aceita" tem `Contrato` correspondente
- [ ] `legacy*Id` preservados em todas as entidades alvo
- [ ] Nenhum dado legado removido

---

## 6. Ordem de execução

```
1. ClientRecord → Brand (creator.brands)
2. Lead → PerfilInfluencer (influencer.profiles)
3. Lead → Campanha (creator.campaigns)
4. Proposta → Contrato (influencer.contratos)
5. Tarefa → ChecklistEntrega (influencer.checklists)
6. PipelineItem → Entrega (influencer.entregas)
7. Fatura → PagamentoCampanha (influencer.pagamentos)
8. Conversa → Conversation (communications — incremental)
```

---

## 7. Rollback

1. Backup de `tenant_crm_state.state_json` antes da migração
2. Campos legados **nunca removidos** na Fase 1–3
3. Rollback = remover chave `influencer` do snapshot e desativar feature flags
4. Script de rollback: `migrations/001-rollback.ts` (a criar na Fase 3)

---

## 8. Riscos e mitigações

| Risco | Impacto | Mitigação |
| --- | --- | --- |
| Lead usado como oportunidade E contato | Duplicação | Separar em 2 entidades alvo com `legacyLeadId` |
| ~170 refs a `clientId` no código | Quebra de portal | Manter `clientId` + adicionar `brandId` |
| Dual-write inconsistente | Dados divergentes | Transação atômica no saveCrmState |
| Performance do JSON blob | Lentidão com volume | Indexar por `legacy*Id`; considerar tabelas normalizadas na Fase 4 |

---

## 9. Referências

- `docs/entity-mapping.md` — exemplos JSON por entidade
- `docs/inventory.md` — inventário técnico completo
- `src/modules/creator/CREATOR_DOMAIN_MIGRATION.md` — status atual da migração Creator
- `src/modules/communications/domain/legacy-adapter.ts` — padrão dual-write
- `api-contracts.md` — contratos de API alvo
