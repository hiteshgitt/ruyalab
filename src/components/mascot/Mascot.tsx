import Image from "next/image";

export type MascotPose = "hero" | "explore" | "discover" | "code" | "build" | "launch" | "grow";

const ALT: Record<MascotPose, string> = {
  hero: "Ruyalab's vision mascot — a bright eye wrapped in orbit lines",
  explore: "Ruyalab mascot exploring, beside a compass diamond",
  discover: "Ruyalab mascot discovering, holding a magnifying glass",
  code: "Ruyalab mascot coding, beside a code bracket screen",
  build: "Ruyalab mascot building, beside a product cube",
  launch: "Ruyalab mascot launching, beside a paper rocket",
  grow: "Ruyalab mascot growing, beside a rising bar chart",
};

/** Static mascot pose from /public/mascots (1000×600 artboards, transparent). */
export function Mascot({
  pose,
  className,
  decorative = false,
  priority = false,
}: {
  pose: MascotPose;
  className?: string;
  decorative?: boolean;
  priority?: boolean;
}) {
  return (
    <Image
      src={`/mascots/${pose}.svg`}
      alt={decorative ? "" : ALT[pose]}
      width={1000}
      height={600}
      className={className}
      priority={priority}
      unoptimized
      draggable={false}
    />
  );
}
