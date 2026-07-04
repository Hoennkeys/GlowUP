import { CheckCircle2, Clock, FileText, RotateCcw, XCircle } from "lucide-react";
import type { Entrega, EntregaStatusAprovacao } from "../../types/influencer-platform";
import { GlowBadge, GlowButton } from "@/ui";
import { cn } from "@/lib/utils";
import { brDateTime } from "@/lib/format";
import { ENTREGA_STATUS_CONFIG } from "./influencer/helpers";
import { MediaPlayer } from "./MediaPlayer";

export type TimelineEntregaItem = Pick<
  Entrega,
  "id" | "titulo" | "tipoMidia" | "arquivoUrl" | "versao" | "statusAprovacao" | "criadoEm"
> & {
  comentariosCount?: number;
};

export type TimelineEntregaProps = {
  entregas: TimelineEntregaItem[];
  onApprove?: (entregaId: string) => void;
  onReject?: (entregaId: string) => void;
  onRequestRevision?: (entregaId: string) => void;
  readOnly?: boolean;
  className?: string;
};

const STATUS_ICONS: Record<EntregaStatusAprovacao, typeof CheckCircle2> = {
  rascunho: FileText,
  pendente: Clock,
  em_revisao: RotateCcw,
  aprovado: CheckCircle2,
  rejeitado: XCircle,
};

export function TimelineEntrega({
  entregas,
  onApprove,
  onReject,
  onRequestRevision,
  readOnly,
  className,
}: TimelineEntregaProps) {
  const sorted = [...entregas].sort(
    (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime(),
  );

  return (
    <div className={cn("space-y-0", className)}>
      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          Nenhuma entrega registrada ainda.
        </p>
      ) : (
        <ol className="relative border-l border-border ml-3 space-y-6 pl-6 pb-2">
          {sorted.map((entrega, index) => {
            const config = ENTREGA_STATUS_CONFIG[entrega.statusAprovacao];
            const Icon = STATUS_ICONS[entrega.statusAprovacao];
            const isLatest = index === 0;

            return (
              <li key={entrega.id} className="relative">
                <span
                  className={cn(
                    "absolute -left-[1.65rem] flex h-6 w-6 items-center justify-center rounded-full border-2 bg-background",
                    isLatest ? "border-creator-primary" : "border-border",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-3 w-3",
                      isLatest ? "text-creator-primary" : "text-muted-foreground",
                    )}
                  />
                </span>

                <div
                  className={cn(
                    "rounded-xl border p-4 space-y-3 transition-shadow",
                    isLatest && "border-creator-primary/30 shadow-sm",
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm">
                        {entrega.titulo ?? `Entrega ${entrega.tipoMidia}`}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        v{entrega.versao} · {brDateTime(entrega.criadoEm)}
                      </p>
                    </div>
                    <GlowBadge className={config.className}>{config.label}</GlowBadge>
                  </div>

                  {entrega.arquivoUrl ? (
                    <MediaPlayer
                      src={entrega.arquivoUrl}
                      type={
                        entrega.tipoMidia === "video" || entrega.tipoMidia === "reels"
                          ? "video"
                          : "image"
                      }
                      aspectRatio={entrega.tipoMidia === "stories" ? "portrait" : "video"}
                      className="max-h-48"
                    />
                  ) : null}

                  {entrega.comentariosCount ? (
                    <p className="text-xs text-muted-foreground">
                      {entrega.comentariosCount} comentário(s)
                    </p>
                  ) : null}

                  {!readOnly && entrega.statusAprovacao === "em_revisao" ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      <GlowButton size="sm" onClick={() => onApprove?.(entrega.id)}>
                        Aprovar
                      </GlowButton>
                      <GlowButton
                        size="sm"
                        variant="outline"
                        onClick={() => onRequestRevision?.(entrega.id)}
                      >
                        Pedir revisão
                      </GlowButton>
                      <GlowButton
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => onReject?.(entrega.id)}
                      >
                        Rejeitar
                      </GlowButton>
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
