import { describe, expect, it } from "vitest";
import { injuryChance, rollInjury, tickInjury } from "./injuries";

describe("injuryChance", () => {
  it("dovrebbe crescere con l'età oltre i 30 anni", () => {
    expect(injuryChance(35, "CM", 1)).toBeGreaterThan(injuryChance(25, "CM", 1));
  });

  it("dovrebbe essere maggiore per ruoli ad alto rischio", () => {
    expect(injuryChance(25, "ST", 1)).toBeGreaterThan(injuryChance(25, "CM", 1));
  });

  it("dovrebbe crescere con il numero di stagioni del ciclo", () => {
    expect(injuryChance(25, "CM", 3)).toBeGreaterThan(injuryChance(25, "CM", 1));
  });

  it("non dovrebbe mai superare 0.35", () => {
    expect(injuryChance(40, "ST", 3)).toBeLessThanOrEqual(0.35);
  });
});

describe("rollInjury", () => {
  it("dovrebbe restituire null se il roll è sopra la soglia di probabilità", () => {
    expect(rollInjury(25, "CM", 1, () => 0.99)).toBeNull();
  });

  it("dovrebbe restituire un infortunio deterministico se il roll è sotto la soglia", () => {
    const injury = rollInjury(35, "ST", 1, () => 0);
    expect(injury).not.toBeNull();
    expect(injury?.turnsRemaining).toBeGreaterThan(0);
    expect(injury?.ovrPenalty).toBeGreaterThan(0);
  });
});

describe("tickInjury", () => {
  it("dovrebbe decrementare i cicli residui", () => {
    const injury = { label: "Test", turnsRemaining: 2, ovrPenalty: 4 };
    const ticked = tickInjury(injury);
    expect(ticked).toEqual({ label: "Test", turnsRemaining: 1, ovrPenalty: 4 });
  });

  it("dovrebbe restituire null (guarito) quando i cicli residui arrivano a 0", () => {
    const injury = { label: "Test", turnsRemaining: 1, ovrPenalty: 4 };
    expect(tickInjury(injury)).toBeNull();
  });
});
