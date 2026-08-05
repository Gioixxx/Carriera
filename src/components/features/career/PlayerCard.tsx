"use client";

import { useEffect, useRef, useState } from "react";
import { Award as AwardIcon, HeartCrack, Trophy as TrophyIcon } from "lucide-react";
import type { Player } from "@/types/career";
import { countries } from "@/data/countries";
import { useCountUp } from "@/hooks/useMotion";
import { cn } from "@/lib/utils";
import { ClubCrest } from "./ClubCrest";
import { JerseyBadge } from "./JerseyBadge";
import { OvrBadge } from "./OvrBadge";
import { PopularityMeter } from "./PopularityMeter";

interface PlayerCardProps {
  player: Player;
  /** Compact layout for mobile playing shell */
  compact?: boolean;
}

const VALUE_FORMATTER = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function PlayerCard({ player, compact = false }: PlayerCardProps) {
  const country = countries.find((c) => c.name === player.nationality);
  const trophyCount = player.trophies.length;
  const awardCount = player.awards.length;

  const displayOvr = useCountUp(player.ovr, 800);
  const displayApps = useCountUp(player.career.apps, 800);
  const displayGoals = useCountUp(player.career.goals, 800);
  const displayAssists = useCountUp(player.career.assists, 800);

  const prevCounts = useRef({ trophies: trophyCount, awards: awardCount });
  const [flashTrophies, setFlashTrophies] = useState(false);
  const [flashAwards, setFlashAwards] = useState(false);

  useEffect(() => {
    const prev = prevCounts.current;
    let trophyTimer: ReturnType<typeof setTimeout> | undefined;
    let awardTimer: ReturnType<typeof setTimeout> | undefined;

    if (trophyCount > prev.trophies) {
      setFlashTrophies(true);
      trophyTimer = setTimeout(() => setFlashTrophies(false), 1200);
    }
    if (awardCount > prev.awards) {
      setFlashAwards(true);
      awardTimer = setTimeout(() => setFlashAwards(false), 1200);
    }
    prevCounts.current = { trophies: trophyCount, awards: awardCount };

    return () => {
      if (trophyTimer) clearTimeout(trophyTimer);
      if (awardTimer) clearTimeout(awardTimer);
    };
  }, [trophyCount, awardCount]);

  return (
    <div
      className={cn(
        "dossier-perforated flex flex-col rounded-2xl border border-(--color-accent)/30 bg-(--color-surface-raised) shadow-lg shadow-black/5",
        compact ? "gap-2.5 p-3 sm:p-4" : "gap-4 p-5",
      )}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <JerseyBadge number={player.number} country={country} size="sm" />
        <div className="min-w-0 flex-1">
          <span className="rounded bg-(--color-surface) px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-(--color-text-muted) uppercase">
            {player.position}
          </span>
          {player.injury ? (
            <span
              className="ml-1.5 inline-flex items-center gap-1 rounded bg-(--color-error)/15 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-(--color-error) uppercase"
              title={`${player.injury.label} — fuori per ${player.injury.turnsRemaining} ${player.injury.turnsRemaining === 1 ? "ciclo" : "cicli"}`}
            >
              <HeartCrack size={10} aria-hidden="true" />
              Infortunato
            </span>
          ) : null}
          <p
            className={cn(
              "font-display truncate leading-tight text-(--color-text)",
              compact ? "text-xl" : "text-2xl",
            )}
          >
            {player.lastName.toUpperCase()}
          </p>
          <p className="flex items-center gap-1.5 truncate text-xs text-(--color-text-muted)">
            {player.club ? (
              <ClubCrest crestUrl={player.club.crestUrl} clubName={player.club.name} size={14} />
            ) : null}
            {player.club ? player.club.name : "Svincolato"} · {player.age} anni
          </p>
        </div>
        <OvrBadge ovr={displayOvr} />
      </div>

      <div className="flex flex-col gap-1.5 rounded-lg bg-(--color-surface) px-3 py-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-(--color-text-muted)">Valore</span>
          <span className="font-semibold text-(--color-text)">
            {VALUE_FORMATTER.format(player.marketValueEur)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-(--color-text-muted)">Patrimonio</span>
          <span className="font-semibold text-(--color-text)">
            {VALUE_FORMATTER.format(player.wallet.savingsEur)}
          </span>
        </div>
        <PopularityMeter value={player.popularity} />
      </div>

      <div className={cn("grid grid-cols-3 gap-2 text-center", compact && "hidden sm:grid")}>
        <div className="rounded-lg bg-(--color-surface) py-2">
          <p className="font-display text-lg text-(--color-text)">{displayApps}</p>
          <p className="text-[10px] tracking-wide text-(--color-text-muted) uppercase">Pres.</p>
        </div>
        <div className="rounded-lg bg-(--color-surface) py-2">
          <p className="font-display text-lg text-(--color-text)">{displayGoals}</p>
          <p className="text-[10px] tracking-wide text-(--color-text-muted) uppercase">Gol</p>
        </div>
        <div className="rounded-lg bg-(--color-surface) py-2">
          <p className="font-display text-lg text-(--color-text)">{displayAssists}</p>
          <p className="text-[10px] tracking-wide text-(--color-text-muted) uppercase">Assist</p>
        </div>
      </div>

      {compact ? (
        <div className="flex items-center justify-between gap-2 text-xs sm:hidden">
          <span className="text-(--color-text-muted)">
            {VALUE_FORMATTER.format(player.marketValueEur)}
          </span>
          <span className="text-(--color-text-muted)">
            {displayApps}P · {displayGoals}G · {displayAssists}A
          </span>
        </div>
      ) : null}

      <div
        className={cn(
          "flex items-center gap-4 border-t border-(--color-border) text-xs",
          compact ? "pt-2" : "pt-3",
        )}
      >
        <span
          className={cn(
            "flex items-center gap-1.5 rounded-md px-1.5 py-0.5 transition-colors",
            flashTrophies && "animate-count-flash bg-(--color-ovr-gold)/20",
          )}
          title={trophyCount > 0 ? `${trophyCount} trofei vinti` : "Nessun trofeo vinto finora"}
        >
          <TrophyIcon
            size={14}
            aria-hidden="true"
            className={trophyCount > 0 ? "text-(--color-ovr-gold)" : "text-(--color-text-muted)"}
          />
          <span
            className={
              trophyCount > 0 ? "font-semibold text-(--color-text)" : "text-(--color-text-muted)"
            }
          >
            {trophyCount} {trophyCount === 1 ? "trofeo" : "trofei"}
          </span>
        </span>
        <span
          className={cn(
            "flex items-center gap-1.5 rounded-md px-1.5 py-0.5 transition-colors",
            flashAwards && "animate-count-flash bg-(--color-ovr-gold)/20",
          )}
          title={
            awardCount > 0 ? `${awardCount} premi individuali` : "Nessun premio individuale finora"
          }
        >
          <AwardIcon
            size={14}
            aria-hidden="true"
            className={awardCount > 0 ? "text-(--color-ovr-gold)" : "text-(--color-text-muted)"}
          />
          <span
            className={
              awardCount > 0 ? "font-semibold text-(--color-text)" : "text-(--color-text-muted)"
            }
          >
            {awardCount} {awardCount === 1 ? "premio" : "premi"}
          </span>
        </span>
      </div>
    </div>
  );
}
