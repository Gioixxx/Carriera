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
});
