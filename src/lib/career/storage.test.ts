import { beforeEach, describe, expect, it } from "vitest";
import type { Player, PlayerIdentity } from "@/types/career";
import { createPlayer } from "./engine";
import { INITIAL_LOOP_CONTEXT } from "./loop";
import { clearGame, loadGame, saveGame } from "./storage";

const IDENTITY: PlayerIdentity = {
  lastName: "Rossi",
  number: 10,
  foot: "right",
  nationality: "Italy",
  position: "ST",
};

function samplePlayer(): Player {
  return createPlayer(IDENTITY);
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("saveGame / loadGame", () => {
  it("dovrebbe restituire null se non è presente nessun salvataggio", () => {
    expect(loadGame()).toBeNull();
  });

  it("dovrebbe salvare e ricaricare uno stato di gioco identico", () => {
    const player = samplePlayer();
    saveGame({ player, speed: "normal", context: INITIAL_LOOP_CONTEXT, recentCategories: ["transfer"] });

    const loaded = loadGame();
    expect(loaded?.player).toEqual(player);
    expect(loaded?.speed).toBe("normal");
    expect(loaded?.recentCategories).toEqual(["transfer"]);
  });

  it("dovrebbe restituire null se la versione salvata non corrisponde a quella corrente", () => {
    window.localStorage.setItem(
      "carriera:save",
      JSON.stringify({ version: 999, player: samplePlayer(), speed: "normal", context: INITIAL_LOOP_CONTEXT, recentCategories: [] }),
    );
    expect(loadGame()).toBeNull();
  });

  it("dovrebbe restituire null se il contenuto salvato non è JSON valido", () => {
    window.localStorage.setItem("carriera:save", "{non valido");
    expect(loadGame()).toBeNull();
  });
});

describe("clearGame", () => {
  it("dovrebbe rimuovere il salvataggio esistente", () => {
    saveGame({ player: samplePlayer(), speed: "express", context: INITIAL_LOOP_CONTEXT, recentCategories: [] });
    clearGame();
    expect(loadGame()).toBeNull();
  });
});
