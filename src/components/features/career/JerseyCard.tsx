import { cn } from "@/lib/utils";
import { JerseyBadge } from "./JerseyBadge";

interface JerseyCardProps {
  lastName: string;
  number: number | null;
  flag?: string;
  className?: string;
  /** Always compact. If false, compact on small screens and larger from lg up. */
  compact?: boolean;
}

export function JerseyCard({
  lastName,
  number,
  flag,
  className,
  compact = false,
}: JerseyCardProps) {
  const displayName = lastName.trim() ? lastName.trim().toUpperCase() : "COGNOME";
  const displayNumber = number && number > 0 ? number : "—";
  const serial = String(number && number > 0 ? number : 0).padStart(6, "0");

  return (
    <div
      className={cn(
        "dossier-perforated flex flex-col items-center rounded-2xl border border-(--color-accent)/40",
        "bg-(--color-surface-raised) shadow-lg shadow-black/5",
        compact
          ? "gap-2 px-4 py-3"
          : "gap-2 px-4 py-3 lg:gap-4 lg:px-6 lg:pt-5 lg:pb-6",
        className,
      )}
    >
      <span
        className={cn(
          "font-display tracking-[0.25em] text-(--color-accent)",
          compact ? "text-[10px]" : "text-[10px] lg:text-xs",
        )}
      >
        Cartellino
      </span>

      {compact ? (
        <JerseyBadge number={displayNumber} flag={flag} size="md" />
      ) : (
        <>
          <JerseyBadge number={displayNumber} flag={flag} size="md" className="lg:hidden" />
          <JerseyBadge number={displayNumber} flag={flag} size="lg" className="hidden lg:flex" />
        </>
      )}

      <div className="flex flex-col items-center gap-0.5 text-center">
        <p
          className={cn(
            "font-display max-w-[10rem] truncate text-(--color-text)",
            compact ? "text-lg" : "text-lg lg:text-xl",
          )}
        >
          {displayName}
        </p>
        <p className="text-[10px] font-medium tracking-[0.25em] text-(--color-text-muted) uppercase">
          Nº {serial}
        </p>
      </div>
    </div>
  );
}
