import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { InfluencerInboxPage } from "@/modules/influencer/components/influencer-inbox-page";
import { pageTitle } from "@/lib/product-branding";

export const Route = createFileRoute("/t/$tenantSlug/app/creator/inbox")({
  validateSearch: z.object({
    tag: z.string().optional(),
  }),
  head: () => ({ meta: [{ title: pageTitle("Inbox") }] }),
  component: InfluencerInboxPage,
});
