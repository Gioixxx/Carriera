import { describe, expect, it } from "vitest";
import { getClub } from "@/data/clubs";
import { applyClubTierMovement, relegationChance } from "./club-progression";

const TORINO = getClub("torino")!; // Serie A (tier 1), prestige 1
const SAMPDORIA = getClub("sampdoria")!; // Serie B (tier 2), prestige 1
const BENFICA = getClub("benfica")!; // Primeira Liga, unico tier modellato per il Portogallo

describe("relegationChance", () => {
  it("dovrebbe decrescere con il prestigio", () => {
    expect(relegationChance(0)).toBeGreaterThan(relegationChance(3));
  });

  it("non dovrebbe mai scendere sotto zero", () => {
    expect(relegationChance(3)).toBeGreaterThanOrEqual(0);
  });
});

describe("applyClubTierMovement", () => {
  it("promuove un club che ha appena vinto il campionato del proprio tier", () => {
    const result = applyClubTierMovement(SAMPDORIA, true, () => 0);
    expect(result.change).toBe("promoted");
    expect(result.club.tier).toBe(1);
    expect(result.club.competitions.league).toBe("Serie A");
  });

  it("non promuove un club già al tier 1 anche vincendo il campionato", () => {
    const result = applyClubTierMovement(TORINO, true, () => 0);
    expect(result.change).toBeNull();
    expect(result.club).toEqual(TORINO);
  });

  it("retrocede un club se il roll è sfavorevole e il campionato non è stato vinto", () => {
    const result = applyClubTierMovement(TORINO, false, () => 0);
    expect(result.change).toBe("relegated");
    expect(result.club.tier).toBe(2);
    expect(result.club.competitions.league).toBe("Serie B");
  });

  it("non retrocede se il roll è favorevole (sopra la soglia di rischio)", () => {
    const result = applyClubTierMovement(TORINO, false, () => 0.999);
    expect(result.change).toBeNull();
  });

  it("è un no-op per un club di un paese con un solo tier modellato", () => {
    const result = applyClubTierMovement(BENFICA, false, () => 0);
    expect(result.change).toBeNull();
    expect(result.club).toEqual(BENFICA);
  });

  it("il club ricostruito mantiene id/nome/prestigio/stemma invariati", () => {
    const result = applyClubTierMovement(SAMPDORIA, true, () => 0);
    expect(result.club.id).toBe(SAMPDORIA.id);
    expect(result.club.name).toBe(SAMPDORIA.name);
    expect(result.club.prestige).toBe(SAMPDORIA.prestige);
    expect(result.club.crestUrl).toBe(SAMPDORIA.crestUrl);
  });
});
