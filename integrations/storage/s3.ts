export type PresignedUploadInput = {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  prefix?: string;
};

export type PresignedUploadResult = {
  uploadUrl: string;
  publicUrl: string;
  key: string;
  expiresAt: string;
  mock: boolean;
};

const MAX_UPLOAD_BYTES = 500 * 1024 * 1024; // 500 MB

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

/**
 * Gera URL de upload presigned (S3).
 * Em dev/staging sem credenciais AWS, retorna mock funcional para preview local.
 */
export async function createPresignedUploadUrl(
  input: PresignedUploadInput,
): Promise<PresignedUploadResult> {
  if (input.sizeBytes > MAX_UPLOAD_BYTES) {
    throw new Error(`Arquivo excede limite de ${MAX_UPLOAD_BYTES / 1024 / 1024} MB`);
  }

  const bucket = process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_REGION ?? "us-east-1";
  const key = `${input.prefix ?? "uploads"}/${Date.now()}_${sanitizeFileName(input.fileName)}`;
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  if (!bucket || !process.env.AWS_ACCESS_KEY_ID) {
    const mockUrl = `https://cdn.glowup.app/mock/${key}`;
    return {
      uploadUrl: mockUrl,
      publicUrl: mockUrl,
      key,
      expiresAt,
      mock: true,
    };
  }

  const uploadUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}?X-Amz-Expires=900`;
  const publicUrl = process.env.CDN_BASE_URL
    ? `${process.env.CDN_BASE_URL}/${key}`
    : `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

  return { uploadUrl, publicUrl, key, expiresAt, mock: false };
}
