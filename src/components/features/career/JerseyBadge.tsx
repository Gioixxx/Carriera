import type { Country } from "@/data/countries";
import { cn } from "@/lib/utils";
import { CountryFlag } from "./CountryFlag";

interface JerseyBadgeProps {
  number: number | string;
  country?: Country;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const JERSEY_CLIP_PATH =
  "polygon(50% 0%, 80% 0%, 100% 20%, 85% 35%, 85% 100%, 15% 100%, 15% 35%, 0% 20%, 20% 0%)";

/** Sagoma di maglietta condivisa tra il cartellino di creazione e la card giocatore in partita. */
export function JerseyBadge({ number, country, size = "lg", className }: JerseyBadgeProps) {
  const sizeClass =
    size === "lg" ? "h-36 w-36" : size === "md" ? "h-24 w-24" : "h-16 w-16";
  const flagTopClass = size === "lg" ? "top-7" : size === "md" ? "top-5" : "top-3";
  const flagSize = size === "lg" ? 24 : size === "md" ? 18 : 12;
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
      {country ? (
        <span className={cn("absolute", flagTopClass)}>
          <CountryFlag
            code={country.code}
            name={country.name}
            fallbackEmoji={country.flag}
            size={flagSize}
            className="shadow-sm"
          />
        </span>
      ) : null}
      <span className={cn("font-display leading-none", numberClass)}>{number}</span>
    </div>
  );
}
