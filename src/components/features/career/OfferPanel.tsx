"use client";

import { Star } from "lucide-react";
import type { Decision } from "@/types/career";
import { cn } from "@/lib/utils";
import { ClubCrest } from "./ClubCrest";

interface OfferPanelProps {
  decision: Decision;
  onChoose: (optionId: string) => void;
}

function PrestigeStars({ prestige }: { prestige: number }) {
  if (prestige <= 0) {
    return <span className="text-xs text-(--color-text-muted)">Club emergente</span>;
  }
  return (
    <span className="flex items-center gap-0.5" aria-label={`Prestigio ${prestige} su 3`}>
      {Array.from({ length: 3 }, (_, i) => (
        <Star
          key={i}
          size={13}
          aria-hidden="true"
          className={i < prestige ? "fill-(--color-accent) text-(--color-accent)" : "text-(--color-border)"}
        />
      ))}
    </span>
  );
}

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
              "flex flex-col items-start gap-1.5 rounded-lg border border-(--color-border) bg-(--color-surface-raised) p-4 text-left",
              "transition-all duration-150 hover:-translate-y-0.5 hover:border-(--color-accent) hover:shadow-md",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)",
            )}
          >
            <span className="flex items-center gap-1.5 text-sm font-semibold text-(--color-text)">
              {option.club ? (
                <ClubCrest crestUrl={option.club.crestUrl} clubName={option.club.name} size={16} />
              ) : null}
              {option.label}
            </span>
            {option.club ? (
              <>
                <span className="text-xs text-(--color-text-muted)">
                  {option.club.country} · {option.club.competitions.league}
                </span>
                <PrestigeStars prestige={option.club.prestige} />
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
