export type DeliveryEvent = {
  entregaId: string;
  event: "submitted" | "approved" | "rejected" | "revision_requested";
  recipientIds: string[];
};

type RealtimeEvent = DeliveryEvent & {
  channel: string;
  publishedAt: string;
};

const eventLog: RealtimeEvent[] = [];

/**
 * Publica evento de entrega via Pusher/Supabase Realtime.
 * Mock: acumula em memória quando credenciais ausentes.
 */
export async function publishDeliveryEvent(event: DeliveryEvent): Promise<void> {
  const appId = process.env.PUSHER_APP_ID;
  const channel = `tenant-deliveries-${event.entregaId}`;

  const payload: RealtimeEvent = {
    ...event,
    channel,
    publishedAt: new Date().toISOString(),
  };

  if (!appId || !process.env.PUSHER_KEY) {
    eventLog.push(payload);
    if (process.env.NODE_ENV !== "production") {
      console.info("[realtime:mock]", payload);
    }
    return;
  }

  // Placeholder: integração Pusher real
  eventLog.push(payload);
}

export function getMockEventLog(): RealtimeEvent[] {
  return [...eventLog];
}

export function clearMockEventLog(): void {
  eventLog.length = 0;
}
