import { cn } from "@/lib/utils";
import { GlowBadge } from "./glow-badge";

type GlowTagProps = {
  label: string;
  onRemove?: () => void;
  className?: string;
};

export function GlowTag({ label, onRemove, className }: GlowTagProps) {
  return (
    <GlowBadge
      variant="outline"
      className={cn("rounded-md px-2 py-0.5 font-normal gap-1", onRemove && "pr-1", className)}
    >
      {label}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 rounded-sm hover:bg-muted p-0.5 leading-none"
          aria-label={`Remover tag ${label}`}
        >
          ×
        </button>
      ) : null}
    </GlowBadge>
  );
}
