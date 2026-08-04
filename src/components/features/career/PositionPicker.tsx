"use client";

import { cn } from "@/lib/utils";
import type { Position } from "@/types/career";

interface PositionPickerProps {
  value: Position | null;
  onChange: (position: Position) => void;
}

const PITCH_ROWS: Position[][] = [
  ["LW", "ST", "RW"],
  ["CAM"],
  ["LM", "CM", "RM"],
  ["CDM"],
  ["LB", "CB", "RB"],
  ["GK"],
];

export function PositionPicker({ value, onChange }: PositionPickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Ruolo in campo"
      className="relative flex flex-col justify-between gap-3 rounded-xl border-2 border-white/25 bg-(--color-pitch) p-4"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-white/15"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15"
        aria-hidden="true"
      />
      {PITCH_ROWS.map((row, i) => (
        <div key={i} className="relative z-10 flex justify-center gap-3">
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
                  "flex h-10 w-14 items-center justify-center rounded-full text-xs font-bold",
                  "transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)",
                  selected
                    ? "scale-110 bg-(--color-accent) text-[#1b2320] shadow-md"
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
