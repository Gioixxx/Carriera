import { describe, expect, it } from "vitest";
import {
  accrueSalary,
  applyPopularityDelta,
  computeSalaryEur,
  popularityDeltaForCycle,
  resignSalary,
} from "./wallet";

describe("computeSalaryEur", () => {
  it("dovrebbe crescere con l'OVR", () => {
    expect(computeSalaryEur(85, 2)).toBeGreaterThan(computeSalaryEur(60, 2));
  });

  it("dovrebbe crescere con il prestigio del club", () => {
    expect(computeSalaryEur(70, 3)).toBeGreaterThan(computeSalaryEur(70, 0));
  });
});

describe("accrueSalary", () => {
  it("dovrebbe sommare lo stipendio per il numero di stagioni", () => {
    const wallet = { salaryEurPerCycle: 10_000, savingsEur: 5_000 };
    const accrued = accrueSalary(wallet, 2);
    expect(accrued.savingsEur).toBe(25_000);
  });
});

describe("resignSalary", () => {
  it("dovrebbe ricalcolare lo stipendio senza toccare i risparmi", () => {
    const wallet = { salaryEurPerCycle: 10_000, savingsEur: 5_000 };
    const resigned = resignSalary(wallet, 90, 3);
    expect(resigned.salaryEurPerCycle).toBeGreaterThan(0);
    expect(resigned.savingsEur).toBe(5_000);
  });
});

describe("popularityDeltaForCycle", () => {
  it("dovrebbe essere maggiore con trofei e award vinti rispetto a un ciclo senza nulla", () => {
    const withGlory = popularityDeltaForCycle({ goals: 5, trophiesWon: 1, awardsWon: 1 });
    const withoutGlory = popularityDeltaForCycle({ goals: 5, trophiesWon: 0, awardsWon: 0 });
    expect(withGlory).toBeGreaterThan(withoutGlory);
  });

  it("dovrebbe essere leggermente negativo in un ciclo senza gol né successi", () => {
    expect(popularityDeltaForCycle({ goals: 0, trophiesWon: 0, awardsWon: 0 })).toBeLessThan(0);
  });
});

describe("applyPopularityDelta", () => {
  it("dovrebbe fare clamp a 0-100", () => {
    expect(applyPopularityDelta(95, 50)).toBe(100);
    expect(applyPopularityDelta(5, -50)).toBe(0);
  });
});
