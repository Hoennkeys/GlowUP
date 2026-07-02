import type { Session, TenantMembership } from "./types";

export function resolveActiveMembership(
  session: Session | null,
  tenantSlug?: string,
): TenantMembership | null {
  if (!session?.user.tenantMemberships?.length) return null;
  if (tenantSlug) {
    return session.user.tenantMemberships.find((m) => m.tenantSlug === tenantSlug) ?? null;
  }
  return session.user.tenantMemberships[0] ?? null;
}

export function isOwner(membership: TenantMembership | null | undefined): boolean {
  return membership?.role === "OWNER";
}

export function isMember(membership: TenantMembership | null | undefined): boolean {
  return membership?.role === "MEMBER";
}

export function canManageWorkspaceSettings(session: Session, tenantSlug: string): boolean {
  return isOwner(resolveActiveMembership(session, tenantSlug));
}

export function canManageTeam(session: Session, tenantSlug: string): boolean {
  return isOwner(resolveActiveMembership(session, tenantSlug));
}

export function canManageBilling(session: Session, tenantSlug: string): boolean {
  return isOwner(resolveActiveMembership(session, tenantSlug));
}

export function canConfigureIntegrations(session: Session, tenantSlug: string): boolean {
  return isOwner(resolveActiveMembership(session, tenantSlug));
}

export function canManageWhiteLabel(session: Session, tenantSlug: string): boolean {
  return isOwner(resolveActiveMembership(session, tenantSlug));
}
