import type { Meta, StoryObj } from "@storybook/react";
import { CardInfluencer } from "@/components/CardInfluencer";
import { CampaignCard } from "@/components/CampaignCard";
import { InboxUnificada, type InboxThread } from "@/components/Inbox";
import { PainelCampanha } from "@/components/PainelCampanha";
import { TimelineEntrega } from "@/components/TimelineEntrega";

const meta: Meta = {
  title: "Domain/Influencer",
  tags: ["autodocs"],
};

export default meta;

const sampleProfile = {
  nome: "Ana Creator",
  handle: "@anacreator",
  avatarUrl: null,
  nicho: "Beauty & Lifestyle",
  plataformas: ["instagram", "tiktok"],
  metricasSociais: {
    instagram: { seguidores: 125000, engajamento: 4.8 },
    tiktok: { seguidores: 89000, engajamento: 6.2 },
  },
  status: "ativo" as const,
};

export const InfluencerCard: StoryObj = {
  render: () => (
    <div className="w-80">
      <CardInfluencer profile={sampleProfile} onViewProfile={() => {}} />
    </div>
  ),
};

export const CampaignCardStory: StoryObj = {
  name: "Campaign Card",
  render: () => (
    <div className="w-80">
      <CampaignCard
        campaign={{
          id: "camp-1",
          title: "Launch Verão 2026",
          status: "active",
          budget: 50000,
          startDate: "2026-07-01",
          endDate: "2026-08-31",
          channels: ["instagram", "youtube"],
          description: "Campanha de lançamento da coleção verão com creators de lifestyle.",
        }}
        brandName="Glow Brand"
        onAction={() => {}}
      />
    </div>
  ),
};

const sampleThreads: InboxThread[] = [
  {
    id: "1",
    subject: "Parceria — Launch Verão",
    participantName: "Maria Operacional",
    lastMessage: "Conteúdo aprovado! Pode publicar amanhã.",
    lastMessageAt: "2026-07-04T10:30:00.000Z",
    unreadCount: 2,
    tags: ["campanha", "entrega"],
  },
  {
    id: "2",
    subject: "Revisão de contrato",
    participantName: "João Cliente",
    lastMessage: "Enviei a versão assinada do contrato.",
    lastMessageAt: "2026-07-03T15:00:00.000Z",
    unreadCount: 0,
    tags: ["contrato"],
  },
];

export const InboxUnificadaStory: StoryObj = {
  name: "Inbox Unificada",
  render: () => (
    <div className="w-96 h-[420px]">
      <InboxUnificada threads={sampleThreads} selectedId="1" />
    </div>
  ),
};

export const PainelCampanhaStory: StoryObj = {
  name: "Painel de Campanha",
  render: () => (
    <div className="w-[640px]">
      <PainelCampanha
        painel={{
          id: "painel-story",
          tenantId: "tenant-demo",
          campanhaId: "campaign_demo_launch",
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
            instagram: { alcance: 280000, impressoes: 620000 },
            tiktok: { alcance: 140000, impressoes: 270000 },
          },
          exportMediaKit: true,
          atualizadoEm: "2026-07-04T12:00:00.000Z",
        }}
        campaignTitle="Launch Verão 2026"
        entregasAprovadas={3}
      />
    </div>
  ),
};

export const DeliveryTimeline: StoryObj = {
  render: () => (
    <div className="w-[480px]">
      <TimelineEntrega
        entregas={[
          {
            id: "e1",
            titulo: "Reels — Unboxing",
            tipoMidia: "reels",
            arquivoUrl: null,
            versao: 2,
            statusAprovacao: "em_revisao",
            criadoEm: "2026-07-04T09:00:00.000Z",
            comentariosCount: 3,
          },
          {
            id: "e2",
            titulo: "Stories — Teaser",
            tipoMidia: "stories",
            arquivoUrl: null,
            versao: 1,
            statusAprovacao: "aprovado",
            criadoEm: "2026-07-01T14:00:00.000Z",
          },
        ]}
        onApprove={() => {}}
        onReject={() => {}}
      />
    </div>
  ),
};
