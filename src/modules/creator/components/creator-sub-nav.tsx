import { Link, useParams, useRouterState } from "@tanstack/react-router";
import {
  Sparkles,
  LayoutGrid,
  Megaphone,
  Users,
  MessageCircle,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { CREATOR_NAV } from "@/modules/creator/domain/terminology";
import { cn } from "@/lib/utils";

const NAV: { segment: string; label: string; icon: LucideIcon; iconClass: string }[] = [
  { segment: "", label: CREATOR_NAV.home, icon: Sparkles, iconClass: "text-creator-primary" },
  { segment: "brands", label: CREATOR_NAV.portfolio, icon: LayoutGrid, iconClass: "text-pink-500" },
  {
    segment: "campaigns",
    label: CREATOR_NAV.campaigns,
    icon: Megaphone,
    iconClass: "text-violet-500",
  },
  {
    segment: "agencies",
    label: CREATOR_NAV.collaborations,
    icon: Users,
    iconClass: "text-sky-500",
  },
  {
    segment: "inbox",
    label: CREATOR_NAV.messages,
    icon: MessageCircle,
    iconClass: "text-emerald-500",
  },
  {
    segment: "performance",
    label: CREATOR_NAV.earnings,
    icon: TrendingUp,
    iconClass: "text-amber-500",
  },
];

export function CreatorSubNav() {
  const { tenantSlug } = useParams({ from: "/t/$tenantSlug/app/creator" });
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const base = `/t/${tenantSlug}/app/creator`;

  return (
    <nav className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
      {NAV.map((item) => {
        const href = item.segment ? `${base}/${item.segment}` : base;
        const active =
          item.segment === ""
            ? pathname === base || pathname === `${base}/`
            : pathname === href || pathname.startsWith(`${href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.segment || "home"}
            to={href}
            className={cn(
              "creator-nav-pill inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
              active
                ? "bg-creator-gradient text-white shadow-md shadow-creator-primary/20"
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className={cn("h-4 w-4", active ? "text-white" : item.iconClass)} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
