import * as React from "react";
import { createFileRoute, redirect, useNavigate, useRouteContext } from "@tanstack/react-router";
import { LogIn, Sparkles } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getPlatformTenantBySlug } from "@/lib/admin/tenant-registry";
import { resolveActiveMembership } from "@/lib/auth/workspace-permissions";
import {
  markWorkspaceEntered,
  userInitials,
} from "@/lib/auth/session";
import { pageTitle, PRODUCT_NAME } from "@/lib/product-branding";
import { getDefaultWhiteLabel } from "@/lib/tenant/defaults";
import { loadTenantWhiteLabel } from "@/lib/tenant/storage";

type WorkspaceEnterSearch = {
  slug?: string;
};

export const Route = createFileRoute("/workspace/enter")({
  validateSearch: (search: Record<string, unknown>): WorkspaceEnterSearch => ({
    slug: typeof search.slug === "string" ? search.slug : undefined,
  }),
  beforeLoad: ({ context, search }) => {
    const session = context.session;
    if (!session) {
      throw redirect({ to: "/login" });
    }

    if (session.user.platformRole === "SUPER_ADMIN") {
      throw redirect({ to: "/admin" });
    }

    if (session.user.clientRole === "CLIENT" && session.user.tenantSlug) {
      throw redirect({ to: `/t/${session.user.tenantSlug}/portal` });
    }

    const slug = search.slug ?? session.user.tenantMemberships?.[0]?.tenantSlug;
    const membership = slug ? resolveActiveMembership(session, slug) : null;
    if (!membership) {
      throw redirect({ to: "/login" });
    }
  },
  head: () => ({ meta: [{ title: pageTitle("Workspace") }] }),
  component: WorkspaceEnterPage,
});

function resolveWorkspaceDisplay(slug: string) {
  if (typeof window !== "undefined") {
    try {
      const wl = loadTenantWhiteLabel(slug);
      return { nome: wl.nome, logoUrl: wl.logoUrl };
    } catch {
      /* fall through */
    }
  }

  const fromRegistry = getPlatformTenantBySlug(slug);
  if (fromRegistry) {
    return { nome: fromRegistry.nome, logoUrl: fromRegistry.whiteLabel.logoUrl };
  }

  const defaults = getDefaultWhiteLabel(slug);
  return { nome: defaults?.nome ?? slug, logoUrl: defaults?.logoUrl };
}

function WorkspaceEnterPage() {
  const navigate = useNavigate();
  const { slug: slugFromSearch } = Route.useSearch();
  const { session } = useRouteContext({ from: "__root__" });
  const membership =
    resolveActiveMembership(session, slugFromSearch) ?? session?.user.tenantMemberships?.[0];

  if (!membership) return null;

  const { nome, logoUrl } = resolveWorkspaceDisplay(membership.tenantSlug);
  const initials = userInitials(nome);

  const handleEnter = () => {
    markWorkspaceEntered(membership.tenantSlug);
    void navigate({
      to: "/t/$tenantSlug/app/painel",
      params: { tenantSlug: membership.tenantSlug },
      replace: true,
    });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-6">
      <div className="mx-auto w-full max-w-md space-y-8 text-center">
        <div className="flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-black tracking-wider uppercase text-foreground">
            {PRODUCT_NAME}
          </h1>
        </div>

        <div className="space-y-4 rounded-xl border bg-card p-8 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Workspace:</p>
          <p className="text-2xl font-semibold tracking-tight text-foreground">{nome}</p>

          <Avatar className="mx-auto h-20 w-20">
            {logoUrl ? <AvatarImage src={logoUrl} alt={nome} /> : null}
            <AvatarFallback className="bg-primary text-lg text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>

          <p className="text-sm text-muted-foreground">Você faz parte desta equipe.</p>

          <Button className="w-full" size="lg" onClick={handleEnter}>
            <LogIn className="h-4 w-4" />
            Entrar
          </Button>
        </div>
      </div>
    </div>
  );
}
