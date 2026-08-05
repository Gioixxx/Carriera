import { describe, expect, it } from "vitest";
import { countries } from "./countries";
import {
  clubs,
  clubsByCountry,
  clubsByTier,
  getClub,
  getLeague,
  leagues,
} from "./clubs";

describe("leagues", () => {
  it("dovrebbe avere id univoci", () => {
    const ids = leagues.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ogni lega dovrebbe avere almeno un club assegnato", () => {
    for (const league of leagues) {
      const clubsInLeague = clubsByTier(league.country, league.tier);
      expect(clubsInLeague.length).toBeGreaterThan(0);
    }
  });
});

describe("clubs", () => {
  it("dovrebbe avere id univoci tra tutti i club", () => {
    const ids = clubs.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ogni club dovrebbe avere un prestige tra 0 e 3", () => {
    for (const c of clubs) {
      expect(c.prestige).toBeGreaterThanOrEqual(0);
      expect(c.prestige).toBeLessThanOrEqual(3);
    }
  });

  it("ogni club dovrebbe appartenere a un paese presente in countries.ts", () => {
    const countryNames = new Set(countries.map((c) => c.name));
    for (const c of clubs) {
      expect(countryNames.has(c.country)).toBe(true);
    }
  });

  it("ogni club dovrebbe avere campionato e coppa nazionale coerenti con la propria lega", () => {
    for (const c of clubs) {
      const league = getLeague(
        leagues.find((l) => l.country === c.country && l.tier === c.tier)!.id,
      );
      expect(c.competitions.league).toBe(league!.name);
      expect(c.competitions.cup).toBe(league!.cup);
    }
  });

  it("solo i club di tier 1 dovrebbero avere una coppa continentale assegnata", () => {
    for (const c of clubs) {
      if (c.tier === 1) {
        expect(c.competitions.continental).toBeDefined();
      } else {
        expect(c.competitions.continental).toBeUndefined();
      }
    }
  });

  it("ogni club dovrebbe avere un crestUrl valido (hotlink https a thesportsdb.com)", () => {
    for (const c of clubs) {
      expect(c.crestUrl).toMatch(/^https:\/\/(r2|www)\.thesportsdb\.com\//);
    }
  });

  it("getClub dovrebbe restituire il club corretto per id", () => {
    expect(getClub("juventus")?.name).toBe("Juventus");
    expect(getClub("id-inesistente")).toBeUndefined();
  });

  it("clubsByCountry dovrebbe restituire solo i club di quel paese", () => {
    const italianClubs = clubsByCountry("Italy");
    expect(italianClubs.length).toBeGreaterThan(0);
    expect(italianClubs.every((c) => c.country === "Italy")).toBe(true);
  });

  it("clubsByTier dovrebbe filtrare per paese e livello insieme", () => {
    const serieA = clubsByTier("Italy", 1);
    expect(serieA.length).toBeGreaterThan(0);
    expect(serieA.every((c) => c.country === "Italy" && c.tier === 1)).toBe(true);
  });
});
