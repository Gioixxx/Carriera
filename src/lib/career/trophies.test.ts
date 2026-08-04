import { describe, expect, it } from "vitest";
import type { Club } from "@/types/career";
import { getClub } from "@/data/clubs";
import { awardChance, clubTrophyChance, nationalTournamentWinChance, rollAward, rollClubTrophies, rollNationalTrophy } from "./trophies";

const JUVENTUS = getClub("juventus")!; // prestige 3, competitions: Serie A / Coppa Italia / Champions League
const LOW_PRESTIGE_CLUB = getClub("reggiana")!; // prestige 0, no continental

describe("clubTrophyChance", () => {
  it("dovrebbe crescere con il prestigio del club", () => {
    expect(clubTrophyChance(3, 70)).toBeGreaterThan(clubTrophyChance(0, 70));
  });

  it("dovrebbe crescere con l'OVR a parità di prestigio", () => {
    expect(clubTrophyChance(2, 90)).toBeGreaterThan(clubTrophyChance(2, 60));
  });

  it("non dovrebbe mai superare 0.5", () => {
    expect(clubTrophyChance(3, 99)).toBeLessThanOrEqual(0.5);
  });
});

describe("rollClubTrophies", () => {
  it("dovrebbe assegnare campionato e coppa se il roll è favorevole", () => {
    const trophies = rollClubTrophies(JUVENTUS, 90, 25, () => 0);
    expect(trophies).toHaveLength(2);
    expect(trophies[0].competition).toBe("Serie A");
    expect(trophies[1].competition).toBe("Coppa Italia");
  });

  it("non dovrebbe assegnare nulla se il roll è sfavorevole", () => {
    const trophies = rollClubTrophies(JUVENTUS, 90, 25, () => 0.999);
    expect(trophies).toHaveLength(0);
  });

  it("un club senza coppa nazionale non dovrebbe mai generare quel trofeo", () => {
    const clubWithoutCup: Club = { ...LOW_PRESTIGE_CLUB, competitions: { league: "Serie B" } };
    const trophies = rollClubTrophies(clubWithoutCup, 90, 25, () => 0);
    expect(trophies.every((t) => t.competition !== undefined)).toBe(true);
    expect(trophies.some((t) => t.competition === "Coppa Italia")).toBe(false);
  });
});

describe("nationalTournamentWinChance", () => {
  it("dovrebbe essere zero sotto la soglia minima", () => {
    expect(nationalTournamentWinChance(70)).toBe(0);
  });

  it("non dovrebbe mai superare 0.2", () => {
    expect(nationalTournamentWinChance(150)).toBeLessThanOrEqual(0.2);
  });
});

describe("rollNationalTrophy", () => {
  it("dovrebbe restituire null se il giocatore non è convocato", () => {
    expect(rollNationalTrophy(false, 95, 28, () => 0)).toBeNull();
  });

  it("dovrebbe restituire un trofeo senza club se il roll è favorevole", () => {
    const trophy = rollNationalTrophy(true, 95, 28, () => 0);
    expect(trophy).not.toBeNull();
    expect(trophy?.club).toBeUndefined();
    expect(["Mondiale", "Europei"]).toContain(trophy?.competition);
  });
});

describe("awardChance", () => {
  it("dovrebbe essere zero sotto la soglia OVR 85", () => {
    expect(awardChance(84)).toBe(0);
  });

  it("dovrebbe crescere con l'OVR sopra la soglia", () => {
    expect(awardChance(95)).toBeGreaterThan(awardChance(87));
  });
});

describe("rollAward", () => {
  it("dovrebbe restituire null se l'OVR è sotto soglia", () => {
    const player = { ovr: 80, club: JUVENTUS };
    expect(rollAward(player, { apps: 30, goals: 20, assists: 10 }, 27, () => 0)).toBeNull();
  });

  it("dovrebbe restituire un award con club associato se il roll è favorevole", () => {
    const player = { ovr: 92, club: JUVENTUS };
    const award = rollAward(player, { apps: 30, goals: 20, assists: 10 }, 27, () => 0);
    expect(award).not.toBeNull();
    expect(award?.club).toEqual(JUVENTUS);
  });

  it("dovrebbe restituire null se il giocatore è svincolato ma comunque gestire club undefined", () => {
    const player = { ovr: 92, club: null };
    const award = rollAward(player, { apps: 30, goals: 20, assists: 10 }, 27, () => 0);
    expect(award?.club).toBeUndefined();
  });
});
