import { Link, useParams } from "@tanstack/react-router";
import { DollarSign, Mail } from "lucide-react";
import { GlowAvatar, GlowBadge, GlowButton } from "@/ui";
import { CREATOR_NAV } from "../domain/terminology";
import { coverGradient, initialsFromName } from "../lib/visual-utils";
import { useCreator } from "../store/creator-context";

const STATUS_LABEL = {
  prospect: "Em conversa",
  active: "Ativo",
  inactive: "Inativo",
} as const;

export function SponsorsPage() {
  const { tenantSlug } = useParams({ from: "/t/$tenantSlug/app/creator/sponsors" });
  const { sponsors } = useCreator();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="glowup-heading">{CREATOR_NAV.sponsors}</h1>
          <p className="glowup-subheading">
            Marcas patrocinadoras prontas para campanhas — budgets e oportunidades visuais.
          </p>
        </div>
        <GlowButton variant="outline" size="sm" className="rounded-full" asChild>
          <Link to="/t/$tenantSlug/app/creator/agencies" params={{ tenantSlug }}>
            Ver colaborações
          </Link>
        </GlowButton>
      </div>

      {sponsors.length === 0 ? (
        <div className="creator-empty-feed rounded-2xl border border-dashed p-10 text-center">
          <p className="text-sm text-muted-foreground">Nenhum parceiro cadastrado ainda.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sponsors.map((sponsor) => (
            <article
              key={sponsor.id}
              className="creator-visual-card glowup-card-hover overflow-hidden rounded-2xl border bg-card"
            >
              <div
                className="h-24 w-full"
                style={{ background: coverGradient(sponsor.name) }}
              />
              <div className="p-4 space-y-3">
                <div className="flex items-start gap-3 -mt-8">
                  <GlowAvatar
                    alt={sponsor.name}
                    fallback={initialsFromName(sponsor.name)}
                    size="lg"
                    ring
                    className="border-4 border-card"
                  />
                  <div className="min-w-0 pt-6">
                    <p className="font-semibold truncate">{sponsor.name}</p>
                    <GlowBadge variant="outline" className="mt-1 rounded-full capitalize">
                      {sponsor.industry}
                    </GlowBadge>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-creator-primary/5 px-3 py-2">
                  <DollarSign className="h-4 w-4 text-creator-primary shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">{sponsor.budgetRange}</p>
                    <p className="text-[10px] text-muted-foreground">budget disponível</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{sponsor.contactEmail}</span>
                </div>

                <GlowBadge
                  variant={sponsor.status === "active" ? "default" : "outline"}
                  className="rounded-full"
                >
                  {STATUS_LABEL[sponsor.status]}
                </GlowBadge>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
