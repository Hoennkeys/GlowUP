import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { Eye, Heart, TrendingUp, CheckCircle2, BarChart3 } from "lucide-react";
import { PainelCampanha } from "@/components/PainelCampanha";
import {
  aggregatePainelMetricas,
  countEntregasAprovadas,
  formatMetricCount,
} from "@/components/influencer/helpers";
import { GlowBadge, GlowCard, GlowCardContent, GlowCardHeader } from "@/ui";
import { useCrm } from "@/lib/crm-store";
import { pageTitle } from "@/lib/product-branding";
import { NAV_LABELS } from "@/modules/creator/domain/terminology";

export const Route = createFileRoute("/t/$tenantSlug/app/painel")({
  head: () => ({ meta: [{ title: pageTitle(NAV_LABELS.revenueDashboard) }] }),
  component: Painel,
});

function Painel() {
  const { getInfluencer } = useCrm();
  const snapshot = getInfluencer();
  const { paineis, entregas } = snapshot;

  const metrics = React.useMemo(() => {
    const agg = aggregatePainelMetricas(paineis);
    return { ...agg, entregasAprovadas: countEntregasAprovadas(entregas) };
  }, [paineis, entregas]);

  const chartData = paineis.map((p) => ({
    campanha: p.campanhaId.replace(/^campaign_demo_/, "").replace(/_/g, " "),
    alcance: p.metricas.alcance,
    impressoes: p.metricas.impressoes,
    engajamento: p.metricas.engajamento,
  }));

  const entregasRecentes = [...entregas]
    .sort((a, b) => new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime())
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="glowup-heading">{NAV_LABELS.revenueDashboard}</h1>
        <p className="glowup-subheading">
          Alcance, engajamento e entregas das suas campanhas ativas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Kpi
          icon={<Eye className="h-4 w-4" />}
          label="Alcance"
          value={formatMetricCount(metrics.alcance)}
          hint={`${paineis.length} campanha(s) monitorada(s)`}
        />
        <Kpi
          icon={<BarChart3 className="h-4 w-4" />}
          label="Impressões"
          value={formatMetricCount(metrics.impressoes)}
          hint="Total consolidado"
        />
        <Kpi
          icon={<Heart className="h-4 w-4" />}
          label="Engajamento"
          value={`${metrics.engajamento}%`}
          hint="Média entre campanhas"
          highlight
        />
        <Kpi
          icon={<TrendingUp className="h-4 w-4" />}
          label="ROI de campanha"
          value={metrics.roi != null ? `${metrics.roi}x` : "—"}
          hint={metrics.roi != null ? "Retorno sobre investimento" : "Sem dados de ROI"}
          highlight
        />
        <Kpi
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Entregas aprovadas"
          value={String(metrics.entregasAprovadas)}
          hint={`${entregas.length} entrega(s) no total`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlowCard className="lg:col-span-2">
          <GlowCardHeader>
            <h2 className="font-semibold">Alcance por campanha</h2>
          </GlowCardHeader>
          <GlowCardContent className="h-[280px]">
            {chartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Nenhuma campanha com métricas. Ative campanhas no workspace creator.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="campanha" stroke="currentColor" fontSize={11} />
                  <YAxis
                    stroke="currentColor"
                    fontSize={12}
                    tickFormatter={(v) => formatMetricCount(Number(v))}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      name === "engajamento" ? `${v}%` : formatMetricCount(Number(v)),
                      String(name),
                    ]}
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="alcance" fill="var(--creator-primary)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="impressoes" fill="var(--creator-accent)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </GlowCardContent>
        </GlowCard>

        <GlowCard>
          <GlowCardHeader>
            <h2 className="font-semibold">Engajamento</h2>
          </GlowCardHeader>
          <GlowCardContent className="h-[280px]">
            {chartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Sem dados de engajamento.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="campanha" fontSize={11} stroke="currentColor" />
                  <YAxis fontSize={12} stroke="currentColor" unit="%" />
                  <Tooltip
                    formatter={(v) => [`${v}%`, "Engajamento"]}
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="engajamento"
                    stroke="var(--creator-primary)"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "var(--creator-accent)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </GlowCardContent>
        </GlowCard>
      </div>

      {paineis.length > 0 ? (
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Painéis por campanha</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {paineis.map((painel) => {
              const aprovadas = entregas.filter(
                (e) => e.campanhaId === painel.campanhaId && e.statusAprovacao === "aprovado",
              ).length;
              return (
                <PainelCampanha
                  key={painel.id}
                  painel={painel}
                  campaignTitle={painel.campanhaId.replace(/^campaign_demo_/, "Campanha ")}
                  entregasAprovadas={aprovadas}
                />
              );
            })}
          </div>
        </div>
      ) : null}

      <GlowCard>
        <GlowCardHeader>
          <h2 className="font-semibold">Entregas recentes</h2>
        </GlowCardHeader>
        <GlowCardContent className="space-y-3">
          {entregasRecentes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma entrega registrada. Envie conteúdo nas campanhas ativas.
            </p>
          ) : (
            entregasRecentes.map((e) => (
              <div key={e.id} className="flex items-start justify-between gap-3 text-sm">
                <div>
                  <p className="font-medium">{e.titulo}</p>
                  <p className="text-xs text-muted-foreground capitalize">{e.tipoMidia}</p>
                </div>
                <GlowBadge variant="outline" className="capitalize shrink-0">
                  {e.statusAprovacao.replace("_", " ")}
                </GlowBadge>
              </div>
            ))
          )}
        </GlowCardContent>
      </GlowCard>
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  hint,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  highlight?: boolean;
}) {
  return (
    <GlowCard>
      <GlowCardHeader className="pb-2">
        <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {icon} {label}
        </p>
      </GlowCardHeader>
      <GlowCardContent>
        <div className={`text-2xl font-semibold ${highlight ? "text-creator-primary" : ""}`}>
          {value}
        </div>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </GlowCardContent>
    </GlowCard>
  );
}
