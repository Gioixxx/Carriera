"use client";

import type { Decision } from "@/types/career";
import { cn } from "@/lib/utils";

interface DecisionPanelProps {
  decision: Decision;
  onChoose: (optionId: string) => void;
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
              "flex flex-col items-start gap-1 rounded-lg border border-(--color-border) bg-(--color-surface-raised) p-4 text-left",
              "transition-all duration-150 hover:-translate-y-0.5 hover:border-(--color-accent) hover:shadow-md",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)",
            )}
          >
            <span className="text-sm font-semibold text-(--color-text)">{option.label}</span>
            {option.hint ? (
              <span className="text-xs text-(--color-text-muted)">{option.hint}</span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
