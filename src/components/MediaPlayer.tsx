export { GlowPlayer as MediaPlayer } from "@/ui/glow-player";

export type MediaPlayerProps = {
  src?: string | null;
  type: "image" | "video";
  poster?: string;
  alt?: string;
  aspectRatio?: "square" | "video" | "portrait";
  className?: string;
};
