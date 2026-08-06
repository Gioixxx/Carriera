import { describe, expect, it } from "vitest";
import { clubs, leagues } from "./clubs";
import { COMPETITION_BADGES, CUP_BADGES_KNOWN_GAP, getCompetitionBadge } from "./competition-badges";

describe("COMPETITION_BADGES", () => {
  it("ogni URL è un hotlink https a thesportsdb.com", () => {
    for (const url of Object.values(COMPETITION_BADGES)) {
      expect(url).toMatch(/^https:\/\/(r2\.|www\.)?thesportsdb\.com\//);
    }
  });

  it("copre il campionato di ogni lega tranne Serie C (nessun badge unico)", () => {
    for (const league of leagues) {
      if (league.name === "Serie C") continue;
      expect(getCompetitionBadge(league.name)).toBeDefined();
    }
  });

  it("copre la coppa nazionale quando esiste ed è fuori dai gap noti di copertura TSDB", () => {
    for (const league of leagues) {
      if (!league.cup) continue; // niente coppa nazionale attiva (es. Messico)
      if (CUP_BADGES_KNOWN_GAP.includes(league.cup)) continue; // copertura TSDB nota mancante
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
