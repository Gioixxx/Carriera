import type { DecisionCategory, GameSpeed, Player } from "@/types/career";
import type { LoopContext } from "./loop";

const STORAGE_KEY = "carriera:save";
const STORAGE_VERSION = 1;

export interface SavedGame {
  version: number;
  player: Player;
  speed: GameSpeed;
  context: LoopContext;
  recentCategories: DecisionCategory[];
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
