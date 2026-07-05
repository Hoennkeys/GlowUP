import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  KanbanSquare,
  CalendarDays,
  Headphones,
  Receipt,
  FolderKanban,
  Inbox,
  Ticket,
  Radio,
  Plug,
  BarChart3,
  Settings2,
  MessagesSquare,
  Sparkles,
  LayoutGrid,
  Users,
  Megaphone,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import { SALES_PIPELINE_ID, PROJECTS_PIPELINE_ID } from "@/lib/pipelines/defaults";
import {
  CREATOR_NAV,
  NAV_LABELS,
  SIDEBAR_SECTIONS,
} from "@/modules/creator/domain/terminology";

type AppNavRoute =
  | "/t/$tenantSlug/app/creator/"
  | "/t/$tenantSlug/app/creator/brands"
  | "/t/$tenantSlug/app/creator/agencies"
  | "/t/$tenantSlug/app/creator/sponsors"
  | "/t/$tenantSlug/app/creator/campaigns"
  | "/t/$tenantSlug/app/creator/inbox"
  | "/t/$tenantSlug/app/creator/performance"
  | "/t/$tenantSlug/app/painel"
  | "/t/$tenantSlug/app/funil/$pipelineId"
  | "/t/$tenantSlug/app/comunicacao"
  | "/t/$tenantSlug/app/communications/inbox"
  | "/t/$tenantSlug/app/communications/tickets"
  | "/t/$tenantSlug/app/communications/channels"
  | "/t/$tenantSlug/app/communications/integrations"
  | "/t/$tenantSlug/app/communications/reports"
  | "/t/$tenantSlug/app/communications/settings"
  | "/t/$tenantSlug/app/agenda"
  | "/t/$tenantSlug/app/chamados"
  | "/t/$tenantSlug/app/faturamento";

export type AppNavLink = {
  title: string;
  to: AppNavRoute;
  icon: LucideIcon;
  iconClassName?: string;
};

export type AppNavPipelineLink = AppNavLink & {
  pipelineId: string;
};

export type AppNavItem = AppNavLink | AppNavPipelineLink;

export const CREATOR_SECTION_LABEL = SIDEBAR_SECTIONS.creator;
/** Rotas legado preservadas; labels GlowUP */
export const COMMERCIAL_SECTION_LABEL = SIDEBAR_SECTIONS.commercial;
export const COMMUNICATIONS_SECTION_LABEL = SIDEBAR_SECTIONS.communications;
export const POS_VENDA_SECTION_LABEL = SIDEBAR_SECTIONS.operations;

export const creatorNav: AppNavItem[] = [
  {
    title: CREATOR_NAV.home,
    to: "/t/$tenantSlug/app/creator/",
    icon: Sparkles,
    iconClassName: "text-creator-primary",
  },
  {
    title: CREATOR_NAV.portfolio,
    to: "/t/$tenantSlug/app/creator/brands",
    icon: LayoutGrid,
    iconClassName: "text-pink-500",
  },
  {
    title: CREATOR_NAV.campaigns,
    to: "/t/$tenantSlug/app/creator/campaigns",
    icon: Megaphone,
    iconClassName: "text-violet-500",
  },
  {
    title: CREATOR_NAV.collaborations,
    to: "/t/$tenantSlug/app/creator/agencies",
    icon: Users,
    iconClassName: "text-sky-500",
  },
  {
    title: CREATOR_NAV.messages,
    to: "/t/$tenantSlug/app/creator/inbox",
    icon: MessageCircle,
    iconClassName: "text-emerald-500",
  },
  {
    title: CREATOR_NAV.earnings,
    to: "/t/$tenantSlug/app/creator/performance",
    icon: TrendingUp,
    iconClassName: "text-amber-500",
  },
];

export const commercialNav: AppNavItem[] = [
  { title: NAV_LABELS.revenueDashboard, to: "/t/$tenantSlug/app/painel", icon: LayoutDashboard },
  {
    title: NAV_LABELS.campaignPipeline,
    to: "/t/$tenantSlug/app/funil/$pipelineId",
    icon: KanbanSquare,
    pipelineId: SALES_PIPELINE_ID,
  },
  { title: NAV_LABELS.agenda, to: "/t/$tenantSlug/app/agenda", icon: CalendarDays },
];

export const communicationsNav: AppNavItem[] = [
  {
    title: CREATOR_NAV.messages,
    to: "/t/$tenantSlug/app/communications/inbox",
    icon: Inbox,
    iconClassName: "text-emerald-500",
  },
  { title: "Tickets", to: "/t/$tenantSlug/app/communications/tickets", icon: Ticket },
  { title: "Canais", to: "/t/$tenantSlug/app/communications/channels", icon: Radio },
  {
    title: "Integrações",
    to: "/t/$tenantSlug/app/communications/integrations",
    icon: Plug,
  },
  { title: NAV_LABELS.reports, to: "/t/$tenantSlug/app/communications/reports", icon: BarChart3 },
  {
    title: NAV_LABELS.settings,
    to: "/t/$tenantSlug/app/communications/settings",
    icon: Settings2,
  },
];

/** @deprecated Use communicationsNav — redirect compatível em /comunicacao */
export const legacyComunicacaoNavItem: AppNavLink = {
  title: "Mensagens",
  to: "/t/$tenantSlug/app/comunicacao",
  icon: MessagesSquare,
};

export const posVendaNav: AppNavItem[] = [
  { title: NAV_LABELS.chamados, to: "/t/$tenantSlug/app/chamados", icon: Headphones },
  { title: NAV_LABELS.faturamento, to: "/t/$tenantSlug/app/faturamento", icon: Receipt },
  {
    title: NAV_LABELS.projetos,
    to: "/t/$tenantSlug/app/funil/$pipelineId",
    icon: FolderKanban,
    pipelineId: PROJECTS_PIPELINE_ID,
  },
];

export function isPipelineNavItem(item: AppNavItem): item is AppNavPipelineLink {
  return "pipelineId" in item;
}

export function isCreatorRoute(pathname: string, tenantSlug: string): boolean {
  return pathname.includes(`/t/${tenantSlug}/app/creator`);
}

export function isCommunicationsRoute(pathname: string, tenantSlug: string): boolean {
  const base = `/t/${tenantSlug}/app`;
  return (
    pathname.includes(`${base}/communications`) ||
    pathname.includes(`${base}/comunicacao`) ||
    pathname === `${base}/chats` ||
    pathname === `${base}/emails`
  );
}

export function isNavItemActive(pathname: string, tenantSlug: string, item: AppNavItem): boolean {
  if (isPipelineNavItem(item)) {
    return pathname.includes(`/funil/${item.pipelineId}`);
  }

  const segment = item.to.split("/").pop() ?? "";

  if (segment === "comunicacao") {
    return isCommunicationsRoute(pathname, tenantSlug);
  }

  if (item.to.includes("/communications/")) {
    return pathname.startsWith(`/t/${tenantSlug}/app/communications/${segment}`);
  }

  if (item.to.includes("/creator")) {
    if (item.to.endsWith("/creator/")) {
      return (
        pathname === `/t/${tenantSlug}/app/creator` || pathname === `/t/${tenantSlug}/app/creator/`
      );
    }
    return pathname.startsWith(`/t/${tenantSlug}/app/creator/${segment}`);
  }

  return (
    pathname === `/t/${tenantSlug}/app/${segment}` ||
    pathname.startsWith(`/t/${tenantSlug}/app/${segment}/`)
  );
}

export function isPosVendaRouteActive(pathname: string, tenantSlug: string): boolean {
  return posVendaNav.some((item) => isNavItemActive(pathname, tenantSlug, item));
}

export function isCreatorNavActive(pathname: string, tenantSlug: string): boolean {
  return isCreatorRoute(pathname, tenantSlug);
}

export function isCommunicationsNavActive(pathname: string, tenantSlug: string): boolean {
  return isCommunicationsRoute(pathname, tenantSlug);
}
