/**
 * Migration 001 — Contacts/Leads → Influencer Profiles + Campaigns
 *
 * Transforms legacy CRM data (TenantCrmSnapshot) into influencer platform entities.
 * Legacy data is NEVER removed — only enriched with influencer snapshot.
 *
 * Usage:
 *   npx tsx migrations/001-migrate-contacts-to-profiles.ts --dry-run
 *   npx tsx migrations/001-migrate-contacts-to-profiles.ts
 */

import type { TenantCrmSnapshot } from "../src/lib/db/types";
import type { Lead, Etapa, Proposta, Tarefa, Fatura } from "../src/lib/types";
import type { Brand, Campaign, CampaignStatus } from "../src/modules/creator/domain/entities";
import { CLIENT_REGISTRY } from "../src/lib/clients-registry";
import { DEMO_SNAPSHOT } from "./fixtures/demo-snapshot";
import type {
  PerfilInfluencer,
  InfluencerPlatformSnapshot,
  ChecklistEntrega,
  Contrato,
  PagamentoCampanha,
  ContratoAssinaturaStatus,
  PagamentoStatus,
} from "../types/influencer-platform";
import { EMPTY_INFLUENCER_SNAPSHOT } from "../types/influencer-platform";

// ─── Status mappers ──────────────────────────────────────────────────────────

const ETAPA_TO_CAMPAIGN_STATUS: Record<Etapa, CampaignStatus> = {
  "Sem Contato": "draft",
  "Em Atendimento": "draft",
  "Proposta Enviada": "active",
  Ganho: "completed",
  Perdido: "paused",
};

const PROPOSTA_TO_CONTRATO: Record<string, ContratoAssinaturaStatus> = {
  Pendente: "pendente",
  Aceita: "aceita",
  Vencida: "expirada",
};

const FATURA_TO_PAGAMENTO: Record<string, PagamentoStatus> = {
  Pendente: "pendente",
  Paga: "pago",
  Vencida: "vencido",
  Cancelada: "cancelada",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function inferTenantId(snapshot: TenantCrmSnapshot): string {
  const lead = snapshot.leads[0];
  if (lead?.clientId) {
    const client = CLIENT_REGISTRY.find((c) => c.clientId === lead.clientId);
    if (client) return client.tenantId;
  }
  return "tenant-demo";
}

// ─── Migration functions ─────────────────────────────────────────────────────

export function migrateLeadToProfile(lead: Lead, tenantId: string): PerfilInfluencer {
  const now = new Date().toISOString();
  return {
    id: `influencer_${lead.id}`,
    tenantId,
    nome: lead.contato,
    handle: `@${slugify(lead.contato)}`,
    avatarUrl: null,
    coverUrl: null,
    nicho: null,
    bio: null,
    plataformas: [],
    metricasSociais: {},
    mediaKitUrl: null,
    email: lead.email,
    telefone: lead.telefone,
    status: "ativo",
    legacyLeadId: lead.id,
    legacyClientId: lead.clientId,
    createdAt: lead.criadoEm,
    updatedAt: now,
  };
}

export function migrateLeadToCampaign(
  lead: Lead,
  tenantId: string,
  brandId: string,
): Campaign | null {
  if (lead.etapa === "Sem Contato") return null;

  const now = new Date().toISOString();
  return {
    id: `campaign_migrated_${lead.id}`,
    tenantId,
    title: `Parceria — ${lead.cliente}`,
    brandId,
    status: ETAPA_TO_CAMPAIGN_STATUS[lead.etapa],
    budget: lead.valor,
    startDate: lead.criadoEm.slice(0, 10),
    channels: ["email"],
    description: `Migrado de oportunidade CRM (${lead.etapa})`,
    createdAt: lead.criadoEm,
    updatedAt: now,
  };
}

export function migrateClientToBrand(
  clientId: string,
  tenantId: string,
  existingBrands: Brand[],
): Brand | null {
  if (existingBrands.some((b) => b.id === `brand_${clientId}`)) return null;

  const client = CLIENT_REGISTRY.find((c) => c.clientId === clientId && c.tenantId === tenantId);
  if (!client) return null;

  const now = new Date().toISOString();
  return {
    id: `brand_${clientId}`,
    tenantId,
    name: client.empresa,
    slug: slugify(client.empresa),
    niche: "unknown",
    audienceSize: 0,
    platforms: [],
    status: "active",
    createdAt: now,
    updatedAt: now,
  };
}

export function migrateTarefaToChecklist(
  tarefa: Tarefa,
  tenantId: string,
  campanhaId: string,
): ChecklistEntrega {
  return {
    id: `checklist_${tarefa.id}`,
    tenantId,
    campanhaId,
    itens: [
      {
        id: `item_${tarefa.id}`,
        titulo: tarefa.titulo,
        concluido: tarefa.concluida,
        ordem: 1,
      },
    ],
    responsavelId: tarefa.responsavelId,
    prazo: tarefa.prazo,
    prioridade:
      tarefa.prioridade === "Alta" ? "alta" : tarefa.prioridade === "Média" ? "media" : "baixa",
    legacyTarefaId: tarefa.id,
    createdAt: new Date().toISOString(),
  };
}

export function migratePropostaToContrato(
  proposta: Proposta,
  campanhaId: string,
  influencerId: string,
): Contrato {
  return {
    id: `contrato_${proposta.id}`,
    tenantId: proposta.tenantId,
    campanhaId,
    templateId: "default-campaign",
    numero: proposta.numero.replace("PROP", "CTR"),
    valor: proposta.valor,
    moeda: "BRL",
    milestones: proposta.itens.map((item, i) => ({
      id: `ms_${proposta.id}_${i}`,
      descricao: item.descricao,
      valor: item.qtd * item.valorUnit,
      status: "pendente" as PagamentoStatus,
      vencimento: proposta.validade,
    })),
    assinaturaStatus: PROPOSTA_TO_CONTRATO[proposta.status] ?? "pendente",
    assinadoEm: proposta.status === "Aceita" ? proposta.criadaEm : undefined,
    partes: {
      marcaId: `brand_${proposta.clientId}`,
      influencerId,
    },
    legacyPropostaId: proposta.id,
    createdAt: proposta.criadaEm,
  };
}

export function migrateFaturaToPagamento(fatura: Fatura, campanhaId: string): PagamentoCampanha {
  return {
    id: `pagamento_${fatura.id}`,
    tenantId: fatura.tenantId,
    campanhaId,
    referencia: fatura.numero,
    valor: fatura.valor,
    vencimento: fatura.vencimento,
    status: FATURA_TO_PAGAMENTO[fatura.status] ?? "pendente",
    legacyFaturaId: fatura.id,
    emitidaEm: fatura.emitidaEm,
  };
}

// ─── Main migration ──────────────────────────────────────────────────────────

export type MigrationResult = {
  snapshot: TenantCrmSnapshot;
  influencer: InfluencerPlatformSnapshot;
  stats: {
    profiles: number;
    campaigns: number;
    brands: number;
    checklists: number;
    contratos: number;
    pagamentos: number;
  };
};

export function migrateContactsToProfiles(
  input: TenantCrmSnapshot,
  tenantId?: string,
): MigrationResult {
  const resolvedTenantId = tenantId ?? inferTenantId(input);
  const influencer: InfluencerPlatformSnapshot = structuredClone(EMPTY_INFLUENCER_SNAPSHOT);
  const creator = input.creator ?? { brands: [], agencies: [], sponsors: [], campaigns: [] };
  const brands = [...creator.brands];
  const campaigns = [...creator.campaigns];

  const campaignByLeadId = new Map<string, string>();

  // 1. ClientRecord → Brand
  const clientIds = new Set([
    ...(input.leads.map((l) => l.clientId).filter(Boolean) as string[]),
    ...input.propostas.map((p) => p.clientId),
    ...input.faturas.map((f) => f.clientId),
  ]);

  for (const clientId of clientIds) {
    const brand = migrateClientToBrand(clientId, resolvedTenantId, brands);
    if (brand) brands.push(brand);
  }

  // 2. Lead → PerfilInfluencer + Campanha
  for (const lead of input.leads) {
    influencer.profiles.push(migrateLeadToProfile(lead, resolvedTenantId));

    const brandId = lead.clientId ? `brand_${lead.clientId}` : (brands[0]?.id ?? "brand_unknown");
    const campaign = migrateLeadToCampaign(lead, resolvedTenantId, brandId);
    if (campaign) {
      campaigns.push(campaign);
      campaignByLeadId.set(lead.id, campaign.id);
    }
  }

  // 3. Tarefa → ChecklistEntrega
  for (const tarefa of input.tarefas) {
    const campanhaId = tarefa.leadId
      ? (campaignByLeadId.get(tarefa.leadId) ?? `campaign_migrated_${tarefa.leadId}`)
      : "campaign_unknown";
    influencer.checklists.push(migrateTarefaToChecklist(tarefa, resolvedTenantId, campanhaId));
  }

  // 4. Proposta → Contrato
  for (const proposta of input.propostas) {
    const campanhaId = proposta.leadId
      ? (campaignByLeadId.get(proposta.leadId) ?? `campaign_migrated_${proposta.leadId}`)
      : "campaign_unknown";
    const influencerId = proposta.leadId ? `influencer_${proposta.leadId}` : "influencer_unknown";
    influencer.contratos.push(migratePropostaToContrato(proposta, campanhaId, influencerId));
  }

  // 5. Fatura → PagamentoCampanha
  for (const fatura of input.faturas) {
    const relatedLead = input.leads.find((l) => l.clientId === fatura.clientId);
    const campanhaId = relatedLead
      ? (campaignByLeadId.get(relatedLead.id) ?? `campaign_migrated_${relatedLead.id}`)
      : "campaign_unknown";
    influencer.pagamentos.push(migrateFaturaToPagamento(fatura, campanhaId));
  }

  const snapshot: TenantCrmSnapshot = {
    ...input,
    creator: { ...creator, brands, campaigns },
  };

  return {
    snapshot,
    influencer,
    stats: {
      profiles: influencer.profiles.length,
      campaigns: campaigns.filter((c) => c.id.startsWith("campaign_migrated_")).length,
      brands: brands.filter((b) => b.id.startsWith("brand_")).length,
      checklists: influencer.checklists.length,
      contratos: influencer.contratos.length,
      pagamentos: influencer.pagamentos.length,
    },
  };
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

function parseArgs(): { dryRun: boolean; tenant: string } {
  const args = process.argv.slice(2);
  return {
    dryRun: args.includes("--dry-run"),
    tenant: args.find((a) => a.startsWith("--tenant="))?.split("=")[1] ?? "tenant-demo",
  };
}

const isMain =
  process.argv[1]?.replace(/\\/g, "/").endsWith("001-migrate-contacts-to-profiles.ts") ?? false;

if (isMain) {
  const { dryRun, tenant } = parseArgs();
  const input = DEMO_SNAPSHOT;
  const result = migrateContactsToProfiles(input, tenant);

  console.log(`\n=== Migration 001: Contacts → Profiles ===`);
  console.log(`Tenant: ${tenant}`);
  console.log(`Mode: ${dryRun ? "DRY RUN" : "APPLY"}`);
  console.log(`\nStats:`);
  console.log(`  Profiles:    ${result.stats.profiles}`);
  console.log(`  Campaigns:   ${result.stats.campaigns}`);
  console.log(`  Brands:      ${result.stats.brands}`);
  console.log(`  Checklists:  ${result.stats.checklists}`);
  console.log(`  Contratos:   ${result.stats.contratos}`);
  console.log(`  Pagamentos:  ${result.stats.pagamentos}`);

  if (!dryRun) {
    console.log(`\nSample profile:`);
    console.log(JSON.stringify(result.influencer.profiles[0], null, 2));
  }

  console.log(`\n✓ Migration complete (legacy data preserved)\n`);
}
