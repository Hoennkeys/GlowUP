import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { readAuthenticatedSession } from "@/lib/auth/read-session.server";
import { resolveActiveMembership } from "@/lib/auth/workspace-permissions";
import { hashPassword } from "@/lib/auth/password.server";
import type { Session, TenantRole } from "@/lib/auth/types";
import { getDb } from "@/lib/db/client.server";
import { seedDatabaseIfEmpty } from "@/lib/db/seed.server";
import { tenantMemberships, tenants, users } from "@/lib/db/schema";
import { isServerDbEnabled } from "@/lib/server/feature.server";

export type TeamMemberRecord = {
  id: string;
  nome: string;
  email: string;
  role: TenantRole;
  avatarUrl?: string;
};

function assertTenantStaff(session: Session, tenantSlug: string) {
  const membership = resolveActiveMembership(session, tenantSlug);
  if (!membership) throw new Error("Acesso negado ao workspace.");
  return membership;
}

function assertOwner(session: Session, tenantSlug: string) {
  const membership = assertTenantStaff(session, tenantSlug);
  if (membership.role !== "OWNER") {
    throw new Error("Apenas o Owner pode realizar esta ação.");
  }
  return membership;
}

function avatarForMember(nome: string, logoUrl?: string | null): string | undefined {
  if (logoUrl) return logoUrl;
  const seed = encodeURIComponent(nome.replace(/\s+/g, ""));
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=6366f1`;
}

function rowsToTeamMembers(
  rows: Array<{
    userId: string;
    role: string;
    nome: string;
    email: string;
  }>,
  ownerLogoUrl?: string | null,
): TeamMemberRecord[] {
  return rows.map((row) => ({
    id: row.userId,
    nome: row.nome,
    email: row.email,
    role: row.role as TenantRole,
    avatarUrl:
      row.role === "OWNER"
        ? avatarForMember(row.nome, ownerLogoUrl)
        : avatarForMember(row.nome),
  }));
}

export const listTeamMembersServerFn = createServerFn({ method: "GET" })
  .validator(z.object({ tenantSlug: z.string().min(1) }))
  .handler(async ({ data }) => {
    if (!isServerDbEnabled()) throw new Error("API do servidor desabilitada.");

    await seedDatabaseIfEmpty();
    const session = await readAuthenticatedSession();
    if (!session) throw new Error("Não autenticado.");
    assertTenantStaff(session, data.tenantSlug);

    const db = getDb();
    const tenant = db.select().from(tenants).where(eq(tenants.slug, data.tenantSlug)).get();
    if (!tenant) throw new Error("Workspace não encontrado.");

    const whiteLabel = JSON.parse(tenant.whiteLabelJson) as { logoUrl?: string };
    const rows = db
      .select({
        userId: tenantMemberships.userId,
        role: tenantMemberships.role,
        nome: users.nome,
        email: users.email,
      })
      .from(tenantMemberships)
      .innerJoin(users, eq(users.id, tenantMemberships.userId))
      .where(eq(tenantMemberships.tenantSlug, data.tenantSlug))
      .all();

    return rowsToTeamMembers(rows, whiteLabel.logoUrl);
  });

export const inviteTeamMemberServerFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      tenantSlug: z.string().min(1),
      nome: z.string().min(1),
      email: z.string().email(),
      role: z.enum(["OWNER", "MEMBER"]).default("MEMBER"),
    }),
  )
  .handler(async ({ data }) => {
    if (!isServerDbEnabled()) throw new Error("API do servidor desabilitada.");

    await seedDatabaseIfEmpty();
    const session = await readAuthenticatedSession();
    if (!session) throw new Error("Não autenticado.");
    assertOwner(session, data.tenantSlug);

    const db = getDb();
    const tenant = db.select().from(tenants).where(eq(tenants.slug, data.tenantSlug)).get();
    if (!tenant) throw new Error("Workspace não encontrado.");

    const email = data.email.trim().toLowerCase();
    const existing = db.select().from(users).where(eq(users.email, email)).get();
    if (existing) {
      const existingMembership = db
        .select()
        .from(tenantMemberships)
        .where(
          and(
            eq(tenantMemberships.userId, existing.id),
            eq(tenantMemberships.tenantSlug, data.tenantSlug),
          ),
        )
        .get();
      if (existingMembership) throw new Error("Este e-mail já faz parte da equipe.");
    }

    const userId = existing?.id ?? `user-${Date.now()}`;
    if (!existing) {
      const passwordHash = await hashPassword("demo123");
      db.insert(users)
        .values({
          id: userId,
          email,
          passwordHash,
          nome: data.nome.trim(),
          platformRole: null,
          clientRole: null,
          clientId: null,
          tenantId: null,
          tenantSlug: null,
        })
        .run();
    }

    db.insert(tenantMemberships)
      .values({
        id: `${userId}-${tenant.id}`,
        userId,
        tenantId: tenant.id,
        tenantSlug: data.tenantSlug,
        role: data.role,
      })
      .run();

    return {
      ok: true as const,
      message: "Membro convidado! Senha inicial: demo123",
    };
  });

export const removeTeamMemberServerFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      tenantSlug: z.string().min(1),
      userId: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    if (!isServerDbEnabled()) throw new Error("API do servidor desabilitada.");

    const session = await readAuthenticatedSession();
    if (!session) throw new Error("Não autenticado.");
    assertOwner(session, data.tenantSlug);

    if (data.userId === session.user.id) {
      throw new Error("Você não pode remover a si mesmo.");
    }

    const db = getDb();
    const tenant = db.select().from(tenants).where(eq(tenants.slug, data.tenantSlug)).get();
    if (!tenant) throw new Error("Workspace não encontrado.");

    db.delete(tenantMemberships)
      .where(
        and(
          eq(tenantMemberships.userId, data.userId),
          eq(tenantMemberships.tenantSlug, data.tenantSlug),
        ),
      )
      .run();

    return { ok: true as const };
  });

export const updateMemberRoleServerFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      tenantSlug: z.string().min(1),
      userId: z.string().min(1),
      role: z.enum(["OWNER", "MEMBER"]),
    }),
  )
  .handler(async ({ data }) => {
    if (!isServerDbEnabled()) throw new Error("API do servidor desabilitada.");

    const session = await readAuthenticatedSession();
    if (!session) throw new Error("Não autenticado.");
    assertOwner(session, data.tenantSlug);

    const db = getDb();
    const membership = db
      .select()
      .from(tenantMemberships)
      .where(
        and(
          eq(tenantMemberships.userId, data.userId),
          eq(tenantMemberships.tenantSlug, data.tenantSlug),
        ),
      )
      .get();

    if (!membership) throw new Error("Membro não encontrado.");

    db.update(tenantMemberships)
      .set({ role: data.role })
      .where(eq(tenantMemberships.id, membership.id))
      .run();

    return { ok: true as const };
  });
