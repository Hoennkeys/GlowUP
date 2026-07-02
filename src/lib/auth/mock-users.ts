import type { SessionUser } from "./types";

type MockUserRecord = SessionUser & { password: string };

export const MOCK_USERS: MockUserRecord[] = [
  {
    id: "user-super-admin",
    email: "admin@vendapro.app",
    password: "admin123",
    nome: "Super Admin",
    platformRole: "SUPER_ADMIN",
  },
  {
    id: "user-member-demo",
    email: "operacional@demo.com",
    password: "demo123",
    nome: "Maria Silva",
    tenantMemberships: [{ tenantId: "tenant-demo", tenantSlug: "demo", role: "MEMBER" }],
  },
  {
    id: "user-owner-demo",
    email: "owner@demo.com",
    password: "demo123",
    nome: "Lucas Felipe",
    tenantMemberships: [{ tenantId: "tenant-demo", tenantSlug: "demo", role: "OWNER" }],
  },
  {
    id: "user-owner-acme",
    email: "owner@acme.com",
    password: "demo123",
    nome: "Carlos Acme",
    tenantMemberships: [{ tenantId: "tenant-acme", tenantSlug: "acme", role: "OWNER" }],
  },
  {
    id: "user-cliente",
    email: "cliente@demo.com",
    password: "demo123",
    nome: "João Cliente",
    clientRole: "CLIENT",
    clientId: "client-001",
    tenantSlug: "demo",
    tenantId: "tenant-demo",
  },
  {
    id: "user-cliente-acme",
    email: "cliente@acme.com",
    password: "demo123",
    nome: "Ana Acme",
    clientRole: "CLIENT",
    clientId: "client-acme-001",
    tenantSlug: "acme",
    tenantId: "tenant-acme",
  },
];

/** Optional aliases for dev login hints. */
export const LEGACY_MOCK_EMAIL_ALIASES: Record<string, string> = {
  "membro@demo.com": "operacional@demo.com",
  "operacional@acme.com": "owner@acme.com",
};

export function findMockUser(email: string, password: string): SessionUser | null {
  const normalized = email.trim().toLowerCase();
  const resolvedEmail = LEGACY_MOCK_EMAIL_ALIASES[normalized] ?? normalized;
  const user = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === resolvedEmail && u.password === password,
  );
  if (!user) return null;

  const { password: _, ...sessionUser } = user;
  return sessionUser;
}

function portalLabel(user: MockUserRecord): string {
  if (user.platformRole === "SUPER_ADMIN") return "Plataforma";
  if (user.clientRole === "CLIENT") return `Marca (${user.tenantSlug})`;
  const membership = user.tenantMemberships?.[0];
  if (!membership) return "App";
  const roleLabel = membership.role === "OWNER" ? "Owner" : "Membro";
  return `${roleLabel} (${membership.tenantSlug})`;
}

export const MOCK_LOGIN_HINTS = MOCK_USERS.map(({ email, password, nome, ...rest }) => ({
  email,
  password,
  nome,
  tipo: portalLabel({ email, password, nome, ...rest } as MockUserRecord),
}));
