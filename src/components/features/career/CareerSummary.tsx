import { Award as AwardIcon, Trophy as TrophyIcon } from "lucide-react";
import type { AwardType, Player } from "@/types/career";
import { peakOvr, summarizeClubHistory } from "@/lib/career/summary";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { OvrBadge } from "./OvrBadge";

interface CareerSummaryProps {
  player: Player;
  onRestart: () => void;
}

const AWARD_LABELS: Record<AwardType, string> = {
  "player-of-the-season": "Giocatore della stagione",
  "ballon-dor": "Pallone d'Oro",
  "top-scorer": "Capocannoniere",
};

export function CareerSummary({ player, onRestart }: CareerSummaryProps) {
  const clubs = summarizeClubHistory(player.clubHistory);
  const trophies = [...player.trophies].sort((a, b) => a.age - b.age);
  const awards = [...player.awards].sort((a, b) => a.age - b.age);

  return (
    <div className="animate-step-in flex flex-col gap-6">
      <Card className="flex flex-col items-center gap-3 p-10 text-center">
        <p className="font-display text-xs tracking-[0.35em] text-(--color-accent)">
          Carriera conclusa
        </p>
        <h2 className="font-display text-3xl text-(--color-text)">
          {player.lastName.toUpperCase()}
        </h2>
        <p className="text-(--color-text-muted)">
          Ritirato a {player.age} anni dopo {player.clubHistory.length}{" "}
          {player.clubHistory.length === 1 ? "ciclo" : "cicli"} di carriera
        </p>

        <div className="mt-2 grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="flex flex-col items-center gap-1 rounded-lg bg-(--color-surface-raised) py-3">
            <OvrBadge ovr={peakOvr(player)} size="sm" />
            <p className="text-[10px] tracking-wide text-(--color-text-muted) uppercase">Ovr max</p>
          </div>
          <div className="flex flex-col justify-center rounded-lg bg-(--color-surface-raised) py-3">
            <p className="font-display text-xl text-(--color-text)">{player.career.apps}</p>
            <p className="text-[10px] tracking-wide text-(--color-text-muted) uppercase">Presenze</p>
          </div>
          <div className="flex flex-col justify-center rounded-lg bg-(--color-surface-raised) py-3">
            <p className="font-display text-xl text-(--color-text)">{player.career.goals}</p>
            <p className="text-[10px] tracking-wide text-(--color-text-muted) uppercase">Gol</p>
          </div>
          <div className="flex flex-col justify-center rounded-lg bg-(--color-surface-raised) py-3">
            <p className="font-display text-xl text-(--color-text)">{player.career.assists}</p>
            <p className="text-[10px] tracking-wide text-(--color-text-muted) uppercase">Assist</p>
          </div>
        </div>

        <Button variant="secondary" onClick={onRestart} className="mt-2">
          Gioca ancora
        </Button>
      </Card>

      <Card className="p-6">
        <h3 className="font-display mb-3 text-sm tracking-[0.2em] text-(--color-text-muted) uppercase">
          Club
        </h3>
        {clubs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-sm">
              <thead>
                <tr className="border-b border-(--color-border) text-left text-xs text-(--color-text-muted) uppercase">
                  <th className="px-3 py-2 font-medium">Club</th>
                  <th className="px-3 py-2 font-medium">Età</th>
                  <th className="px-3 py-2 text-right font-medium">Pres.</th>
                  <th className="px-3 py-2 text-right font-medium">Gol</th>
                  <th className="px-3 py-2 text-right font-medium">Assist</th>
                </tr>
              </thead>
              <tbody>
                {clubs.map((c) => (
                  <tr
                    key={c.club.id}
                    className="border-b border-(--color-border) last:border-0 odd:bg-(--color-surface-raised)/40"
                  >
                    <td className="px-3 py-2 font-medium text-(--color-text)">
                      {c.club.name}
                      {c.stintCount > 1 ? (
                        <span className="ml-1.5 text-xs text-(--color-text-muted)">
                          ({c.stintCount} cicli)
                        </span>
                      ) : null}
                    </td>
                    <td className="px-3 py-2 text-(--color-text-muted)">
                      {c.ageFrom}–{c.ageTo}
                    </td>
                    <td className="px-3 py-2 text-right text-(--color-text)">{c.stats.apps}</td>
                    <td className="px-3 py-2 text-right text-(--color-text)">{c.stats.goals}</td>
                    <td className="px-3 py-2 text-right text-(--color-text)">{c.stats.assists}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-(--color-text-muted)">Nessun club nella carriera.</p>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="font-display mb-3 text-sm tracking-[0.2em] text-(--color-text-muted) uppercase">
          Nazionale
        </h3>
        {player.nationalTeam.called ? (
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-(--color-surface-raised) py-2">
              <p className="font-display text-lg text-(--color-text)">{player.nationalTeam.apps}</p>
              <p className="text-[10px] tracking-wide text-(--color-text-muted) uppercase">Pres.</p>
            </div>
            <div className="rounded-lg bg-(--color-surface-raised) py-2">
              <p className="font-display text-lg text-(--color-text)">{player.nationalTeam.goals}</p>
              <p className="text-[10px] tracking-wide text-(--color-text-muted) uppercase">Gol</p>
            </div>
            <div className="rounded-lg bg-(--color-surface-raised) py-2">
              <p className="font-display text-lg text-(--color-text)">{player.nationalTeam.assists}</p>
              <p className="text-[10px] tracking-wide text-(--color-text-muted) uppercase">Assist</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-(--color-text-muted)">Mai convocato in nazionale.</p>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="font-display mb-3 text-sm tracking-[0.2em] text-(--color-text-muted) uppercase">
          Trofei e premi
        </h3>
        {trophies.length === 0 && awards.length === 0 ? (
          <p className="text-sm text-(--color-text-muted)">Nessun trofeo o premio vinto in carriera.</p>
        ) : (
          <ul className="flex flex-col gap-2 text-sm">
            {trophies.map((t, i) => (
              <li key={`trophy-${i}`} className="flex items-center gap-2">
                <TrophyIcon size={14} aria-hidden="true" className="shrink-0 text-(--color-ovr-gold)" />
                <span className="text-(--color-text)">
                  {t.competition}
                  <span className="text-(--color-text-muted)">
                    {" "}
                    — {t.club ? t.club.name : "Nazionale"}, {t.age} anni
                  </span>
                </span>
              </li>
            ))}
            {awards.map((a, i) => (
              <li key={`award-${i}`} className="flex items-center gap-2">
                <AwardIcon size={14} aria-hidden="true" className="shrink-0 text-(--color-ovr-gold)" />
                <span className="text-(--color-text)">
                  {AWARD_LABELS[a.type]}
                  <span className="text-(--color-text-muted)">
                    {" "}
                    — {a.club ? a.club.name : "Nazionale"}, {a.age} anni
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
