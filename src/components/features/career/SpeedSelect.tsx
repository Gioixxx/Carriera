"use client";

import { useState } from "react";
import type { GameSpeed } from "@/types/career";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

interface SpeedSelectProps {
  onSelect: (speed: GameSpeed) => void;
}

const SPEED_ORDER: GameSpeed[] = ["intense", "normal", "express"];

export const SPEED_LABELS: Record<GameSpeed, string> = {
  intense: "Intensa",
  normal: "Normale",
  express: "Rapida",
};

const SPEED_DESCRIPTIONS: Record<GameSpeed, string> = {
  intense:
    "Una decisione ogni stagione: il ritmo più serrato, per vivere ogni singolo bivio della carriera.",
  normal: "Una decisione ogni 2 stagioni: un'esperienza bilanciata tra ritmo e profondità.",
  express: "Una decisione ogni 3 stagioni: scorri veloce verso i momenti che contano davvero.",
};

export function SpeedSelect({ onSelect }: SpeedSelectProps) {
  const [speed, setSpeed] = useState<GameSpeed>("normal");

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <div>
        <p className="font-display text-xs tracking-[0.3em] text-(--color-accent)">Passo 1</p>
        <h2 className="font-display text-2xl text-(--color-text)">Scegli il ritmo di carriera</h2>
      </div>
      <SegmentedControl
        name="Ritmo di carriera"
        value={speed}
        onChange={setSpeed}
        options={SPEED_ORDER.map((s) => ({ value: s, label: SPEED_LABELS[s] }))}
      />
      <p className="max-w-sm text-sm text-(--color-text-muted)">{SPEED_DESCRIPTIONS[speed]}</p>
      <Button onClick={() => onSelect(speed)}>Inizia la carriera</Button>
    </div>
  );
}
