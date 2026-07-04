import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type GlowInputProps = React.ComponentProps<typeof Input> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function GlowInput({ label, hint, error, className, id, ...props }: GlowInputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      ) : null}
      <Input
        id={inputId}
        className={cn(
          "rounded-lg border-border focus-visible:ring-creator-primary/40",
          error && "border-destructive focus-visible:ring-destructive/40",
          className,
        )}
        aria-invalid={!!error}
        {...props}
      />
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
