export type SocialMetrics = {
  platform: "instagram" | "tiktok" | "youtube";
  handle: string;
  seguidores?: number;
  inscritos?: number;
  engajamento?: number;
  visualizacoes?: number;
  fetchedAt: string;
};

export type FetchMetricsInput = {
  platform: SocialMetrics["platform"];
  handle: string;
  accessToken?: string;
};

/**
 * Busca métricas públicas de redes sociais.
 * Mock quando token ausente — substituir por APIs oficiais em produção.
 */
export async function fetchPublicMetrics(input: FetchMetricsInput): Promise<SocialMetrics> {
  const now = new Date().toISOString();

  if (!input.accessToken) {
    const mockByPlatform: Record<SocialMetrics["platform"], Partial<SocialMetrics>> = {
      instagram: { seguidores: 125000, engajamento: 4.8 },
      tiktok: { seguidores: 89000, engajamento: 6.2 },
      youtube: { inscritos: 42000, visualizacoes: 1_200_000 },
    };
    return {
      platform: input.platform,
      handle: input.handle,
      ...mockByPlatform[input.platform],
      fetchedAt: now,
    };
  }

  // Placeholder para integração real (Meta Graph API, TikTok API, YouTube Data API)
  throw new Error(`Integração ${input.platform} requer configuração de access token`);
}

export async function syncAllPlatformMetrics(
  handles: { platform: SocialMetrics["platform"]; handle: string }[],
): Promise<SocialMetrics[]> {
  return Promise.all(handles.map((h) => fetchPublicMetrics(h)));
}
