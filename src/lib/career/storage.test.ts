import { beforeEach, describe, expect, it } from "vitest";
import type { Player, PlayerIdentity } from "@/types/career";
import { createPlayer } from "./engine";
import { INITIAL_LOOP_CONTEXT } from "./loop";
import { appendToArchive, buildArchiveEntry, clearGame, loadArchive, loadGame, saveGame } from "./storage";

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

  it("dovrebbe migrare un save v1 privo di injury/wallet/popularity aggiungendo i default", () => {
    const legacyPlayer = samplePlayer() as unknown as Record<string, unknown>;
    delete legacyPlayer.injury;
    delete legacyPlayer.wallet;
    delete legacyPlayer.popularity;
    delete legacyPlayer.milestonesReached;
    delete legacyPlayer.records;
    delete legacyPlayer.seasonTitles;
    delete legacyPlayer.currentObjective;
    window.localStorage.setItem(
      "carriera:save",
      JSON.stringify({
        version: 1,
        player: legacyPlayer,
        speed: "normal",
        context: INITIAL_LOOP_CONTEXT,
        recentCategories: [],
      }),
    );

    const loaded = loadGame();
    expect(loaded?.version).toBe(3);
    expect(loaded?.player.injury).toBeNull();
    expect(loaded?.player.wallet).toEqual({ salaryEurPerCycle: 0, savingsEur: 0 });
    expect(loaded?.player.popularity).toBe(15);
    expect(loaded?.player.milestonesReached).toEqual([]);
    expect(loaded?.player.seasonTitles).toEqual([]);
    expect(loaded?.player.currentObjective).toBeNull();
    expect(loaded?.player.records.bestSeasonGoals).toBe(0);
  });

  it("dovrebbe migrare un save v2 privo dei campi soddisfazione aggiungendo i default", () => {
    const legacyPlayer = samplePlayer() as unknown as Record<string, unknown>;
    delete legacyPlayer.milestonesReached;
    delete legacyPlayer.records;
    delete legacyPlayer.seasonTitles;
    delete legacyPlayer.currentObjective;
    window.localStorage.setItem(
      "carriera:save",
      JSON.stringify({
        version: 2,
        player: legacyPlayer,
        speed: "normal",
        context: INITIAL_LOOP_CONTEXT,
        recentCategories: [],
      }),
    );

    const loaded = loadGame();
    expect(loaded?.version).toBe(3);
    expect(loaded?.player.milestonesReached).toEqual([]);
    expect(loaded?.player.currentObjective).toBeNull();
    expect(loaded?.player.records.peakMarketValueEur).toBe(samplePlayer().marketValueEur);
  });
});

describe("clearGame", () => {
  it("dovrebbe rimuovere il salvataggio esistente", () => {
    saveGame({ player: samplePlayer(), speed: "express", context: INITIAL_LOOP_CONTEXT, recentCategories: [] });
    clearGame();
    expect(loadGame()).toBeNull();
  });
});

describe("loadArchive / appendToArchive", () => {
  it("dovrebbe restituire un array vuoto se non c'è nessun archivio", () => {
    expect(loadArchive()).toEqual([]);
  });

  it("dovrebbe accodare più carriere mantenendo le più recenti in testa", () => {
    const first = buildArchiveEntry(samplePlayer());
    const second = buildArchiveEntry({ ...samplePlayer(), lastName: "Bianchi" });

    appendToArchive(first);
    appendToArchive(second);

    const archive = loadArchive();
    expect(archive).toHaveLength(2);
    expect(archive[0].lastName).toBe("Bianchi");
    expect(archive[1].lastName).toBe("Rossi");
  });

  it("buildArchiveEntry dovrebbe estrarre i campi di riepilogo dal giocatore", () => {
    const player = samplePlayer();
    const entry = buildArchiveEntry(player);

    expect(entry.lastName).toBe(player.lastName);
    expect(entry.position).toBe(player.position);
    expect(entry.peakOvr).toBe(player.ovr);
    expect(entry.trophyCount).toBe(0);
    expect(entry.awardCount).toBe(0);
    expect(entry.finalSavingsEur).toBe(player.wallet.savingsEur);
    expect(entry.finalPopularity).toBe(player.popularity);
    expect(entry.careerTitle).toBe("Carriera solida");
  });
});
