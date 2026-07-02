import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  inviteTeamMemberServerFn,
  listTeamMembersServerFn,
  removeTeamMemberServerFn,
  updateMemberRoleServerFn,
  type TeamMemberRecord,
} from "@/lib/api/team.functions";
import type { TenantRole } from "@/lib/auth/types";
import { isClientServerApiEnabled } from "@/lib/client/server-api";
import {
  inviteMockTeamMember,
  listMockTeamMembers,
  removeMockTeamMember,
  updateMockMemberRole,
} from "@/lib/team/mock-team-store";

export function useTeamMembers(tenantSlug: string) {
  const [members, setMembers] = useState<TeamMemberRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      if (isClientServerApiEnabled()) {
        const list = await listTeamMembersServerFn({ data: { tenantSlug } });
        setMembers(list);
      } else {
        setMembers(listMockTeamMembers(tenantSlug));
      }
    } finally {
      setLoading(false);
    }
  }, [tenantSlug]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const invite = useCallback(
    async (input: { nome: string; email: string; role: TenantRole }) => {
      if (isClientServerApiEnabled()) {
        const result = await inviteTeamMemberServerFn({
          data: { tenantSlug, ...input },
        });
        toast.success(result.message);
      } else {
        const result = inviteMockTeamMember(tenantSlug, input);
        toast.success(result.message);
      }
      await refresh();
    },
    [tenantSlug, refresh],
  );

  const remove = useCallback(
    async (userId: string) => {
      if (isClientServerApiEnabled()) {
        await removeTeamMemberServerFn({ data: { tenantSlug, userId } });
      } else {
        removeMockTeamMember(tenantSlug, userId);
      }
      toast.success("Membro removido.");
      await refresh();
    },
    [tenantSlug, refresh],
  );

  const updateRole = useCallback(
    async (userId: string, role: TenantRole) => {
      if (isClientServerApiEnabled()) {
        await updateMemberRoleServerFn({ data: { tenantSlug, userId, role } });
      } else {
        updateMockMemberRole(tenantSlug, userId, role);
      }
      toast.success("Função atualizada.");
      await refresh();
    },
    [tenantSlug, refresh],
  );

  return { members, loading, refresh, invite, remove, updateRole };
}
