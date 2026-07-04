import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type GlowAvatarProps = {
  src?: string | null;
  alt: string;
  fallback: string;
  size?: "sm" | "md" | "lg" | "xl";
  ring?: boolean;
  className?: string;
};

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-lg",
};

export function GlowAvatar({ src, alt, fallback, size = "md", ring, className }: GlowAvatarProps) {
  return (
    <Avatar
      className={cn(
        sizeClasses[size],
        ring && "ring-2 ring-creator-primary/30 ring-offset-2 ring-offset-background",
        className,
      )}
    >
      {src ? <AvatarImage src={src} alt={alt} /> : null}
      <AvatarFallback className="bg-creator-primary/10 text-creator-primary font-medium">
        {fallback}
      </AvatarFallback>
    </Avatar>
  );
}
