import { describe, expect, it } from "vitest";
import { clubs, leagues } from "./clubs";
import { COMPETITION_BADGES, getCompetitionBadge } from "./competition-badges";

describe("COMPETITION_BADGES", () => {
  it("ogni URL è un hotlink https a thesportsdb.com", () => {
    for (const url of Object.values(COMPETITION_BADGES)) {
      expect(url).toMatch(/^https:\/\/(r2\.)?thesportsdb\.com\//);
    }
  });

  it("copre campionato e coppa nazionale di ogni lega tranne Serie C (nessun badge unico)", () => {
    for (const league of leagues) {
      if (league.name === "Serie C") continue;
      expect(getCompetitionBadge(league.name)).toBeDefined();
      expect(getCompetitionBadge(league.cup)).toBeDefined();
    }
  });

  it("copre la coppa continentale di ogni club di tier 1", () => {
    for (const c of clubs) {
      if (c.tier === 1 && c.competitions.continental) {
        expect(getCompetitionBadge(c.competitions.continental)).toBeDefined();
      }
    }
  });

  it("restituisce undefined per una competizione sconosciuta", () => {
    expect(getCompetitionBadge("Serie C")).toBeUndefined();
    expect(getCompetitionBadge("Torneo inesistente")).toBeUndefined();
  });
});
