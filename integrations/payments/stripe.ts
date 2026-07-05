export type MilestonePaymentInput = {
  milestoneId: string;
  campaignId: string;
  amountCents: number;
  currency?: string;
  influencerAccountId?: string;
};

export type PaymentResult = {
  paymentIntentId: string;
  status: "succeeded" | "pending" | "failed";
  mock: boolean;
};

/**
 * Processa pagamento de milestone via Stripe Connect.
 * Sandbox mock quando STRIPE_SECRET_KEY ausente.
 */
export async function processMilestonePayment(
  input: MilestonePaymentInput,
): Promise<PaymentResult> {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return {
      paymentIntentId: `pi_mock_${input.milestoneId}`,
      status: "succeeded",
      mock: true,
    };
  }

  // Placeholder: Stripe PaymentIntent.create(...)
  return {
    paymentIntentId: `pi_live_${input.milestoneId}`,
    status: "pending",
    mock: false,
  };
}

export async function createPayoutAccount(influencerEmail: string): Promise<{ accountId: string; mock: boolean }> {
  if (!process.env.STRIPE_SECRET_KEY) {
    return { accountId: `acct_mock_${influencerEmail.replace(/@/, "_")}`, mock: true };
  }
  return { accountId: `acct_live_pending`, mock: false };
}
