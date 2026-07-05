import type { FetchMetricsInput, SocialMetrics } from "./types";

/**
 * Métricas públicas TikTok — mock sem credenciais; TikTok API v2 em produção.
 */
export async function fetchTikTokMetrics(input: FetchMetricsInput): Promise<SocialMetrics> {
  const now = new Date().toISOString();

  if (!input.accessToken && !process.env.TIKTOK_CLIENT_KEY) {
    return {
      platform: "tiktok",
      handle: input.handle,
      seguidores: 89000,
      engajamento: 6.2,
      fetchedAt: now,
    };
  }

  throw new Error("Integração TikTok requer TIKTOK_CLIENT_KEY e access token");
}
