import * as React from "react";
import { ArrowLeft, FileText, Megaphone } from "lucide-react";
import { Link, useParams } from "@tanstack/react-router";
import { CampaignCard } from "@/components/CampaignCard";
import { MediaUploader } from "@/components/MediaUploader";
import { TimelineEntrega } from "@/components/TimelineEntrega";
import { GlowBadge, GlowButton, GlowCard, GlowCardContent, GlowCardHeader } from "@/ui";
import { brl } from "@/lib/format";
import { useAuth } from "@/lib/auth/auth-store";
import { useCreator } from "@/modules/creator/store/creator-context";
import { useInfluencer } from "../store/influencer-context";

export function CampaignDetailPage() {
  const { tenantSlug, campaignId } = useParams({
    from: "/t/$tenantSlug/app/creator/campaigns/$campaignId",
  });
  const { campaigns, brands, atualizarCampaignStatus } = useCreator();
  const {
    getEntregasByCampaign,
    canApprove,
    atualizarEntregaStatus,
    adicionarEntrega,
    uploadMedia,
    snapshot,
    tenantId,
  } = useInfluencer();
  const { session } = useAuth();

  const campaign = campaigns.find((c) => c.id === campaignId);
  const entregas = getEntregasByCampaign(campaignId);
  const contrato = snapshot.contratos.find((c) => c.campanhaId === campaignId);
  const painel = snapshot.paineis.find((p) => p.campanhaId === campaignId);
  const [uploading, setUploading] = React.useState(false);

  if (!campaign) {
    return (
      <div className="space-y-4">
        <BackLink tenantSlug={tenantSlug} />
        <p className="text-muted-foreground">Campanha não encontrada.</p>
      </div>
    );
  }

  const brandName = brands.find((b) => b.id === campaign.brandId)?.name;
  const versions = entregas.map((e) => ({
    id: e.id,
    name: e.titulo ?? `Versão ${e.versao}`,
    url: e.arquivoUrl ?? "",
    version: e.versao,
    uploadedAt: e.atualizadoEm,
  }));

  const handleUpload = async (files: File[]) => {
    const file = files[0];
    if (!file || !session?.user.id) return;
    setUploading(true);
    try {
      let entrega = entregas[0];
      if (!entrega) {
        entrega = adicionarEntrega({
          tenantId,
          campanhaId: campaignId,
          influencerId: snapshot.profiles[0]?.id ?? "influencer_unknown",
          titulo: file.name,
          tipoMidia: file.type.startsWith("video/") ? "video" : "imagem",
          arquivoUrl: null,
          versao: 0,
          statusAprovacao: "rascunho",
        });
      }
      await uploadMedia(file, {
        entregaId: entrega.id,
        campaignId,
        uploadedBy: session.user.id,
        existingVersions: entregas.map((e) => e.versao),
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <BackLink tenantSlug={tenantSlug} />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <CampaignCard
          campaign={campaign}
          brandName={brandName}
          onAction={(action, id) => {
            if (action === "activate") atualizarCampaignStatus(id, "active");
            if (action === "pause") atualizarCampaignStatus(id, "paused");
          }}
        />

        <div className="space-y-6">
          <GlowCard>
            <GlowCardHeader>
              <h2 className="font-semibold flex items-center gap-2">
                <Megaphone className="h-4 w-4" />
                Brief & entregáveis
              </h2>
            </GlowCardHeader>
            <GlowCardContent className="space-y-2 text-sm">
              {campaign.description ? (
                <p className="text-muted-foreground">{campaign.description}</p>
              ) : (
                <p className="text-muted-foreground italic">Sem brief detalhado.</p>
              )}
              <div className="flex flex-wrap gap-2 pt-2">
                {campaign.channels.map((ch) => (
                  <GlowBadge key={ch} variant="outline" className="capitalize">
                    {ch}
                  </GlowBadge>
                ))}
              </div>
            </GlowCardContent>
          </GlowCard>

          <GlowCard>
            <GlowCardHeader>
              <h2 className="font-semibold">Enviar entrega</h2>
            </GlowCardHeader>
            <GlowCardContent>
              <MediaUploader
                versions={versions.filter((v) => v.url)}
                onFilesSelected={handleUpload}
                disabled={uploading}
              />
              {uploading ? (
                <p className="text-xs text-muted-foreground mt-2">Enviando via presigned URL…</p>
              ) : null}
            </GlowCardContent>
          </GlowCard>

          <GlowCard>
            <GlowCardHeader>
              <h2 className="font-semibold">Timeline de entregas</h2>
            </GlowCardHeader>
            <GlowCardContent>
              <TimelineEntrega
                entregas={entregas}
                readOnly={!canApprove}
                onApprove={(id) => atualizarEntregaStatus(id, "aprovado")}
                onReject={(id) => atualizarEntregaStatus(id, "rejeitado")}
                onRequestRevision={(id) => atualizarEntregaStatus(id, "em_revisao")}
              />
            </GlowCardContent>
          </GlowCard>

          {contrato ? (
            <GlowCard>
              <GlowCardHeader>
                <h2 className="font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Contrato {contrato.numero}
                </h2>
              </GlowCardHeader>
              <GlowCardContent className="space-y-3">
                <p className="text-sm">
                  Valor total: <strong>{brl(contrato.valor)}</strong>
                </p>
                <GlowBadge
                  variant={contrato.assinaturaStatus === "aceita" ? "default" : "secondary"}
                >
                  {contrato.assinaturaStatus}
                </GlowBadge>
                <ul className="space-y-2 text-sm">
                  {contrato.milestones.map((ms) => (
                    <li key={ms.id} className="flex justify-between gap-2 border-b pb-2">
                      <span>{ms.descricao}</span>
                      <span className="shrink-0 text-muted-foreground">
                        {brl(ms.valor)} · {ms.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </GlowCardContent>
            </GlowCard>
          ) : null}

          {painel ? (
            <GlowButton variant="outline" asChild>
              <Link
                to="/t/$tenantSlug/app/creator/performance"
                params={{ tenantSlug }}
                search={{ campaignId }}
              >
                Ver painel de performance
              </Link>
            </GlowButton>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function BackLink({ tenantSlug }: { tenantSlug: string }) {
  return (
    <GlowButton variant="ghost" size="sm" asChild>
      <Link to="/t/$tenantSlug/app/creator/campaigns" params={{ tenantSlug }}>
        <ArrowLeft className="h-4 w-4 mr-1" />
        Campanhas
      </Link>
    </GlowButton>
  );
}
