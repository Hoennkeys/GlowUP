import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

type GlowPlayerProps = {
  src?: string | null;
  type: "image" | "video";
  poster?: string;
  alt?: string;
  aspectRatio?: "square" | "video" | "portrait";
  className?: string;
};

const aspectClasses = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[9/16]",
};

export function GlowPlayer({
  src,
  type,
  poster,
  alt = "Mídia",
  aspectRatio = "video",
  className,
}: GlowPlayerProps) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-xl bg-muted border border-dashed border-border",
          aspectClasses[aspectRatio],
          className,
        )}
      >
        <Play className="h-10 w-10 text-muted-foreground/40" />
      </div>
    );
  }

  if (type === "video") {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-xl bg-black",
          aspectClasses[aspectRatio],
          className,
        )}
      >
        <video
          src={src}
          poster={poster}
          controls
          className="h-full w-full object-contain"
          preload="metadata"
        >
          Seu navegador não suporta vídeo.
        </video>
      </div>
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden rounded-xl", aspectClasses[aspectRatio], className)}
    >
      <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
    </div>
  );
}
