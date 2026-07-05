import { useDraggable } from "@dnd-kit/core";
import { GlowBadge, GlowCard, GlowCardContent } from "@/ui";
import { brl, brDate } from "@/lib/format";
import type { CardField, PipelineItem } from "@/lib/pipelines/types";
import type { Prioridade } from "@/lib/types";
import { cn } from "@/lib/utils";

const corPrioridade: Record<Prioridade, string> = {
  Alta: "bg-destructive/15 text-destructive",
  Média: "bg-warning/15 text-warning",
  Baixa: "bg-muted text-muted-foreground",
};

function formatFieldValue(field: CardField, value: unknown): string {
  if (value == null || value === "") return "—";
  if (field.type === "currency") return brl(Number(value));
  if (field.type === "date") return brDate(String(value));
  return String(value);
}

type PipelineCardProps = {
  item: PipelineItem;
  cardSchema: CardField[];
  onClick: () => void;
  suppressClickRef?: React.MutableRefObject<boolean>;
};

export function PipelineCard({ item, cardSchema, onClick, suppressClickRef }: PipelineCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
  });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const cardFields = cardSchema.filter((f) => f.showOnCard);
  const prioridade = item.dados.prioridade as Prioridade | undefined;

  const handleClick = () => {
    if (suppressClickRef?.current) {
      suppressClickRef.current = false;
      return;
    }
    onClick();
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={handleClick}>
      <GlowCard
        hover
        className={cn("cursor-grab active:cursor-grabbing", isDragging && "opacity-30")}
      >
        <GlowCardContent className="space-y-2 p-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium leading-tight">{item.titulo}</p>
            {prioridade && (
              <GlowBadge className={cn("text-[10px]", corPrioridade[prioridade])}>
                {prioridade}
              </GlowBadge>
            )}
          </div>
          {cardFields
            .filter((f) => f.key !== "prioridade")
            .map((field) => (
              <p key={field.key} className="text-xs text-muted-foreground">
                {field.type === "currency" ? (
                  <span className="text-sm font-semibold text-creator-primary">
                    {formatFieldValue(field, item.dados[field.key])}
                  </span>
                ) : (
                  formatFieldValue(field, item.dados[field.key])
                )}
              </p>
            ))}
          <div className="flex items-center justify-end">
            <span className="text-[11px] text-muted-foreground">{brDate(item.criadoEm)}</span>
          </div>
        </GlowCardContent>
      </GlowCard>
    </div>
  );
}
