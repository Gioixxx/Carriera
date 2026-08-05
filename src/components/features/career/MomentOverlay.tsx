"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { Flag } from "lucide-react";
import type { Award, Trophy } from "@/types/career";
import { AWARD_LABELS } from "@/lib/career/award-labels";
import { Button } from "@/components/ui/Button";
import { AwardBadge } from "./AwardBadge";
import { CompetitionBadge } from "./CompetitionBadge";

export type CareerMoment =
  | { kind: "trophy"; trophy: Trophy }
  | { kind: "award"; award: Award }
  | { kind: "callup" };

interface MomentOverlayProps {
  moment: CareerMoment;
  onContinue: () => void;
}

export function MomentOverlay({ moment, onContinue }: MomentOverlayProps) {
  const titleId = useId();
  const continueRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    continueRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onContinue();
        return;
      }
      if (event.key !== "Tab") return;
      // Single focusable control — keep focus trapped on Continua
      event.preventDefault();
      continueRef.current?.focus();
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [onContinue]);

  let eyebrow: string;
  let title: string;
  let detail: string | null = null;
  let visual: ReactNode;

  if (moment.kind === "trophy") {
    eyebrow = "Trofeo";
    title = moment.trophy.competition;
    detail = moment.trophy.club
      ? `${moment.trophy.club.name} · ${moment.trophy.age} anni`
      : `Nazionale · ${moment.trophy.age} anni`;
    visual = <CompetitionBadge competition={moment.trophy.competition} size={64} />;
  } else if (moment.kind === "award") {
    eyebrow = "Premio individuale";
    title = AWARD_LABELS[moment.award.type];
    detail = moment.award.club
      ? `${moment.award.club.name} · ${moment.award.age} anni`
      : `${moment.award.age} anni`;
    visual = <AwardBadge size={64} />;
  } else {
    eyebrow = "Nazionale";
    title = "Convocato in nazionale!";
    detail = "Hai ricevuto la chiamata del CT.";
    visual = (
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-(--color-accent)/20 text-(--color-accent)">
        <Flag size={32} aria-hidden="true" />
      </span>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="animate-moment-in flex w-full max-w-sm flex-col items-center gap-5 rounded-2xl border border-(--color-ovr-gold)/40 bg-(--color-surface) p-8 text-center shadow-2xl">
        <p className="font-display text-xs tracking-[0.35em] text-(--color-ovr-gold)">{eyebrow}</p>
        <div className="flex items-center justify-center">{visual}</div>
        <h2 id={titleId} className="font-display text-2xl text-(--color-text) sm:text-3xl">
          {title}
        </h2>
        {detail ? <p className="text-sm text-(--color-text-muted)">{detail}</p> : null}
        <Button ref={continueRef} onClick={onContinue} className="mt-1 w-full sm:w-auto">
          Continua
        </Button>
      </div>
    </div>
  );
}

export function buildCareerMoments(input: {
  newTrophies: Trophy[];
  newAward: Award | null;
  nationalCallup: boolean;
}): CareerMoment[] {
  const moments: CareerMoment[] = [];
  for (const trophy of input.newTrophies) {
    moments.push({ kind: "trophy", trophy });
  }
  if (input.newAward) {
    moments.push({ kind: "award", award: input.newAward });
  }
  if (input.nationalCallup) {
    moments.push({ kind: "callup" });
  }
  return moments;
}
