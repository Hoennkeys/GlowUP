import type { LucideIcon } from "lucide-react";
import { GlowCard, GlowCardContent, GlowCardHeader } from "@/ui";
import { cn } from "@/lib/utils";

export function DashboardStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  className,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <GlowCard className={cn(className)}>
      <GlowCardHeader className="flex flex-row items-center justify-between pb-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <Icon className="h-4 w-4 text-creator-primary" />
      </GlowCardHeader>
      <GlowCardContent>
        <p className="text-2xl font-bold">{value}</p>
        {subtitle ? <p className="text-xs text-muted-foreground mt-1">{subtitle}</p> : null}
      </GlowCardContent>
    </GlowCard>
  );
}
