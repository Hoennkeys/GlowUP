import { MOCK_USERS } from "@/lib/auth/mock-users";
import { DEFAULT_THEME_COLORS, DEFAULT_WHITE_LABELS } from "@/lib/tenant/defaults";
import type { TenantWhiteLabel } from "@/lib/tenant/types";

import type { PlatformTenant, TenantPlan, TenantStatus } from "./admin/types";

export type PlatformInvoice = {
  id: string;
  tenantId: string;
  tenantNome: string;
  numero: string;
  descricao: string;
  valor: number;
  vencimento: string;
  status: "Paga" | "Pendente" | "Vencida";
  emitidaEm: string;
};

export type PlatformActivity = {
  id: string;
  em: string;
  texto: string;
  tenantSlug?: string;
};

const PLAN_MRR: Record<TenantPlan, number> = {
  starter: 99,
  pro: 299,
  enterprise: 799,
};

const EXTRA_TENANTS: Array<{
  slug: string;
  nome: string;
  status: TenantStatus;
  plan: TenantPlan;
  createdAt: string;
  theme: keyof typeof DEFAULT_THEME_COLORS;
  logoUrl?: string;
}> = [
  {
    slug: "techstart",
    nome: "TechStart Labs",
    status: "trial",
    plan: "starter",
    createdAt: "2026-05-15T10:00:00.000Z",
    theme: "vendapro",
  },
  {
    slug: "nordic",
    nome: "Nordic Supply",
    status: "suspended",
    plan: "enterprise",
    createdAt: "2025-08-20T09:00:00.000Z",
    theme: "acme",
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Nordic&backgroundColor=64748b",
  },
];

function whiteLabelFromSeed(
  slug: string,
  nome: string,
  theme: keyof typeof DEFAULT_THEME_COLORS,
  logoUrl?: string,
): TenantWhiteLabel {
  return {
    tenantId: `tenant-${slug}`,
    slug,
    nome,
    logoUrl,
    cores: { ...DEFAULT_THEME_COLORS[theme] },
  };
}

/** Tenants iniciais da plataforma — demo/acme (sistema) + trial/suspenso para admin rico. */
export function getPlatformSeedTenants(): PlatformTenant[] {
  const system: PlatformTenant[] = Object.values(DEFAULT_WHITE_LABELS).map((wl) => ({
    id: wl.tenantId,
    slug: wl.slug,
    nome: wl.nome,
    status: "active" as const,
    plan: wl.slug === "acme" ? ("pro" as const) : ("starter" as const),
    createdAt: wl.slug === "demo" ? "2025-01-01T00:00:00.000Z" : "2025-03-10T09:00:00.000Z",
    whiteLabel: structuredClone(wl),
    isSystem: true,
  }));

  const extra: PlatformTenant[] = EXTRA_TENANTS.map((t) => ({
    id: `tenant-${t.slug}`,
    slug: t.slug,
    nome: t.nome,
    status: t.status,
    plan: t.plan,
    createdAt: t.createdAt,
    whiteLabel: whiteLabelFromSeed(t.slug, t.nome, t.theme, t.logoUrl),
    isSystem: false,
  }));

  return [...system, ...extra];
}

/** Faturas SaaS da plataforma — correlacionadas com plano/status de cada tenant. */
export const PLATFORM_INVOICES: PlatformInvoice[] = [
  {
    id: "plat-inv-demo-06",
    tenantId: "tenant-demo",
    tenantNome: "Demo Corp",
    numero: "PLAT-2026-0601",
    descricao: "Assinatura Starter — Jun/2026",
    valor: PLAN_MRR.starter,
    vencimento: "2026-06-05T12:00:00.000Z",
    status: "Paga",
    emitidaEm: "2026-06-01T08:00:00.000Z",
  },
  {
    id: "plat-inv-acme-06",
    tenantId: "tenant-acme",
    tenantNome: "Acme Indústria",
    numero: "PLAT-2026-0602",
    descricao: "Assinatura Pro — Jun/2026",
    valor: PLAN_MRR.pro,
    vencimento: "2026-06-05T12:00:00.000Z",
    status: "Paga",
    emitidaEm: "2026-06-01T08:00:00.000Z",
  },
  {
    id: "plat-inv-demo-07",
    tenantId: "tenant-demo",
    tenantNome: "Demo Corp",
    numero: "PLAT-2026-0701",
    descricao: "Assinatura Starter — Jul/2026",
    valor: PLAN_MRR.starter,
    vencimento: "2026-07-05T12:00:00.000Z",
    status: "Pendente",
    emitidaEm: "2026-07-01T08:00:00.000Z",
  },
  {
    id: "plat-inv-acme-07",
    tenantId: "tenant-acme",
    tenantNome: "Acme Indústria",
    numero: "PLAT-2026-0702",
    descricao: "Assinatura Pro — Jul/2026",
    valor: PLAN_MRR.pro,
    vencimento: "2026-07-05T12:00:00.000Z",
    status: "Pendente",
    emitidaEm: "2026-07-01T08:00:00.000Z",
  },
  {
    id: "plat-inv-techstart-06",
    tenantId: "tenant-techstart",
    tenantNome: "TechStart Labs",
    numero: "PLAT-2026-0603",
    descricao: "Trial Starter — Jun/2026 (cortesia)",
    valor: 0,
    vencimento: "2026-06-30T12:00:00.000Z",
    status: "Paga",
    emitidaEm: "2026-06-01T08:00:00.000Z",
  },
  {
    id: "plat-inv-nordic-05",
    tenantId: "tenant-nordic",
    tenantNome: "Nordic Supply",
    numero: "PLAT-2026-0501",
    descricao: "Assinatura Enterprise — Mai/2026",
    valor: PLAN_MRR.enterprise,
    vencimento: "2026-05-10T12:00:00.000Z",
    status: "Vencida",
    emitidaEm: "2026-05-01T08:00:00.000Z",
  },
];

/** Feed de atividade da plataforma — referencia tenants e usuários mock. */
export const PLATFORM_ACTIVITIES: PlatformActivity[] = [
  {
    id: "act-001",
    em: "2026-06-14T10:00:00.000Z",
    texto: "Maria Silva (demo) fechou lead EduTech Cursos — R$ 12.000",
    tenantSlug: "demo",
  },
  {
    id: "act-002",
    em: "2026-06-12T15:30:00.000Z",
    texto: "Carlos Acme atualizou proposta PROP-2026-101 para Ana Acme",
    tenantSlug: "acme",
  },
  {
    id: "act-003",
    em: "2026-06-10T09:00:00.000Z",
    texto: "TechStart Labs iniciou período trial (Starter)",
    tenantSlug: "techstart",
  },
  {
    id: "act-004",
    em: "2026-06-04T16:00:00.000Z",
    texto: "Chamado ERP aberto por Ana Acme — Carlos Acme em atendimento",
    tenantSlug: "acme",
  },
  {
    id: "act-005",
    em: "2026-06-01T11:00:00.000Z",
    texto: "João Cliente abriu chamado sobre fatura FAT-2026-001 (demo)",
    tenantSlug: "demo",
  },
  {
    id: "act-006",
    em: "2026-05-28T14:00:00.000Z",
    texto: "Nordic Supply suspenso por inadimplência — fatura PLAT-2026-0501 vencida",
    tenantSlug: "nordic",
  },
];

export function countPlatformUsers(): number {
  return MOCK_USERS.length;
}

export function countPaidPlatformInvoices(): number {
  return PLATFORM_INVOICES.filter((i) => i.status === "Paga" && i.valor > 0).length;
}
