import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export const glowButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-creator-primary/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-creator-primary text-white shadow hover:bg-creator-primary/90 hover:shadow-md",
        accent: "bg-creator-accent text-white shadow hover:bg-creator-accent/90",
        outline:
          "border border-border bg-background hover:bg-creator-neutral-bg hover:border-creator-primary/30",
        ghost: "hover:bg-creator-primary/10 hover:text-creator-primary",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-6",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface GlowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof glowButtonVariants> {
  asChild?: boolean;
}

export function GlowButton({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: GlowButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(glowButtonVariants({ variant, size, className }))} {...props} />;
}
