import { describe, expect, it } from "vitest";
import type { PlayerIdentity, Position } from "@/types/career";
import { simulateCareer } from "./simulation";

/** PRNG deterministico (mulberry32) — stessa sequenza ad ogni run, niente flakiness in CI. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const POSITIONS: Position[] = ["GK", "CB", "CDM", "CM", "CAM", "ST"];
const NATIONALITIES = ["Italy", "Brazil", "Portugal", "France"];
const BATCH_SIZE = 400;

function buildIdentity(index: number): PlayerIdentity {
  return {
    lastName: `Sim${index}`,
    number: (index % 99) + 1,
    foot: index % 2 === 0 ? "right" : "left",
    nationality: NATIONALITIES[index % NATIONALITIES.length],
    position: POSITIONS[index % POSITIONS.length],
  };
}

describe("simulateCareer — batch smoke test (seed fisso)", () => {
  const rng = mulberry32(42);
  const results = Array.from({ length: BATCH_SIZE }, (_, index) =>
    simulateCareer(buildIdentity(index), "normal", rng),
  );

  it("ogni carriera si ritira entro la finestra 34-40 anni", () => {
    for (const { player } of results) {
      expect(player.retired).toBe(true);
      expect(player.age).toBeGreaterThanOrEqual(34);
      expect(player.age).toBeLessThanOrEqual(40);
    }
  });

  it("almeno una carriera vince un trofeo di club", () => {
    const withClubTrophy = results.filter((r) => r.player.trophies.some((t) => t.club));
    expect(withClubTrophy.length).toBeGreaterThan(0);
  });

  it("almeno una carriera riceve una convocazione in nazionale", () => {
    const withCallup = results.filter((r) => r.player.nationalTeam.called);
    expect(withCallup.length).toBeGreaterThan(0);
  });

  it("almeno una carriera subisce un infortunio", () => {
    const withInjury = results.filter((r) => r.injuryCount > 0);
    expect(withInjury.length).toBeGreaterThan(0);
  });
});
