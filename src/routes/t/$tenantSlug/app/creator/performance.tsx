import { createFileRoute } from "@tanstack/react-router";
import { PerformancePanelPage } from "@/modules/influencer/components/performance-panel-page";
import { pageTitle } from "@/lib/product-branding";

export const Route = createFileRoute("/t/$tenantSlug/app/creator/performance")({
  validateSearch: (search: Record<string, unknown>) => ({
    campaignId: typeof search.campaignId === "string" ? search.campaignId : undefined,
  }),
  head: () => ({ meta: [{ title: pageTitle("Performance") }] }),
  component: PerformancePanelPage,
});
