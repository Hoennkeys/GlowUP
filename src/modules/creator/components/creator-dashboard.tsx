import * as React from "react";
import { Link, useParams } from "@tanstack/react-router";
import {
  Sparkles,
  Megaphone,
  MessageCircle,
  ArrowRight,
  LayoutGrid,
  TrendingUp,
} from "lucide-react";
import { CampaignCard } from "@/components/CampaignCard";
import { GlowAvatar, GlowBadge, GlowButton } from "@/ui";
import { useCommunicationsUnread } from "@/hooks/use-communications-unread";
import { brl } from "@/lib/format";
import { PRODUCT_NAME } from "@/lib/product-branding";
import { CREATOR_NAV } from "../domain/terminology";
import { computeCreatorMetrics } from "../domain/metrics";
import { coverGradient, formatAudience, initialsFromName } from "../lib/visual-utils";
import { useCreator } from "../store/creator-context";

export function CreatorDashboard() {
  const { tenantSlug } = useParams({ from: "/t/$tenantSlug/app/creator" });
  const { snapshot, brands, campaigns, sponsors, agencies } = useCreator();
  const metrics = React.useMemo(() => computeCreatorMetrics(snapshot), [snapshot]);
  const commsUnread = useCommunicationsUnread();

  const recentCampaigns = [...campaigns]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  const metricChips = [
    { label: "Marcas", value: metrics.activeBrands, sub: `${brands.length} no portfólio` },
    { label: "Colaborações", value: metrics.activeAgencies, sub: `${agencies.length} parceiras` },
    { label: "Parceiros", value: metrics.activeSponsors, sub: `${sponsors.length} ativos` },
    {
      label: "Campanhas",
      value: metrics.activeCampaigns,
      sub: `${brl(metrics.totalCampaignBudget)} em andamento`,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="creator-hero rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-white/90" />
              <span className="text-white">{PRODUCT_NAME}</span>
            </h1>
            <p className="text-sm sm:text-base text-white/80 max-w-lg">
              Seu hub criativo — portfólio, campanhas e colaborações em um só lugar.
            </p>
          </div>
          <GlowButton
            variant="secondary"
            size="sm"
            className="rounded-full bg-white/15 text-white border-white/20 hover:bg-white/25"
            asChild
          >
            <Link to="/t/$tenantSlug/app/creator/campaigns" params={{ tenantSlug }}>
              Ver campanhas
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </GlowButton>
        </div>

        <div className="mt-6 flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {metricChips.map((chip) => (
            <div
              key={chip.label}
              className="creator-metric-chip shrink-0 rounded-2xl bg-white/15 backdrop-blur-sm px-4 py-3 min-w-[140px]"
            >
              <p className="text-2xl font-bold text-white">{chip.value}</p>
              <p className="text-xs font-medium text-white/90">{chip.label}</p>
              <p className="text-[10px] text-white/70 mt-0.5">{chip.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="glowup-heading flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-violet-500" />
              Campanhas em andamento
            </h2>
            <p className="glowup-subheading">Suas ativações mais recentes</p>
          </div>
          <GlowButton variant="outline" size="sm" className="rounded-full" asChild>
            <Link to="/t/$tenantSlug/app/creator/campaigns" params={{ tenantSlug }}>
              Ver todas
            </Link>
          </GlowButton>
        </div>

        {recentCampaigns.length === 0 ? (
          <div className="creator-empty-feed rounded-2xl border border-dashed p-10 text-center">
            <Megaphone className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">
              Nenhuma campanha ainda. Que tal começar uma colaboração?
            </p>
            <GlowButton size="sm" className="mt-4 rounded-full" asChild>
              <Link to="/t/$tenantSlug/app/creator/onboarding" params={{ tenantSlug }}>
                Começar agora
              </Link>
            </GlowButton>
          </div>
        ) : (
          <div className="creator-feed-grid">
            {recentCampaigns.map((c) => (
              <CampaignCard
                key={c.id}
                campaign={c}
                brandName={brands.find((b) => b.id === c.brandId)?.name}
                visual
              />
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="glowup-heading flex items-center gap-2">
                <LayoutGrid className="h-5 w-5 text-pink-500" />
                {CREATOR_NAV.portfolio}
              </h2>
              <p className="glowup-subheading">Marcas e perfis que você representa</p>
            </div>
            <GlowButton variant="ghost" size="sm" className="rounded-full" asChild>
              <Link to="/t/$tenantSlug/app/creator/brands" params={{ tenantSlug }}>
                Ver portfólio
              </Link>
            </GlowButton>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {brands.slice(0, 4).map((brand) => (
              <article
                key={brand.id}
                className="creator-visual-card glowup-card-hover group overflow-hidden rounded-2xl border bg-card"
              >
                <div
                  className="h-24 w-full"
                  style={{ background: coverGradient(brand.name) }}
                />
                <div className="relative px-4 pb-4">
                  <GlowAvatar
                    src={brand.logoUrl}
                    alt={brand.name}
                    fallback={initialsFromName(brand.name)}
                    size="lg"
                    ring
                    className="-mt-8 border-4 border-card"
                  />
                  <p className="mt-3 font-semibold truncate">{brand.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{brand.niche}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <GlowBadge variant="outline" className="rounded-full text-[10px]">
                      {formatAudience(brand.audienceSize)} seguidores
                    </GlowBadge>
                    {brand.platforms.slice(0, 2).map((p) => (
                      <GlowBadge key={p} variant="secondary" className="rounded-full text-[10px] capitalize">
                        {p}
                      </GlowBadge>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="creator-visual-card rounded-2xl border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
              <MessageCircle className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <h2 className="font-semibold">{CREATOR_NAV.messages}</h2>
              <p className="text-xs text-muted-foreground">Conversas com marcas e parceiros</p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-muted/50 px-4 py-3">
            <div>
              <p className="text-sm font-medium">Não lidas</p>
              <p className="text-xs text-muted-foreground">Suas DMs mais recentes</p>
            </div>
            {commsUnread > 0 ? (
              <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-creator-primary text-sm font-bold text-white">
                {commsUnread}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">Tudo em dia ✨</span>
            )}
          </div>

          <GlowButton className="w-full rounded-full" asChild>
            <Link to="/t/$tenantSlug/app/creator/inbox" params={{ tenantSlug }}>
              Abrir mensagens
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </GlowButton>

          <GlowButton variant="outline" size="sm" className="w-full rounded-full" asChild>
            <Link to="/t/$tenantSlug/app/creator/performance" params={{ tenantSlug }}>
              <TrendingUp className="mr-1 h-4 w-4 text-amber-500" />
              Ver {CREATOR_NAV.earnings.toLowerCase()}
            </Link>
          </GlowButton>
        </section>
      </div>
    </div>
  );
}
