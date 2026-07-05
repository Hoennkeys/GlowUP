import { MOCK_USERS } from "@/lib/auth/mock-users";
import type { TeamMemberRecord } from "@/lib/api/team.functions";
import type { TenantRole } from "@/lib/auth/types";
import { getPlatformTenantBySlug } from "@/lib/admin/tenant-registry";

const STORAGE_PREFIX = "glowup_team_extra_v1_";

type StoredMember = {
  id: string;
  nome: string;
  email: string;
  role: TenantRole;
};

function storageKey(tenantSlug: string): string {
  return `${STORAGE_PREFIX}${tenantSlug}`;
}

function readExtras(tenantSlug: string): StoredMember[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(storageKey(tenantSlug));
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StoredMember[];
  } catch {
    return [];
  }
}

function writeExtras(tenantSlug: string, members: StoredMember[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(tenantSlug), JSON.stringify(members));
}

function avatarForMember(nome: string, logoUrl?: string): string {
  if (logoUrl) return logoUrl;
  const seed = encodeURIComponent(nome.replace(/\s+/g, ""));
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=6366f1`;
}

export function listMockTeamMembers(tenantSlug: string): TeamMemberRecord[] {
  const tenant = getPlatformTenantBySlug(tenantSlug);
  const ownerLogo = tenant?.whiteLabel.logoUrl;

  const fromMock = MOCK_USERS.filter((user) =>
    user.tenantMemberships?.some((m) => m.tenantSlug === tenantSlug),
  ).map((user) => {
    const membership = user.tenantMemberships!.find((m) => m.tenantSlug === tenantSlug)!;
    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: membership.role,
      avatarUrl:
        membership.role === "OWNER"
          ? avatarForMember(user.nome, ownerLogo)
          : avatarForMember(user.nome),
    };
  });

  const extras = readExtras(tenantSlug).map((m) => ({
    ...m,
    avatarUrl: avatarForMember(m.nome),
  }));

  const seen = new Set(fromMock.map((m) => m.email));
  return [...fromMock, ...extras.filter((m) => !seen.has(m.email))];
}

export function inviteMockTeamMember(
  tenantSlug: string,
  input: { nome: string; email: string; role: TenantRole },
): { message: string } {
  const email = input.email.trim().toLowerCase();
  const existing = listMockTeamMembers(tenantSlug);
  if (existing.some((m) => m.email.toLowerCase() === email)) {
    throw new Error("Este e-mail já faz parte da equipe.");
  }

  const extras = readExtras(tenantSlug);
  extras.push({
    id: `user-mock-${Date.now()}`,
    nome: input.nome.trim(),
    email,
    role: input.role,
  });
  writeExtras(tenantSlug, extras);
  return { message: "Membro convidado com sucesso!" };
}

export function removeMockTeamMember(tenantSlug: string, userId: string): void {
  const extras = readExtras(tenantSlug).filter((m) => m.id !== userId);
  writeExtras(tenantSlug, extras);
}

export function updateMockMemberRole(tenantSlug: string, userId: string, role: TenantRole): void {
  const extras = readExtras(tenantSlug);
  const idx = extras.findIndex((m) => m.id === userId);
  if (idx >= 0) {
    extras[idx] = { ...extras[idx]!, role };
    writeExtras(tenantSlug, extras);
  }
}
