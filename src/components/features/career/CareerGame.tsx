"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GameSpeed, PlayerIdentity } from "@/types/career";
import { useCareerGame, type CycleOutcomeSummary } from "@/hooks/useCareerGame";
import { AWARD_LABELS } from "@/lib/career/award-labels";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { AwardBadge } from "./AwardBadge";
import { CareerSummary } from "./CareerSummary";
import { CareerTable } from "./CareerTable";
import { CareerTimeline } from "./CareerTimeline";
import { CompetitionBadge } from "./CompetitionBadge";
import { DecisionPanel } from "./DecisionPanel";
import { IdentityForm } from "./IdentityForm";
import { buildCareerMoments, MomentOverlay, type CareerMoment } from "./MomentOverlay";
import { OfferPanel } from "./OfferPanel";
import { PenaltyShootout } from "./PenaltyShootout";
import { PlayerCard } from "./PlayerCard";
import { SpeedSelect } from "./SpeedSelect";

type Step = "speed" | "identity";
type ResolvePhase = "moments" | "outcome" | null;

function OutcomeBanner({
  outcome,
  onContinue,
}: {
  outcome: CycleOutcomeSummary;
  onContinue: () => void;
}) {
  return (
    <Card className="animate-step-in flex flex-col gap-3 border-(--color-accent)/40 p-4 sm:p-5">
      <div>
        <p className="font-display text-xs tracking-[0.3em] text-(--color-accent)">Esito</p>
        <p className="font-semibold text-(--color-text)">{outcome.optionLabel}</p>
        <p className="mt-1 text-sm text-(--color-text-muted)">{outcome.outcomeText}</p>
      </div>

      {outcome.nationalCallup ? (
        <p className="text-sm font-medium text-(--color-accent)">Convocato in nazionale!</p>
      ) : null}

      {outcome.newTrophies.length > 0 ? (
        <ul className="flex flex-col gap-1.5">
          {outcome.newTrophies.map((trophy, i) => (
            <li
              key={i}
              className="flex items-center gap-2 text-sm font-medium text-(--color-ovr-gold)"
            >
              <CompetitionBadge competition={trophy.competition} size={18} />
              <span>Vinci: {trophy.competition}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {outcome.newAward ? (
        <p className="flex items-center gap-2 text-sm font-medium text-(--color-ovr-gold)">
          <AwardBadge size={18} />
          {AWARD_LABELS[outcome.newAward.type]}
        </p>
      ) : null}

      <Button onClick={onContinue} className="self-start">
        Continua
      </Button>
    </Card>
  );
}

function SetupStepDots({ current }: { current: Step }) {
  return (
    <div className="flex justify-center gap-2" aria-hidden="true">
      <div
        className={cn(
          "h-1 w-5 rounded-full transition-colors duration-150",
          current === "speed" ? "bg-(--color-accent)" : "bg-(--color-border)",
        )}
      />
      <div
        className={cn(
          "h-1 w-5 rounded-full transition-colors duration-150",
          current === "identity" ? "bg-(--color-accent)" : "bg-(--color-border)",
        )}
      />
    </div>
  );
}

export function CareerGame() {
  const [step, setStep] = useState<Step>("speed");
  const [speed, setSpeed] = useState<GameSpeed | null>(null);
  const { state, startCareer, chooseOption, restart, isResuming } = useCareerGame();

  const [resolvePhase, setResolvePhase] = useState<ResolvePhase>(null);
  const [moments, setMoments] = useState<CareerMoment[]>([]);
  const [momentIndex, setMomentIndex] = useState(0);
  const seenOutcome = useRef<CycleOutcomeSummary | null>(null);

  const showPlaying = state !== null;
  const isRetired = state?.retired ?? false;
  const awaitingResolve = resolvePhase !== null;

  useEffect(() => {
    const outcome = state?.lastOutcome ?? null;
    if (outcome === seenOutcome.current) return;
    seenOutcome.current = outcome;

    if (!outcome) {
      setResolvePhase(null);
      setMoments([]);
      setMomentIndex(0);
      return;
    }

    const nextMoments = buildCareerMoments(outcome);
    setMoments(nextMoments);
    setMomentIndex(0);
    setResolvePhase(nextMoments.length > 0 ? "moments" : "outcome");
  }, [state?.lastOutcome]);

  const handleSpeedSelected = useCallback((selected: GameSpeed) => {
    setSpeed(selected);
    setStep("identity");
  }, []);

  const handleIdentitySubmitted = useCallback(
    (identity: PlayerIdentity) => {
      if (!speed) return;
      startCareer(identity, speed);
    },
    [speed, startCareer],
  );

  const handleRestart = useCallback(() => {
    restart();
    setSpeed(null);
    setStep("speed");
    setResolvePhase(null);
    setMoments([]);
    setMomentIndex(0);
    seenOutcome.current = null;
  }, [restart]);

  const handleMomentContinue = useCallback(() => {
    if (momentIndex + 1 < moments.length) {
      setMomentIndex((i) => i + 1);
      return;
    }
    setResolvePhase("outcome");
  }, [momentIndex, moments.length]);

  const handleOutcomeContinue = useCallback(() => {
    setResolvePhase(null);
  }, []);

  const decisionUsesOffers =
    state?.currentDecision?.options.some((o) => o.club || o.retire) ?? false;

  const currentMoment = resolvePhase === "moments" ? moments[momentIndex] ?? null : null;
  const showDecision =
    Boolean(state && !state.retired && state.currentDecision && !awaitingResolve);
  const showOutcome = Boolean(state?.lastOutcome && resolvePhase === "outcome");
  const showSummary = Boolean(state?.retired && !awaitingResolve);
  const showPlayShell = Boolean(state && (!isRetired || awaitingResolve));

  const isSetup = !showPlaying;
  const isIdentity = isSetup && step === "identity";
  const outcomeKey = state?.lastOutcome
    ? `${state.player.age}-${state.lastOutcome.optionLabel}-${state.lastOutcome.outcomeText}`
    : "none";
  const decisionKey = state?.currentDecision
    ? `${state.player.age}-${state.currentDecision.id}`
    : "none";

  return (
    <div
      className={cn(
        "mx-auto flex w-full min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden px-4",
        showPlayShell
          ? "max-w-6xl gap-2 overflow-hidden py-2 sm:gap-3 sm:py-3"
          : showSummary
            ? "max-w-6xl gap-2 overflow-y-auto py-2 sm:gap-3 sm:py-3 lg:overflow-hidden"
            : isIdentity
              ? "max-w-5xl gap-2 overflow-hidden py-2 sm:py-3"
              : "max-w-3xl gap-3 overflow-y-auto py-4 sm:py-6",
      )}
    >
      {showPlaying ? (
        <header className="flex shrink-0 items-center justify-between gap-4">
          <p className="font-display text-lg tracking-[0.2em] text-(--color-accent)">CARRIERA</p>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={handleRestart} className="px-0 text-xs">
              Ricomincia
            </Button>
            <ThemeToggle />
          </div>
        </header>
      ) : (
        <header className="flex shrink-0 flex-col gap-2">
          <div className="flex justify-end">
            <ThemeToggle />
          </div>
          <div className="text-center">
            <p className="font-display text-[10px] tracking-[0.35em] text-(--color-accent)">
              Carriera
            </p>
            <h1 className="font-display text-2xl text-(--color-text) sm:text-3xl">
              {isIdentity ? "Crea la tua identità" : "Costruisci la tua carriera da calciatore"}
            </h1>
            {!isIdentity ? (
              <p className="mt-0.5 text-sm text-(--color-text-muted)">
                Scegli chi sei, affronta le decisioni che contano, scrivi la tua leggenda.
              </p>
            ) : (
              <p className="mt-0.5 font-display text-xs tracking-[0.3em] text-(--color-accent)">
                Passo 2 di 2
              </p>
            )}
          </div>
          <SetupStepDots current={step} />
        </header>
      )}

      {isResuming ? (
        <p className="text-center text-sm text-(--color-text-muted)">Caricamento…</p>
      ) : (
        <>
          {!showPlaying && step === "speed" ? (
            <Card key="step-speed" className="animate-step-in p-5 sm:p-7">
              <SpeedSelect onSelect={handleSpeedSelected} />
            </Card>
          ) : null}

          {!showPlaying && step === "identity" ? (
            <Card
              key="step-identity"
              className="animate-step-in flex min-h-0 flex-1 flex-col overflow-y-auto p-3 sm:p-5 lg:overflow-hidden"
            >
              <IdentityForm onSubmit={handleIdentitySubmitted} />
            </Card>
          ) : null}

          {showPlayShell && state ? (
            <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
              <CareerTimeline player={state.player} />

              <div className="grid min-h-0 min-w-0 flex-1 gap-3 lg:grid-cols-[18rem_1fr] lg:items-stretch xl:grid-cols-[20rem_1fr]">
                <div className="min-w-0 shrink-0 lg:max-h-full lg:overflow-y-auto">
                  <PlayerCard player={state.player} compact />
                </div>

                <div className="flex min-h-0 min-w-0 flex-col gap-3">
                  <div className="min-w-0 shrink-0">
                    {showOutcome && state.lastOutcome ? (
                      <OutcomeBanner
                        key={`outcome-${outcomeKey}`}
                        outcome={state.lastOutcome}
                        onContinue={handleOutcomeContinue}
                      />
                    ) : null}

                    {showDecision && state.currentDecision ? (
                      <Card
                        key={`decision-${decisionKey}`}
                        className="animate-step-in p-4 shadow-lg shadow-black/5 sm:p-5"
                      >
                        {state.currentCategory === "continental-final" ? (
                          <PenaltyShootout
                            decision={state.currentDecision}
                            onChoose={chooseOption}
                          />
                        ) : decisionUsesOffers ? (
                          <OfferPanel decision={state.currentDecision} onChoose={chooseOption} />
                        ) : (
                          <DecisionPanel
                            decision={state.currentDecision}
                            onChoose={chooseOption}
                          />
                        )}
                      </Card>
                    ) : null}
                  </div>

                  <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
                    <p className="shrink-0 font-display text-xs tracking-[0.2em] text-(--color-text-muted) uppercase">
                      Storico
                    </p>
                    <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
                      <CareerTable
                        player={state.player}
                        pendingLabel={
                          awaitingResolve && !isRetired ? "Prossimo ciclo…" : undefined
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {showSummary && state ? (
            <CareerSummary
              key={`summary-${state.player.lastName}-${state.player.age}`}
              player={state.player}
              onRestart={handleRestart}
            />
          ) : null}
        </>
      )}

      {currentMoment ? (
        <MomentOverlay
          key={`moment-${momentIndex}-${currentMoment.kind}`}
          moment={currentMoment}
          onContinue={handleMomentContinue}
        />
      ) : null}
    </div>
  );
}
