import { describe, expect, it } from "vitest";
import { computeMarketValue } from "./market";

const YOUNG_STARTER_AGE = 16;
const PEAK_AGE = 27;
const VETERAN_AGE = 36;
const LOW_OVR = 50;
const HIGH_OVR = 88;

describe("computeMarketValue", () => {
  it("dovrebbe crescere se l'OVR aumenta a parità di età", () => {
    const low = computeMarketValue(LOW_OVR, PEAK_AGE);
    const high = computeMarketValue(HIGH_OVR, PEAK_AGE);
    expect(high).toBeGreaterThan(low);
  });

  it("dovrebbe valere di meno per un veterano che per un giocatore nel pieno della carriera allo stesso OVR", () => {
    const peak = computeMarketValue(HIGH_OVR, PEAK_AGE);
    const veteran = computeMarketValue(HIGH_OVR, VETERAN_AGE);
    expect(veteran).toBeLessThan(peak);
  });

  it("dovrebbe restituire un valore positivo anche per un giovane a inizio carriera", () => {
    const value = computeMarketValue(LOW_OVR, YOUNG_STARTER_AGE);
    expect(value).toBeGreaterThan(0);
  });

  it("dovrebbe restituire un valore arrotondato, non un numero con decimali arbitrari", () => {
    const value = computeMarketValue(HIGH_OVR, PEAK_AGE);
    expect(Number.isInteger(value)).toBe(true);
    expect(value % 10_000).toBe(0);
  });

  describe("breakpoint del moltiplicatore per età", () => {
    it("dovrebbe restare invariato tra 21 e 22 anni (continuità tra formula lineare e tabella)", () => {
      expect(computeMarketValue(HIGH_OVR, 21)).toBe(computeMarketValue(HIGH_OVR, 22));
    });

    it("dovrebbe restare invariato durante il plateau 22-27 anni", () => {
      expect(computeMarketValue(HIGH_OVR, 27)).toBe(computeMarketValue(HIGH_OVR, 22));
    });

    it("dovrebbe scendere passando da 27 a 28 anni", () => {
      expect(computeMarketValue(HIGH_OVR, 28)).toBeLessThan(computeMarketValue(HIGH_OVR, 27));
    });

    it("dovrebbe scendere passando da 30 a 31 anni", () => {
      expect(computeMarketValue(HIGH_OVR, 31)).toBeLessThan(computeMarketValue(HIGH_OVR, 30));
    });

    it("dovrebbe scendere passando da 33 a 34 anni", () => {
      expect(computeMarketValue(HIGH_OVR, 34)).toBeLessThan(computeMarketValue(HIGH_OVR, 33));
    });

    it("dovrebbe scendere passando da 36 a 37 anni", () => {
      expect(computeMarketValue(HIGH_OVR, 37)).toBeLessThan(computeMarketValue(HIGH_OVR, 36));
    });
  });

  describe("granularità di arrotondamento per fascia di valore", () => {
    it("dovrebbe arrotondare ai 10.000 EUR sotto la soglia di 1 milione", () => {
      const value = computeMarketValue(46, PEAK_AGE);
      expect(value).toBeLessThan(1_000_000);
      expect(value % 10_000).toBe(0);
    });

    it("dovrebbe arrotondare ai 100.000 EUR tra 1 e 10 milioni", () => {
      const value = computeMarketValue(65, PEAK_AGE);
      expect(value).toBeGreaterThanOrEqual(1_000_000);
      expect(value).toBeLessThan(10_000_000);
      expect(value % 100_000).toBe(0);
    });

    it("dovrebbe arrotondare ai 500.000 EUR sopra i 10 milioni", () => {
      const value = computeMarketValue(90, PEAK_AGE);
      expect(value).toBeGreaterThanOrEqual(10_000_000);
      expect(value % 500_000).toBe(0);
    });
  });
});
