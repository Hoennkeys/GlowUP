import type { ReactNode } from "react";
import { LogOut } from "lucide-react";

import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppBreadcrumbs } from "@/components/app-breadcrumbs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-store";
import { resolveActiveMembership } from "@/lib/auth/workspace-permissions";
import { userInitials } from "@/lib/auth/session";
import { labelTenantRole } from "@/modules/creator/domain/terminology";
import { useParams } from "@tanstack/react-router";

export function AppLayout({ children }: { children: ReactNode }) {
  const { session, logout } = useAuth();
  const { tenantSlug } = useParams({ from: "/t/$tenantSlug/app" });
  const initials = session ? userInitials(session.user.nome) : "GU";
  const membership = session ? resolveActiveMembership(session, tenantSlug) : null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger />
          <AppBreadcrumbs className="hidden min-w-0 flex-1 sm:flex" />
          <div className="flex-1 sm:hidden" />
          <ThemeToggle />
          <div className="hidden items-center gap-2 md:flex">
            {membership ? (
              <Badge variant={membership.role === "OWNER" ? "default" : "secondary"}>
                {labelTenantRole(membership.role)}
              </Badge>
            ) : null}
            <span className="text-sm text-muted-foreground">{session?.user.nome}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => void logout()} title="Sair">
            <LogOut className="h-4 w-4" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-xs text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
