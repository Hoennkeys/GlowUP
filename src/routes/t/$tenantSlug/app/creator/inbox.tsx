import { createFileRoute } from "@tanstack/react-router";
import { InfluencerInboxPage } from "@/modules/influencer/components/influencer-inbox-page";
import { pageTitle } from "@/lib/product-branding";

export const Route = createFileRoute("/t/$tenantSlug/app/creator/inbox")({
  head: () => ({ meta: [{ title: pageTitle("Inbox") }] }),
  component: InfluencerInboxPage,
});
