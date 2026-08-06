import type { ArchivedCareer, DecisionCategory, GameSpeed, Player } from "@/types/career";
import type { LoopContext } from "./loop";
import { emptyPersonalRecords, pickBestCareerTitle } from "./satisfaction";
import { peakOvr } from "./summary";

const STORAGE_KEY = "carriera:save";
const STORAGE_VERSION = 4;

export interface SavedGame {
  version: number;
  player: Player;
  speed: GameSpeed;
  context: LoopContext;
  recentCategories: DecisionCategory[];
}

/** Arricchisce un save v1 (privo di injury/wallet/popularity) con i default, invece di scartarlo. */
function migratePlayerV1(raw: Player): Player {
  return migratePlayerV2({
    ...raw,
    injury: raw.injury ?? null,
    wallet: raw.wallet ?? { salaryEurPerCycle: 0, savingsEur: 0 },
    popularity: raw.popularity ?? 15,
  });
}

/** Arricchisce un save v2 (privo dei campi soddisfazione) con i default. */
function migratePlayerV2(raw: Player): Player {
  return migratePlayerV3({
    ...raw,
    milestonesReached: raw.milestonesReached ?? [],
    records: raw.records ?? emptyPersonalRecords(raw.marketValueEur ?? 0),
    seasonTitles: raw.seasonTitles ?? [],
    currentObjective: raw.currentObjective ?? null,
  });
}

/** Arricchisce un save v3 (privo del flag di cambio nazionalità) con il default. */
function migratePlayerV3(raw: Player): Player {
  return {
    ...raw,
    hasSwitchedNationality: raw.hasSwitchedNationality ?? false,
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
    if (parsed.version === 2) {
      return { ...parsed, version: STORAGE_VERSION, player: migratePlayerV2(parsed.player) };
    }
    if (parsed.version === 3) {
      return { ...parsed, version: STORAGE_VERSION, player: migratePlayerV3(parsed.player) };
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
const ARCHIVE_VERSION = 2;
const ARCHIVE_MAX_ENTRIES = 100;

interface ArchivePayload {
  version: number;
  entries: ArchivedCareer[];
}

function migrateArchiveEntryV1(entry: ArchivedCareer): ArchivedCareer {
  return {
    ...entry,
    careerTitle: entry.careerTitle ?? "",
  };
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
    careerTitle: pickBestCareerTitle(player.seasonTitles),
  };
}

export function loadArchive(): ArchivedCareer[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(ARCHIVE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as ArchivePayload;
    if (parsed.version === 1) {
      return parsed.entries.map(migrateArchiveEntryV1);
    }
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
