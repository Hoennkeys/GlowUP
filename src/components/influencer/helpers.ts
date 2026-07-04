import type { CampaignStatus } from "@/modules/creator/domain/entities";
import type { EntregaStatusAprovacao } from "../../../types/influencer-platform";

/** Formata contagem de seguidores/visualizações (ex: 45000 → "45K") */
export function formatMetricCount(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(value);
}

export function getPrimaryFollowerCount(metricas: {
  instagram?: { seguidores?: number };
  youtube?: { inscritos?: number };
  tiktok?: { seguidores?: number };
}): number {
  return (
    metricas.instagram?.seguidores ??
    metricas.tiktok?.seguidores ??
    metricas.youtube?.inscritos ??
    0
  );
}

export const CAMPAIGN_STATUS_CONFIG: Record<CampaignStatus, { label: string; className: string }> =
  {
    draft: { label: "Rascunho", className: "bg-muted text-muted-foreground" },
    active: { label: "Ativa", className: "bg-creator-primary/15 text-creator-primary" },
    paused: { label: "Pausada", className: "bg-warning/15 text-warning" },
    completed: { label: "Concluída", className: "bg-success/15 text-success" },
  };

export const ENTREGA_STATUS_CONFIG: Record<
  EntregaStatusAprovacao,
  { label: string; className: string }
> = {
  rascunho: { label: "Rascunho", className: "bg-muted text-muted-foreground" },
  pendente: { label: "Pendente", className: "bg-warning/15 text-warning" },
  em_revisao: { label: "Em revisão", className: "bg-creator-accent/15 text-creator-accent" },
  aprovado: { label: "Aprovado", className: "bg-success/15 text-success" },
  rejeitado: { label: "Rejeitado", className: "bg-destructive/15 text-destructive" },
};

export function initialsFromName(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function acceptMimeForMediaTypes(types: string[]): string {
  const map: Record<string, string> = {
    imagem: "image/*",
    video: "video/*",
    stories: "image/*,video/*",
    reels: "video/*",
    documento: ".pdf,.doc,.docx",
  };
  return types.map((t) => map[t] ?? "*/*").join(",");
}
