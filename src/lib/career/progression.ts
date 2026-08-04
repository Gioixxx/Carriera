import type { Position, StatLine } from "@/types/career";

export type Rng = () => number;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Crescita/declino atteso dell'OVR per singola stagione, in base all'età. */
const GROWTH_STAGES: { maxAge: number; deltaPerSeason: number }[] = [
  { maxAge: 21, deltaPerSeason: 2.5 },
  { maxAge: 27, deltaPerSeason: 1.4 },
  { maxAge: 31, deltaPerSeason: 0.3 },
  { maxAge: 34, deltaPerSeason: -0.6 },
  { maxAge: 37, deltaPerSeason: -1.6 },
  { maxAge: Infinity, deltaPerSeason: -3 },
];

export function ovrDeltaForAge(age: number): number {
  const stage =
    GROWTH_STAGES.find((s) => age < s.maxAge) ??
    GROWTH_STAGES[GROWTH_STAGES.length - 1];
  return stage.deltaPerSeason;
}

/** Proietta l'OVR dopo N stagioni, con un piccolo rumore casuale ad ogni stagione. */
export function projectOvr(
  ovr: number,
  age: number,
  seasons: number,
  rng: Rng = Math.random,
): number {
  let nextOvr = ovr;
  for (let i = 0; i < seasons; i++) {
    const noise = (rng() - 0.5) * 2; // -1..+1
    nextOvr += ovrDeltaForAge(age + i) + noise;
  }
  return clamp(Math.round(nextOvr), 35, 99);
}

interface RoleWeights {
  goals: number;
  assists: number;
}

export const ROLE_WEIGHTS: Record<Position, RoleWeights> = {
  GK: { goals: 0, assists: 0.02 },
  CB: { goals: 0.05, assists: 0.08 },
  LB: { goals: 0.08, assists: 0.22 },
  RB: { goals: 0.08, assists: 0.22 },
  CDM: { goals: 0.12, assists: 0.18 },
  CM: { goals: 0.22, assists: 0.28 },
  CAM: { goals: 0.38, assists: 0.34 },
  LM: { goals: 0.3, assists: 0.32 },
  RM: { goals: 0.3, assists: 0.32 },
  LW: { goals: 0.42, assists: 0.28 },
  RW: { goals: 0.42, assists: 0.28 },
  ST: { goals: 0.55, assists: 0.18 },
};

/** Genera le statistiche "offscreen" di una singola stagione da OVR/ruolo/livello del club. */
export function projectSeasonStats(
  ovr: number,
  position: Position,
  clubTier: number,
  rng: Rng = Math.random,
): StatLine {
  const appsBase = 24 + Math.round((ovr - 50) / 4);
  const apps = clamp(appsBase + Math.round((rng() - 0.5) * 8), 5, 38);

  const tierFactor = clamp(1.3 - (clubTier - 1) * 0.15, 0.6, 1.3);
  const ovrFactor = Math.max(0, (ovr - 45) / 55);
  const weights = ROLE_WEIGHTS[position];

  const goalsExpected = apps * weights.goals * ovrFactor * tierFactor;
  const assistsExpected = apps * weights.assists * ovrFactor * tierFactor;

  const variance = () => 0.7 + rng() * 0.6;
  const goals = Math.max(0, Math.round(goalsExpected * variance()));
  const assists = Math.max(0, Math.round(assistsExpected * variance()));

  return { apps, goals, assists };
}

/** Somma le statistiche generate su più stagioni consecutive nello stesso club. */
export function projectStats(
  ovr: number,
  position: Position,
  clubTier: number,
  seasons: number,
  rng: Rng = Math.random,
): StatLine {
  let total: StatLine = { apps: 0, goals: 0, assists: 0 };
  for (let i = 0; i < seasons; i++) {
    const season = projectSeasonStats(ovr, position, clubTier, rng);
    total = {
      apps: total.apps + season.apps,
      goals: total.goals + season.goals,
      assists: total.assists + season.assists,
    };
  }
  return total;
}

/**
 * Statistiche con la nazionale per una singola stagione — molto più basse di quelle di club
 * (poche convocazioni all'anno), proporzionali a OVR/ruolo.
 */
export function projectNationalSeasonStats(
  ovr: number,
  position: Position,
  rng: Rng = Math.random,
): StatLine {
  const apps = clamp(Math.round(2 + (ovr - 75) / 8 + (rng() - 0.5) * 3), 0, 12);
  const weights = ROLE_WEIGHTS[position];
  const ovrFactor = Math.max(0, (ovr - 70) / 30);
  const variance = () => 0.6 + rng() * 0.6;

  const goals = Math.max(0, Math.round(apps * weights.goals * ovrFactor * variance()));
  const assists = Math.max(0, Math.round(apps * weights.assists * ovrFactor * variance()));

  return { apps, goals, assists };
}

/** Somma le statistiche con la nazionale su più stagioni consecutive. */
export function projectNationalStats(
  ovr: number,
  position: Position,
  seasons: number,
  rng: Rng = Math.random,
): StatLine {
  let total: StatLine = { apps: 0, goals: 0, assists: 0 };
  for (let i = 0; i < seasons; i++) {
    const season = projectNationalSeasonStats(ovr, position, rng);
    total = {
      apps: total.apps + season.apps,
      goals: total.goals + season.goals,
      assists: total.assists + season.assists,
    };
  }
  return total;
}
