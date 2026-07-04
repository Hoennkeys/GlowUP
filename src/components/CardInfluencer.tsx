import { Instagram, Youtube } from "lucide-react";
import type { PerfilInfluencer } from "../../../types/influencer-platform";
import { GlowAvatar, GlowBadge, GlowButton, GlowCard, GlowCardContent, GlowCardFooter } from "@/ui";
import { cn } from "@/lib/utils";
import { formatMetricCount, getPrimaryFollowerCount, initialsFromName } from "./influencer/helpers";

export type CardInfluencerProps = {
  profile: Pick<
    PerfilInfluencer,
    "nome" | "handle" | "avatarUrl" | "nicho" | "plataformas" | "metricasSociais" | "status"
  >;
  compact?: boolean;
  onViewProfile?: () => void;
  className?: string;
};

const PLATFORM_ICONS: Record<string, typeof Instagram> = {
  instagram: Instagram,
  youtube: Youtube,
};

export function CardInfluencer({
  profile,
  compact = false,
  onViewProfile,
  className,
}: CardInfluencerProps) {
  const followers = getPrimaryFollowerCount(profile.metricasSociais);
  const engagement = profile.metricasSociais.instagram?.engajamento;

  return (
    <GlowCard hover={!!onViewProfile} className={cn("overflow-hidden", className)}>
      <GlowCardContent className={cn("p-4", compact ? "space-y-3" : "space-y-4")}>
        <div className="flex items-start gap-3">
          <GlowAvatar
            src={profile.avatarUrl}
            alt={profile.nome}
            fallback={initialsFromName(profile.nome)}
            size={compact ? "md" : "lg"}
            ring
          />
          <div className="min-w-0 flex-1">
            <p className="font-semibold truncate">{profile.nome}</p>
            {profile.handle ? (
              <p className="text-sm text-muted-foreground truncate">{profile.handle}</p>
            ) : null}
            {profile.nicho ? (
              <GlowBadge variant="outline" className="mt-1.5">
                {profile.nicho}
              </GlowBadge>
            ) : null}
          </div>
        </div>

        {!compact && profile.plataformas.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.plataformas.map((platform) => {
              const Icon = PLATFORM_ICONS[platform];
              return (
                <span
                  key={platform}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground capitalize"
                >
                  {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                  {platform}
                </span>
              );
            })}
          </div>
        ) : null}

        <div className="flex gap-4 text-sm">
          <div>
            <p className="font-semibold text-foreground">{formatMetricCount(followers)}</p>
            <p className="text-xs text-muted-foreground">seguidores</p>
          </div>
          {engagement != null ? (
            <div>
              <p className="font-semibold text-foreground">{engagement}%</p>
              <p className="text-xs text-muted-foreground">engajamento</p>
            </div>
          ) : null}
        </div>
      </GlowCardContent>

      {onViewProfile ? (
        <GlowCardFooter className="px-4 pb-4 pt-0">
          <GlowButton variant="outline" size="sm" className="w-full" onClick={onViewProfile}>
            Ver perfil
          </GlowButton>
        </GlowCardFooter>
      ) : null}
    </GlowCard>
  );
}
