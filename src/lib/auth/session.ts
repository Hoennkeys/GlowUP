import { findMockUser } from "./mock-users";
import { normalizeMemberships } from "./tenant-role";
import type { Session, SessionUser } from "./types";

const SESSION_STORAGE_KEY = "vendapro_session_v1";
const SESSION_COOKIE = "vendapro_session";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function isSessionValid(session: Session): boolean {
  return new Date(session.expiresAt).getTime() > Date.now();
}

function parseSession(raw: string): Session | null {
  try {
    const session = JSON.parse(raw) as Session;
    if (!isSessionValid(session)) return null;
    if (session.user.tenantMemberships) {
      session.user.tenantMemberships =
        normalizeMemberships(session.user.tenantMemberships) ?? session.user.tenantMemberships;
    }
    return session;
  } catch {
    return null;
  }
}

export function parseSessionFromCookie(cookieHeader: string | null): Session | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|; )${SESSION_COOKIE}=([^;]*)`));
  if (!match) return null;
  return parseSession(decodeURIComponent(match[1]));
}

export function getSessionFromStorage(): Session | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!stored) return null;

  const session = parseSession(stored);
  if (!session) {
    clearSession();
    return null;
  }
  return session;
}

export function getDefaultPortalRedirect(session: Session) {
  if (session.user.platformRole === "SUPER_ADMIN") {
    return { to: "/admin" as const };
  }
  if (session.user.clientRole === "CLIENT" && session.user.tenantSlug) {
    return {
      to: "/t/$tenantSlug/portal" as const,
      params: { tenantSlug: session.user.tenantSlug },
    };
  }
  const membership = session.user.tenantMemberships?.[0];
  if (membership) {
    return {
      to: "/workspace/enter" as const,
      search: { slug: membership.tenantSlug },
    };
  }
  return { to: "/login" as const };
}

/** @deprecated Prefer getDefaultPortalRedirect for navigation with search params. */
export function getDefaultPortalPath(session: Session): string {
  const target = getDefaultPortalRedirect(session);
  if (target.to === "/t/$tenantSlug/portal" && "params" in target) {
    return `/t/${target.params.tenantSlug}/portal`;
  }
  if (target.to === "/workspace/enter" && "search" in target) {
    return `/workspace/enter?slug=${target.search.slug}`;
  }
  return target.to;
}

export function getWorkspaceEntryRedirect(tenantSlug: string) {
  return { to: "/workspace/enter" as const, search: { slug: tenantSlug } };
}

export function getTenantAppPath(tenantSlug: string, subpath = "painel"): string {
  return `/t/${tenantSlug}/app/${subpath}`;
}

const WORKSPACE_ENTERED_PREFIX = "glowup_workspace_entered_";

export function markWorkspaceEntered(tenantSlug: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(`${WORKSPACE_ENTERED_PREFIX}${tenantSlug}`, "1");
}

export function hasEnteredWorkspace(tenantSlug: string): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(`${WORKSPACE_ENTERED_PREFIX}${tenantSlug}`) === "1";
}

export function clearWorkspaceEntered(tenantSlug: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(`${WORKSPACE_ENTERED_PREFIX}${tenantSlug}`);
}

export function createSession(user: SessionUser): Session {
  const normalizedUser: SessionUser = {
    ...user,
    tenantMemberships: normalizeMemberships(user.tenantMemberships),
  };
  return {
    user: normalizedUser,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
  };
}

export function authenticate(email: string, password: string): Session | null {
  const user = findMockUser(email, password);
  return user ? createSession(user) : null;
}

export function persistSession(session: Session): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(JSON.stringify(session))}; path=/; max-age=86400; SameSite=Lax`;
}

export function clearSession(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(SESSION_STORAGE_KEY);
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function userInitials(nome: string): string {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
