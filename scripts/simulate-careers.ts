import { it } from "vitest";
import type { AwardType, DecisionCategory, PlayerIdentity, Position } from "@/types/career";
import { simulateCareer } from "@/lib/career/simulation";

/**
 * Strumento di taratura manuale (non un test): gira N carriere con Math.random reale e stampa
 * le frequenze empiriche delle meccaniche probabilistiche del motore, da confrontare con
 * l'obiettivo "generoso ma non assurdo" rispetto all'originale (vedi piano di implementazione).
 * Eseguire con `npm run simulate`.
 */
const CAREER_COUNT = 2000;
const POSITIONS: Position[] = ["GK", "CB", "CDM", "CM", "CAM", "ST"];
const NATIONALITIES = ["Italy", "Brazil", "Portugal", "France", "Argentina", "Netherlands"];

function buildIdentity(index: number): PlayerIdentity {
  return {
    lastName: `Player${index}`,
    number: (index % 99) + 1,
    foot: index % 2 === 0 ? "right" : "left",
    nationality: NATIONALITIES[index % NATIONALITIES.length],
    position: POSITIONS[index % POSITIONS.length],
  };
}

function pct(count: number, total: number): string {
  return `${((count / total) * 100).toFixed(1)}%`;
}

it("simula molte carriere e stampa le frequenze osservate", () => {
  const results = Array.from({ length: CAREER_COUNT }, (_, index) =>
    simulateCareer(buildIdentity(index), "normal", Math.random),
  );

  const withClubTrophy = results.filter((r) => r.player.trophies.some((t) => t.club)).length;
  const withNationalTrophy = results.filter((r) => r.player.trophies.some((t) => !t.club)).length;
  const withCallup = results.filter((r) => r.player.nationalTeam.called).length;
  const withInjury = results.filter((r) => r.injuryCount > 0).length;

  const awardCounts: Record<AwardType, number> = {
    "player-of-the-season": 0,
    "ballon-dor": 0,
    "top-scorer": 0,
  };
  let totalTrophies = 0;
  let totalAwards = 0;
  const retirementAges: Record<number, number> = {};
  const categoryTotals: Partial<Record<DecisionCategory, number>> = {};
  let totalCyclesPlayed = 0;

  for (const { player, categoryPicks, cyclesPlayed } of results) {
    totalTrophies += player.trophies.length;
    totalAwards += player.awards.length;
    for (const award of player.awards) awardCounts[award.type] += 1;
    retirementAges[player.age] = (retirementAges[player.age] ?? 0) + 1;
    totalCyclesPlayed += cyclesPlayed;
    for (const [cat, count] of Object.entries(categoryPicks)) {
      const key = cat as DecisionCategory;
      categoryTotals[key] = (categoryTotals[key] ?? 0) + (count ?? 0);
    }
  }

  console.log(`\n=== Simulazione di ${CAREER_COUNT} carriere ===\n`);
  console.log(`Almeno 1 trofeo di club:       ${pct(withClubTrophy, CAREER_COUNT)}`);
  console.log(`Almeno 1 trofeo di nazionale:  ${pct(withNationalTrophy, CAREER_COUNT)}`);
  console.log(`Almeno 1 convocazione:         ${pct(withCallup, CAREER_COUNT)}`);
  console.log(`Almeno 1 infortunio:           ${pct(withInjury, CAREER_COUNT)}`);
  console.log(`Trofei medi per carriera:      ${(totalTrophies / CAREER_COUNT).toFixed(2)}`);
  console.log(`Award medi per carriera:       ${(totalAwards / CAREER_COUNT).toFixed(2)}`);
  console.log(`\n--- Award per tipo (carriere con almeno 1) ---`);
  for (const [type, count] of Object.entries(awardCounts)) {
    console.log(`  ${type}: ${pct(count, CAREER_COUNT)}`);
  }

  console.log(`\n--- Età di ritiro ---`);
  for (const age of Object.keys(retirementAges).map(Number).sort((a, b) => a - b)) {
    console.log(`  ${age} anni: ${pct(retirementAges[age], CAREER_COUNT)}`);
  }

  console.log(`\n--- Frequenza scelta categoria (su ${totalCyclesPlayed} cicli totali) ---`);
  for (const [cat, count] of Object.entries(categoryTotals).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))) {
    console.log(`  ${cat}: ${pct(count ?? 0, totalCyclesPlayed)}`);
  }
  console.log("");
});
