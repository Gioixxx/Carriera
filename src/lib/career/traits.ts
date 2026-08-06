import type { ArchetypeId, Traits } from "@/types/career";
import { clamp } from "./progression";
import { SHADOW_SCANDAL_THRESHOLD } from "./shadow";

/** Punto di partenza neutro: nessuna tendenza forte ancora espressa. */
export const NEUTRAL_TRAITS: Traits = {
  loyalty: 50,
  ambition: 50,
  showmanship: 50,
  discipline: 50,
  leadership: 50,
};

/** Soglia oltre la quale un vettore conta come "dominante" per un archetipo a vettore singolo. */
export const ARCHETYPE_DOMINANT_THRESHOLD = 58;
/** Soglia sotto la quale un vettore conta come "basso" per le condizioni composte (mercenary/problem). */
export const ARCHETYPE_LOW_THRESHOLD = 45;

export function applyTraitsDelta(current: Traits, delta: Partial<Traits>): Traits {
  return {
    loyalty: clamp(current.loyalty + (delta.loyalty ?? 0), 0, 100),
    ambition: clamp(current.ambition + (delta.ambition ?? 0), 0, 100),
    showmanship: clamp(current.showmanship + (delta.showmanship ?? 0), 0, 100),
    discipline: clamp(current.discipline + (delta.discipline ?? 0), 0, 100),
    leadership: clamp(current.leadership + (delta.leadership ?? 0), 0, 100),
  };
}

export const ARCHETYPE_LABELS: Record<ArchetypeId, string> = {
  flagbearer: "Bandiera",
  mercenary: "Mercenario",
  showman: "Showman",
  pro: "Professionista",
  leader: "Leader",
  problem: "Problema",
};

interface ArchetypeCandidate {
  id: ArchetypeId;
  qualifies: boolean;
  /** Usato solo per l'ordinamento tra i candidati a vettore singolo. */
  score: number;
}

/**
 * Deriva l'archetipo dominante (ed eventualmente secondario) dai vettori di personalità e dal
 * debito morale. `problem` e `mercenary` sono condizioni composte (non il semplice massimo);
 * priorità in caso di più condizioni vere: problem > mercenary > il vettore singolo più alto.
 */
export function deriveArchetype(
  traits: Traits,
  shadow: number,
): { primary: ArchetypeId | null; secondary: ArchetypeId | null } {
  const isProblem =
    (traits.discipline < ARCHETYPE_LOW_THRESHOLD && traits.showmanship >= ARCHETYPE_DOMINANT_THRESHOLD) ||
    shadow >= SHADOW_SCANDAL_THRESHOLD;
  const isMercenary =
    traits.ambition >= ARCHETYPE_DOMINANT_THRESHOLD && traits.loyalty < ARCHETYPE_LOW_THRESHOLD;

  const allSingleVectorCandidates: ArchetypeCandidate[] = [
    { id: "flagbearer", qualifies: traits.loyalty >= ARCHETYPE_DOMINANT_THRESHOLD, score: traits.loyalty },
    { id: "showman", qualifies: traits.showmanship >= ARCHETYPE_DOMINANT_THRESHOLD, score: traits.showmanship },
    { id: "pro", qualifies: traits.discipline >= ARCHETYPE_DOMINANT_THRESHOLD, score: traits.discipline },
    { id: "leader", qualifies: traits.leadership >= ARCHETYPE_DOMINANT_THRESHOLD, score: traits.leadership },
  ];
  const singleVectorCandidates = allSingleVectorCandidates
    .filter((c) => c.qualifies)
    .sort((a, b) => b.score - a.score);

  const ordered: ArchetypeId[] = [
    ...(isProblem ? (["problem"] as const) : []),
    ...(isMercenary ? (["mercenary"] as const) : []),
    ...singleVectorCandidates.map((c) => c.id),
  ];

  return {
    primary: ordered[0] ?? null,
    secondary: ordered[1] ?? null,
  };
}
