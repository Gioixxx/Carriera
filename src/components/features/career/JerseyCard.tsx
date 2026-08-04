import { cn } from "@/lib/utils";
import { JerseyBadge } from "./JerseyBadge";

interface JerseyCardProps {
  lastName: string;
  number: number | null;
  flag?: string;
  className?: string;
}

export function JerseyCard({ lastName, number, flag, className }: JerseyCardProps) {
  const displayName = lastName.trim() ? lastName.trim().toUpperCase() : "COGNOME";
  const displayNumber = number && number > 0 ? number : "—";
  const serial = String(number && number > 0 ? number : 0).padStart(6, "0");

  return (
    <div
      className={cn(
        "dossier-perforated flex flex-col items-center gap-4 rounded-2xl border border-(--color-accent)/40",
        "bg-(--color-surface-raised) px-6 pt-5 pb-6 shadow-lg shadow-black/5",
        className,
      )}
    >
      <span className="font-display text-xs tracking-[0.25em] text-(--color-accent)">
        Cartellino del giocatore
      </span>

      <JerseyBadge number={displayNumber} flag={flag} size="lg" />

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
