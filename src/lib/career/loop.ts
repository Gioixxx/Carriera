import type {
  Award,
  Club,
  Decision,
  DecisionCategory,
  DecisionOption,
  GameSpeed,
  Injury,
  Player,
  SeasonTitleEntry,
  Trophy,
} from "@/types/career";
import {
  applyDelta,
  advanceSeasons,
  checkRetirement,
  resolveOutcome,
  retire,
  signWithClub,
  SEASONS_PER_CYCLE,
} from "./engine";
import { rollInjury, tickInjury } from "./injuries";
import { clamp, projectNationalStats, type Rng } from "./progression";
import { computeMarketValue } from "./market";
import {
  brokenRecordLabels,
  buildHighlightReel,
  detectOvrMilestones,
  evaluateObjective,
  evaluateSeasonTitle,
  pushSeasonTitle,
  rollCycleObjective,
  updatePersonalRecords,
  type CycleSatisfactionContext,
} from "./satisfaction";
import { accrueSalary, applyPopularityDelta, popularityDeltaForCycle } from "./wallet";
import {
  generateClubCrisis,
  generateClubPriority,
  generateCompetitionForSpot,
  generateContinentalFinalDecision,
  generateControversialPost,
  generateControversialStatement,
  generateEndOfCycle,
  generateLoanOffer,
  generateLoanReturn,
  generateReturnHome,
  generateSponsorDeal,
  generateTaxTrouble,
  generateTransferWindow,
  generateTriumphantReturn,
  generateUnexpectedProspect,
  isClubPriorityEligible,
  isReturnHomeEligible,
  isSponsorEligible,
  isTaxTroubleEligible,
  isTriumphantReturnEligible,
  isUnexpectedProspectEligible,
  LIFESTYLE_DECISIONS,
  pickDecisionCategory,
  rollNationalCallup,
} from "./decisions";
import { rollAward, rollClubTrophies, rollNationalTrophy } from "./trophies";
import { getCountry } from "@/data/countries";

export interface LoopContext {
  /** Club "di appartenenza" mentre si è in prestito altrove; null se non in prestito. */
  loanParentClub: Club | null;
}

export const INITIAL_LOOP_CONTEXT: LoopContext = { loanParentClub: null };

const MIN_CONTINENTAL_FINAL_OVR = 78;
const CONTINENTAL_FINAL_CHANCE = 0.15;

/** Categorie disponibili in un dato ciclo, in base allo stato del giocatore. */
export function availableCategories(player: Player, context: LoopContext): DecisionCategory[] {
  if (context.loanParentClub) {
    return ["loan-return"];
  }
  if (!player.club) {
    return ["end-of-cycle"];
  }
  const categories: DecisionCategory[] = [
    "transfer",
    "loan",
    "lifestyle",
    "position-change",
    "club-crisis",
    "end-of-cycle",
  ];
  if (
    isTaxTroubleEligible(player) ||
    isReturnHomeEligible(player) ||
    isUnexpectedProspectEligible(player) ||
    isTriumphantReturnEligible(player)
  ) {
    categories.push("narrative");
  }
  if (isSponsorEligible(player)) {
    categories.push("sponsor");
  }
  return categories;
}

export function shouldTriggerContinentalFinal(
  player: Player,
  context: LoopContext,
  rng: Rng = Math.random,
): boolean {
  if (context.loanParentClub) return false;
  if (!player.club?.competitions.continental) return false;
  if (player.ovr < MIN_CONTINENTAL_FINAL_OVR) return false;
  return rng() < CONTINENTAL_FINAL_CHANCE;
}

/** "Finish high school" ha senso solo a inizio carriera — unico evento del pool con un gate d'età. */
function pickStaticDecision(category: DecisionCategory, player: Player, rng: Rng): Decision {
  const pool = LIFESTYLE_DECISIONS.filter((d) => {
    if (d.category !== category) return false;
    if (d.id === "finish-high-school" && player.age > 17) return false;
    return true;
  });
  const index = Math.min(Math.floor(rng() * pool.length), pool.length - 1);
  return pool[index];
}

function pickClubCrisisDecision(player: Player, rng: Rng): Decision {
  const generators: Array<() => Decision> = [
    () => generateClubCrisis(player, rng),
    () => generateCompetitionForSpot(player, rng),
    () => generateControversialStatement(player, rng),
    () => generateControversialPost(player, rng),
  ];
  if (isClubPriorityEligible(player)) {
    generators.push(() => generateClubPriority(player));
  }
  const index = Math.min(Math.floor(rng() * generators.length), generators.length - 1);
  return generators[index]();
}

function pickNarrativeDecision(player: Player, rng: Rng): Decision {
  const generators: Array<() => Decision> = [];
  if (isTaxTroubleEligible(player)) generators.push(() => generateTaxTrouble(player, rng));
  if (isReturnHomeEligible(player)) generators.push(() => generateReturnHome(player, rng));
  if (isUnexpectedProspectEligible(player)) {
    generators.push(() => generateUnexpectedProspect(player, rng));
  }
  if (isTriumphantReturnEligible(player)) {
    generators.push(() => generateTriumphantReturn(player));
  }
  if (generators.length === 0) {
    throw new Error("Nessun evento narrativo disponibile per questo giocatore");
  }
  const index = Math.min(Math.floor(rng() * generators.length), generators.length - 1);
  return generators[index]();
}

export interface NextDecision {
  decision: Decision;
  category: DecisionCategory;
}

/** Sceglie la prossima decisione del ciclo, gestendo eventi speciali (coppa continentale) e categorie ordinarie. */
export function pickNextDecision(
  player: Player,
  context: LoopContext,
  recentCategories: DecisionCategory[],
  rng: Rng = Math.random,
): NextDecision {
  if (shouldTriggerContinentalFinal(player, context, rng)) {
    return {
      decision: generateContinentalFinalDecision(player, player.club!.competitions.continental!),
      category: "continental-final",
    };
  }

  const categories = availableCategories(player, context);
  const category = pickDecisionCategory(categories, recentCategories, rng);

  switch (category) {
    case "transfer":
      return { decision: generateTransferWindow(player, rng), category };
    case "loan":
      return { decision: generateLoanOffer(player, rng), category };
    case "loan-return": {
      if (!context.loanParentClub) {
        throw new Error("loan-return richiede un club di appartenenza nel contesto");
      }
      return { decision: generateLoanReturn(player, context.loanParentClub, rng), category };
    }
    case "club-crisis":
      return { decision: pickClubCrisisDecision(player, rng), category };
    case "end-of-cycle":
      return { decision: generateEndOfCycle(player, rng), category };
    case "lifestyle":
    case "position-change":
      return { decision: pickStaticDecision(category, player, rng), category };
    case "narrative":
      return { decision: pickNarrativeDecision(player, rng), category };
    case "sponsor":
      return { decision: generateSponsorDeal(player, rng), category };
    default:
      throw new Error(`Categoria di decisione non gestita nel loop: ${category}`);
  }
}

/** Calcola il prossimo contesto (club di appartenenza in prestito) dopo aver risolto un'opzione. */
export function nextLoopContext(
  category: DecisionCategory,
  option: DecisionOption,
  playerBeforeChange: Player,
  context: LoopContext,
): LoopContext {
  if (category === "loan") {
    return { loanParentClub: playerBeforeChange.club };
  }
  if (category === "loan-return") {
    if (option.id === "sign-permanent") {
      return { loanParentClub: null };
    }
    return context;
  }
  if (option.club) {
    return { loanParentClub: null };
  }
  return context;
}

export interface CycleResult {
  player: Player;
  context: LoopContext;
  retired: boolean;
  optionLabel: string;
  outcomeText: string;
  newTrophies: Trophy[];
  newAward: Award | null;
  nationalCallup: boolean;
  newInjury: Injury | null;
  injuryHealed: boolean;
  newMilestones: number[];
  seasonTitle: SeasonTitleEntry | null;
  objectiveResult: { label: string; met: boolean } | null;
  brokenRecords: string[];
  highlights: string[];
}

function emptySatisfactionFields(): Pick<
  CycleResult,
  "newMilestones" | "seasonTitle" | "objectiveResult" | "brokenRecords" | "highlights"
> {
  return {
    newMilestones: [],
    seasonTitle: null,
    objectiveResult: null,
    brokenRecords: [],
    highlights: [],
  };
}

/** Fa avanzare l'infortunio del giocatore di un ciclo, o ne estrae uno nuovo, aggiustando l'OVR. */
function processInjuries(
  player: Player,
  seasons: number,
  rng: Rng,
): { player: Player; newInjury: Injury | null; injuryHealed: boolean } {
  if (player.injury) {
    const ticked = tickInjury(player.injury);
    if (ticked === null) {
      const restoredOvr = clamp(player.ovr + player.injury.ovrPenalty, 30, 99);
      return {
        player: {
          ...player,
          injury: null,
          ovr: restoredOvr,
          marketValueEur: computeMarketValue(restoredOvr, player.age),
        },
        newInjury: null,
        injuryHealed: true,
      };
    }
    return { player: { ...player, injury: ticked }, newInjury: null, injuryHealed: false };
  }

  const rolled = rollInjury(player.age, player.position, seasons, rng);
  if (!rolled) {
    return { player, newInjury: null, injuryHealed: false };
  }
  const penalizedOvr = clamp(player.ovr - rolled.ovrPenalty, 30, 99);
  return {
    player: {
      ...player,
      injury: rolled,
      ovr: penalizedOvr,
      marketValueEur: computeMarketValue(penalizedOvr, player.age),
    },
    newInjury: rolled,
    injuryHealed: false,
  };
}

/** Applica l'esito di un'opzione scelta dal giocatore: delta, cambio club/ritiro, avanzamento stagioni, trofei/award/nazionale. */
export function resolveCycle(
  player: Player,
  context: LoopContext,
  category: DecisionCategory,
  option: DecisionOption,
  speed: GameSpeed,
  rng: Rng = Math.random,
): CycleResult {
  const ovrBefore = player.ovr;
  const wasAlreadyCalled = player.nationalTeam.called;
  const pendingObjective = player.currentObjective;

  const outcome = resolveOutcome(option.outcomes, rng);
  let nextPlayer = applyDelta(player, outcome.effect);

  if (option.retire) {
    nextPlayer = retire(nextPlayer);
    return {
      player: nextPlayer,
      context,
      retired: true,
      optionLabel: option.label,
      outcomeText: outcome.resultText,
      newTrophies: [],
      newAward: null,
      nationalCallup: false,
      newInjury: null,
      injuryHealed: false,
      ...emptySatisfactionFields(),
    };
  }

  if (option.club) {
    nextPlayer = signWithClub(nextPlayer, option.club);
  }

  const nextContext = nextLoopContext(category, option, player, context);
  const stintType = nextContext.loanParentClub ? "loan" : "permanent";
  const seasons = SEASONS_PER_CYCLE[speed];
  nextPlayer = advanceSeasons(nextPlayer, seasons, rng, stintType);

  const injuryResult = processInjuries(nextPlayer, seasons, rng);
  nextPlayer = injuryResult.player;
  nextPlayer = { ...nextPlayer, wallet: accrueSalary(nextPlayer.wallet, seasons) };

  const newTrophies: Trophy[] = nextPlayer.club
    ? rollClubTrophies(nextPlayer.club, nextPlayer.ovr, nextPlayer.age, rng)
    : [];

  if (category === "continental-final" && nextPlayer.club?.competitions.continental) {
    if (outcome.continentalWin === true) {
      newTrophies.push({
        competition: nextPlayer.club.competitions.continental,
        club: nextPlayer.club,
        age: nextPlayer.age,
      });
    }
  }

  let nationalCallup = false;
  let nationalGoalsThisCycle = 0;
  if (rollNationalCallup(nextPlayer, rng)) {
    nextPlayer = { ...nextPlayer, nationalTeam: { ...nextPlayer.nationalTeam, called: true } };
    nationalCallup = true;
  }

  if (nextPlayer.nationalTeam.called) {
    const natStats = projectNationalStats(nextPlayer.ovr, nextPlayer.position, seasons, rng);
    nationalGoalsThisCycle = natStats.goals;
    nextPlayer = {
      ...nextPlayer,
      nationalTeam: {
        called: true,
        apps: nextPlayer.nationalTeam.apps + natStats.apps,
        goals: nextPlayer.nationalTeam.goals + natStats.goals,
        assists: nextPlayer.nationalTeam.assists + natStats.assists,
        ...(nextPlayer.position === "GK"
          ? {
              goalsAgainst: (nextPlayer.nationalTeam.goalsAgainst ?? 0) + (natStats.goalsAgainst ?? 0),
              cleanSheets: (nextPlayer.nationalTeam.cleanSheets ?? 0) + (natStats.cleanSheets ?? 0),
            }
          : {}),
      },
    };
    const confederation = getCountry(nextPlayer.nationality)?.confederation ?? "UEFA";
    const nationalTrophy = rollNationalTrophy(true, nextPlayer.ovr, nextPlayer.age, confederation, rng);
    if (nationalTrophy) newTrophies.push(nationalTrophy);
  }

  if (newTrophies.length > 0) {
    nextPlayer = { ...nextPlayer, trophies: [...nextPlayer.trophies, ...newTrophies] };
  }

  const lastStint = nextPlayer.clubHistory[nextPlayer.clubHistory.length - 1];
  const newAward = rollAward(nextPlayer, lastStint?.stats ?? { apps: 0, goals: 0, assists: 0 }, nextPlayer.age, rng);
  if (newAward) {
    nextPlayer = { ...nextPlayer, awards: [...nextPlayer.awards, newAward] };
  }

  const popularityDelta = popularityDeltaForCycle({
    goals: lastStint?.stats.goals ?? 0,
    cleanSheets: lastStint?.stats.cleanSheets,
    trophiesWon: newTrophies.length,
    awardsWon: newAward ? 1 : 0,
  });
  nextPlayer = {
    ...nextPlayer,
    popularity: applyPopularityDelta(nextPlayer.popularity, popularityDelta),
  };

  const satCtx: CycleSatisfactionContext = {
    age: nextPlayer.age,
    ovrBefore,
    ovrAfter: nextPlayer.ovr,
    goals: lastStint?.stats.goals ?? 0,
    assists: lastStint?.stats.assists ?? 0,
    apps: lastStint?.stats.apps ?? 0,
    cleanSheets: lastStint?.stats.cleanSheets,
    trophies: newTrophies,
    award: newAward,
    newInjury: injuryResult.newInjury,
    injuryHealed: injuryResult.injuryHealed,
    nationalCallup,
    nationalGoals: nationalGoalsThisCycle,
    marketValueEur: nextPlayer.marketValueEur,
    wasAlreadyCalled,
  };

  const newMilestoneEntries = detectOvrMilestones(
    ovrBefore,
    nextPlayer.ovr,
    nextPlayer.milestonesReached,
    nextPlayer.age,
  );
  if (newMilestoneEntries.length > 0) {
    nextPlayer = {
      ...nextPlayer,
      milestonesReached: [...nextPlayer.milestonesReached, ...newMilestoneEntries],
    };
  }

  let objectiveResult: { label: string; met: boolean } | null = null;
  if (pendingObjective) {
    const evaluated = evaluateObjective(pendingObjective, satCtx);
    objectiveResult = { label: pendingObjective.label, met: evaluated.met };
    if (evaluated.met) {
      nextPlayer = applyDelta(nextPlayer, evaluated.reward);
    }
  }

  const seasonTitle = evaluateSeasonTitle({
    age: nextPlayer.age,
    goals: satCtx.goals,
    assists: satCtx.assists,
    apps: satCtx.apps,
    cleanSheets: satCtx.cleanSheets,
    trophies: newTrophies,
    award: newAward,
    newInjury: injuryResult.newInjury,
    injuryHealed: injuryResult.injuryHealed,
    ovrDelta: nextPlayer.ovr - ovrBefore,
    nationalCallup,
    nationalGoals: nationalGoalsThisCycle,
  });
  nextPlayer = {
    ...nextPlayer,
    seasonTitles: pushSeasonTitle(nextPlayer.seasonTitles, seasonTitle),
  };

  const recordsUpdate = updatePersonalRecords(nextPlayer.records, satCtx);
  nextPlayer = { ...nextPlayer, records: recordsUpdate.records };
  const brokenRecords = brokenRecordLabels(recordsUpdate.broken);

  const highlights = buildHighlightReel(satCtx, rng);

  if (checkRetirement(nextPlayer, rng)) {
    nextPlayer = retire(nextPlayer);
  }

  if (!nextPlayer.retired) {
    nextPlayer = { ...nextPlayer, currentObjective: rollCycleObjective(nextPlayer, rng) };
  } else {
    nextPlayer = { ...nextPlayer, currentObjective: null };
  }

  return {
    player: nextPlayer,
    context: nextContext,
    retired: nextPlayer.retired,
    optionLabel: option.label,
    outcomeText: outcome.resultText,
    newTrophies,
    newAward,
    nationalCallup,
    newInjury: injuryResult.newInjury,
    injuryHealed: injuryResult.injuryHealed,
    newMilestones: newMilestoneEntries.map((m) => m.ovr),
    seasonTitle,
    objectiveResult,
    brokenRecords,
    highlights,
  };
}

const RECENT_CATEGORIES_WINDOW = 3;

export function pushRecentCategory(
  recentCategories: DecisionCategory[],
  category: DecisionCategory,
): DecisionCategory[] {
  return [...recentCategories, category].slice(-RECENT_CATEGORIES_WINDOW);
}
