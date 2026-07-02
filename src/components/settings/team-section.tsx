import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTeamMembers } from "@/hooks/use-team-members";
import { userInitials } from "@/lib/auth/session";
import { canManageTeam } from "@/lib/auth/workspace-permissions";
import { useAuth } from "@/lib/auth/auth-store";
import type { TenantRole } from "@/lib/auth/types";
import { CREATOR_TERMS, labelTenantRole } from "@/modules/creator/domain/terminology";

type TeamSectionProps = {
  tenantSlug: string;
};

export function TeamSection({ tenantSlug }: TeamSectionProps) {
  const { session } = useAuth();
  const { members, loading, invite, remove, updateRole } = useTeamMembers(tenantSlug);
  const canManage = session ? canManageTeam(session, tenantSlug) : false;
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    nome: "",
    email: "",
    role: "MEMBER" as TenantRole,
  });

  const handleInvite = async () => {
    try {
      await invite(form);
      setOpen(false);
      setForm({ nome: "", email: "", role: "MEMBER" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao convidar membro.");
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{CREATOR_TERMS.teamMembers}</CardTitle>
            <CardDescription>
              {canManage
                ? "Gerencie quem faz parte do seu workspace."
                : "Membros com acesso a este workspace."}
            </CardDescription>
          </div>
          {canManage ? (
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" /> Convidar membro
            </Button>
          ) : null}
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando equipe...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Foto</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Função</TableHead>
                  {canManage ? <TableHead className="text-right">Ações</TableHead> : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <Avatar className="h-9 w-9">
                        {member.avatarUrl ? (
                          <AvatarImage src={member.avatarUrl} alt={member.nome} />
                        ) : null}
                        <AvatarFallback className="text-xs">
                          {userInitials(member.nome)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{member.nome}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      {canManage && member.id !== session?.user.id ? (
                        <Select
                          value={member.role}
                          onValueChange={(v) => void updateRole(member.id, v as TenantRole)}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="OWNER">{labelTenantRole("OWNER")}</SelectItem>
                            <SelectItem value="MEMBER">{labelTenantRole("MEMBER")}</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant={member.role === "OWNER" ? "default" : "secondary"}>
                          {labelTenantRole(member.role)}
                        </Badge>
                      )}
                    </TableCell>
                    {canManage ? (
                      <TableCell className="text-right">
                        {member.id !== session?.user.id ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Remover membro"
                            onClick={() => void remove(member.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        ) : null}
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convidar membro</DialogTitle>
            <DialogDescription>Adicione alguém à equipe do workspace.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Nome</Label>
              <Input
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
            </div>
            <div>
              <Label>E-mail</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <Label>Função</Label>
              <Select
                value={form.role}
                onValueChange={(v) => setForm({ ...form, role: v as TenantRole })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEMBER">{labelTenantRole("MEMBER")}</SelectItem>
                  <SelectItem value="OWNER">{labelTenantRole("OWNER")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => void handleInvite()} disabled={!form.nome || !form.email}>
              Convidar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
