import * as React from "react";
import { useAuth } from "@/lib/auth/auth-store";
import {
  canApproveDeliveries,
  canEditProfile,
  canManageCampaigns,
  resolveInfluencerRole,
  type InfluencerRole,
} from "@/lib/feature-flags";
import { useCrm } from "@/lib/crm-store";
import type {
  Entrega,
  EntregaStatusAprovacao,
  InfluencerPlatformSnapshot,
  PerfilInfluencer,
} from "../../../../types/influencer-platform";
import { hydrateInfluencerPlatform } from "../domain/legacy-adapter";
import {
  buildEntregaVersionMeta,
  inferTipoMidiaFromMime,
  nextVersionNumber,
  type EntregaVersionMeta,
} from "../domain/entrega-version";
import { getPresignedUploadUrlFn } from "../api/influencer.functions";

type InfluencerContextValue = {
  tenantId: string;
  snapshot: InfluencerPlatformSnapshot;
  profiles: PerfilInfluencer[];
  entregas: Entrega[];
  role: InfluencerRole;
  canApprove: boolean;
  canManageCampaigns: boolean;
  getProfile: (id: string) => PerfilInfluencer | undefined;
  getEntregasByCampaign: (campaignId: string) => Entrega[];
  atualizarEntregaStatus: (id: string, status: EntregaStatusAprovacao) => void;
  adicionarEntrega: (input: Omit<Entrega, "id" | "criadoEm" | "atualizadoEm" | "comentarios">) => Entrega;
  atualizarProfile: (id: string, patch: Partial<PerfilInfluencer>) => void;
  uploadMedia: (
    file: File,
    opts: { entregaId: string; campaignId: string; uploadedBy: string; existingVersions: number[] },
  ) => Promise<EntregaVersionMeta>;
};

const InfluencerContext = React.createContext<InfluencerContextValue | null>(null);

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function InfluencerProvider({
  children,
  tenantId,
}: {
  children: React.ReactNode;
  tenantId: string;
}) {
  const crm = useCrm();
  const { session } = useAuth();

  const role = resolveInfluencerRole(session?.user);

  const snapshot = React.useMemo(
    () => crm.getInfluencer(),
    [crm, crm.getInfluencer],
  );

  const value: InfluencerContextValue = {
    tenantId,
    snapshot,
    profiles: snapshot.profiles.filter((p) => p.tenantId === tenantId),
    entregas: snapshot.entregas.filter((e) => e.tenantId === tenantId),
    role,
    canApprove: canApproveDeliveries(role),
    canManageCampaigns: canManageCampaigns(role),

    getProfile: (id) => snapshot.profiles.find((p) => p.id === id),

    getEntregasByCampaign: (campaignId) =>
      snapshot.entregas.filter((e) => e.campanhaId === campaignId),

    atualizarEntregaStatus: (id, status) => {
      crm.setInfluencer((current) => ({
        ...current,
        entregas: current.entregas.map((e) =>
          e.id === id
            ? { ...e, statusAprovacao: status, atualizadoEm: new Date().toISOString() }
            : e,
        ),
      }));
    },

    adicionarEntrega: (input) => {
      const agora = new Date().toISOString();
      const nova: Entrega = {
        ...input,
        id: uid("entrega"),
        comentarios: [],
        criadoEm: agora,
        atualizadoEm: agora,
      };
      crm.setInfluencer((current) => ({
        ...current,
        entregas: [nova, ...current.entregas],
      }));
      return nova;
    },

    atualizarProfile: (id, patch) => {
      if (!canEditProfile(role, false) && role === "influencer") return;
      crm.setInfluencer((current) => ({
        ...current,
        profiles: current.profiles.map((p) =>
          p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p,
        ),
      }));
    },

    uploadMedia: async (file, opts) => {
      const presigned = await getPresignedUploadUrlFn({
        data: {
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          campaignId: opts.campaignId,
        },
      });

      const versao = nextVersionNumber(opts.existingVersions);
      const meta = buildEntregaVersionMeta({
        entregaId: opts.entregaId,
        versao,
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: file.size,
        tipoMidia: inferTipoMidiaFromMime(file.type),
        uploadedBy: opts.uploadedBy,
        arquivoUrl: presigned.publicUrl,
      });

      crm.setInfluencer((current) => ({
        ...current,
        entregas: current.entregas.map((e) =>
          e.id === opts.entregaId
            ? {
                ...e,
                versao: meta.versao,
                arquivoUrl: meta.arquivoUrl,
                tipoMidia: meta.tipoMidia,
                statusAprovacao: "pendente" as const,
                atualizadoEm: meta.uploadedAt,
              }
            : e,
        ),
      }));

      return meta;
    },
  };

  return <InfluencerContext.Provider value={value}>{children}</InfluencerContext.Provider>;
}

export function useInfluencer() {
  const ctx = React.useContext(InfluencerContext);
  if (!ctx) throw new Error("useInfluencer precisa de InfluencerProvider");
  return ctx;
}

export { hydrateInfluencerPlatform };
