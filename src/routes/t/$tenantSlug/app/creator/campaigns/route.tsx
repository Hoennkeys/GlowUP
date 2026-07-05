import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/t/$tenantSlug/app/creator/campaigns")({
  component: () => <Outlet />,
});
