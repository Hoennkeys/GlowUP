# Mapeamento de Entidades — CRM → Plataforma de Influenciadores

> **Etapa 1** do plano de migração GlowUP  
> Última atualização: julho/2026

Este documento define como cada entidade legada do CRM se transforma na plataforma centrada em influenciadores, com exemplos JSON baseados nos tipos reais do código (`src/lib/types.ts`, `src/modules/creator/domain/entities.ts`, `src/modules/communications/domain/entities.ts`).

## Visão geral

| CRM (legado) | Nova entidade | Status no código |
| --- | --- | --- |
| Leads / Contatos | **PerfilInfluencer** | Tipo alvo — a criar |
| Oportunidades | **Campanha** | Parcial — `Campaign` existe no módulo Creator |
| Atividades | **Entrega** | Tipo alvo — a criar |
| Conta / Empresa | **Marca / Agência** | Parcial — `Brand`, `Agency` existem |
| Tarefas | **ChecklistEntrega** | Tipo alvo — a criar |
| Relatórios | **PainelCampanha** | Parcial — painel CRM + comms reports |
| Documentos | **Contrato** | Tipo alvo — `Proposta` é o análogo mais próximo |
| Mensagens | **InboxUnificada** | Parcial — Communications Hub implementado |

### Nota sobre terminologia

No código atual, `Lead` é rotulado na UI como **Oportunidade de Parceria** (`terminology.ts`). Para a plataforma de influenciadores:

- **Contato** (`contato`, `email`, `telefone`) → campos do **PerfilInfluencer**
- **Oportunidade comercial** (`Lead` completo) → origem de **Campanha**
- Um mesmo registro `Lead` pode gerar **dois** registros alvo quando migrado

---

## 1. Leads / Contatos → PerfilInfluencer

**Fonte:** `Lead` em `src/lib/types.ts`

### Exemplo legado

```json
{
  "id": "lead-demo-jc-ativo",
  "cliente": "João Cliente ME",
  "contato": "João Cliente",
  "email": "cliente@demo.com",
  "telefone": "(11) 98765-4321",
  "valor": 15000,
  "etapa": "Proposta Enviada",
  "prioridade": "Alta",
  "responsavelId": "user-operacional",
  "criadoEm": "2026-05-01T11:00:00.000Z",
  "clientId": "client-001"
}
```

### Exemplo alvo

```json
{
  "id": "influencer_lead-demo-jc-ativo",
  "tenantId": "tenant-demo",
  "nome": "João Cliente",
  "handle": "@joaocliente",
  "avatarUrl": null,
  "coverUrl": null,
  "nicho": null,
  "bio": null,
  "plataformas": [],
  "metricasSociais": {
    "instagram": { "seguidores": 0, "engajamento": 0 },
    "youtube": { "inscritos": 0, "visualizacoes": 0 },
    "tiktok": { "seguidores": 0, "curtidas": 0 }
  },
  "mediaKitUrl": null,
  "email": "cliente@demo.com",
  "telefone": "(11) 98765-4321",
  "status": "ativo",
  "legacyLeadId": "lead-demo-jc-ativo",
  "legacyClientId": "client-001",
  "createdAt": "2026-05-01T11:00:00.000Z",
  "updatedAt": "2026-05-01T11:00:00.000Z"
}
```

### Mapeamento de campos

| Legado | Alvo | Regra |
| --- | --- | --- |
| `contato` | `nome` | Direto |
| `email` | `email` | Direto |
| `telefone` | `telefone` | Direto |
| `cliente` | — | Não migra para perfil (vai para Marca) |
| `id` | `legacyLeadId` | Preservar para rastreabilidade |
| `clientId` | `legacyClientId` | Link com portal/marca |

---

## 2. Oportunidades → Campanha

**Fonte:** `Lead` + `Campaign` existente em `src/modules/creator/domain/entities.ts`

### Exemplo legado

```json
{
  "id": "lead-demo-jc-ativo",
  "cliente": "João Cliente ME",
  "contato": "João Cliente",
  "valor": 15000,
  "etapa": "Proposta Enviada",
  "prioridade": "Alta",
  "responsavelId": "user-operacional",
  "criadoEm": "2026-05-01T11:00:00.000Z",
  "clientId": "client-001"
}
```

### Exemplo alvo

```json
{
  "id": "campaign_migrated_lead-demo-jc-ativo",
  "tenantId": "tenant-demo",
  "title": "Parceria — João Cliente ME",
  "brandId": "brand_client-001",
  "status": "active",
  "budget": 15000,
  "startDate": "2026-05-01",
  "endDate": null,
  "channels": ["instagram", "email"],
  "description": "Migrado de oportunidade CRM",
  "conversationId": null,
  "legacyLeadId": "lead-demo-jc-ativo",
  "createdAt": "2026-05-01T11:00:00.000Z",
  "updatedAt": "2026-05-01T11:00:00.000Z"
}
```

### Mapeamento de status

| `Lead.etapa` | `Campaign.status` |
| --- | --- |
| Sem Contato | `draft` |
| Em Atendimento | `draft` |
| Proposta Enviada | `active` |
| Ganho | `completed` |
| Perdido | `paused` |

---

## 3. Atividades → Entrega

**Fonte:** `TimelineItem` em leads/pipeline items; estágios do pipeline de projetos (`briefing`, `execucao`, `revisao`, `entregue`)

### Exemplo legado

```json
{
  "tipo": "email",
  "em": "2026-04-10T10:00:00.000Z",
  "texto": "Proposta PROP-2026-002 enviada ao cliente"
}
```

### Exemplo alvo

```json
{
  "id": "entrega_001",
  "tenantId": "tenant-demo",
  "campanhaId": "campaign_migrated_lead-demo-jc-ativo",
  "influencerId": "influencer_lead-demo-jc-ativo",
  "tipoMidia": "documento",
  "arquivoUrl": null,
  "thumbnailUrl": null,
  "versao": 1,
  "statusAprovacao": "pendente",
  "comentarios": [],
  "checklistId": null,
  "legacyTimelineTipo": "email",
  "criadoEm": "2026-04-10T10:00:00.000Z",
  "atualizadoEm": "2026-04-10T10:00:00.000Z"
}
```

### Tipos de mídia suportados

`imagem` | `video` | `stories` | `reels` | `documento` | `link`

### Status de aprovação

`rascunho` | `pendente` | `em_revisao` | `aprovado` | `rejeitado`

---

## 4. Conta / Empresa → Marca / Agência

**Fonte:** `ClientRecord` em `src/lib/clients-registry.ts`; `Brand` e `Agency` no módulo Creator

### Exemplo legado (ClientRecord)

```json
{
  "clientId": "client-001",
  "tenantId": "tenant-demo",
  "nome": "João Cliente",
  "empresa": "João Cliente ME",
  "email": "cliente@demo.com",
  "cnpj": "12.345.678/0001-90"
}
```

### Exemplo alvo — Marca

```json
{
  "id": "brand_client-001",
  "tenantId": "tenant-demo",
  "name": "João Cliente ME",
  "slug": "joao-cliente-me",
  "niche": "unknown",
  "audienceSize": 0,
  "platforms": [],
  "status": "active",
  "logoUrl": null,
  "primaryAgencyId": null,
  "legacyClientId": "client-001",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

### Exemplo alvo — Agência

```json
{
  "id": "agency_demo_001",
  "tenantId": "tenant-demo",
  "name": "Agência Demo Partners",
  "contactName": "Maria Operacional",
  "contactEmail": "operacional@demo.com",
  "brandsManaged": ["brand_client-001"],
  "commissionRate": 15,
  "status": "active",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

## 5. Tarefas → ChecklistEntrega

**Fonte:** `Tarefa` em `src/lib/types.ts`

### Exemplo legado

```json
{
  "id": "tarefa-demo-001",
  "titulo": "Revisar proposta de consultoria com João",
  "responsavelId": "user-operacional",
  "prazo": "2026-06-18T17:00:00.000Z",
  "prioridade": "Alta",
  "concluida": false,
  "leadId": "lead-demo-jc-ativo"
}
```

### Exemplo alvo

```json
{
  "id": "checklist_tarefa-demo-001",
  "tenantId": "tenant-demo",
  "entregaId": "entrega_001",
  "campanhaId": "campaign_migrated_lead-demo-jc-ativo",
  "itens": [
    {
      "id": "item_001",
      "titulo": "Revisar proposta de consultoria com João",
      "concluido": false,
      "ordem": 1
    }
  ],
  "responsavelId": "user-operacional",
  "prazo": "2026-06-18T17:00:00.000Z",
  "prioridade": "alta",
  "legacyTarefaId": "tarefa-demo-001",
  "createdAt": "2026-06-01T09:00:00.000Z"
}
```

---

## 6. Relatórios → PainelCampanha

**Fonte:** KPIs em `src/routes/t/$tenantSlug/app/painel.tsx` + `communications/reports`

### Exemplo alvo

```json
{
  "id": "painel_campaign_demo_launch_x3",
  "tenantId": "tenant-demo",
  "campanhaId": "campaign_demo_launch_x3",
  "periodo": {
    "inicio": "2026-04-01",
    "fim": "2026-06-30"
  },
  "metricas": {
    "alcance": 420000,
    "impressoes": 1250000,
    "cliques": 18500,
    "engajamento": 4.2,
    "conversoes": 320,
    "roi": 2.8,
    "receitaParceria": 120000,
    "cpm": 96.0
  },
  "porPlataforma": {
    "instagram": { "alcance": 280000, "engajamento": 5.1 },
    "youtube": { "visualizacoes": 95000, "engajamento": 3.8 },
    "tiktok": { "visualizacoes": 210000, "engajamento": 6.2 }
  },
  "exportMediaKit": false,
  "atualizadoEm": "2026-06-30T23:59:59.000Z"
}
```

---

## 7. Documentos → Contrato

**Fonte:** `Proposta` em `src/lib/types.ts`

### Exemplo legado

```json
{
  "id": "prop-demo-001",
  "tenantId": "tenant-demo",
  "clientId": "client-001",
  "numero": "PROP-2026-002",
  "cliente": "João Cliente ME",
  "cnpj": "12.345.678/0001-90",
  "valor": 8500,
  "criadaEm": "2026-05-15T14:00:00.000Z",
  "validade": "2026-07-01",
  "status": "Aceita",
  "responsavelId": "user-operacional",
  "itens": [
    { "descricao": "Implementação CRM", "qtd": 1, "valorUnit": 8500 }
  ],
  "condicoes": "Pagamento em 2x",
  "observacoes": "",
  "leadId": "lead-demo-jc-ativo"
}
```

### Exemplo alvo

```json
{
  "id": "contrato_prop-demo-001",
  "tenantId": "tenant-demo",
  "campanhaId": "campaign_migrated_lead-demo-jc-ativo",
  "templateId": "default-campaign",
  "numero": "CTR-2026-002",
  "valor": 8500,
  "moeda": "BRL",
  "milestones": [
    { "id": "ms_001", "descricao": "Assinatura", "valor": 4250, "status": "pago", "vencimento": "2026-05-20" },
    { "id": "ms_002", "descricao": "Entrega aprovada", "valor": 4250, "status": "pendente", "vencimento": "2026-07-01" }
  ],
  "assinaturaStatus": "aceita",
  "assinadoEm": "2026-05-18T10:00:00.000Z",
  "partes": {
    "marcaId": "brand_client-001",
    "influencerId": "influencer_lead-demo-jc-ativo"
  },
  "legacyPropostaId": "prop-demo-001",
  "createdAt": "2026-05-15T14:00:00.000Z"
}
```

---

## 8. Mensagens → InboxUnificada

**Fonte:** `CommunicationsSnapshot` (autoritativo) + legado `Conversa`/`Mensagem`/`EmailMsg`

### Exemplo legado — Conversa

```json
{
  "id": "conv-demo-001",
  "contatoNome": "João Cliente",
  "contatoEmpresa": "João Cliente ME",
  "telefone": "(11) 98765-4321",
  "leadId": "lead-demo-jc-ativo",
  "agenteId": "user-operacional",
  "naoLidas": 1,
  "mensagens": [
    {
      "id": "msg-demo-001a",
      "autor": "cliente",
      "texto": "Olá, gostaria de saber o status da proposta.",
      "em": "2026-05-10T09:30:00.000Z",
      "lida": false
    }
  ]
}
```

### Exemplo alvo — Conversation (Communications Hub)

```json
{
  "id": "conv_unified_001",
  "tenantId": "tenant-demo",
  "channelId": "channel_internal_001",
  "channelType": "internal",
  "subject": "Parceria — João Cliente ME",
  "participants": [
    { "id": "user-operacional", "name": "Maria Operacional", "role": "employee" },
    { "id": "client-001", "name": "João Cliente", "role": "client", "email": "cliente@demo.com" }
  ],
  "assignedEmployeeId": "user-operacional",
  "clientId": "client-001",
  "leadId": "lead-demo-jc-ativo",
  "campaignId": "campaign_migrated_lead-demo-jc-ativo",
  "unreadCount": 1,
  "lastMessageAt": "2026-05-10T09:30:00.000Z",
  "status": "open",
  "tags": ["campanha", "proposta"],
  "legacyConversaId": "conv-demo-001"
}
```

### Nota de migração

O Communications Hub já implementa o padrão de **dual-write** via `legacy-adapter.ts` e `chamado-ticket-sync.ts`. A evolução para InboxUnificada completa requer:

- Threads por campanha (campo `campaignId`)
- Tags automáticas por status de entrega
- Unificação de canais (WhatsApp, email, internal) em uma única inbox

---

## Referências de código

| Entidade legada | Arquivo |
| --- | --- |
| Lead, Tarefa, Proposta, etc. | `src/lib/types.ts` |
| TenantCrmSnapshot | `src/lib/db/types.ts` |
| Brand, Campaign, Agency | `src/modules/creator/domain/entities.ts` |
| Conversation, Message, Ticket | `src/modules/communications/domain/entities.ts` |
| PipelineItem | `src/lib/pipelines/types.ts` |
| ClientRecord | `src/lib/clients-registry.ts` |
