import { ArrowLeft, Instagram, Link2, Upload } from "lucide-react";
import { Link, useParams } from "@tanstack/react-router";
import { CardInfluencer } from "@/components/CardInfluencer";
import { GlowBadge, GlowButton, GlowCard, GlowCardContent, GlowCardHeader } from "@/ui";
import { formatMetricCount } from "@/components/influencer/helpers";
import { useInfluencer } from "../store/influencer-context";

export function ProfilePage() {
  const { tenantSlug, profileId } = useParams({
    from: "/t/$tenantSlug/app/creator/profile/$profileId",
  });
  const { getProfile, entregas } = useInfluencer();
  const profile = getProfile(profileId);

  if (!profile) {
    return (
      <div className="space-y-4">
        <BackLink tenantSlug={tenantSlug} />
        <p className="text-muted-foreground">Perfil não encontrado.</p>
      </div>
    );
  }

  const profileEntregas = entregas.filter((e) => e.influencerId === profileId);
  const approved = profileEntregas.filter((e) => e.statusAprovacao === "aprovado").length;

  return (
    <div className="space-y-6">
      <BackLink tenantSlug={tenantSlug} />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <CardInfluencer profile={profile} className="h-fit" />

        <div className="space-y-6">
          {profile.bio ? (
            <GlowCard>
              <GlowCardHeader>
                <h2 className="font-semibold">Sobre</h2>
              </GlowCardHeader>
              <GlowCardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
              </GlowCardContent>
            </GlowCard>
          ) : null}

          <GlowCard>
            <GlowCardHeader>
              <h2 className="font-semibold flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                Métricas por plataforma
              </h2>
            </GlowCardHeader>
            <GlowCardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(profile.metricasSociais).map(([platform, metrics]) => (
                  <div key={platform} className="rounded-lg border p-3 space-y-1">
                    <p className="text-xs font-medium capitalize text-muted-foreground">
                      {platform}
                    </p>
                    {metrics.seguidores != null ? (
                      <p className="text-lg font-semibold">
                        {formatMetricCount(metrics.seguidores)}{" "}
                        <span className="text-xs font-normal text-muted-foreground">
                          seguidores
                        </span>
                      </p>
                    ) : null}
                    {metrics.inscritos != null ? (
                      <p className="text-lg font-semibold">
                        {formatMetricCount(metrics.inscritos)}{" "}
                        <span className="text-xs font-normal text-muted-foreground">inscritos</span>
                      </p>
                    ) : null}
                    {metrics.engajamento != null ? (
                      <p className="text-sm text-creator-primary">
                        {metrics.engajamento}% engajamento
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </GlowCardContent>
          </GlowCard>

          <GlowCard>
            <GlowCardHeader>
              <h2 className="font-semibold">Portfólio & entregas</h2>
            </GlowCardHeader>
            <GlowCardContent className="space-y-3">
              <div className="flex gap-4 text-sm">
                <div>
                  <p className="font-semibold">{profileEntregas.length}</p>
                  <p className="text-muted-foreground">entregas</p>
                </div>
                <div>
                  <p className="font-semibold text-emerald-600">{approved}</p>
                  <p className="text-muted-foreground">aprovadas</p>
                </div>
              </div>
              {profile.mediaKitUrl ? (
                <GlowButton variant="outline" size="sm" asChild>
                  <a href={profile.mediaKitUrl} target="_blank" rel="noreferrer">
                    <Link2 className="h-3.5 w-3.5 mr-1" />
                    Media kit
                  </a>
                </GlowButton>
              ) : (
                <GlowBadge variant="secondary">Media kit em construção</GlowBadge>
              )}
            </GlowCardContent>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}

function BackLink({ tenantSlug }: { tenantSlug: string }) {
  return (
    <GlowButton variant="ghost" size="sm" asChild>
      <Link to="/t/$tenantSlug/app/creator/" params={{ tenantSlug }}>
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar
      </Link>
    </GlowButton>
  );
}
