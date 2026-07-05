import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { CampaignCard } from "@/components/CampaignCard";
import { GlowButton } from "@/ui";
import type { CampaignStatus } from "../domain/entities";
import { useCreator } from "../store/creator-context";

const STATUS_LABEL: Record<CampaignStatus, string> = {
  draft: "Rascunho",
  active: "Ativa",
  paused: "Pausada",
  completed: "Concluída",
};

export function CampaignsPage() {
  const { tenantSlug } = useParams({ from: "/t/$tenantSlug/app/creator/campaigns" });
  const navigate = useNavigate();
  const { campaigns, brands, sponsors, atualizarCampaignStatus } = useCreator();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Campanhas</h1>
          <p className="text-sm text-muted-foreground">
            Ativações patrocinadas conectadas a marcas, sponsors e Communications Hub.
          </p>
        </div>
        <GlowButton variant="outline" size="sm" asChild>
          <Link to="/t/$tenantSlug/app/creator/onboarding" params={{ tenantSlug }}>
            Novo creator
          </Link>
        </GlowButton>
      </div>

      {campaigns.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma campanha cadastrada.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((c) => (
            <CampaignCard
              key={c.id}
              campaign={c}
              brandName={brands.find((b) => b.id === c.brandId)?.name}
              onAction={(action, id) => {
                if (action === "activate") atualizarCampaignStatus(id, "active");
                if (action === "pause") atualizarCampaignStatus(id, "paused");
                if (action === "view") {
                  navigate({
                    to: "/t/$tenantSlug/app/creator/campaigns/$campaignId",
                    params: { tenantSlug, campaignId: id },
                  });
                }
              }}
            />
          ))}
        </div>
      )}

      <details className="text-sm text-muted-foreground">
        <summary className="cursor-pointer">Ver tabela legada</summary>
        <ul className="mt-2 space-y-1">
          {campaigns.map((c) => (
            <li key={c.id}>
              <Link
                to="/t/$tenantSlug/app/creator/campaigns/$campaignId"
                params={{ tenantSlug, campaignId: c.id }}
                className="text-creator-primary hover:underline"
              >
                {c.title}
              </Link>
              {" · "}
              {STATUS_LABEL[c.status]} · {sponsors.find((s) => s.id === c.sponsorId)?.name ?? "—"}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
