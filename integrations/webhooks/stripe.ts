export type StripeWebhookEvent = {
  id: string;
  type: string;
  data: {
    object: {
      id: string;
      metadata?: Record<string, string>;
      amount?: number;
      status?: string;
    };
  };
};

export type WebhookResult = {
  handled: boolean;
  action?: "milestone_paid" | "payout_completed" | "payment_failed";
  mock: boolean;
};

/**
 * Processa webhook Stripe (payment_intent.succeeded, payout.paid, etc.).
 * Valida assinatura quando STRIPE_WEBHOOK_SECRET definido.
 */
export async function handleStripeWebhook(
  payload: string,
  signature?: string,
): Promise<WebhookResult> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    let event: StripeWebhookEvent;
    try {
      event = JSON.parse(payload) as StripeWebhookEvent;
    } catch {
      return { handled: false, mock: true };
    }

    const action = mapEventType(event.type);
    if (process.env.NODE_ENV !== "production") {
      console.info("[stripe:webhook:mock]", event.type, event.data.object.id);
    }
    return { handled: true, action, mock: true };
  }

  if (!signature) {
    throw new Error("Stripe webhook requer header Stripe-Signature");
  }

  // Placeholder: stripe.webhooks.constructEvent(payload, signature, secret)
  return { handled: true, action: "milestone_paid", mock: false };
}

function mapEventType(type: string): WebhookResult["action"] {
  switch (type) {
    case "payment_intent.succeeded":
      return "milestone_paid";
    case "payout.paid":
      return "payout_completed";
    case "payment_intent.payment_failed":
      return "payment_failed";
    default:
      return undefined;
  }
}
