import type {
  Club,
  ClubStint,
  DecisionOutcome,
  GameSpeed,
  Player,
  PlayerDelta,
  PlayerIdentity,
  StatLine,
} from "@/types/career";
import { clamp, projectOvr, projectStats, type Rng } from "./progression";
import { computeMarketValue } from "./market";

export const STARTING_AGE = 16;
export const STARTING_OVR = 50;

/** Stagioni tra una decisione e l'altra per modalità — osservato sul gioco originale:
 * Normal esplicitamente "every 2 seasons"; Express osservato a passi di 3 (16→19→22...);
 * Intense non osservato direttamente, dedotto come il passo più fitto (1). */
export const SEASONS_PER_CYCLE: Record<GameSpeed, number> = {
  intense: 1,
  normal: 2,
  express: 3,
};

export function createPlayer(identity: PlayerIdentity): Player {
  return {
    ...identity,
    age: STARTING_AGE,
    ovr: STARTING_OVR,
    marketValueEur: computeMarketValue(STARTING_OVR, STARTING_AGE),
    career: { apps: 0, goals: 0, assists: 0 },
    club: null,
    clubHistory: [],
    nationalTeam: { called: false, apps: 0, goals: 0, assists: 0 },
    trophies: [],
    awards: [],
    retired: false,
  };
}

/** Firma per un nuovo club (academy offer, transfer window, prestito). */
export function signWithClub(player: Player, club: Club): Player {
  return { ...player, club };
}

function sumStats(a: StatLine, b: StatLine): StatLine {
  return {
    apps: a.apps + b.apps,
    goals: a.goals + b.goals,
    assists: a.assists + b.assists,
  };
}

/**
 * Fa avanzare il giocatore di N stagioni al club corrente: aggiorna età, OVR, valore
 * di mercato, statistiche cumulative e aggiunge una riga a `clubHistory` per il ciclo
 * (replica il comportamento osservato: una riga per ciclo, non un accorpamento per club).
 */
export function advanceSeasons(
  player: Player,
  seasons: number,
  rng: Rng = Math.random,
  stintType: "permanent" | "loan" = "permanent",
): Player {
  if (!player.club) {
    throw new Error("Il giocatore deve avere un club per accumulare stagioni");
  }
  if (seasons <= 0) {
    throw new Error("Il numero di stagioni deve essere positivo");
  }

  const ageFrom = player.age;
  const ageTo = ageFrom + seasons;
  const nextOvr = projectOvr(player.ovr, ageFrom, seasons, rng);
  const seasonStats = projectStats(
    player.ovr,
    player.position,
    player.club.tier,
    seasons,
    rng,
  );

  const stint: ClubStint = {
    club: player.club,
    ageFrom,
    ageTo,
    type: stintType,
    stats: seasonStats,
  };

  return {
    ...player,
    age: ageTo,
    ovr: nextOvr,
    marketValueEur: computeMarketValue(nextOvr, ageTo),
    career: sumStats(player.career, seasonStats),
    clubHistory: [...player.clubHistory, stint],
  };
}

/** Applica l'effetto di un outcome di decisione (es. +3 OVR, -2 OVR) al giocatore. */
export function applyDelta(player: Player, delta: PlayerDelta): Player {
  const nextOvr = clamp(player.ovr + (delta.ovrDelta ?? 0), 30, 99);
  return {
    ...player,
    ovr: nextOvr,
    marketValueEur: computeMarketValue(nextOvr, player.age),
  };
}

/** Estrae un outcome pesato tra quelli disponibili per un'opzione di decisione. */
export function resolveOutcome(
  outcomes: DecisionOutcome[],
  rng: Rng = Math.random,
): DecisionOutcome {
  if (outcomes.length === 0) {
    throw new Error("Un'opzione di decisione deve avere almeno un outcome");
  }
  const totalWeight = outcomes.reduce((sum, o) => sum + o.weight, 0);
  const roll = rng() * totalWeight;
  let cumulative = 0;
  for (const outcome of outcomes) {
    cumulative += outcome.weight;
    if (roll < cumulative) return outcome;
  }
  return outcomes[outcomes.length - 1];
}

/** Probabilità di ritiro crescente tra i 34 e i 41 anni; automatico da 41 in su. */
export function checkRetirement(player: Player, rng: Rng = Math.random): boolean {
  if (player.age < 34) return false;
  if (player.age >= 41) return true;
  const progress = (player.age - 34) / (41 - 34);
  const chance = clamp(progress * progress, 0, 1);
  return rng() < chance;
}

export function retire(player: Player): Player {
  return { ...player, retired: true, club: null };
}
