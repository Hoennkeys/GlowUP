import { Calendar, Megaphone } from "lucide-react";
import type { Campaign, CampaignStatus } from "@/modules/creator/domain/entities";
import { GlowBadge, GlowButton, GlowCard, GlowCardContent, GlowCardFooter } from "@/ui";
import { brl, brDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { CAMPAIGN_STATUS_CONFIG } from "./influencer/helpers";

export type CampaignCardProps = {
  campaign: Pick<
    Campaign,
    "id" | "title" | "status" | "budget" | "startDate" | "endDate" | "channels" | "description"
  >;
  brandName?: string;
  onAction?: (action: "view" | "activate" | "pause", campaignId: string) => void;
  className?: string;
};

function actionForStatus(
  status: CampaignStatus,
): { label: string; action: "activate" | "pause" | "view" } | null {
  switch (status) {
    case "draft":
      return { label: "Ativar campanha", action: "activate" };
    case "active":
      return { label: "Pausar", action: "pause" };
    case "paused":
      return { label: "Retomar", action: "activate" };
    case "completed":
      return { label: "Ver relatório", action: "view" };
  }
}

export function CampaignCard({ campaign, brandName, onAction, className }: CampaignCardProps) {
  const statusConfig = CAMPAIGN_STATUS_CONFIG[campaign.status];
  const cta = actionForStatus(campaign.status);

  return (
    <GlowCard hover className={cn("flex flex-col", className)}>
      <GlowCardContent className="flex-1 space-y-4 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-creator-primary/10">
              <Megaphone className="h-4 w-4 text-creator-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold truncate">{campaign.title}</p>
              {brandName ? (
                <p className="text-xs text-muted-foreground truncate">{brandName}</p>
              ) : null}
            </div>
          </div>
          <GlowBadge className={cn("shrink-0", statusConfig.className)}>
            {statusConfig.label}
          </GlowBadge>
        </div>

        {campaign.description ? (
          <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>
        ) : null}

        <div className="flex flex-wrap gap-3 text-sm">
          <div>
            <p className="font-semibold">{brl(campaign.budget)}</p>
            <p className="text-xs text-muted-foreground">orçamento</p>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-xs">
              {brDate(campaign.startDate)}
              {campaign.endDate ? ` — ${brDate(campaign.endDate)}` : ""}
            </span>
          </div>
        </div>

        {campaign.channels.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {campaign.channels.map((ch) => (
              <GlowBadge key={ch} variant="outline" className="font-normal capitalize">
                {ch}
              </GlowBadge>
            ))}
          </div>
        ) : null}
      </GlowCardContent>

      {onAction && cta ? (
        <GlowCardFooter className="px-4 pb-4 pt-0">
          <GlowButton
            size="sm"
            variant={campaign.status === "draft" ? "default" : "outline"}
            className="w-full"
            onClick={() => onAction(cta.action, campaign.id)}
          >
            {cta.label}
          </GlowButton>
        </GlowCardFooter>
      ) : null}
    </GlowCard>
  );
}
