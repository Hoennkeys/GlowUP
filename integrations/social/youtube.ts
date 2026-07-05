import type { FetchMetricsInput, SocialMetrics } from "./types";

/**
 * Métricas públicas YouTube — mock sem API key; YouTube Data API v3 em produção.
 */
export async function fetchYouTubeMetrics(input: FetchMetricsInput): Promise<SocialMetrics> {
  const now = new Date().toISOString();

  if (!input.accessToken && !process.env.YOUTUBE_API_KEY) {
    return {
      platform: "youtube",
      handle: input.handle,
      inscritos: 42000,
      visualizacoes: 1_200_000,
      fetchedAt: now,
    };
  }

  throw new Error("Integração YouTube requer YOUTUBE_API_KEY ou access token");
}
