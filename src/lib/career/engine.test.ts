import { describe, expect, it } from "vitest";
import type { Club, DecisionOutcome, PlayerIdentity } from "@/types/career";
import {
  advanceSeasons,
  applyDelta,
  checkRetirement,
  createPlayer,
  resolveOutcome,
  retire,
  signWithClub,
  STARTING_AGE,
  STARTING_OVR,
} from "./engine";
import type { Rng } from "./progression";

const IDENTITY: PlayerIdentity = {
  lastName: "Rossi",
  number: 10,
  foot: "right",
  nationality: "Italy",
  position: "ST",
};

const TEST_CLUB: Club = {
  id: "test-club",
  name: "Test FC",
  country: "Italy",
  tier: 1,
  prestige: 2,
  competitions: { league: "Serie A", cup: "Coppa Italia" },
  crestUrl: "https://r2.thesportsdb.com/images/media/team/badge/test.png",
};

const NO_NOISE_RNG: Rng = () => 0.5;

describe("createPlayer", () => {
  it("dovrebbe creare un giocatore free agent a 16 anni con OVR 50 e statistiche azzerate", () => {
    const player = createPlayer(IDENTITY);

    expect(player.age).toBe(STARTING_AGE);
    expect(player.ovr).toBe(STARTING_OVR);
    expect(player.club).toBeNull();
    expect(player.career).toEqual({ apps: 0, goals: 0, assists: 0 });
    expect(player.trophies).toEqual([]);
    expect(player.awards).toEqual([]);
    expect(player.retired).toBe(false);
  });
});

describe("signWithClub", () => {
  it("dovrebbe assegnare il club al giocatore senza modificare altri campi", () => {
    const player = createPlayer(IDENTITY);
    const signed = signWithClub(player, TEST_CLUB);

    expect(signed.club).toEqual(TEST_CLUB);
    expect(signed.age).toBe(player.age);
    expect(signed.ovr).toBe(player.ovr);
  });
});

describe("advanceSeasons", () => {
  it("dovrebbe lanciare un errore se il giocatore non ha un club", () => {
    const player = createPlayer(IDENTITY);
    expect(() => advanceSeasons(player, 2, NO_NOISE_RNG)).toThrow();
  });

  it("dovrebbe aggiornare età e statistiche cumulative dopo N stagioni", () => {
    const player = signWithClub(createPlayer(IDENTITY), TEST_CLUB);
    const advanced = advanceSeasons(player, 2, NO_NOISE_RNG);

    expect(advanced.age).toBe(STARTING_AGE + 2);
    expect(advanced.career.apps).toBeGreaterThan(0);
  });

  it("dovrebbe aggiungere una riga a clubHistory per ogni ciclo, senza accorpare i cicli precedenti allo stesso club", () => {
    const player = signWithClub(createPlayer(IDENTITY), TEST_CLUB);
    const afterFirstCycle = advanceSeasons(player, 2, NO_NOISE_RNG);
    const afterSecondCycle = advanceSeasons(afterFirstCycle, 2, NO_NOISE_RNG);

    expect(afterSecondCycle.clubHistory).toHaveLength(2);
    expect(afterSecondCycle.clubHistory[0].ageFrom).toBe(STARTING_AGE);
    expect(afterSecondCycle.clubHistory[1].ageFrom).toBe(STARTING_AGE + 2);
  });
});

describe("applyDelta", () => {
  it("dovrebbe applicare il delta OVR e ricalcolare il valore di mercato", () => {
    const player = createPlayer(IDENTITY);
    const boosted = applyDelta(player, { ovrDelta: 3 });

    expect(boosted.ovr).toBe(player.ovr + 3);
    expect(boosted.marketValueEur).toBeGreaterThan(player.marketValueEur);
  });

  it("non dovrebbe far scendere l'OVR sotto il minimo di 30", () => {
    const player = createPlayer(IDENTITY);
    const crashed = applyDelta(player, { ovrDelta: -100 });

    expect(crashed.ovr).toBe(30);
  });
});

describe("resolveOutcome", () => {
  it("dovrebbe restituire sempre lo stesso outcome se ha peso 100 e l'altro peso 0", () => {
    const outcomes: DecisionOutcome[] = [
      { weight: 100, effect: { ovrDelta: 1 }, resultText: "certo" },
      { weight: 0, effect: { ovrDelta: -1 }, resultText: "impossibile" },
    ];

    expect(resolveOutcome(outcomes, () => 0).resultText).toBe("certo");
    expect(resolveOutcome(outcomes, () => 0.999).resultText).toBe("certo");
  });

  it("dovrebbe rispettare i confini cumulativi dei pesi tra le opzioni", () => {
    const outcomes: DecisionOutcome[] = [
      { weight: 30, effect: {}, resultText: "basso" },
      { weight: 70, effect: {}, resultText: "alto" },
    ];

    expect(resolveOutcome(outcomes, () => 0.29).resultText).toBe("basso");
    expect(resolveOutcome(outcomes, () => 0.31).resultText).toBe("alto");
  });

  it("dovrebbe lanciare un errore se non ci sono outcome disponibili", () => {
    expect(() => resolveOutcome([], () => 0.5)).toThrow();
  });
});

describe("checkRetirement", () => {
  it("dovrebbe restituire false se il giocatore ha meno di 34 anni", () => {
    const player = { ...createPlayer(IDENTITY), age: 33 };
    expect(checkRetirement(player, () => 0)).toBe(false);
  });

  it("dovrebbe restituire true se il giocatore ha 40 anni o più", () => {
    const player = { ...createPlayer(IDENTITY), age: 40 };
    expect(checkRetirement(player, () => 0.999)).toBe(true);
  });

  it("dovrebbe essere probabilistico tra i 34 e i 40 anni", () => {
    const player = { ...createPlayer(IDENTITY), age: 37 }; // progress = 3/6, chance = (3/6)^2 = 0.25
    expect(checkRetirement(player, () => 0)).toBe(true); // roll 0 < chance
    expect(checkRetirement(player, () => 0.9)).toBe(false); // roll 0.9 > chance
  });
});

describe("retire", () => {
  it("dovrebbe segnare il giocatore come ritirato e rimuovere il club corrente", () => {
    const player = signWithClub(createPlayer(IDENTITY), TEST_CLUB);
    const retiredPlayer = retire(player);

    expect(retiredPlayer.retired).toBe(true);
    expect(retiredPlayer.club).toBeNull();
  });
});
