import type { Player } from "@/types/career";
import { countries } from "@/data/countries";
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

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-(--color-border) bg-(--color-surface) p-5">
      <div className="flex items-center gap-4">
        <OvrBadge ovr={player.ovr} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span aria-hidden="true">{flag}</span>
            <span className="rounded bg-(--color-surface-raised) px-1.5 py-0.5 text-xs font-semibold text-(--color-text-muted)">
              #{player.number} {player.position}
            </span>
          </div>
          <p className="font-display truncate text-2xl text-(--color-text)">
            {player.club ? player.club.name : "Svincolato"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-(--color-text-muted)">Età</p>
          <p className="font-display text-xl text-(--color-text)">{player.age}</p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-(--color-border) pt-3 text-sm">
        <p className="text-(--color-text-muted)">
          Valore <span className="font-semibold text-(--color-text)">{VALUE_FORMATTER.format(player.marketValueEur)}</span>
        </p>
        <div className="flex gap-4">
          <span>
            <span className="font-semibold text-(--color-text)">{player.career.apps}</span>{" "}
            <span className="text-(--color-text-muted)">pres.</span>
          </span>
          <span>
            <span className="font-semibold text-(--color-text)">{player.career.goals}</span>{" "}
            <span className="text-(--color-text-muted)">gol</span>
          </span>
          <span>
            <span className="font-semibold text-(--color-text)">{player.career.assists}</span>{" "}
            <span className="text-(--color-text-muted)">assist</span>
          </span>
        </div>
      </div>
    </div>
  );
}
