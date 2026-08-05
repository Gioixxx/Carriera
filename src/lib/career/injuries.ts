import type { Injury, Position } from "@/types/career";
import { clamp, type Rng } from "./progression";

const HIGH_RISK_POSITIONS = new Set<Position>(["CDM", "CB", "ST"]);

const INJURY_LABELS = [
  "Distorsione alla caviglia",
  "Lesione muscolare",
  "Problema al ginocchio",
  "Affaticamento fisico",
];

/** Probabilità di infortunio in un ciclo, in base a età, ruolo e carico (stagioni del ciclo). */
export function injuryChance(age: number, position: Position, seasons: number): number {
  const ageFactor = age >= 30 ? clamp((age - 30) / 25, 0, 0.22) : 0.03;
  const roleFactor = HIGH_RISK_POSITIONS.has(position) ? 0.05 : 0.02;
  const loadFactor = clamp((seasons - 1) * 0.03, 0, 0.09);
  return clamp(ageFactor + roleFactor + loadFactor, 0, 0.35);
}

/** Estrae un infortunio per il ciclo, o null se il giocatore resta integro. */
export function rollInjury(
  age: number,
  position: Position,
  seasons: number,
  rng: Rng = Math.random,
): Injury | null {
  if (rng() >= injuryChance(age, position, seasons)) return null;

  const severity = rng();
  const turnsRemaining = severity < 0.6 ? 1 : severity < 0.9 ? 2 : 3;
  const ovrPenalty = Math.round(2 + severity * 6);
  const label = INJURY_LABELS[Math.floor(rng() * INJURY_LABELS.length)];
  return { label, turnsRemaining, ovrPenalty };
}

/** Fa avanzare l'infortunio di un ciclo; torna null (guarito) quando il countdown si esaurisce. */
export function tickInjury(injury: Injury): Injury | null {
  if (injury.turnsRemaining <= 1) return null;
  return { ...injury, turnsRemaining: injury.turnsRemaining - 1 };
}
