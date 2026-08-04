import { Trophy } from "lucide-react";
import type { Player } from "@/types/career";
import { OvrBadge } from "./OvrBadge";

interface CareerTableProps {
  player: Player;
  /** Testo del placeholder mostrato nell'ultima riga mentre si genera il prossimo ciclo. */
  pendingLabel?: string;
}

export function CareerTable({ player, pendingLabel }: CareerTableProps) {
  const trophiesByAge = new Map<number, number>();
  for (const trophy of player.trophies) {
    trophiesByAge.set(trophy.age, (trophiesByAge.get(trophy.age) ?? 0) + 1);
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-(--color-border) bg-(--color-surface) shadow-sm">
      <table className="w-full min-w-[420px] text-sm">
        <thead>
          <tr className="border-b border-(--color-border) text-left text-xs text-(--color-text-muted) uppercase">
            <th className="px-3 py-2 font-medium">Età</th>
            <th className="px-3 py-2 font-medium">Club</th>
            <th className="px-3 py-2 text-right font-medium">OVR</th>
            <th className="px-3 py-2 text-right font-medium">Pres.</th>
            <th className="px-3 py-2 text-right font-medium">Gol</th>
            <th className="px-3 py-2 text-right font-medium">Assist</th>
          </tr>
        </thead>
        <tbody>
          {player.clubHistory.map((stint, index) => {
            const trophyCount = trophiesByAge.get(stint.ageTo) ?? 0;
            return (
              <tr
                key={index}
                className="border-b border-(--color-border) last:border-0 odd:bg-(--color-surface-raised)/40"
              >
                <td className="px-3 py-2 text-(--color-text-muted)">{stint.ageFrom}</td>
                <td className="px-3 py-2">
                  <span className="font-medium text-(--color-text)">{stint.club.name}</span>
                  {stint.type === "loan" ? (
                    <span className="ml-1.5 text-xs text-(--color-text-muted)">(prestito)</span>
                  ) : null}
                  {trophyCount > 0 ? (
                    <span
                      className="ml-1.5 inline-flex items-center gap-0.5 rounded-full bg-(--color-ovr-gold)/15 px-1.5 py-0.5 text-(--color-ovr-gold)"
                      title={`${trophyCount} ${trophyCount === 1 ? "trofeo vinto" : "trofei vinti"} in questo ciclo`}
                    >
                      <Trophy size={13} aria-hidden="true" />
                      {trophyCount > 1 ? <span className="text-xs font-semibold">×{trophyCount}</span> : null}
                    </span>
                  ) : null}
                </td>
                <td className="px-3 py-2 text-right">
                  <OvrBadge ovr={stint.ovr} size="sm" className="ml-auto" />
                </td>
                <td className="px-3 py-2 text-right text-(--color-text)">{stint.stats.apps}</td>
                <td className="px-3 py-2 text-right text-(--color-text)">{stint.stats.goals}</td>
                <td className="px-3 py-2 text-right text-(--color-text)">{stint.stats.assists}</td>
              </tr>
            );
          })}
          {pendingLabel ? (
            <tr className="animate-pulse">
              <td className="px-3 py-2 text-(--color-text-muted)">{player.age}</td>
              <td colSpan={5} className="px-3 py-2 text-(--color-text-muted)">
                {pendingLabel}
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
