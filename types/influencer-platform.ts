/**
 * Tipos alvo da plataforma de influenciadores.
 * Etapa 2 — Arquitetura de dados e migração.
 *
 * Estes tipos complementam (não substituem) os tipos legados em src/lib/types.ts.
 * Durante a migração, campos legacy*Id preservam rastreabilidade.
 */

export type InfluencerStatus = "ativo" | "inativo" | "pendente";
export type EntregaStatusAprovacao =
  | "rascunho"
  | "pendente"
  | "em_revisao"
  | "aprovado"
  | "rejeitado";
export type EntregaTipoMidia = "imagem" | "video" | "stories" | "reels" | "documento" | "link";
export type ContratoAssinaturaStatus = "pendente" | "aceita" | "expirada" | "cancelada";
export type PagamentoStatus = "pendente" | "pago" | "vencido" | "cancelado";
export type ChecklistPrioridade = "alta" | "media" | "baixa";

export interface MetricasPlataforma {
  seguidores?: number;
  inscritos?: number;
  visualizacoes?: number;
  engajamento?: number;
  curtidas?: number;
}

export interface PerfilInfluencer {
  id: string;
  tenantId: string;
  nome: string;
  handle?: string;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  nicho?: string | null;
  bio?: string | null;
  plataformas: string[];
  metricasSociais: {
    instagram?: MetricasPlataforma;
    youtube?: MetricasPlataforma;
    tiktok?: MetricasPlataforma;
    twitch?: MetricasPlataforma;
    linkedin?: MetricasPlataforma;
  };
  mediaKitUrl?: string | null;
  email: string;
  telefone?: string;
  status: InfluencerStatus;
  legacyLeadId?: string;
  legacyClientId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EntregaComentario {
  id: string;
  autorId: string;
  texto: string;
  criadoEm: string;
}

export interface Entrega {
  id: string;
  tenantId: string;
  campanhaId: string;
  influencerId: string;
  titulo?: string;
  tipoMidia: EntregaTipoMidia;
  arquivoUrl?: string | null;
  thumbnailUrl?: string | null;
  versao: number;
  statusAprovacao: EntregaStatusAprovacao;
  comentarios: EntregaComentario[];
  checklistId?: string | null;
  legacyPipelineItemId?: string;
  legacyTimelineTipo?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ChecklistItem {
  id: string;
  titulo: string;
  concluido: boolean;
  ordem: number;
}

export interface ChecklistEntrega {
  id: string;
  tenantId: string;
  entregaId?: string;
  campanhaId: string;
  itens: ChecklistItem[];
  responsavelId: string;
  prazo: string;
  prioridade: ChecklistPrioridade;
  legacyTarefaId?: string;
  createdAt: string;
}

export interface ContratoMilestone {
  id: string;
  descricao: string;
  valor: number;
  status: PagamentoStatus;
  vencimento: string;
}

export interface Contrato {
  id: string;
  tenantId: string;
  campanhaId: string;
  templateId: string;
  numero: string;
  valor: number;
  moeda: string;
  milestones: ContratoMilestone[];
  assinaturaStatus: ContratoAssinaturaStatus;
  assinadoEm?: string;
  partes: {
    marcaId: string;
    influencerId: string;
  };
  legacyPropostaId?: string;
  createdAt: string;
}

export interface PainelCampanhaMetricas {
  alcance: number;
  impressoes: number;
  cliques: number;
  engajamento: number;
  conversoes: number;
  roi: number | null;
  receitaParceria: number;
  cpm: number;
}

export interface PainelCampanha {
  id: string;
  tenantId: string;
  campanhaId: string;
  periodo: { inicio: string; fim: string };
  metricas: PainelCampanhaMetricas;
  porPlataforma: Record<string, Partial<PainelCampanhaMetricas>>;
  exportMediaKit: boolean;
  atualizadoEm: string;
}

export interface PagamentoCampanha {
  id: string;
  tenantId: string;
  campanhaId: string;
  referencia: string;
  valor: number;
  vencimento: string;
  status: PagamentoStatus;
  legacyFaturaId?: string;
  emitidaEm: string;
}

/** Snapshot completo das entidades alvo por tenant */
export interface InfluencerPlatformSnapshot {
  profiles: PerfilInfluencer[];
  entregas: Entrega[];
  checklists: ChecklistEntrega[];
  contratos: Contrato[];
  paineis: PainelCampanha[];
  pagamentos: PagamentoCampanha[];
}

export const EMPTY_INFLUENCER_SNAPSHOT: InfluencerPlatformSnapshot = {
  profiles: [],
  entregas: [],
  checklists: [],
  contratos: [],
  paineis: [],
  pagamentos: [],
};
