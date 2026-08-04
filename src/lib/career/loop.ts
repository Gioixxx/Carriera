import type {
  Award,
  Club,
  Decision,
  DecisionCategory,
  DecisionOption,
  GameSpeed,
  Player,
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
import { projectNationalStats, type Rng } from "./progression";
import {
  generateClubCrisis,
  generateCompetitionForSpot,
  generateContinentalFinalDecision,
  generateControversialStatement,
  generateEndOfCycle,
  generateLoanOffer,
  generateLoanReturn,
  generateReturnHome,
  generateTaxTrouble,
  generateTransferWindow,
  isReturnHomeEligible,
  isTaxTroubleEligible,
  LIFESTYLE_DECISIONS,
  pickDecisionCategory,
  rollNationalCallup,
} from "./decisions";
import { rollAward, rollClubTrophies, rollNationalTrophy } from "./trophies";

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
  if (isTaxTroubleEligible(player) || isReturnHomeEligible(player)) {
    categories.push("narrative");
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

function pickStaticDecision(category: DecisionCategory, rng: Rng): Decision {
  const pool = LIFESTYLE_DECISIONS.filter((d) => d.category === category);
  const index = Math.min(Math.floor(rng() * pool.length), pool.length - 1);
  return pool[index];
}

const CLUB_CRISIS_GENERATORS: Array<(player: Player, rng: Rng) => Decision> = [
  generateClubCrisis,
  generateCompetitionForSpot,
  generateControversialStatement,
];

function pickClubCrisisDecision(player: Player, rng: Rng): Decision {
  const index = Math.min(Math.floor(rng() * CLUB_CRISIS_GENERATORS.length), CLUB_CRISIS_GENERATORS.length - 1);
  return CLUB_CRISIS_GENERATORS[index](player, rng);
}

function pickNarrativeDecision(player: Player, rng: Rng): Decision {
  const generators: Array<() => Decision> = [];
  if (isTaxTroubleEligible(player)) generators.push(() => generateTaxTrouble(player, rng));
  if (isReturnHomeEligible(player)) generators.push(() => generateReturnHome(player, rng));
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
      return { decision: pickStaticDecision(category, rng), category };
    case "narrative":
      return { decision: pickNarrativeDecision(player, rng), category };
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
}

/** Determina se l'outcome scelto rappresenta una vittoria nella finale di coppa continentale. */
function isContinentalFinalWin(outcomeText: string): boolean {
  return outcomeText.startsWith("Gol!");
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
    };
  }

  if (option.club) {
    nextPlayer = signWithClub(nextPlayer, option.club);
  }

  const nextContext = nextLoopContext(category, option, player, context);
  const stintType = nextContext.loanParentClub ? "loan" : "permanent";
  const seasons = SEASONS_PER_CYCLE[speed];
  nextPlayer = advanceSeasons(nextPlayer, seasons, rng, stintType);

  const newTrophies: Trophy[] = nextPlayer.club
    ? rollClubTrophies(nextPlayer.club, nextPlayer.ovr, nextPlayer.age, rng)
    : [];

  if (category === "continental-final" && nextPlayer.club?.competitions.continental) {
    if (isContinentalFinalWin(outcome.resultText)) {
      newTrophies.push({
        competition: nextPlayer.club.competitions.continental,
        club: nextPlayer.club,
        age: nextPlayer.age,
      });
    }
  }

  let nationalCallup = false;
  if (rollNationalCallup(nextPlayer, rng)) {
    nextPlayer = { ...nextPlayer, nationalTeam: { ...nextPlayer.nationalTeam, called: true } };
    nationalCallup = true;
  }

  if (nextPlayer.nationalTeam.called) {
    const natStats = projectNationalStats(nextPlayer.ovr, nextPlayer.position, seasons, rng);
    nextPlayer = {
      ...nextPlayer,
      nationalTeam: {
        called: true,
        apps: nextPlayer.nationalTeam.apps + natStats.apps,
        goals: nextPlayer.nationalTeam.goals + natStats.goals,
        assists: nextPlayer.nationalTeam.assists + natStats.assists,
      },
    };
    const nationalTrophy = rollNationalTrophy(true, nextPlayer.ovr, nextPlayer.age, rng);
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

  if (checkRetirement(nextPlayer, rng)) {
    nextPlayer = retire(nextPlayer);
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
  };
}

const RECENT_CATEGORIES_WINDOW = 3;

export function pushRecentCategory(
  recentCategories: DecisionCategory[],
  category: DecisionCategory,
): DecisionCategory[] {
  return [...recentCategories, category].slice(-RECENT_CATEGORIES_WINDOW);
}
