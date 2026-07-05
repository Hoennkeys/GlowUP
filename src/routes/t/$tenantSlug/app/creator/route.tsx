import { Outlet, createFileRoute } from "@tanstack/react-router";
import { CreatorProvider } from "@/modules/creator/store/creator-context";
import { InfluencerProvider } from "@/modules/influencer/store/influencer-context";
import { CreatorSubNav } from "@/modules/creator/components/creator-sub-nav";
import { pageTitle } from "@/lib/product-branding";
import { FEATURE_FLAGS } from "@/lib/feature-flags";
import { useTenant } from "@/lib/tenant/tenant-store";

export const Route = createFileRoute("/t/$tenantSlug/app/creator")({
  head: () => ({ meta: [{ title: pageTitle("Dashboard") }] }),
  component: CreatorLayout,
});

function CreatorLayout() {
  const { whiteLabel } = useTenant();

  const content = (
    <CreatorProvider>
      <div className="space-y-2">
        <CreatorSubNav />
        <Outlet />
      </div>
    </CreatorProvider>
  );

  if (!FEATURE_FLAGS.influencerPlatform) {
    return content;
  }

  return <InfluencerProvider tenantId={whiteLabel.tenantId}>{content}</InfluencerProvider>;
}
