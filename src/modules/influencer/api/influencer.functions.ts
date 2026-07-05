import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createPresignedUploadUrl } from "../../../../integrations/storage/s3";
import {
  buildEntregaVersionMeta,
  inferTipoMidiaFromMime,
  nextVersionNumber,
} from "../domain/entrega-version";

export const getPresignedUploadUrlFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      fileName: z.string().min(1),
      mimeType: z.string().min(1),
      sizeBytes: z.number().positive(),
      campaignId: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const result = await createPresignedUploadUrl({
      fileName: data.fileName,
      mimeType: data.mimeType,
      sizeBytes: data.sizeBytes,
      prefix: data.campaignId ? `campaigns/${data.campaignId}` : "uploads",
    });
    return result;
  });

export const createEntregaVersionFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      entregaId: z.string().min(1),
      fileName: z.string().min(1),
      mimeType: z.string().min(1),
      sizeBytes: z.number().positive(),
      uploadedBy: z.string().min(1),
      arquivoUrl: z.string().url(),
      existingVersions: z.array(z.number()).default([]),
    }),
  )
  .handler(async ({ data }) => {
    const versao = nextVersionNumber(data.existingVersions);
    const meta = buildEntregaVersionMeta({
      entregaId: data.entregaId,
      versao,
      fileName: data.fileName,
      mimeType: data.mimeType,
      sizeBytes: data.sizeBytes,
      tipoMidia: inferTipoMidiaFromMime(data.mimeType),
      uploadedBy: data.uploadedBy,
      arquivoUrl: data.arquivoUrl,
    });
    return meta;
  });

export const notifyDeliveryUpdateFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      entregaId: z.string(),
      event: z.enum(["submitted", "approved", "rejected", "revision_requested"]),
      recipientIds: z.array(z.string()),
    }),
  )
  .handler(async ({ data }) => {
    const { publishDeliveryEvent } = await import("../../../../integrations/realtime/pusher");
    await publishDeliveryEvent(data);
    return { ok: true as const, deliveredAt: new Date().toISOString() };
  });
