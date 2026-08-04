"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import type { Decision, DecisionOutcome } from "@/types/career";
import { cn } from "@/lib/utils";

interface DecisionPanelProps {
  decision: Decision;
  onChoose: (optionId: string) => void;
}

function OutcomeBadge({ outcome, showWeight }: { outcome: DecisionOutcome; showWeight: boolean }) {
  const delta = outcome.effect.ovrDelta ?? 0;
  const isPositive = delta > 0;
  const isNegative = delta < 0;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium",
        isPositive && "bg-(--color-success)/15 text-(--color-success)",
        isNegative && "bg-(--color-error)/15 text-(--color-error)",
        !isPositive && !isNegative && "bg-(--color-surface) text-(--color-text-muted)",
      )}
    >
      <span className="flex items-center gap-1">
        {isPositive ? <TrendingUp size={14} aria-hidden="true" /> : null}
        {isNegative ? <TrendingDown size={14} aria-hidden="true" /> : null}
        {outcome.resultText}
      </span>
      {showWeight ? <span>{outcome.weight}%</span> : null}
    </div>
  );
}

export function DecisionPanel({ decision, onChoose }: DecisionPanelProps) {
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
              "flex flex-col items-start gap-2 rounded-lg border border-(--color-border) bg-(--color-surface-raised) p-4 text-left",
              "transition-all duration-150 hover:-translate-y-0.5 hover:border-(--color-accent) hover:shadow-md",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)",
            )}
          >
            <span className="text-sm font-semibold text-(--color-text)">{option.label}</span>
            <div className="flex w-full flex-col gap-1.5">
              {option.outcomes.map((outcome, i) => (
                <OutcomeBadge key={i} outcome={outcome} showWeight={option.outcomes.length > 1} />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
