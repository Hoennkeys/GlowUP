import { eq } from "drizzle-orm";

import { MOCK_USERS } from "@/lib/auth/mock-users";
import { hashPassword } from "@/lib/auth/password.server";
import { buildMockSnapshotForTenant } from "@/lib/mock-data";
import { getPlatformSeedTenants } from "@/lib/platform-mock-data";

import { getDb } from "./client.server";
import { ensureSchema } from "./migrate.server";
import { tenantCrmState, tenantMemberships, tenants, users } from "./schema";

function nowIso() {
  return new Date().toISOString();
}

export async function seedDatabaseIfEmpty() {
  ensureSchema();
  const db = getDb();

  const existing = db.select().from(tenants).all();
  if (existing.length > 0) return false;

  const createdAt = nowIso();

  for (const tenant of getPlatformSeedTenants()) {
    db.insert(tenants)
      .values({
        id: tenant.id,
        slug: tenant.slug,
        nome: tenant.nome,
        status: tenant.status,
        plan: tenant.plan,
        whiteLabelJson: JSON.stringify(tenant.whiteLabel),
        isSystem: tenant.isSystem ?? false,
        createdAt,
      })
      .run();

    const snapshot =
      tenant.id === "tenant-demo" || tenant.id === "tenant-acme"
        ? buildMockSnapshotForTenant(tenant.id)
        : { leads: [], tarefas: [], emails: [], conversas: [], propostas: [], chamados: [], faturas: [], pipelineItems: [], usuarios: [] };

    db.insert(tenantCrmState)
      .values({
        tenantId: tenant.id,
        stateJson: JSON.stringify(snapshot),
        updatedAt: createdAt,
      })
      .run();
  }

  for (const mock of MOCK_USERS) {
    const passwordHash = await hashPassword(mock.password);
    db.insert(users)
      .values({
        id: mock.id,
        email: mock.email.toLowerCase(),
        passwordHash,
        nome: mock.nome,
        platformRole: mock.platformRole ?? null,
        clientRole: mock.clientRole ?? null,
        clientId: mock.clientId ?? null,
        tenantId: mock.tenantId ?? null,
        tenantSlug: mock.tenantSlug ?? null,
      })
      .run();

    if (mock.tenantMemberships) {
      for (const membership of mock.tenantMemberships) {
        db.insert(tenantMemberships)
          .values({
            id: `${mock.id}-${membership.tenantId}`,
            userId: mock.id,
            tenantId: membership.tenantId,
            tenantSlug: membership.tenantSlug,
            role: membership.role,
          })
          .run();
      }
    }
  }

  return true;
}

/** Upserts mock users/memberships so dev DB stays aligned with MOCK_USERS. */
export async function ensureMockUsersSynced() {
  ensureSchema();
  const db = getDb();

  for (const mock of MOCK_USERS) {
    const email = mock.email.toLowerCase();
    const passwordHash = await hashPassword(mock.password);
    let existing = getUserByEmail(email);

    if (!existing) {
      db.insert(users)
        .values({
          id: mock.id,
          email,
          passwordHash,
          nome: mock.nome,
          platformRole: mock.platformRole ?? null,
          clientRole: mock.clientRole ?? null,
          clientId: mock.clientId ?? null,
          tenantId: mock.tenantId ?? null,
          tenantSlug: mock.tenantSlug ?? null,
        })
        .run();
      existing = getUserByEmail(email);
    } else {
      db.update(users)
        .set({
          nome: mock.nome,
          passwordHash,
          platformRole: mock.platformRole ?? null,
          clientRole: mock.clientRole ?? null,
          clientId: mock.clientId ?? null,
          tenantId: mock.tenantId ?? null,
          tenantSlug: mock.tenantSlug ?? null,
        })
        .where(eq(users.id, existing.id))
        .run();
    }

    if (!existing) continue;
    const userId = existing.id;

    if (mock.tenantMemberships) {
      for (const membership of mock.tenantMemberships) {
        const row = db
          .select()
          .from(tenantMemberships)
          .where(eq(tenantMemberships.userId, userId))
          .all()
          .find((m) => m.tenantId === membership.tenantId);

        if (!row) {
          db.insert(tenantMemberships)
            .values({
              id: `${userId}-${membership.tenantId}`,
              userId,
              tenantId: membership.tenantId,
              tenantSlug: membership.tenantSlug,
              role: membership.role,
            })
            .run();
        } else {
          db.update(tenantMemberships)
            .set({ role: membership.role, tenantSlug: membership.tenantSlug })
            .where(eq(tenantMemberships.id, row.id))
            .run();
        }
      }
    }
  }
}

export function getUserByEmail(email: string) {
  const db = getDb();
  return db.select().from(users).where(eq(users.email, email.trim().toLowerCase())).get();
}

export function getUserMemberships(userId: string) {
  const db = getDb();
  return db.select().from(tenantMemberships).where(eq(tenantMemberships.userId, userId)).all();
}
