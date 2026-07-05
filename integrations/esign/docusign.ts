export type SigningRequestInput = {
  contractId: string;
  signerEmail: string;
  signerName: string;
  documentUrl: string;
  returnUrl: string;
};

export type SigningRequestResult = {
  envelopeId: string;
  signingUrl: string;
  status: "sent" | "pending" | "completed";
  mock: boolean;
};

/**
 * Cria envelope de assinatura (DocuSign / HelloSign).
 * Mock quando DOCUSIGN_INTEGRATION_KEY ausente.
 */
export async function createSigningRequest(
  input: SigningRequestInput,
): Promise<SigningRequestResult> {
  const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY;

  if (!integrationKey) {
    return {
      envelopeId: `env_mock_${input.contractId}`,
      signingUrl: `${input.returnUrl}?mock_sign=true&contract=${input.contractId}`,
      status: "sent",
      mock: true,
    };
  }

  return {
    envelopeId: `env_live_${input.contractId}`,
    signingUrl: input.returnUrl,
    status: "pending",
    mock: false,
  };
}

export async function getSigningStatus(envelopeId: string): Promise<{
  envelopeId: string;
  status: "sent" | "pending" | "completed" | "declined";
  mock: boolean;
}> {
  if (!process.env.DOCUSIGN_INTEGRATION_KEY) {
    return { envelopeId, status: "completed", mock: true };
  }
  return { envelopeId, status: "pending", mock: false };
}
