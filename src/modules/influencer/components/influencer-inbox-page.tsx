import * as React from "react";
import { MessageCircle } from "lucide-react";
import { ChatComposer, InboxUnificada, type InboxThread } from "@/components/Inbox";
import { GlowAvatar } from "@/ui";
import { brDateTime } from "@/lib/format";
import { useCommunicationsUnread } from "@/hooks/use-communications-unread";
import { useCrm } from "@/lib/crm-store";
import { CREATOR_NAV } from "@/modules/creator/domain/terminology";
import { initialsFromName } from "@/modules/creator/lib/visual-utils";

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

      const participant =
        conv.participants.find((p) => p.role === "client") ?? conv.participants[0];

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
        <h1 className="glowup-heading flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-emerald-500" />
          {CREATOR_NAV.messages}
        </h1>
        <p className="glowup-subheading">
          {unreadTotal > 0
            ? `${unreadTotal} mensagem${unreadTotal > 1 ? "ns" : ""} não lida${unreadTotal > 1 ? "s" : ""} — responda quando quiser ✨`
            : "Suas conversas com marcas e parceiros — estilo DM."}
        </p>
      </div>

      <div className="creator-chat-layout grid gap-0 lg:grid-cols-[340px_1fr] min-h-[520px] rounded-2xl border overflow-hidden bg-card">
        <InboxUnificada
          threads={threads}
          selectedId={selected?.id}
          onSelect={setSelectedId}
          tagFilter={tagFilter}
          onTagFilterChange={setTagFilter}
          searchQuery={search}
          onSearchChange={setSearch}
          className="h-full border-r"
        />

        <div className="flex flex-col min-h-[480px]">
          {selected ? (
            <>
              <header className="flex items-center gap-3 border-b px-4 py-3">
                <GlowAvatar
                  alt={selected.participantName}
                  fallback={initialsFromName(selected.participantName)}
                  size="md"
                  ring
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{selected.participantName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {selected.subject} · {brDateTime(selected.lastMessageAt)}
                  </p>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20">
                <div className="creator-chat-bubble creator-chat-bubble--incoming max-w-[85%]">
                  <p className="text-sm">{selected.lastMessage}</p>
                  <span className="creator-chat-time">{brDateTime(selected.lastMessageAt)}</span>
                </div>
                <div className="creator-chat-bubble creator-chat-bubble--outgoing max-w-[85%] ml-auto">
                  <p className="text-sm">Obrigada! Vou revisar e te retorno em breve 🙌</p>
                  <span className="creator-chat-time">Agora</span>
                </div>
              </div>

              <ChatComposer />
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-muted-foreground">
              <MessageCircle className="h-10 w-10 opacity-30" />
              <p className="text-sm">Selecione uma conversa para começar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
