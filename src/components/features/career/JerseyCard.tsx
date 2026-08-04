import { cn } from "@/lib/utils";

interface JerseyCardProps {
  lastName: string;
  number: number | null;
  flag?: string;
  className?: string;
}

const JERSEY_CLIP_PATH =
  "polygon(50% 0%, 80% 0%, 100% 20%, 85% 35%, 85% 100%, 15% 100%, 15% 35%, 0% 20%, 20% 0%)";

export function JerseyCard({ lastName, number, flag, className }: JerseyCardProps) {
  const displayName = lastName.trim() ? lastName.trim().toUpperCase() : "COGNOME";
  const displayNumber = number && number > 0 ? number : "—";
  const serial = String(number && number > 0 ? number : 0).padStart(6, "0");

  return (
    <div
      className={cn(
        "dossier-perforated flex flex-col items-center gap-4 rounded-2xl border border-(--color-accent)/40",
        "bg-(--color-surface-raised) px-6 pt-5 pb-6",
        className,
      )}
    >
      <span className="font-display text-xs tracking-[0.25em] text-(--color-accent)">
        Cartellino del giocatore
      </span>

      <div
        className="relative flex h-36 w-36 items-center justify-center bg-(--color-pitch) text-white"
        style={{ clipPath: JERSEY_CLIP_PATH }}
      >
        {flag ? (
          <span className="absolute top-7 text-base" aria-hidden="true">
            {flag}
          </span>
        ) : null}
        <span className="font-display text-5xl leading-none">{displayNumber}</span>
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <p className="font-display max-w-[12rem] truncate text-xl text-(--color-text)">
          {displayName}
        </p>
        <p className="text-[10px] font-medium tracking-[0.3em] text-(--color-text-muted) uppercase">
          Nº tesserino {serial}
        </p>
      </div>
    </div>
  );
}
