import type { TenantMembership, TenantRole } from "./types";

const LEGACY_ROLE_MAP: Record<string, TenantRole> = {
  ADMIN: "OWNER",
  OPERATIONAL: "MEMBER",
  OWNER: "OWNER",
  MEMBER: "MEMBER",
};

/** Normalizes legacy ADMIN/OPERATIONAL values to OWNER/MEMBER. */
export function normalizeTenantRole(role: string): TenantRole | null {
  return LEGACY_ROLE_MAP[role] ?? null;
}

export function normalizeMembership(membership: TenantMembership): TenantMembership {
  const role = normalizeTenantRole(membership.role);
  if (!role) return membership;
  return { ...membership, role };
}

export function normalizeMemberships(
  memberships: TenantMembership[] | undefined,
): TenantMembership[] | undefined {
  if (!memberships) return undefined;
  return memberships
    .map(normalizeMembership)
    .filter((m): m is TenantMembership => normalizeTenantRole(m.role) !== null);
}
