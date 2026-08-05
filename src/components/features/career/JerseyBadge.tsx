import { cn } from "@/lib/utils";

interface JerseyBadgeProps {
  number: number | string;
  flag?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const JERSEY_CLIP_PATH =
  "polygon(50% 0%, 80% 0%, 100% 20%, 85% 35%, 85% 100%, 15% 100%, 15% 35%, 0% 20%, 20% 0%)";

/** Sagoma di maglietta condivisa tra il cartellino di creazione e la card giocatore in partita. */
export function JerseyBadge({ number, flag, size = "lg", className }: JerseyBadgeProps) {
  const sizeClass =
    size === "lg" ? "h-36 w-36" : size === "md" ? "h-24 w-24" : "h-16 w-16";
  const flagClass =
    size === "lg" ? "top-7 text-base" : size === "md" ? "top-5 text-sm" : "top-3 text-[9px]";
  const numberClass =
    size === "lg" ? "text-5xl" : size === "md" ? "text-3xl" : "text-xl";

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center bg-(--color-pitch) text-white",
        sizeClass,
        className,
      )}
      style={{ clipPath: JERSEY_CLIP_PATH }}
    >
      {flag ? (
        <span className={cn("absolute", flagClass)} aria-hidden="true">
          {flag}
        </span>
      ) : null}
      <span className={cn("font-display leading-none", numberClass)}>{number}</span>
    </div>
  );
}
