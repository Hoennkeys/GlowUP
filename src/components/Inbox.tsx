import { MessageSquare, Search } from "lucide-react";
import { GlowBadge, GlowInput } from "@/ui";
import { cn } from "@/lib/utils";
import { brDateTime } from "@/lib/format";

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
    <div className={cn("flex flex-col h-full min-h-[320px] border rounded-xl bg-card", className)}>
      <div className="p-3 border-b space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <GlowInput
            placeholder="Buscar conversas..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => onTagFilterChange?.(undefined)}
            className="focus:outline-none"
          >
            <GlowBadge variant={!tagFilter ? "default" : "outline"} className="cursor-pointer">
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
                className="cursor-pointer capitalize"
              >
                {tag}
              </GlowBadge>
            </button>
          ))}
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto divide-y">
        {filtered.length === 0 ? (
          <li className="flex flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground">
            <MessageSquare className="h-8 w-8 opacity-40" />
            <p className="text-sm">Nenhuma conversa encontrada</p>
          </li>
        ) : (
          filtered.map((thread) => (
            <li key={thread.id}>
              <button
                type="button"
                onClick={() => onSelect?.(thread.id)}
                className={cn(
                  "w-full text-left px-4 py-3 transition-colors hover:bg-muted/50",
                  selectedId === thread.id &&
                    "bg-creator-primary/5 border-l-2 border-l-creator-primary",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate text-sm">{thread.participantName}</p>
                      {thread.unreadCount > 0 ? (
                        <GlowBadge className="h-5 min-w-5 px-1.5 text-[10px]">
                          {thread.unreadCount}
                        </GlowBadge>
                      ) : null}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{thread.subject}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5 line-clamp-1">
                      {thread.lastMessage}
                    </p>
                    {thread.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {thread.tags.slice(0, 3).map((tag) => (
                          <GlowBadge
                            key={tag}
                            variant="outline"
                            className="text-[10px] py-0 font-normal"
                          >
                            {tag}
                          </GlowBadge>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {brDateTime(thread.lastMessageAt)}
                  </span>
                </div>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
