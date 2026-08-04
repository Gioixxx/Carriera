"use client";

import { useState } from "react";
import type { GameSpeed, PlayerIdentity } from "@/types/career";
import { useCareerGame } from "@/hooks/useCareerGame";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { CareerTable } from "./CareerTable";
import { DecisionPanel } from "./DecisionPanel";
import { IdentityForm } from "./IdentityForm";
import { OfferPanel } from "./OfferPanel";
import { PenaltyShootout } from "./PenaltyShootout";
import { PlayerCard } from "./PlayerCard";
import { SpeedSelect } from "./SpeedSelect";

type Step = "speed" | "identity";

export function CareerGame() {
  const [step, setStep] = useState<Step>("speed");
  const [speed, setSpeed] = useState<GameSpeed | null>(null);
  const { state, startCareer, chooseOption, restart, isResuming } = useCareerGame();

  // Una volta che esiste uno stato di carriera (nuova o ripresa da localStorage), la UI passa
  // sempre alla schermata di gioco — nessun effect necessario, si deriva direttamente dal render.
  const showPlaying = state !== null;

  function handleSpeedSelected(selected: GameSpeed) {
    setSpeed(selected);
    setStep("identity");
  }

  function handleIdentitySubmitted(identity: PlayerIdentity) {
    if (!speed) return;
    startCareer(identity, speed);
  }

  function handleRestart() {
    restart();
    setSpeed(null);
    setStep("speed");
  }

  const decisionUsesOffers =
    state?.currentDecision?.options.some((o) => o.club || o.retire) ?? false;

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-col gap-8 px-4 py-10 sm:py-16",
        showPlaying ? "max-w-6xl" : "max-w-3xl",
      )}
    >
      {showPlaying ? (
        <header className="flex items-baseline justify-between">
          <p className="font-display text-lg tracking-[0.2em] text-(--color-accent)">CARRIERA</p>
          <Button variant="ghost" onClick={handleRestart} className="px-0 text-xs">
            Ricomincia
          </Button>
        </header>
      ) : (
        <header className="text-center">
          <p className="font-display text-xs tracking-[0.35em] text-(--color-accent)">Carriera</p>
          <h1 className="font-display text-4xl text-(--color-text) sm:text-5xl">
            Costruisci la tua carriera da calciatore
          </h1>
          <p className="mt-2 text-(--color-text-muted)">
            Scegli chi sei, affronta le decisioni che contano, scrivi la tua leggenda.
          </p>
        </header>
      )}

      {isResuming ? (
        <p className="text-center text-sm text-(--color-text-muted)">Caricamento…</p>
      ) : (
        <>
          {!showPlaying && step === "speed" ? (
            <Card className="animate-step-in p-6 sm:p-10">
              <SpeedSelect onSelect={handleSpeedSelected} />
            </Card>
          ) : null}

          {!showPlaying && step === "identity" ? (
            <Card className="animate-step-in p-6 sm:p-10">
              <IdentityForm onSubmit={handleIdentitySubmitted} />
            </Card>
          ) : null}

          {showPlaying && state ? (
            <div className="grid gap-6 lg:grid-cols-[22rem_1fr] lg:items-start">
              <div className="lg:sticky lg:top-8">
                <PlayerCard player={state.player} />
              </div>

              <div className="flex flex-col gap-6">
                {state.lastOutcome ? (
                  <Card className="animate-step-in border-(--color-accent)/40 p-4 text-sm">
                    <p className="font-semibold text-(--color-text)">{state.lastOutcome.optionLabel}</p>
                    <p className="text-(--color-text-muted)">{state.lastOutcome.outcomeText}</p>
                    {state.lastOutcome.nationalCallup ? (
                      <p className="mt-1 font-medium text-(--color-accent)">Convocato in nazionale!</p>
                    ) : null}
                    {state.lastOutcome.newTrophies.map((trophy, i) => (
                      <p key={i} className="mt-1 font-medium text-(--color-ovr-gold)">
                        Vinci: {trophy.competition}
                      </p>
                    ))}
                    {state.lastOutcome.newAward ? (
                      <p className="mt-1 font-medium text-(--color-ovr-gold)">Premio individuale vinto!</p>
                    ) : null}
                  </Card>
                ) : null}

                {state.retired ? (
                  <Card className="animate-step-in flex flex-col items-center gap-3 p-10 text-center">
                    <p className="font-display text-xs tracking-[0.35em] text-(--color-accent)">
                      Carriera conclusa
                    </p>
                    <h2 className="font-display text-3xl text-(--color-text)">
                      {state.player.lastName.toUpperCase()}
                    </h2>
                    <p className="text-(--color-text-muted)">
                      La schermata di riepilogo completa arriverà nella prossima fase dello sviluppo.
                    </p>
                    <Button variant="secondary" onClick={handleRestart}>
                      Ricomincia
                    </Button>
                  </Card>
                ) : null}

                {!state.retired && state.currentDecision ? (
                  <Card className="p-6 shadow-lg shadow-black/5">
                    {state.currentCategory === "continental-final" ? (
                      <PenaltyShootout decision={state.currentDecision} onChoose={chooseOption} />
                    ) : decisionUsesOffers ? (
                      <OfferPanel decision={state.currentDecision} onChoose={chooseOption} />
                    ) : (
                      <DecisionPanel decision={state.currentDecision} onChoose={chooseOption} />
                    )}
                  </Card>
                ) : null}

                <CareerTable player={state.player} />
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
