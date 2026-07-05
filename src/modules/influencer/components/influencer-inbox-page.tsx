import * as React from "react";
import { MessageSquare } from "lucide-react";
import { Inbox, type InboxThread } from "@/components/Inbox";
import { GlowCard, GlowCardContent, GlowCardHeader } from "@/ui";
import { brDateTime } from "@/lib/format";
import { useCommunicationsUnread } from "@/hooks/use-communications-unread";
import { useCrm } from "@/lib/crm-store";

export function InfluencerInboxPage() {
  const crm = useCrm();
  const comms = crm.getCommunications();
  const unreadTotal = useCommunicationsUnread();
  const [selectedId, setSelectedId] = React.useState<string | undefined>();
  const [tagFilter, setTagFilter] = React.useState<string | undefined>();
  const [search, setSearch] = React.useState("");

  const threads: InboxThread[] = React.useMemo(() => {
    return comms.conversations.map((conv) => {
      const tags = [...conv.tags];
      const subject = conv.subject ?? "Conversa";
      if (tags.length === 0) {
        if (subject.toLowerCase().includes("contrato")) tags.push("contrato");
        else if (subject.toLowerCase().includes("entrega")) tags.push("entrega");
        else tags.push("campanha");
      }

      const lastMsg = comms.messages
        .filter((m) => m.conversationId === conv.id)
        .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())[0];

      const participant = conv.participants.find((p) => p.role === "client") ?? conv.participants[0];

      return {
        id: conv.id,
        subject,
        participantName: participant?.name ?? "Contato",
        lastMessage: lastMsg?.body ?? "—",
        lastMessageAt: conv.lastMessageAt,
        unreadCount: conv.unreadCount ?? 0,
        tags,
        channelType: conv.channelType,
      };
    });
  }, [comms.conversations, comms.messages]);

  const selected = threads.find((t) => t.id === selectedId) ?? threads[0];

  React.useEffect(() => {
    if (!selectedId && threads[0]) setSelectedId(threads[0].id);
  }, [threads, selectedId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-creator-primary" />
          Inbox Unificada
        </h1>
        <p className="text-sm text-muted-foreground">
          Conversas 1:1 e por campanha · {unreadTotal} não lidas
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr] min-h-[480px]">
        <GlowCard className="overflow-hidden">
          <Inbox
            threads={threads}
            selectedId={selected?.id}
            onSelect={setSelectedId}
            tagFilter={tagFilter}
            onTagFilterChange={setTagFilter}
            searchQuery={search}
            onSearchChange={setSearch}
            className="h-full"
          />
        </GlowCard>

        <GlowCard>
          <GlowCardHeader>
            <h2 className="font-semibold">{selected?.subject ?? "Selecione uma conversa"}</h2>
            {selected ? (
              <p className="text-xs text-muted-foreground">
                {selected.participantName} · {brDateTime(selected.lastMessageAt)}
              </p>
            ) : null}
          </GlowCardHeader>
          <GlowCardContent>
            {selected ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-muted/50 p-4 text-sm">
                  {selected.lastMessage}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tags: {selected.tags.join(", ")}
                  {selected.channelType ? ` · Canal: ${selected.channelType}` : ""}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma conversa selecionada.</p>
            )}
          </GlowCardContent>
        </GlowCard>
      </div>
    </div>
  );
}
