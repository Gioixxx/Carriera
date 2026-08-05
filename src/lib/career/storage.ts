import type { ArchivedCareer, DecisionCategory, GameSpeed, Player } from "@/types/career";
import type { LoopContext } from "./loop";
import { peakOvr } from "./summary";

const STORAGE_KEY = "carriera:save";
const STORAGE_VERSION = 2;

export interface SavedGame {
  version: number;
  player: Player;
  speed: GameSpeed;
  context: LoopContext;
  recentCategories: DecisionCategory[];
}

/** Arricchisce un save v1 (privo di injury/wallet/popularity) con i default, invece di scartarlo. */
function migratePlayerV1(raw: Player): Player {
  return {
    ...raw,
    injury: raw.injury ?? null,
    wallet: raw.wallet ?? { salaryEurPerCycle: 0, savingsEur: 0 },
    popularity: raw.popularity ?? 15,
  };
}

export function saveGame(save: Omit<SavedGame, "version">): void {
  if (typeof window === "undefined") return;
  const payload: SavedGame = { version: STORAGE_VERSION, ...save };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function loadGame(): SavedGame | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as SavedGame;
    if (parsed.version === 1) {
      return { ...parsed, version: STORAGE_VERSION, player: migratePlayerV1(parsed.player) };
    }
    if (parsed.version !== STORAGE_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearGame(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

const ARCHIVE_KEY = "carriera:archive";
const ARCHIVE_VERSION = 1;
const ARCHIVE_MAX_ENTRIES = 100;

interface ArchivePayload {
  version: number;
  entries: ArchivedCareer[];
}

export function buildArchiveEntry(player: Player): ArchivedCareer {
  return {
    id: `${player.lastName}-${Date.now()}`,
    lastName: player.lastName,
    nationality: player.nationality,
    position: player.position,
    peakOvr: peakOvr(player),
    trophyCount: player.trophies.length,
    awardCount: player.awards.length,
    retiredAge: player.age,
    retiredAtIso: new Date().toISOString(),
    careerApps: player.career.apps,
    careerGoals: player.career.goals,
    careerAssists: player.career.assists,
    finalSavingsEur: player.wallet.savingsEur,
    finalPopularity: player.popularity,
  };
}

export function loadArchive(): ArchivedCareer[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(ARCHIVE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as ArchivePayload;
    if (parsed.version !== ARCHIVE_VERSION) return [];
    return parsed.entries;
  } catch {
    return [];
  }
}

export function appendToArchive(entry: ArchivedCareer): void {
  if (typeof window === "undefined") return;
  const entries = [entry, ...loadArchive()].slice(0, ARCHIVE_MAX_ENTRIES);
  const payload: ArchivePayload = { version: ARCHIVE_VERSION, entries };
  window.localStorage.setItem(ARCHIVE_KEY, JSON.stringify(payload));
}
