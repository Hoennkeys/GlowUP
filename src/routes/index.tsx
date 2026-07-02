import { createFileRoute, redirect } from "@tanstack/react-router";
import { getDefaultPortalRedirect } from "@/lib/auth/session";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (context.session) {
      throw redirect(getDefaultPortalRedirect(context.session));
    }
    throw redirect({ to: "/login" });
  },
});
