import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { Megaphone, Plus } from "lucide-react";
import { CampaignCard } from "@/components/CampaignCard";
import { GlowButton } from "@/ui";
import { CREATOR_NAV } from "../domain/terminology";
import { useCreator } from "../store/creator-context";

export function CampaignsPage() {
  const { tenantSlug } = useParams({ from: "/t/$tenantSlug/app/creator/campaigns" });
  const navigate = useNavigate();
  const { campaigns, brands, atualizarCampaignStatus } = useCreator();

  const activeCount = campaigns.filter((c) => c.status === "active").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="glowup-heading flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-violet-500" />
            {CREATOR_NAV.campaigns}
          </h1>
          <p className="glowup-subheading">
            {activeCount > 0
              ? `${activeCount} campanha${activeCount > 1 ? "s" : ""} em andamento — seu feed de ativações.`
              : "Seu feed de campanhas e colaborações com marcas."}
          </p>
        </div>
        <GlowButton size="sm" className="rounded-full" asChild>
          <Link to="/t/$tenantSlug/app/creator/onboarding" params={{ tenantSlug }}>
            <Plus className="mr-1 h-4 w-4" />
            Nova campanha
          </Link>
        </GlowButton>
      </div>

      {campaigns.length === 0 ? (
        <div className="creator-empty-feed rounded-2xl border border-dashed p-12 text-center">
          <Megaphone className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <p className="mt-4 text-sm text-muted-foreground">
            Nenhuma campanha ainda. Bora criar algo incrível?
          </p>
          <GlowButton size="sm" className="mt-4 rounded-full" asChild>
            <Link to="/t/$tenantSlug/app/creator/onboarding" params={{ tenantSlug }}>
              Começar
            </Link>
          </GlowButton>
        </div>
      ) : (
        <div className="creator-feed-grid">
          {campaigns.map((c) => (
            <CampaignCard
              key={c.id}
              campaign={c}
              brandName={brands.find((b) => b.id === c.brandId)?.name}
              visual
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
    </div>
  );
}
