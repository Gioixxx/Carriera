"use client";

import { useState } from "react";
import type { GameSpeed, Player, PlayerIdentity } from "@/types/career";
import { createPlayer } from "@/lib/career/engine";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { countries } from "@/data/countries";
import { IdentityForm } from "./IdentityForm";
import { SPEED_LABELS, SpeedSelect } from "./SpeedSelect";

type Step = "speed" | "identity" | "created";

export function CareerGame() {
  const [step, setStep] = useState<Step>("speed");
  const [speed, setSpeed] = useState<GameSpeed | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);

  function handleSpeedSelected(selected: GameSpeed) {
    setSpeed(selected);
    setStep("identity");
  }

  function handleIdentitySubmitted(identity: PlayerIdentity) {
    setPlayer(createPlayer(identity));
    setStep("created");
  }

  function handleRestart() {
    setStep("speed");
    setPlayer(null);
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:py-16">
      <header className="text-center">
        <p className="font-display text-xs tracking-[0.35em] text-(--color-accent)">Carriera</p>
        <h1 className="font-display text-4xl text-(--color-text) sm:text-5xl">
          Costruisci la tua carriera da calciatore
        </h1>
        <p className="mt-2 text-(--color-text-muted)">
          Scegli chi sei, affronta le decisioni che contano, scrivi la tua leggenda.
        </p>
      </header>

      {step === "speed" ? (
        <Card className="animate-step-in p-6 sm:p-10">
          <SpeedSelect onSelect={handleSpeedSelected} />
        </Card>
      ) : null}

      {step === "identity" ? (
        <Card className="animate-step-in p-6 sm:p-10">
          <IdentityForm onSubmit={handleIdentitySubmitted} />
        </Card>
      ) : null}

      {step === "created" && player ? (
        <Card className="animate-step-in flex flex-col items-center gap-3 p-10 text-center">
          <p className="font-display text-xs tracking-[0.35em] text-(--color-accent)">
            Tesseramento completato
          </p>
          <h2 className="font-display text-3xl text-(--color-text)">
            {player.lastName.toUpperCase()}{" "}
            <span aria-hidden="true">
              {countries.find((c) => c.name === player.nationality)?.flag}
            </span>
          </h2>
          <p className="text-(--color-text-muted)">
            {player.position} · {player.age} anni · OVR {player.ovr} · Svincolato
          </p>
          <p className="text-xs tracking-wide text-(--color-text-muted) uppercase">
            Carriera {speed ? SPEED_LABELS[speed] : ""}
          </p>
          <p className="max-w-sm text-sm text-(--color-text-muted)">
            La prossima fase dello sviluppo porterà le offerte del settore giovanile e il resto
            della carriera.
          </p>
          <Button variant="secondary" onClick={handleRestart}>
            Ricomincia
          </Button>
        </Card>
      ) : null}
    </div>
  );
}
