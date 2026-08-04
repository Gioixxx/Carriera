import { cn } from "@/lib/utils";

interface JerseyBadgeProps {
  number: number | string;
  flag?: string;
  size?: "sm" | "lg";
  className?: string;
}

const JERSEY_CLIP_PATH =
  "polygon(50% 0%, 80% 0%, 100% 20%, 85% 35%, 85% 100%, 15% 100%, 15% 35%, 0% 20%, 20% 0%)";

/** Sagoma di maglietta condivisa tra il cartellino di creazione e la card giocatore in partita. */
export function JerseyBadge({ number, flag, size = "lg", className }: JerseyBadgeProps) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center bg-(--color-pitch) text-white",
        size === "lg" ? "h-36 w-36" : "h-16 w-16",
        className,
      )}
      style={{ clipPath: JERSEY_CLIP_PATH }}
    >
      {flag ? (
        <span
          className={cn("absolute", size === "lg" ? "top-7 text-base" : "top-3 text-[9px]")}
          aria-hidden="true"
        >
          {flag}
        </span>
      ) : null}
      <span className={cn("font-display leading-none", size === "lg" ? "text-5xl" : "text-xl")}>
        {number}
      </span>
    </div>
  );
}
