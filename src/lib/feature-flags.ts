import type { SessionUser } from "@/lib/auth/types";

export type InfluencerRole = "super_admin" | "brand_admin" | "manager" | "influencer";

function readEnvFlag(key: string, defaultValue: boolean): boolean {
  const fromProcess = typeof process !== "undefined" ? process.env[key] : undefined;
  const fromMeta =
    typeof import.meta !== "undefined"
      ? (import.meta as ImportMeta & { env?: Record<string, string> }).env?.[key]
      : undefined;
  const raw = fromMeta ?? fromProcess;
  if (raw === undefined) return defaultValue;
  return raw === "true" || raw === "1";
}

/** Feature flags — env vars com fallback seguro para dev/test. */
export const FEATURE_FLAGS = {
  influencerPlatform: readEnvFlag("VITE_INFLUENCER_PLATFORM", true),
  creatorDomainRead: readEnvFlag("VITE_CREATOR_DOMAIN_READ", true),
  presignedUploads: readEnvFlag("VITE_PRESIGNED_UPLOADS", true),
  realtimeNotifications: readEnvFlag("VITE_REALTIME_NOTIFICATIONS", false),
  socialMetricsSync: readEnvFlag("VITE_SOCIAL_METRICS_SYNC", false),
  stripeSandbox: readEnvFlag("VITE_STRIPE_SANDBOX", false),
  ga4Tracking: readEnvFlag("VITE_GA4_TRACKING", false),
  esignContracts: readEnvFlag("VITE_ESIGN_CONTRACTS", false),
} as const;

export type FeatureFlagKey = keyof typeof FEATURE_FLAGS;

export function isFeatureEnabled(flag: FeatureFlagKey): boolean {
  return FEATURE_FLAGS[flag];
}

export function resolveInfluencerRole(user?: SessionUser | null): InfluencerRole {
  if (!user) return "influencer";
  if (user.platformRole === "SUPER_ADMIN") return "super_admin";
  const membership = user.tenantMemberships?.[0];
  if (membership?.role === "OWNER") return "brand_admin";
  return "influencer";
}

export function canApproveDeliveries(role: InfluencerRole): boolean {
  return role === "super_admin" || role === "brand_admin" || role === "manager";
}

export function canManageCampaigns(role: InfluencerRole): boolean {
  return role !== "influencer";
}

export function canEditProfile(role: InfluencerRole, isOwnProfile: boolean): boolean {
  if (role === "super_admin" || role === "brand_admin") return true;
  return isOwnProfile;
}
