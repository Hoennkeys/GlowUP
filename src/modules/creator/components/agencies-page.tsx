import { Mail, Users } from "lucide-react";
import { GlowAvatar, GlowBadge } from "@/ui";
import { CREATOR_NAV } from "../domain/terminology";
import { coverGradient, initialsFromName } from "../lib/visual-utils";
import { useCreator } from "../store/creator-context";

const STATUS_LABEL = { active: "Ativa", inactive: "Inativa" } as const;

export function AgenciesPage() {
  const { agencies, brands } = useCreator();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="glowup-heading">{CREATOR_NAV.collaborations}</h1>
        <p className="glowup-subheading">
          Agências e parceiros que te representam — conexões que impulsionam sua carreira.
        </p>
      </div>

      {agencies.length === 0 ? (
        <div className="creator-empty-feed rounded-2xl border border-dashed p-10 text-center">
          <p className="text-sm text-muted-foreground">Nenhuma colaboração cadastrada ainda.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {agencies.map((agency) => {
            const managedBrands = agency.brandsManaged
              .map((id) => brands.find((b) => b.id === id))
              .filter(Boolean);

            return (
              <article
                key={agency.id}
                className="creator-visual-card glowup-card-hover overflow-hidden rounded-2xl border bg-card"
              >
                <div
                  className="h-20 w-full"
                  style={{ background: coverGradient(agency.name) }}
                />
                <div className="p-4 space-y-4">
                  <div className="flex items-start gap-3 -mt-10">
                    <GlowAvatar
                      alt={agency.name}
                      fallback={initialsFromName(agency.name)}
                      size="lg"
                      ring
                      className="border-4 border-card"
                    />
                    <div className="min-w-0 pt-8">
                      <p className="font-semibold truncate">{agency.name}</p>
                      <GlowBadge variant="outline" className="mt-1 rounded-full">
                        {STATUS_LABEL[agency.status]}
                      </GlowBadge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0" />
                    <div className="min-w-0 truncate">
                      <p className="truncate">{agency.contactName}</p>
                      <p className="text-xs truncate">{agency.contactEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-xl bg-muted/40 px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-sky-500" />
                      <span className="text-sm font-medium">{managedBrands.length}</span>
                      <span className="text-xs text-muted-foreground">marcas</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-creator-primary">{agency.commissionRate}%</span>
                      <span className="text-xs text-muted-foreground ml-1">comissão</span>
                    </div>
                  </div>

                  {managedBrands.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {managedBrands.map((b) =>
                        b ? (
                          <GlowBadge key={b.id} variant="secondary" className="rounded-full text-[10px]">
                            {b.name}
                          </GlowBadge>
                        ) : null,
                      )}
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
