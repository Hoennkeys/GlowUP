import { createFileRoute } from "@tanstack/react-router";
import { CampaignDetailPage } from "@/modules/influencer/components/campaign-detail-page";
import { pageTitle } from "@/lib/product-branding";

export const Route = createFileRoute("/t/$tenantSlug/app/creator/campaigns/$campaignId")({
  head: () => ({ meta: [{ title: pageTitle("Campanha") }] }),
  component: CampaignDetailPage,
});
