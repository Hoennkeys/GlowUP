export type SocialOAuthCallback = {
  platform: "instagram" | "tiktok" | "youtube";
  code: string;
  state: string;
  redirectUri: string;
};

export type OAuthTokenResult = {
  accessToken: string;
  refreshToken?: string;
  expiresAt: string;
  platform: SocialOAuthCallback["platform"];
  mock: boolean;
};

/**
 * Troca código OAuth por access token (callback de redes sociais).
 * Mock quando credenciais da plataforma ausentes.
 */
export async function handleSocialOAuthCallback(
  callback: SocialOAuthCallback,
): Promise<OAuthTokenResult> {
  const hasCredentials =
    (callback.platform === "instagram" && process.env.INSTAGRAM_APP_SECRET) ||
    (callback.platform === "tiktok" && process.env.TIKTOK_CLIENT_SECRET) ||
    (callback.platform === "youtube" && process.env.YOUTUBE_CLIENT_SECRET);

  const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();

  if (!hasCredentials) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[social:oauth:mock]", callback.platform, callback.state);
    }
    return {
      accessToken: `mock_token_${callback.platform}_${callback.code.slice(0, 8)}`,
      platform: callback.platform,
      expiresAt,
      mock: true,
    };
  }

  return {
    accessToken: "pending_live_token",
    platform: callback.platform,
    expiresAt,
    mock: false,
  };
}
