import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "@/modules/influencer/components/profile-page";
import { pageTitle } from "@/lib/product-branding";

export const Route = createFileRoute("/t/$tenantSlug/app/creator/profile/$profileId")({
  head: () => ({ meta: [{ title: pageTitle("Perfil") }] }),
  component: ProfilePage,
});
