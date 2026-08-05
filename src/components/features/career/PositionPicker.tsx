"use client";

import { cn } from "@/lib/utils";
import type { Position } from "@/types/career";

interface PositionPickerProps {
  value: Position | null;
  onChange: (position: Position) => void;
  compact?: boolean;
  className?: string;
}

const PITCH_ROWS: Position[][] = [
  ["LW", "ST", "RW"],
  ["CAM"],
  ["LM", "CM", "RM"],
  ["CDM"],
  ["LB", "CB", "RB"],
  ["GK"],
];

export function PositionPicker({
  value,
  onChange,
  compact = false,
  className,
}: PositionPickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Ruolo in campo"
      className={cn(
        "relative flex min-h-0 min-w-0 flex-col justify-between rounded-xl border-2 border-white/25 bg-(--color-pitch)",
        compact ? "gap-1 p-2" : "gap-2 p-3 sm:gap-3 sm:p-4",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-white/15"
        aria-hidden="true"
      />
      <div
        className={cn(
          "pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15",
          compact ? "h-10 w-10" : "h-12 w-12 sm:h-16 sm:w-16",
        )}
        aria-hidden="true"
      />
      {PITCH_ROWS.map((row, i) => (
        <div
          key={i}
          className={cn("relative z-10 flex justify-center", compact ? "gap-1.5" : "gap-2 sm:gap-3")}
        >
          {row.map((position) => {
            const selected = position === value;
            return (
              <button
                key={position}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onChange(position)}
                className={cn(
                  "flex shrink-0 items-center justify-center rounded-full font-bold",
                  "transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)",
                  compact
                    ? "h-7 w-9 text-[10px]"
                    : "h-8 w-10 text-[11px] sm:h-9 sm:w-12 sm:text-xs",
                  selected
                    ? "scale-105 bg-(--color-accent) text-[#1b2320] shadow-md"
                    : "bg-white/10 text-white hover:bg-white/20",
                )}
              >
                {position}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
