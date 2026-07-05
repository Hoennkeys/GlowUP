import { BarChart3, Eye, Heart, MousePointerClick, TrendingUp, CheckCircle2 } from "lucide-react";
import type { PainelCampanha as PainelCampanhaData } from "../../types/influencer-platform";
import { GlowBadge, GlowCard, GlowCardContent, GlowCardHeader } from "@/ui";
import { formatMetricCount } from "./influencer/helpers";
import { cn } from "@/lib/utils";

export type PainelCampanhaProps = {
  painel: PainelCampanhaData;
  campaignTitle?: string;
  entregasAprovadas?: number;
  className?: string;
};

export function PainelCampanha({
  painel,
  campaignTitle,
  entregasAprovadas,
  className,
}: PainelCampanhaProps) {
  const m = painel.metricas;

  return (
    <GlowCard className={cn(className)}>
      <GlowCardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-creator-primary" />
              {campaignTitle ?? "Painel de Campanha"}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {painel.periodo.inicio} — {painel.periodo.fim}
            </p>
          </div>
          {painel.exportMediaKit ? (
            <GlowBadge variant="outline" className="shrink-0">
              Media kit
            </GlowBadge>
          ) : null}
        </div>
      </GlowCardHeader>

      <GlowCardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <MetricTile icon={Eye} label="Alcance" value={formatMetricCount(m.alcance)} />
          <MetricTile icon={BarChart3} label="Impressões" value={formatMetricCount(m.impressoes)} />
          <MetricTile icon={Heart} label="Engajamento" value={`${m.engajamento}%`} highlight />
          {m.roi != null ? (
            <MetricTile icon={TrendingUp} label="ROI de campanha" value={`${m.roi}x`} highlight />
          ) : null}
          {entregasAprovadas != null ? (
            <MetricTile
              icon={CheckCircle2}
              label="Entregas aprovadas"
              value={String(entregasAprovadas)}
            />
          ) : null}
        </div>

        {Object.keys(painel.porPlataforma).length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 pt-2 border-t">
            {Object.entries(painel.porPlataforma).map(([platform, metrics]) => (
              <div key={platform} className="rounded-lg border border-border/60 p-3 space-y-1">
                <GlowBadge variant="outline" className="capitalize text-[10px]">
                  {platform}
                </GlowBadge>
                {metrics.alcance != null ? (
                  <p className="text-sm flex items-center gap-1.5">
                    <Eye className="h-3 w-3 text-muted-foreground" />
                    Alcance: {formatMetricCount(metrics.alcance)}
                  </p>
                ) : null}
                {metrics.impressoes != null ? (
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <MousePointerClick className="h-3 w-3" />
                    Impressões: {formatMetricCount(metrics.impressoes)}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </GlowCardContent>
    </GlowCard>
  );
}

function MetricTile({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: typeof Eye;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg bg-muted/40 p-3 space-y-1">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className={cn("text-xl font-bold", highlight && "text-creator-primary")}>{value}</p>
    </div>
  );
}
