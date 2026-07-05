import { Instagram, Youtube, Music2 } from "lucide-react";
import { GlowAvatar, GlowBadge } from "@/ui";
import { CREATOR_NAV } from "../domain/terminology";
import { coverGradient, formatAudience, initialsFromName } from "../lib/visual-utils";
import { useCreator } from "../store/creator-context";

const STATUS_LABEL = { active: "Ativa", paused: "Pausada", archived: "Arquivada" } as const;

const PLATFORM_ICONS: Record<string, typeof Instagram> = {
  instagram: Instagram,
  youtube: Youtube,
  tiktok: Music2,
};

export function BrandsPage() {
  const { brands, agencies } = useCreator();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="glowup-heading">{CREATOR_NAV.portfolio}</h1>
        <p className="glowup-subheading">
          Seus perfis, nichos e audiências — tudo em cards visuais.
        </p>
      </div>

      {brands.length === 0 ? (
        <div className="creator-empty-feed rounded-2xl border border-dashed p-10 text-center">
          <p className="text-sm text-muted-foreground">Nenhum perfil no portfólio ainda.</p>
        </div>
      ) : (
        <div className="creator-feed-grid">
          {brands.map((brand) => {
            const agency = agencies.find((a) => a.id === brand.primaryAgencyId);
            return (
              <article
                key={brand.id}
                className="creator-visual-card glowup-card-hover overflow-hidden rounded-2xl border bg-card"
              >
                <div
                  className="h-32 w-full"
                  style={{ background: coverGradient(brand.slug) }}
                />
                <div className="relative px-4 pb-5">
                  <GlowAvatar
                    src={brand.logoUrl}
                    alt={brand.name}
                    fallback={initialsFromName(brand.name)}
                    size="xl"
                    ring
                    className="-mt-10 border-4 border-card mx-auto"
                  />
                  <div className="mt-3 text-center">
                    <p className="font-semibold text-lg truncate">{brand.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{brand.niche}</p>
                  </div>

                  <div className="mt-4 flex justify-center gap-6 text-center">
                    <div>
                      <p className="text-lg font-bold text-creator-primary">
                        {formatAudience(brand.audienceSize)}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        audiência
                      </p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">{brand.platforms.length}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        plataformas
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                    {brand.platforms.map((p) => {
                      const Icon = PLATFORM_ICONS[p];
                      return (
                        <GlowBadge
                          key={p}
                          variant="outline"
                          className="rounded-full text-[10px] capitalize gap-1"
                        >
                          {Icon ? <Icon className="h-3 w-3" /> : null}
                          {p}
                        </GlowBadge>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2 border-t pt-3">
                    <p className="text-xs text-muted-foreground truncate">
                      {agency ? `via ${agency.name}` : "Independente"}
                    </p>
                    <GlowBadge variant="outline" className="rounded-full shrink-0">
                      {STATUS_LABEL[brand.status]}
                    </GlowBadge>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
