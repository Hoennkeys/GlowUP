import { MessageSquare, Search, Send } from "lucide-react";
import { GlowAvatar, GlowBadge, GlowButton, GlowInput } from "@/ui";
import { cn } from "@/lib/utils";
import { brDateTime } from "@/lib/format";
import { initialsFromName } from "@/modules/creator/lib/visual-utils";

export type InboxThread = {
  id: string;
  subject: string;
  participantName: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  tags: string[];
  channelType?: string;
};

export type InboxProps = {
  threads: InboxThread[];
  selectedId?: string;
  onSelect?: (threadId: string) => void;
  tagFilter?: string;
  onTagFilterChange?: (tag: string | undefined) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  className?: string;
};

const TAG_LABELS: Record<string, string> = {
  campanha: "Campanha",
  entrega: "Conteúdo",
  contrato: "Acordo",
  urgente: "Urgente",
};

const ALL_TAGS = ["campanha", "entrega", "contrato", "urgente"] as const;

export function Inbox({
  threads,
  selectedId,
  onSelect,
  tagFilter,
  onTagFilterChange,
  searchQuery = "",
  onSearchChange,
  className,
}: InboxProps) {
  const filtered = threads.filter((t) => {
    const matchesTag = !tagFilter || t.tags.includes(tagFilter);
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      t.subject.toLowerCase().includes(q) ||
      t.participantName.toLowerCase().includes(q) ||
      t.lastMessage.toLowerCase().includes(q);
    return matchesTag && matchesSearch;
  });

  return (
    <div className={cn("flex flex-col h-full min-h-[320px] bg-card", className)}>
      <div className="p-3 border-b space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <GlowInput
            placeholder="Buscar mensagens..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-9 rounded-full bg-muted/40 border-0"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => onTagFilterChange?.(undefined)}
            className="focus:outline-none"
          >
            <GlowBadge
              variant={!tagFilter ? "default" : "outline"}
              className="cursor-pointer rounded-full"
            >
              Todas
            </GlowBadge>
          </button>
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onTagFilterChange?.(tagFilter === tag ? undefined : tag)}
              className="focus:outline-none"
            >
              <GlowBadge
                variant={tagFilter === tag ? "default" : "outline"}
                className="cursor-pointer rounded-full"
              >
                {TAG_LABELS[tag] ?? tag}
              </GlowBadge>
            </button>
          ))}
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <li className="flex flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground">
            <MessageSquare className="h-8 w-8 opacity-40" />
            <p className="text-sm">Nenhuma mensagem encontrada</p>
          </li>
        ) : (
          filtered.map((thread) => (
            <li key={thread.id}>
              <button
                type="button"
                onClick={() => onSelect?.(thread.id)}
                className={cn(
                  "w-full text-left px-4 py-3 transition-all hover:bg-muted/40",
                  selectedId === thread.id && "bg-creator-primary/5",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <GlowAvatar
                      alt={thread.participantName}
                      fallback={initialsFromName(thread.participantName)}
                      size="md"
                      ring={thread.unreadCount > 0}
                    />
                    {thread.unreadCount > 0 ? (
                      <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-creator-primary px-1 text-[9px] font-bold text-white">
                        {thread.unreadCount}
                      </span>
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={cn(
                          "truncate text-sm",
                          thread.unreadCount > 0 ? "font-semibold" : "font-medium",
                        )}
                      >
                        {thread.participantName}
                      </p>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {brDateTime(thread.lastMessageAt)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{thread.subject}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {thread.lastMessage}
                    </p>
                  </div>
                </div>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export type ChatComposerProps = {
  placeholder?: string;
  className?: string;
};

export function ChatComposer({
  placeholder = "Escreva uma mensagem...",
  className,
}: ChatComposerProps) {
  return (
    <div className={cn("flex items-center gap-2 border-t p-3", className)}>
      <GlowInput
        placeholder={placeholder}
        className="rounded-full bg-muted/40 border-0 flex-1"
        readOnly
      />
      <GlowButton size="icon" className="rounded-full shrink-0 h-9 w-9">
        <Send className="h-4 w-4" />
      </GlowButton>
    </div>
  );
}

/** Alias canônico do design system (Inbox antiga → InboxUnificada) */
export const InboxUnificada = Inbox;
