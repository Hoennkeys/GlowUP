import { createFileRoute } from "@tanstack/react-router";
import { OnboardingPage } from "@/modules/influencer/components/onboarding-page";
import { pageTitle } from "@/lib/product-branding";

export const Route = createFileRoute("/t/$tenantSlug/app/creator/onboarding")({
  head: () => ({ meta: [{ title: pageTitle("Onboarding") }] }),
  component: OnboardingPage,
});
