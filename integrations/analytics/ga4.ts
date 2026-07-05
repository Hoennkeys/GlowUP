export type CampaignAnalyticsEvent =
  | "delivery_submitted"
  | "delivery_approved"
  | "delivery_rejected"
  | "contract_signed"
  | "milestone_paid"
  | "campaign_created";

export type TrackEventInput = {
  event: CampaignAnalyticsEvent;
  campaignId: string;
  tenantId: string;
  userId?: string;
  metadata?: Record<string, string | number>;
};

export type UtmParams = {
  source: string;
  medium: string;
  campaign: string;
  content?: string;
  term?: string;
};

const eventLog: Array<TrackEventInput & { trackedAt: string; mock: boolean }> = [];

/**
 * Envia evento para GA4 Measurement Protocol.
 * Mock quando GA4_MEASUREMENT_ID ausente.
 */
export async function trackCampaignEvent(input: TrackEventInput): Promise<{ ok: boolean; mock: boolean }> {
  const measurementId = process.env.GA4_MEASUREMENT_ID;
  const apiSecret = process.env.GA4_API_SECRET;
  const mock = !measurementId || !apiSecret;

  const payload = { ...input, trackedAt: new Date().toISOString(), mock };
  eventLog.push(payload);

  if (mock) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[ga4:mock]", payload);
    }
    return { ok: true, mock: true };
  }

  // Placeholder: POST https://www.google-analytics.com/mp/collect
  return { ok: true, mock: false };
}

/** Monta URL com parâmetros UTM para links de campanha. */
export function buildUtmUrl(baseUrl: string, utm: UtmParams): string {
  const url = new URL(baseUrl);
  url.searchParams.set("utm_source", utm.source);
  url.searchParams.set("utm_medium", utm.medium);
  url.searchParams.set("utm_campaign", utm.campaign);
  if (utm.content) url.searchParams.set("utm_content", utm.content);
  if (utm.term) url.searchParams.set("utm_term", utm.term);
  return url.toString();
}

export function getMockAnalyticsLog(): typeof eventLog {
  return [...eventLog];
}

export function clearMockAnalyticsLog(): void {
  eventLog.length = 0;
}
