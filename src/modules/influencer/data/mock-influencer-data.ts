import type { TenantCrmSnapshot } from "@/lib/db/types";
import type {
  Entrega,
  InfluencerPlatformSnapshot,
  PainelCampanha,
  PerfilInfluencer,
} from "../../../../types/influencer-platform";
import { EMPTY_INFLUENCER_SNAPSHOT } from "../../../../types/influencer-platform";

const DEMO_TENANT_ID = "tenant-demo";

const demoProfiles: PerfilInfluencer[] = [
  {
    id: "influencer_demo_ana",
    tenantId: DEMO_TENANT_ID,
    nome: "Ana Creator",
    handle: "@anacreator",
    avatarUrl: null,
    coverUrl: null,
    nicho: "Beauty & Lifestyle",
    bio: "Creator de conteúdo sobre beleza, moda e bem-estar. Parcerias autênticas com marcas alinhadas.",
    plataformas: ["instagram", "tiktok", "youtube"],
    metricasSociais: {
      instagram: { seguidores: 125000, engajamento: 4.8 },
      tiktok: { seguidores: 89000, engajamento: 6.2 },
      youtube: { inscritos: 42000, visualizacoes: 1_200_000 },
    },
    mediaKitUrl: null,
    email: "ana@creator.com",
    telefone: "(11) 98888-0001",
    status: "ativo",
    createdAt: "2025-12-01T10:00:00.000Z",
    updatedAt: "2026-07-01T10:00:00.000Z",
  },
  {
    id: "influencer_demo_lucas",
    tenantId: DEMO_TENANT_ID,
    nome: "Lucas Tech",
    handle: "@lucastech",
    avatarUrl: null,
    coverUrl: null,
    nicho: "Tecnologia",
    bio: "Reviews de gadgets, unboxings e tutoriais de produtividade.",
    plataformas: ["youtube", "instagram"],
    metricasSociais: {
      youtube: { inscritos: 380000, visualizacoes: 5_400_000 },
      instagram: { seguidores: 95000, engajamento: 3.9 },
    },
    mediaKitUrl: null,
    email: "lucas@techcreator.com",
    status: "ativo",
    createdAt: "2026-01-15T10:00:00.000Z",
    updatedAt: "2026-06-20T10:00:00.000Z",
  },
];

const demoEntregas: Entrega[] = [
  {
    id: "entrega_demo_001",
    tenantId: DEMO_TENANT_ID,
    campanhaId: "campaign_demo_launch_x3",
    influencerId: "influencer_demo_ana",
    titulo: "Reels — Unboxing Launch Verão",
    tipoMidia: "reels",
    arquivoUrl: "https://placehold.co/720x1280/FF4D8A/white?text=Reels+v2",
    thumbnailUrl: "https://placehold.co/360x640/FF4D8A/white?text=Thumb",
    versao: 2,
    statusAprovacao: "em_revisao",
    comentarios: [
      {
        id: "c1",
        autorId: "user-operacional",
        texto: "Ajustar CTA nos primeiros 3 segundos.",
        criadoEm: "2026-07-03T14:00:00.000Z",
      },
    ],
    criadoEm: "2026-07-02T10:00:00.000Z",
    atualizadoEm: "2026-07-04T09:00:00.000Z",
  },
  {
    id: "entrega_demo_002",
    tenantId: DEMO_TENANT_ID,
    campanhaId: "campaign_demo_launch_x3",
    influencerId: "influencer_demo_ana",
    titulo: "Stories — Bastidores",
    tipoMidia: "stories",
    arquivoUrl: "https://placehold.co/1080x1920/7C3AED/white?text=Stories",
    versao: 1,
    statusAprovacao: "aprovado",
    comentarios: [],
    criadoEm: "2026-06-28T16:00:00.000Z",
    atualizadoEm: "2026-06-29T11:00:00.000Z",
  },
  {
    id: "entrega_demo_003",
    tenantId: DEMO_TENANT_ID,
    campanhaId: "campaign_demo_summer_fit",
    influencerId: "influencer_demo_lucas",
    titulo: "YouTube — Review completo",
    tipoMidia: "video",
    arquivoUrl: null,
    versao: 1,
    statusAprovacao: "pendente",
    comentarios: [],
    criadoEm: "2026-07-04T08:00:00.000Z",
    atualizadoEm: "2026-07-04T08:00:00.000Z",
  },
];

const demoPaineis: PainelCampanha[] = [
  {
    id: "painel_demo_launch",
    tenantId: DEMO_TENANT_ID,
    campanhaId: "campaign_demo_launch_x3",
    periodo: { inicio: "2026-07-01", fim: "2026-08-31" },
    metricas: {
      alcance: 420000,
      impressoes: 890000,
      cliques: 12400,
      engajamento: 5.2,
      conversoes: 340,
      roi: 2.4,
      receitaParceria: 50000,
      cpm: 56.18,
    },
    porPlataforma: {
      instagram: { alcance: 280000, impressoes: 620000, cliques: 8900 },
      tiktok: { alcance: 140000, impressoes: 270000, cliques: 3500 },
    },
    exportMediaKit: true,
    atualizadoEm: "2026-07-04T12:00:00.000Z",
  },
];

const demoSnapshot: InfluencerPlatformSnapshot = {
  ...EMPTY_INFLUENCER_SNAPSHOT,
  profiles: demoProfiles,
  entregas: demoEntregas,
  paineis: demoPaineis,
  contratos: [
    {
      id: "contrato_demo_001",
      tenantId: DEMO_TENANT_ID,
      campanhaId: "campaign_demo_launch_x3",
      templateId: "tpl_standard",
      numero: "CTR-2026-001",
      valor: 50000,
      moeda: "BRL",
      milestones: [
        {
          id: "ms1",
          descricao: "Assinatura do contrato",
          valor: 15000,
          status: "pago",
          vencimento: "2026-07-05",
        },
        {
          id: "ms2",
          descricao: "Entrega aprovada",
          valor: 25000,
          status: "pendente",
          vencimento: "2026-08-01",
        },
        {
          id: "ms3",
          descricao: "Publicação + relatório",
          valor: 10000,
          status: "pendente",
          vencimento: "2026-09-01",
        },
      ],
      assinaturaStatus: "aceita",
      assinadoEm: "2026-06-25T10:00:00.000Z",
      partes: {
        marcaId: "brand_demo_techflow",
        influencerId: "influencer_demo_ana",
      },
      createdAt: "2026-06-20T10:00:00.000Z",
    },
  ],
  pagamentos: [
    {
      id: "pag_demo_001",
      tenantId: DEMO_TENANT_ID,
      campanhaId: "campaign_demo_launch_x3",
      referencia: "Milestone 1 — Assinatura",
      valor: 15000,
      vencimento: "2026-07-05",
      status: "pago",
      emitidaEm: "2026-06-25T10:00:00.000Z",
    },
  ],
};

export function buildMockInfluencerForTenant(
  tenantId: string,
  _state?: Partial<TenantCrmSnapshot>,
): InfluencerPlatformSnapshot {
  if (tenantId === DEMO_TENANT_ID) {
    return structuredClone({
      ...demoSnapshot,
      profiles: demoSnapshot.profiles.map((p) => ({ ...p, tenantId })),
      entregas: demoSnapshot.entregas.map((e) => ({ ...e, tenantId })),
    });
  }
  return structuredClone(EMPTY_INFLUENCER_SNAPSHOT);
}

export function getDemoCampaignIds(): string[] {
  return ["campaign_demo_launch_x3", "campaign_demo_summer_fit"];
}
