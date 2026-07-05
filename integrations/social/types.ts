export type SocialPlatform = "instagram" | "tiktok" | "youtube";

export type SocialMetrics = {
  platform: SocialPlatform;
  handle: string;
  seguidores?: number;
  inscritos?: number;
  engajamento?: number;
  visualizacoes?: number;
  fetchedAt: string;
};

export type FetchMetricsInput = {
  platform: SocialPlatform;
  handle: string;
  accessToken?: string;
};
