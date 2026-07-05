import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { PerformancePanelPage } from "@/modules/influencer/components/performance-panel-page";
import { pageTitle } from "@/lib/product-branding";

export const Route = createFileRoute("/t/$tenantSlug/app/creator/performance")({
  validateSearch: z.object({
    campaignId: z.string().optional(),
  }),
  head: () => ({ meta: [{ title: pageTitle("Performance") }] }),
  component: PerformancePanelPage,
});
