import { useCallback, useRef, useState } from "react";
import { FileUp, X } from "lucide-react";
import { GlowBadge, GlowButton } from "@/ui";
import { cn } from "@/lib/utils";
import { acceptMimeForMediaTypes } from "./influencer/helpers";

export type MediaVersion = {
  id: string;
  name: string;
  url: string;
  version: number;
  uploadedAt: string;
};

export type MediaUploaderProps = {
  accept?: string[];
  maxFiles?: number;
  versions?: MediaVersion[];
  onFilesSelected?: (files: File[]) => void;
  onRemoveVersion?: (versionId: string) => void;
  disabled?: boolean;
  className?: string;
};

export function MediaUploader({
  accept = ["imagem", "video"],
  maxFiles = 5,
  versions = [],
  onFilesSelected,
  onRemoveVersion,
  disabled,
  className,
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<{ name: string; url: string }[]>([]);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files?.length || disabled) return;
      const list = Array.from(files).slice(0, maxFiles);
      onFilesSelected?.(list);

      const next = list.map((f) => ({ name: f.name, url: URL.createObjectURL(f) }));
      setPreviews((prev) => [...prev, ...next].slice(-maxFiles));
    },
    [disabled, maxFiles, onFilesSelected],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors cursor-pointer",
          isDragging
            ? "border-creator-primary bg-creator-primary/5"
            : "border-border hover:border-creator-primary/40 hover:bg-muted/50",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-creator-primary/10">
          <FileUp className="h-6 w-6 text-creator-primary" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">Arraste arquivos ou clique para enviar</p>
          <p className="text-xs text-muted-foreground mt-1">
            Imagem, vídeo ou documento — até {maxFiles} arquivos
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptMimeForMediaTypes(accept)}
          className="hidden"
          disabled={disabled}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {previews.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {previews.map((p) => (
            <div
              key={p.url}
              className="relative aspect-video rounded-lg overflow-hidden border bg-muted"
            >
              {p.url.match(/\.(mp4|webm|mov)/i) ? (
                <video src={p.url} className="h-full w-full object-cover" muted />
              ) : (
                <img src={p.url} alt={p.name} className="h-full w-full object-cover" />
              )}
              <span className="absolute bottom-1 left-1 right-1 truncate text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                {p.name}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      {versions.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-medium">Versões anteriores</p>
          <ul className="space-y-2">
            {versions.map((v) => (
              <li
                key={v.id}
                className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{v.name}</p>
                  <p className="text-xs text-muted-foreground">v{v.version}</p>
                </div>
                <GlowBadge variant="outline">v{v.version}</GlowBadge>
                {onRemoveVersion ? (
                  <GlowButton
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => onRemoveVersion(v.id)}
                    aria-label={`Remover versão ${v.version}`}
                  >
                    <X className="h-4 w-4" />
                  </GlowButton>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
