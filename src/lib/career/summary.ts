import type { Club, ClubStint, Player, StatLine } from "@/types/career";

export interface ClubSummary {
  club: Club;
  ageFrom: number;
  ageTo: number;
  stats: StatLine;
  /** Quanti cicli separati (righe di clubHistory) sono stati accorpati per questo club. */
  stintCount: number;
}

function sumStats(a: StatLine, b: StatLine): StatLine {
  return {
    apps: a.apps + b.apps,
    goals: a.goals + b.goals,
    assists: a.assists + b.assists,
  };
}

/**
 * Accorpa `clubHistory` per club (una riga per club, non per ciclo), sommando le statistiche
 * di eventuali cicli separati passati nello stesso club. Preserva l'ordine di prima apparizione.
 */
export function summarizeClubHistory(clubHistory: ClubStint[]): ClubSummary[] {
  const byClub = new Map<string, ClubSummary>();
  const order: string[] = [];

  for (const stint of clubHistory) {
    const existing = byClub.get(stint.club.id);
    if (existing) {
      existing.stats = sumStats(existing.stats, stint.stats);
      existing.ageTo = Math.max(existing.ageTo, stint.ageTo);
      existing.stintCount += 1;
    } else {
      byClub.set(stint.club.id, {
        club: stint.club,
        ageFrom: stint.ageFrom,
        ageTo: stint.ageTo,
        stats: { ...stint.stats },
        stintCount: 1,
      });
      order.push(stint.club.id);
    }
  }

  return order.map((id) => byClub.get(id)!);
}

/** OVR più alto raggiunto in carriera (storico dei cicli + valore attuale). */
export function peakOvr(player: Pick<Player, "ovr" | "clubHistory">): number {
  return Math.max(player.ovr, ...player.clubHistory.map((s) => s.ovr));
}
