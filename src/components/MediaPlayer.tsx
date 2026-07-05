export { GlowPlayer as MediaPlayer, GlowPlayer as PlayerMultimidia } from "@/ui/glow-player";

export type MediaPlayerProps = {
  src?: string | null;
  type: "image" | "video";
  poster?: string;
  alt?: string;
  aspectRatio?: "square" | "video" | "portrait";
  className?: string;
};
