import { Award as AwardIcon, Trophy as TrophyIcon } from "lucide-react";
import type { Player } from "@/types/career";
import { countries } from "@/data/countries";
import { JerseyBadge } from "./JerseyBadge";
import { OvrBadge } from "./OvrBadge";

interface PlayerCardProps {
  player: Player;
}

const VALUE_FORMATTER = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function PlayerCard({ player }: PlayerCardProps) {
  const flag = countries.find((c) => c.name === player.nationality)?.flag;
  const trophyCount = player.trophies.length;
  const awardCount = player.awards.length;

  return (
    <div className="dossier-perforated flex flex-col gap-4 rounded-2xl border border-(--color-accent)/30 bg-(--color-surface-raised) p-5 shadow-lg shadow-black/5">
      <div className="flex items-center gap-4">
        <JerseyBadge number={player.number} flag={flag} size="sm" />
        <div className="min-w-0 flex-1">
          <span className="rounded bg-(--color-surface) px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-(--color-text-muted) uppercase">
            {player.position}
          </span>
          <p className="font-display truncate text-2xl leading-tight text-(--color-text)">
            {player.lastName.toUpperCase()}
          </p>
          <p className="truncate text-xs text-(--color-text-muted)">
            {player.club ? player.club.name : "Svincolato"} · {player.age} anni
          </p>
        </div>
        <OvrBadge ovr={player.ovr} />
      </div>

      <div className="flex items-center justify-between rounded-lg bg-(--color-surface) px-3 py-2 text-sm">
        <span className="text-(--color-text-muted)">Valore</span>
        <span className="font-semibold text-(--color-text)">
          {VALUE_FORMATTER.format(player.marketValueEur)}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-(--color-surface) py-2">
          <p className="font-display text-lg text-(--color-text)">{player.career.apps}</p>
          <p className="text-[10px] tracking-wide text-(--color-text-muted) uppercase">Pres.</p>
        </div>
        <div className="rounded-lg bg-(--color-surface) py-2">
          <p className="font-display text-lg text-(--color-text)">{player.career.goals}</p>
          <p className="text-[10px] tracking-wide text-(--color-text-muted) uppercase">Gol</p>
        </div>
        <div className="rounded-lg bg-(--color-surface) py-2">
          <p className="font-display text-lg text-(--color-text)">{player.career.assists}</p>
          <p className="text-[10px] tracking-wide text-(--color-text-muted) uppercase">Assist</p>
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-(--color-border) pt-3 text-xs">
        <span
          className="flex items-center gap-1.5"
          title={trophyCount > 0 ? `${trophyCount} trofei vinti` : "Nessun trofeo vinto finora"}
        >
          <TrophyIcon
            size={14}
            aria-hidden="true"
            className={trophyCount > 0 ? "text-(--color-ovr-gold)" : "text-(--color-text-muted)"}
          />
          <span className={trophyCount > 0 ? "font-semibold text-(--color-text)" : "text-(--color-text-muted)"}>
            {trophyCount} {trophyCount === 1 ? "trofeo" : "trofei"}
          </span>
        </span>
        <span
          className="flex items-center gap-1.5"
          title={awardCount > 0 ? `${awardCount} premi individuali` : "Nessun premio individuale finora"}
        >
          <AwardIcon
            size={14}
            aria-hidden="true"
            className={awardCount > 0 ? "text-(--color-ovr-gold)" : "text-(--color-text-muted)"}
          />
          <span className={awardCount > 0 ? "font-semibold text-(--color-text)" : "text-(--color-text-muted)"}>
            {awardCount} {awardCount === 1 ? "premio" : "premi"}
          </span>
        </span>
      </div>
    </div>
  );
}
