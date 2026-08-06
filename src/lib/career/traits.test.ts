import { describe, expect, it } from "vitest";
import type { Traits } from "@/types/career";
import { applyTraitsDelta, deriveArchetype, NEUTRAL_TRAITS } from "./traits";

describe("applyTraitsDelta", () => {
  it("dovrebbe sommare il delta ai vettori esistenti", () => {
    const next = applyTraitsDelta(NEUTRAL_TRAITS, { loyalty: 10, ambition: -5 });
    expect(next.loyalty).toBe(60);
    expect(next.ambition).toBe(45);
    expect(next.showmanship).toBe(50);
  });

  it("dovrebbe clampare a 0-100", () => {
    const next = applyTraitsDelta(NEUTRAL_TRAITS, { loyalty: 1000, discipline: -1000 });
    expect(next.loyalty).toBe(100);
    expect(next.discipline).toBe(0);
  });

  it("dovrebbe lasciare invariati i vettori non presenti nel delta", () => {
    const next = applyTraitsDelta(NEUTRAL_TRAITS, {});
    expect(next).toEqual(NEUTRAL_TRAITS);
  });
});

describe("deriveArchetype", () => {
  it("dovrebbe restituire null se nessun vettore supera la soglia", () => {
    expect(deriveArchetype(NEUTRAL_TRAITS, 0)).toEqual({ primary: null, secondary: null });
  });

  it("dovrebbe derivare flagbearer da alta loyalty", () => {
    const traits: Traits = { ...NEUTRAL_TRAITS, loyalty: 80 };
    expect(deriveArchetype(traits, 0).primary).toBe("flagbearer");
  });

  it("dovrebbe derivare showman da alta showmanship", () => {
    const traits: Traits = { ...NEUTRAL_TRAITS, showmanship: 80 };
    expect(deriveArchetype(traits, 0).primary).toBe("showman");
  });

  it("dovrebbe derivare pro da alta discipline", () => {
    const traits: Traits = { ...NEUTRAL_TRAITS, discipline: 80 };
    expect(deriveArchetype(traits, 0).primary).toBe("pro");
  });

  it("dovrebbe derivare leader da alta leadership", () => {
    const traits: Traits = { ...NEUTRAL_TRAITS, leadership: 80 };
    expect(deriveArchetype(traits, 0).primary).toBe("leader");
  });

  it("mercenary richiede ambition alta E loyalty bassa insieme, non solo ambition alta", () => {
    const highAmbitionOnly: Traits = { ...NEUTRAL_TRAITS, ambition: 80 };
    expect(deriveArchetype(highAmbitionOnly, 0).primary).toBeNull();

    const mercenary: Traits = { ...NEUTRAL_TRAITS, ambition: 80, loyalty: 20 };
    expect(deriveArchetype(mercenary, 0).primary).toBe("mercenary");
  });

  it("problem emerge da bassa discipline + alta showmanship", () => {
    const traits: Traits = { ...NEUTRAL_TRAITS, discipline: 20, showmanship: 80 };
    expect(deriveArchetype(traits, 0).primary).toBe("problem");
  });

  it("problem emerge anche da shadow alto senza bassa discipline", () => {
    expect(deriveArchetype(NEUTRAL_TRAITS, 60).primary).toBe("problem");
  });

  it("problem ha priorità su mercenary quando entrambe le condizioni sono vere", () => {
    const traits: Traits = { ...NEUTRAL_TRAITS, ambition: 80, loyalty: 20, discipline: 20, showmanship: 80 };
    expect(deriveArchetype(traits, 0).primary).toBe("problem");
    expect(deriveArchetype(traits, 0).secondary).toBe("mercenary");
  });

  it("dovrebbe assegnare un secondary solo se qualifica indipendentemente", () => {
    const traits: Traits = { ...NEUTRAL_TRAITS, loyalty: 80, showmanship: 70 };
    const result = deriveArchetype(traits, 0);
    expect(result.primary).toBe("flagbearer");
    expect(result.secondary).toBe("showman");
  });
});
