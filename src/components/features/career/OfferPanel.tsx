"use client";

import type { Decision } from "@/types/career";
import { cn } from "@/lib/utils";

interface OfferPanelProps {
  decision: Decision;
  onChoose: (optionId: string) => void;
}

const PRESTIGE_STARS = "★";

export function OfferPanel({ decision, onChoose }: OfferPanelProps) {
  return (
    <div className="animate-step-in flex flex-col gap-4">
      <div>
        <p className="font-display text-xs tracking-[0.3em] text-(--color-accent)">
          {decision.title}
        </p>
        <p className="text-sm text-(--color-text-muted)">{decision.description}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {decision.options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChoose(option.id)}
            className={cn(
              "flex flex-col items-start gap-1 rounded-lg border border-(--color-border) bg-(--color-surface-raised) p-4 text-left",
              "transition-colors duration-150 hover:border-(--color-accent)",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)",
            )}
          >
            <span className="text-sm font-semibold text-(--color-text)">{option.label}</span>
            {option.club ? (
              <>
                <span className="text-xs text-(--color-text-muted)">
                  {option.club.country} · {option.club.competitions.league}
                </span>
                <span className="text-(--color-accent)" aria-label={`Prestigio ${option.club.prestige} su 3`}>
                  {PRESTIGE_STARS.repeat(option.club.prestige) || "—"}
                </span>
              </>
            ) : null}
            {option.retire ? (
              <span className="text-xs text-(--color-text-muted)">Termina la tua carriera da professionista.</span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
