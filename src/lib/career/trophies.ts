import type { Award, AwardType, Club, Player, StatLine, Trophy } from "@/types/career";
import { clamp, type Rng } from "./progression";

/**
 * Probabilità di vincere una competizione di club in un ciclo, in base al prestigio del club
 * e all'OVR del giocatore (una squadra con un fenomeno vince di più). Deliberatamente più
 * generosa dell'originale: vedi decisions.md per il perché.
 */
export function clubTrophyChance(prestige: number, ovr: number): number {
  const base = prestige * 0.08;
  const ovrBonus = clamp((ovr - 60) / 200, 0, 0.15);
  return clamp(base + ovrBonus, 0, 0.5);
}

/** Estrae i trofei di campionato/coppa nazionale vinti in un ciclo al club corrente. */
export function rollClubTrophies(
  club: Club,
  ovr: number,
  age: number,
  rng: Rng = Math.random,
): Trophy[] {
  const trophies: Trophy[] = [];
  const chance = clubTrophyChance(club.prestige, ovr);

  if (rng() < chance) {
    trophies.push({ competition: club.competitions.league, club, age });
  }
  if (club.competitions.cup && rng() < chance * 0.7) {
    trophies.push({ competition: club.competitions.cup, club, age });
  }
  return trophies;
}

/** Probabilità di vincere il torneo internazionale con la nazionale in un ciclo da convocato. */
export function nationalTournamentWinChance(ovr: number): number {
  return clamp((ovr - 78) / 150, 0, 0.2);
}

export function rollNationalTrophy(
  called: boolean,
  ovr: number,
  age: number,
  rng: Rng = Math.random,
): Trophy | null {
  if (!called) return null;
  if (rng() >= nationalTournamentWinChance(ovr)) return null;
  const competition = rng() < 0.5 ? "Mondiale" : "Europei";
  return { competition, club: undefined, age };
}

const TOP_SCORER_GOALS_THRESHOLD = 15;
const BALLON_DOR_OVR_THRESHOLD = 90;

/**
 * Probabilità di un award individuale nel ciclo — deliberatamente più generosa dell'originale
 * (dove restano irraggiungibili anche a OVR 88 con carriera leggendaria, vedi decisions.md).
 */
export function awardChance(ovr: number): number {
  if (ovr < 85) return 0;
  return clamp((ovr - 85) / 30, 0, 0.6);
}

export function rollAward(
  player: Pick<Player, "ovr" | "club">,
  seasonStats: StatLine,
  age: number,
  rng: Rng = Math.random,
): Award | null {
  if (rng() >= awardChance(player.ovr)) return null;

  const club = player.club ?? undefined;
  let type: AwardType = "player-of-the-season";
  if (seasonStats.goals >= TOP_SCORER_GOALS_THRESHOLD && rng() < 0.5) {
    type = "top-scorer";
  } else if (player.ovr >= BALLON_DOR_OVR_THRESHOLD && rng() < 0.3) {
    type = "ballon-dor";
  }

  return { type, age, club };
}
