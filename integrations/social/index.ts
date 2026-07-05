import { fetchTikTokMetrics } from "./tiktok";
import { fetchYouTubeMetrics } from "./youtube";
import type { FetchMetricsInput, SocialMetrics, SocialPlatform } from "./types";

export type { FetchMetricsInput, SocialMetrics, SocialPlatform } from "./types";

const MOCK_BY_PLATFORM: Record<SocialPlatform, Partial<SocialMetrics>> = {
  instagram: { seguidores: 125000, engajamento: 4.8 },
  tiktok: { seguidores: 89000, engajamento: 6.2 },
  youtube: { inscritos: 42000, visualizacoes: 1_200_000 },
};

/**
 * Busca métricas públicas de redes sociais.
 * Mock quando token/credenciais ausentes — substituir por APIs oficiais em produção.
 */
export async function fetchPublicMetrics(input: FetchMetricsInput): Promise<SocialMetrics> {
  const now = new Date().toISOString();
  const hasCredentials =
    input.accessToken ||
    (input.platform === "instagram" && process.env.INSTAGRAM_ACCESS_TOKEN) ||
    (input.platform === "tiktok" && process.env.TIKTOK_CLIENT_KEY) ||
    (input.platform === "youtube" && process.env.YOUTUBE_API_KEY);

  if (!hasCredentials) {
    return {
      platform: input.platform,
      handle: input.handle,
      ...MOCK_BY_PLATFORM[input.platform],
      fetchedAt: now,
    };
  }

  switch (input.platform) {
    case "tiktok":
      return fetchTikTokMetrics(input);
    case "youtube":
      return fetchYouTubeMetrics(input);
    case "instagram":
      throw new Error("Integração Instagram requer configuração de access token");
    default:
      throw new Error(`Plataforma não suportada: ${input.platform satisfies never}`);
  }
}

export async function syncAllPlatformMetrics(
  handles: { platform: SocialPlatform; handle: string }[],
): Promise<SocialMetrics[]> {
  return Promise.all(handles.map((h) => fetchPublicMetrics(h)));
}
