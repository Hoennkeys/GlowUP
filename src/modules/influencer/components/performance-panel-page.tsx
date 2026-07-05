import { BarChart3, TrendingUp } from "lucide-react";
import { useParams, useSearch } from "@tanstack/react-router";
import { GlowBadge, GlowCard, GlowCardContent, GlowCardHeader } from "@/ui";
import { formatMetricCount } from "@/components/influencer/helpers";
import { useCreator } from "@/modules/creator/store/creator-context";
import { useInfluencer } from "../store/influencer-context";

export function PerformancePanelPage() {
  const { tenantSlug } = useParams({ from: "/t/$tenantSlug/app/creator/performance" });
  const { campaignId } = useSearch({ from: "/t/$tenantSlug/app/creator/performance" });
  const { campaigns } = useCreator();
  const { snapshot } = useInfluencer();

  const paineis = campaignId
    ? snapshot.paineis.filter((p) => p.campanhaId === campaignId)
    : snapshot.paineis;

  const selectedCampaign = campaignId
    ? campaigns.find((c) => c.id === campaignId)
    : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-creator-primary" />
          Painel de Performance
        </h1>
        <p className="text-sm text-muted-foreground">
          {selectedCampaign
            ? `Métricas — ${selectedCampaign.title}`
            : "Métricas consolidadas por campanha"}
        </p>
      </div>

      {paineis.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum dado de performance disponível.</p>
      ) : (
        paineis.map((painel) => {
          const campaign = campaigns.find((c) => c.id === painel.campanhaId);
          const m = painel.metricas;

          return (
            <div key={painel.id} className="space-y-4">
              {campaign && !selectedCampaign ? (
                <h2 className="font-medium">{campaign.title}</h2>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Alcance" value={formatMetricCount(m.alcance)} />
                <MetricCard label="Impressões" value={formatMetricCount(m.impressoes)} />
                <MetricCard label="Cliques" value={formatMetricCount(m.cliques)} />
                <MetricCard
                  label="Engajamento"
                  value={`${m.engajamento}%`}
                  highlight
                />
                {m.roi != null ? (
                  <MetricCard label="ROI" value={`${m.roi}x`} highlight />
                ) : null}
                <MetricCard label="Conversões" value={String(m.conversoes)} />
                <MetricCard label="CPM" value={`R$ ${m.cpm.toFixed(2)}`} />
              </div>

              {Object.keys(painel.porPlataforma).length > 0 ? (
                <GlowCard>
                  <GlowCardHeader>
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Por plataforma
                    </h3>
                  </GlowCardHeader>
                  <GlowCardContent>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {Object.entries(painel.porPlataforma).map(([platform, metrics]) => (
                        <div key={platform} className="rounded-lg border p-3 space-y-1">
                          <GlowBadge variant="outline" className="capitalize">
                            {platform}
                          </GlowBadge>
                          {metrics.alcance != null ? (
                            <p className="text-sm">
                              Alcance: {formatMetricCount(metrics.alcance)}
                            </p>
                          ) : null}
                          {metrics.impressoes != null ? (
                            <p className="text-sm text-muted-foreground">
                              Impressões: {formatMetricCount(metrics.impressoes)}
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </GlowCardContent>
                </GlowCard>
              ) : null}
            </div>
          );
        })
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <GlowCard>
      <GlowCardContent className="p-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-2xl font-bold ${highlight ? "text-creator-primary" : ""}`}>{value}</p>
      </GlowCardContent>
    </GlowCard>
  );
}
