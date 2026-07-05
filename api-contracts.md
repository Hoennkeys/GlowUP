# Contratos de API — Plataforma de Influenciadores GlowUP

> **Etapa 2 — Arquitetura de dados e migração**  
> Última atualização: julho/2026

Este documento define os contratos de API alvo para a plataforma de influenciadores. Durante a transição, as server functions legadas (`createServerFn`) coexistem com os novos endpoints.

---

## Convenções

| Aspecto       | Padrão                                                    |
| ------------- | --------------------------------------------------------- |
| Formato       | JSON                                                      |
| Autenticação  | Session cookie (TanStack Start)                           |
| Escopo        | Por tenant (`tenantId` implícito na sessão)               |
| Versionamento | Header `X-API-Version: 2026-07`                           |
| Erros         | `{ "error": string, "code": string, "details"?: object }` |

### Códigos de erro

| Code               | HTTP | Descrição                    |
| ------------------ | ---- | ---------------------------- |
| `UNAUTHORIZED`     | 401  | Sessão inválida              |
| `FORBIDDEN`        | 403  | Sem permissão para o recurso |
| `NOT_FOUND`        | 404  | Recurso não encontrado       |
| `VALIDATION_ERROR` | 422  | Payload inválido             |
| `CONFLICT`         | 409  | Conflito de versão/estado    |

---

## 1. Perfis de Influenciador

### `GET /api/v1/influencers`

Lista perfis do tenant.

**Query params:** `?status=ativo&nicho=beauty&page=1&limit=20`

**Response 200:**

```json
{
  "data": [
    {
      "id": "influencer_lead-demo-jc-ativo",
      "nome": "João Cliente",
      "handle": "@joaocliente",
      "avatarUrl": null,
      "nicho": "lifestyle",
      "plataformas": ["instagram", "tiktok"],
      "metricasSociais": {
        "instagram": { "seguidores": 45000, "engajamento": 4.2 }
      },
      "status": "ativo"
    }
  ],
  "meta": { "total": 1, "page": 1, "limit": 20 }
}
```

### `GET /api/v1/influencers/:id`

**Response 200:** Objeto `PerfilInfluencer` completo (ver `types/influencer-platform.ts`).

### `POST /api/v1/influencers`

**Request:**

```json
{
  "nome": "Ana Creator",
  "email": "ana@creator.com",
  "handle": "@anacreator",
  "nicho": "beauty",
  "plataformas": ["instagram"]
}
```

**Response 201:** `PerfilInfluencer` criado.

### `PATCH /api/v1/influencers/:id`

Atualização parcial do perfil.

---

## 2. Campanhas

> Nota: `Campaign` já existe em `src/modules/creator/domain/entities.ts`. Endpoints estendem o módulo Creator.

### `GET /api/v1/campaigns`

**Query params:** `?status=active&brandId=brand_client-001`

**Response 200:**

```json
{
  "data": [
    {
      "id": "campaign_migrated_lead-demo-jc-ativo",
      "title": "Parceria — João Cliente ME",
      "brandId": "brand_client-001",
      "status": "active",
      "budget": 15000,
      "startDate": "2026-05-01",
      "channels": ["instagram", "email"],
      "legacyLeadId": "lead-demo-jc-ativo"
    }
  ],
  "meta": { "total": 1 }
}
```

### `POST /api/v1/campaigns`

**Request:**

```json
{
  "title": "Launch Verão 2026",
  "brandId": "brand_client-001",
  "budget": 50000,
  "startDate": "2026-07-01",
  "channels": ["instagram", "youtube"],
  "description": "Campanha de lançamento da coleção verão"
}
```

### `GET /api/v1/campaigns/:id/entregas`

Lista entregas vinculadas à campanha.

---

## 3. Entregas

### `POST /api/v1/campaigns/:campaignId/entregas`

**Request:**

```json
{
  "influencerId": "influencer_lead-demo-jc-ativo",
  "tipoMidia": "video",
  "titulo": "Reels — Unboxing produto",
  "arquivoUrl": "https://cdn.glowup.app/entregas/video_001.mp4"
}
```

**Response 201:**

```json
{
  "id": "entrega_001",
  "campanhaId": "campaign_migrated_lead-demo-jc-ativo",
  "versao": 1,
  "statusAprovacao": "pendente",
  "criadoEm": "2026-07-04T12:00:00.000Z"
}
```

### `PATCH /api/v1/entregas/:id/status`

**Request:**

```json
{
  "statusAprovacao": "aprovado",
  "comentario": "Conteúdo aprovado para publicação"
}
```

### `POST /api/v1/entregas/:id/versoes`

Upload de nova versão (incrementa `versao`).

---

## 4. Contratos

### `GET /api/v1/contratos?campanhaId=...`

### `POST /api/v1/contratos`

**Request:**

```json
{
  "campanhaId": "campaign_migrated_lead-demo-jc-ativo",
  "templateId": "default-campaign",
  "valor": 8500,
  "partes": {
    "marcaId": "brand_client-001",
    "influencerId": "influencer_lead-demo-jc-ativo"
  },
  "milestones": [
    { "descricao": "Assinatura", "valor": 4250, "vencimento": "2026-07-15" },
    { "descricao": "Entrega aprovada", "valor": 4250, "vencimento": "2026-08-01" }
  ]
}
```

### `POST /api/v1/contratos/:id/assinar`

Inicia fluxo de e-sign (integração futura DocuSign/HelloSign).

---

## 5. Inbox Unificada

> Parcialmente implementado via Communications Hub server functions.

### Server functions existentes

| Função                            | Método | Descrição                   |
| --------------------------------- | ------ | --------------------------- |
| `getCommunicationsStateServerFn`  | GET    | Lê snapshot de comunicações |
| `saveCommunicationsStateServerFn` | POST   | Salva snapshot              |

### Endpoints alvo (evolução)

| Endpoint                                        | Descrição                                       |
| ----------------------------------------------- | ----------------------------------------------- |
| `GET /api/v1/inbox/conversations`               | Lista threads (filtro por campanha, canal, tag) |
| `GET /api/v1/inbox/conversations/:id/messages`  | Mensagens da thread                             |
| `POST /api/v1/inbox/conversations/:id/messages` | Enviar mensagem + anexos                        |
| `PATCH /api/v1/inbox/conversations/:id/tags`    | Atualizar tags                                  |

**Request — enviar mensagem:**

```json
{
  "body": "Conteúdo aprovado! Pode publicar amanhã às 18h.",
  "attachments": [{ "name": "brief.pdf", "mimeType": "application/pdf", "url": "https://..." }]
}
```

---

## 6. Painel de Performance

### `GET /api/v1/campaigns/:id/painel`

**Query params:** `?inicio=2026-04-01&fim=2026-06-30`

**Response 200:**

```json
{
  "campanhaId": "campaign_demo_launch_x3",
  "periodo": { "inicio": "2026-04-01", "fim": "2026-06-30" },
  "metricas": {
    "alcance": 420000,
    "impressoes": 1250000,
    "cliques": 18500,
    "engajamento": 4.2,
    "roi": 2.8,
    "receitaParceria": 120000
  },
  "porPlataforma": {
    "instagram": { "alcance": 280000, "engajamento": 5.1 }
  }
}
```

### `POST /api/v1/campaigns/:id/painel/export-media-kit`

Gera PDF/media kit exportável.

---

## 7. Server functions legadas (mantidas durante migração)

| Função                 | Arquivo            | Substituída por                      |
| ---------------------- | ------------------ | ------------------------------------ |
| `getCrmStateServerFn`  | `crm.functions.ts` | `GET /api/v1/snapshot` (transitório) |
| `saveCrmStateServerFn` | `crm.functions.ts` | Endpoints granulares acima           |
| `addChamadoServerFn`   | `crm.functions.ts` | `POST /api/v1/inbox/tickets`         |

---

## 8. Feature flags e rollout

Durante o rollout, o frontend consulta flags antes de chamar endpoints novos:

```typescript
// src/lib/feature-flags.ts (a implementar)
export const flags = {
  creatorDomainRead: import.meta.env.VITE_CREATOR_DOMAIN_READ === "true",
  influencerProfiles: import.meta.env.VITE_INFLUENCER_PROFILES === "true",
};
```

| Fase      | Read    | Write      | Endpoints ativos     |
| --------- | ------- | ---------- | -------------------- |
| 0 (atual) | legado  | legado     | Server functions CRM |
| 1         | adapter | legado     | Adapter layer        |
| 2         | alvo    | dual-write | Novos + legado       |
| 3         | alvo    | alvo       | Apenas novos         |

---

## 9. Validação

Payloads validados contra JSON Schema em `schemas/`:

| Schema                          | Entidade         |
| ------------------------------- | ---------------- |
| `perfil-influencer.schema.json` | PerfilInfluencer |
| `campanha.schema.json`          | Campanha         |

---

## Referências

- `types/influencer-platform.ts` — tipos TypeScript alvo
- `docs/entity-mapping.md` — mapeamento CRM → plataforma
- `migration-plan.md` — estratégia de migração de dados
- `migrations/001-migrate-contacts-to-profiles.ts` — script de migração batch
