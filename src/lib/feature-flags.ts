/**
 * Feature flags para rollout gradual da plataforma de influenciadores.
 * Flags com prefixo VITE_ são expostas ao client; demais são server-only.
 */

import type { SessionUser } from "@/lib/auth/types";

export type InfluencerRole = "influencer" | "manager" | "brand_admin" | "super_admin";

const env =
  typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env
    : ({} as ImportMetaEnv);

export const FEATURE_FLAGS = {
  /** Lê entidades Creator/Influencer em vez de labels CRM legados */
  creatorDomainRead:
    env.VITE_CREATOR_DOMAIN_READ === "true" || env.DEV === true,

  /** Habilita rotas e fluxos da plataforma de influenciadores */
  influencerPlatform: env.VITE_INFLUENCER_PLATFORM !== "false",

  /** Upload via presigned URL (S3) — mock quando credenciais ausentes */
  presignedUploads: env.VITE_PRESIGNED_UPLOADS !== "false",

  /** Notificações em tempo real (Pusher/Supabase) */
  realtimeNotifications: env.VITE_REALTIME_NOTIFICATIONS === "true",

  /** Sincronização de métricas sociais (cron/jobs) */
  socialMetricsSync: env.VITE_SOCIAL_METRICS_SYNC === "true",

  /** Pagamentos Stripe sandbox */
  stripeSandbox: env.VITE_STRIPE_SANDBOX === "true",
} as const;

export function isFeatureEnabled(flag: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[flag];
}

/** Mapeia papel do usuário CRM para role da plataforma */
export function resolveInfluencerRole(user?: SessionUser): InfluencerRole {
  if (user?.platformRole === "SUPER_ADMIN") return "super_admin";
  const membership = user?.tenantMemberships?.[0];
  if (membership?.role === "OWNER") return "brand_admin";
  if (membership?.role === "MEMBER") return "manager";
  return "influencer";
}

export function canApproveDeliveries(role: InfluencerRole): boolean {
  return role === "brand_admin" || role === "manager" || role === "super_admin";
}

export function canManageCampaigns(role: InfluencerRole): boolean {
  return role === "brand_admin" || role === "manager" || role === "super_admin";
}

export function canEditProfile(role: InfluencerRole, isOwnProfile: boolean): boolean {
  if (role === "brand_admin" || role === "super_admin") return true;
  return role === "influencer" && isOwnProfile;
}
