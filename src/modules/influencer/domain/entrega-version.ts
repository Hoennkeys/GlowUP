import type { EntregaTipoMidia } from "../../../../types/influencer-platform";

export type EntregaVersionMeta = {
  id: string;
  entregaId: string;
  versao: number;
  hash: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  tipoMidia: EntregaTipoMidia;
  uploadedAt: string;
  uploadedBy: string;
  arquivoUrl: string;
};

/** Hash determinístico simples para deduplicação de versões (mock — substituir por SHA-256 server-side). */
export function computeFileHash(fileName: string, sizeBytes: number, mimeType: string): string {
  const raw = `${fileName}:${sizeBytes}:${mimeType}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  return `vhash_${Math.abs(hash).toString(36)}`;
}

export function buildEntregaVersionMeta(input: {
  entregaId: string;
  versao: number;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  tipoMidia: EntregaTipoMidia;
  uploadedBy: string;
  arquivoUrl: string;
}): EntregaVersionMeta {
  const hash = computeFileHash(input.fileName, input.sizeBytes, input.mimeType);
  return {
    id: `ver_${input.entregaId}_v${input.versao}`,
    entregaId: input.entregaId,
    versao: input.versao,
    hash,
    fileName: input.fileName,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
    tipoMidia: input.tipoMidia,
    uploadedAt: new Date().toISOString(),
    uploadedBy: input.uploadedBy,
    arquivoUrl: input.arquivoUrl,
  };
}

export function nextVersionNumber(existingVersions: number[]): number {
  if (existingVersions.length === 0) return 1;
  return Math.max(...existingVersions) + 1;
}

export function inferTipoMidiaFromMime(mimeType: string): EntregaTipoMidia {
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("image/")) return "imagem";
  return "documento";
}
