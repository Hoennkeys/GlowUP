import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const glowBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-creator-primary text-white",
        accent: "border-transparent bg-creator-accent text-white",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border text-foreground",
        success: "border-transparent bg-success/15 text-success",
        warning: "border-transparent bg-warning/15 text-warning",
        destructive: "border-transparent bg-destructive/15 text-destructive",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface GlowBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof glowBadgeVariants> {}

export function GlowBadge({ className, variant, ...props }: GlowBadgeProps) {
  return <div className={cn(glowBadgeVariants({ variant }), className)} {...props} />;
}
