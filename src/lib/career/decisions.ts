import type {
  Club,
  Decision,
  DecisionCategory,
  DecisionOption,
  DecisionOutcome,
  Injury,
  Player,
} from "@/types/career";
import { clubs, clubsByCountry } from "@/data/clubs";
import { clamp, type Rng } from "./progression";

// ---------- Helper di selezione club ----------

function targetPrestige(ovr: number): number {
  if (ovr >= 85) return 3;
  if (ovr >= 75) return 2;
  if (ovr >= 60) return 1;
  return 0;
}

function eligibleClubs(ovr: number, excludeId?: string): Club[] {
  const prestige = targetPrestige(ovr);
  return clubs.filter(
    (c) => c.id !== excludeId && Math.abs(c.prestige - prestige) <= 1,
  );
}

function shuffle<T>(items: T[], rng: Rng): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function pickClubs(pool: Club[], count: number, rng: Rng): Club[] {
  return shuffle(pool, rng).slice(0, count);
}

// ---------- Helper per costruire decisioni/opzioni ----------

function outcome(weight: number, resultText: string, ovrDelta = 0): DecisionOutcome {
  return { weight, effect: ovrDelta ? { ovrDelta } : {}, resultText };
}

/** Outcome che infortuna il giocatore invece di applicare solo un malus OVR testuale. */
function injuryOutcome(weight: number, resultText: string, injury: Injury): DecisionOutcome {
  return { weight, effect: { injury }, resultText };
}

function signOption(id: string, label: string, club: Club, resultText: string): DecisionOption {
  return { id, label, club, outcomes: [outcome(100, resultText)] };
}

// ---------- Offerta iniziale (settore giovanile) ----------

export function generateAcademyOffer(
  identity: Pick<Player, "nationality">,
  rng: Rng = Math.random,
): Decision {
  const homeClubs = clubsByCountry(identity.nationality).filter((c) => c.prestige <= 1);
  const pool = homeClubs.length >= 3 ? homeClubs : clubs.filter((c) => c.prestige <= 1);
  const offers = pickClubs(pool, 3, rng);
  return {
    id: "academy-offer",
    category: "transfer",
    title: "Offerta dal settore giovanile",
    description:
      "Tre club vogliono aggiungerti al loro progetto giovanile. Scegli dove inizia la tua carriera.",
    options: offers.map((c) =>
      signOption(`sign-${c.id}`, `Firma per ${c.name}`, c, `Inizi la carriera al ${c.name}.`),
    ),
  };
}

// ---------- Pool statico di eventi lifestyle/narrativi (nessuna dipendenza dal club) ----------

export const LIFESTYLE_DECISIONS: Decision[] = [
  {
    id: "nutrition-plan",
    category: "lifestyle",
    title: "Piano alimentare",
    description:
      "Un nutrizionista propone di cambiare la tua dieta. Potrebbe migliorare le prestazioni o ritorcersi contro di te.",
    options: [
      {
        id: "follow-plan",
        label: "Segui il piano",
        outcomes: [
          outcome(60, "Il nuovo regime alimentare ti dà una marcia in più.", 3),
          outcome(40, "Il cambio di dieta ti destabilizza in campo.", -2),
        ],
      },
      {
        id: "keep-diet",
        label: "Mantieni la tua dieta",
        outcomes: [outcome(100, "Nessun cambiamento.")],
      },
    ],
  },
  {
    id: "giant-tattoo",
    category: "lifestyle",
    title: "Tatuaggio enorme",
    description: "Uno studio propone di tatuarti un'aquila gigante sul petto.",
    options: [
      {
        id: "accept-tattoo",
        label: "Accetta",
        outcomes: [
          outcome(70, "Ti senti più sicuro di te in campo.", 1),
          outcome(30, "Il tatuaggio si infetta e ti costringe a fermarti.", -2),
        ],
      },
      {
        id: "reject-tattoo",
        label: "Rifiuta",
        outcomes: [outcome(100, "Nulla succede.")],
      },
    ],
  },
  {
    id: "double-sessions",
    category: "lifestyle",
    title: "Doppie sedute",
    description: "Due allenamenti al giorno per migliorare le prestazioni.",
    options: [
      {
        id: "train-hard",
        label: "Allenati duramente",
        outcomes: [
          outcome(65, "Diventi titolare per il prossimo ciclo.", 2),
          injuryOutcome(35, "Un infortunio ti tiene lontano dai campi.", {
            label: "Distorsione alla caviglia",
            turnsRemaining: 2,
            ovrPenalty: 4,
          }),
        ],
      },
      {
        id: "reduce-load",
        label: "Riduci il carico",
        outcomes: [outcome(100, "Giochi con meno minutaggio.", -1)],
      },
    ],
  },
  {
    id: "extra-camp",
    category: "lifestyle",
    title: "Ritiro speciale",
    description: "Un ritiro speciale può darti una spinta, ma lo sforzo extra si fa sentire.",
    options: [
      {
        id: "attend-camp",
        label: "Partecipa",
        outcomes: [
          outcome(65, "Il ritiro speciale ti dà una marcia in più.", 4),
          injuryOutcome(35, "Lo sforzo extra si fa sentire.", {
            label: "Affaticamento fisico",
            turnsRemaining: 2,
            ovrPenalty: 3,
          }),
        ],
      },
      {
        id: "usual-preparation",
        label: "Preparazione abituale",
        outcomes: [outcome(100, "Nessun cambiamento.")],
      },
    ],
  },
  {
    id: "indecent-proposal",
    category: "lifestyle",
    title: "Proposta indecente",
    description: "La compagna di un compagno di squadra ti fa un'avance.",
    options: [
      {
        id: "proceed",
        label: "Accetta",
        outcomes: [
          outcome(50, "L'euforia ti dà motivazione extra.", 2),
          outcome(50, "Vieni scoperto e lo scandalo ti pesa addosso.", -3),
        ],
      },
      {
        id: "reject",
        label: "Rifiuta",
        outcomes: [outcome(100, "Nulla succede.")],
      },
    ],
  },
  {
    id: "position-change",
    category: "position-change",
    title: "Cambio di ruolo",
    description: "Il mister ha bisogno che tu copra un'altra posizione.",
    options: [
      {
        id: "accept-position",
        label: "Accetta",
        outcomes: [
          outcome(
            100,
            "Diventi titolare al prossimo ciclo, ma serve tempo per adattarti.",
            -2,
          ),
        ],
      },
      {
        id: "reject-position",
        label: "Rifiuta",
        outcomes: [outcome(100, "Giochi con meno minutaggio.")],
      },
    ],
  },
];

// ---------- Generatori dipendenti dal club corrente ----------

export function generateTransferWindow(player: Player, rng: Rng = Math.random): Decision {
  if (!player.club) {
    throw new Error("Serve un club corrente per generare una finestra di mercato");
  }
  const currentClub = player.club;
  const offers = pickClubs(eligibleClubs(player.ovr, currentClub.id), 2, rng);
  return {
    id: `transfer-window-${player.age}`,
    category: "transfer",
    title: "Finestra di mercato",
    description:
      "Sono arrivate offerte dopo l'ultimo ciclo. Puoi accettarne una o restare al tuo club.",
    options: [
      ...offers.map((c) =>
        signOption(`sign-${c.id}`, `Firma per ${c.name}`, c, `Ti trasferisci al ${c.name}.`),
      ),
      signOption("stay", `Resta al ${currentClub.name}`, currentClub, `Resti al ${currentClub.name}.`),
    ],
  };
}

/** Alcune finestre di prestito nell'originale non offrono l'opzione "resta" — replica quel comportamento. */
export function generateLoanOffer(player: Player, rng: Rng = Math.random): Decision {
  if (!player.club) {
    throw new Error("Serve un club corrente per generare un'offerta di prestito");
  }
  const offers = pickClubs(
    eligibleClubs(Math.max(player.ovr - 8, 0), player.club.id),
    3,
    rng,
  );
  return {
    id: `loan-offer-${player.age}`,
    category: "loan",
    title: "Offerta di prestito",
    description: "Il tuo club vuole farti giocare altrove per crescere.",
    options: offers.map((c) =>
      signOption(`loan-${c.id}`, `Vai in prestito al ${c.name}`, c, `Vai in prestito al ${c.name}.`),
    ),
  };
}

export function generateLoanReturn(
  player: Player,
  parentClub: Club,
  rng: Rng = Math.random,
): Decision {
  const offers = pickClubs(eligibleClubs(player.ovr, player.club?.id ?? parentClub.id), 2, rng);
  const options: DecisionOption[] = offers.map((c) =>
    signOption(`loan-${c.id}`, `Vai in prestito al ${c.name}`, c, `Vai in prestito al ${c.name}.`),
  );
  if (player.club) {
    options.push(
      signOption(
        "sign-permanent",
        `Firma a titolo definitivo per il ${player.club.name}`,
        player.club,
        `Firmi a titolo definitivo per il ${player.club.name}.`,
      ),
    );
  }
  return {
    id: `loan-return-${player.age}`,
    category: "loan-return",
    title: "Ritorno dal prestito",
    description: `Sei tornato al ${parentClub.name}, ma non rientri più nei piani. Puoi ripartire in prestito o firmare a titolo definitivo per il club dove hai giocato.`,
    options,
  };
}

export function generateClubCrisis(player: Player, rng: Rng = Math.random): Decision {
  if (!player.club) {
    throw new Error("Serve un club corrente per generare una crisi di squadra");
  }
  const [alternative] = pickClubs(eligibleClubs(player.ovr, player.club.id), 1, rng);
  return {
    id: `club-crisis-${player.age}`,
    category: "club-crisis",
    title: "Crisi di squadra",
    description: "La squadra attraversa un momento difficile e un altro club si fa avanti.",
    options: [
      {
        id: "stay-and-fight",
        label: `Resta e lotta al ${player.club.name}`,
        club: player.club,
        outcomes: [outcome(100, "Meno possibilità di vincere qualcosa quest'anno.", -2)],
      },
      signOption("leave", `Vai al ${alternative.name}`, alternative, `Ti trasferisci al ${alternative.name}.`),
    ],
  };
}

export function generateCompetitionForSpot(player: Player, rng: Rng = Math.random): Decision {
  if (!player.club) {
    throw new Error("Serve un club corrente per generare questo evento");
  }
  const [alternative] = pickClubs(eligibleClubs(player.ovr, player.club.id), 1, rng);
  return {
    id: `competition-for-spot-${player.age}`,
    category: "club-crisis",
    title: "Concorrenza per il tuo posto",
    description: "Il club ha ingaggiato un altro giocatore per contendersi il tuo ruolo.",
    options: [
      {
        id: "compete",
        label: "Fatti valere",
        club: player.club,
        outcomes: [
          outcome(50, "Ti guadagni il posto da titolare.", 1),
          outcome(50, "Finisci in panchina, giochi meno.", -2),
        ],
      },
      signOption("leave", `Firma per ${alternative.name}`, alternative, `Lasci subito per il ${alternative.name}.`),
    ],
  };
}

export function generateControversialStatement(player: Player, rng: Rng = Math.random): Decision {
  if (!player.club) {
    throw new Error("Serve un club corrente per generare questo evento");
  }
  const weaker = clubs.filter(
    (c) => c.id !== player.club!.id && c.prestige < player.club!.prestige,
  );
  const pool = weaker.length > 0 ? weaker : eligibleClubs(player.ovr, player.club.id);
  const [alternative] = pickClubs(pool, 1, rng);
  return {
    id: `controversial-statement-${player.age}`,
    category: "club-crisis",
    title: "Dichiarazione controversa",
    description: "Critichi pubblicamente l'allenatore dopo una sconfitta pesante.",
    options: [
      {
        id: "apologize",
        label: "Scusati pubblicamente",
        club: player.club,
        outcomes: [outcome(100, "Ti scusi ma il minutaggio cala.", -1)],
      },
      signOption("leave", `Firma per ${alternative.name}`, alternative, `Lasci per il ${alternative.name}.`),
    ],
  };
}

export function generateEndOfCycle(player: Player, rng: Rng = Math.random): Decision {
  const offers = pickClubs(eligibleClubs(player.ovr, player.club?.id), 2, rng);
  return {
    id: `end-of-cycle-${player.age}`,
    category: "end-of-cycle",
    title: "Fine ciclo",
    description: "Il tuo club ha deciso di non rinnovarti. Scegli il prossimo passo della carriera.",
    options: [
      ...offers.map((c) =>
        signOption(`sign-${c.id}`, `Firma per ${c.name}`, c, `Firmi per il ${c.name}.`),
      ),
      {
        id: "retire",
        label: "Ritirati",
        retire: true,
        outcomes: [outcome(100, "Chiudi la carriera da professionista.")],
      },
    ],
  };
}

// ---------- Eventi condizionati dal contesto (paese del club / nazionalità) ----------

export function isTaxTroubleEligible(player: Player): boolean {
  return player.club !== null;
}

export function generateTaxTrouble(player: Player, rng: Rng = Math.random): Decision {
  if (!player.club) {
    throw new Error("Serve un club corrente per generare questo evento");
  }
  const foreignClubs = clubs.filter((c) => c.country !== player.club!.country);
  const [alternative] = pickClubs(
    foreignClubs.length > 0 ? foreignClubs : eligibleClubs(player.ovr, player.club.id),
    1,
    rng,
  );
  return {
    id: `tax-trouble-${player.age}`,
    category: "narrative",
    title: `Grane fiscali in ${player.club.country}`,
    description: "Un'indagine fiscale mette in dubbio il tuo futuro nel paese.",
    options: [
      {
        id: "stay",
        label: `Resta al ${player.club.name}`,
        club: player.club,
        outcomes: [outcome(100, "La distrazione ti pesa addosso.", -3)],
      },
      signOption("leave", `Vai al ${alternative.name}`, alternative, `Lasci per il ${alternative.name}.`),
    ],
  };
}

export function isReturnHomeEligible(player: Player): boolean {
  if (!player.club || player.club.country === player.nationality) return false;
  return clubsByCountry(player.nationality).length > 0;
}

export function generateReturnHome(player: Player, rng: Rng = Math.random): Decision {
  if (!player.club) {
    throw new Error("Serve un club corrente per generare questo evento");
  }
  const homeClubs = clubsByCountry(player.nationality);
  const [homeClub] = pickClubs(homeClubs, 1, rng);
  return {
    id: `return-home-${player.age}`,
    category: "narrative",
    title: "Richiamo da casa",
    description: "La tua famiglia ti chiede di tornare nel tuo paese d'origine.",
    options: [
      {
        id: "stay",
        label: `Resta al ${player.club.name}`,
        club: player.club,
        outcomes: [outcome(100, "Il rapporto con la famiglia si incrina.", -5)],
      },
      signOption("return", `Torna al ${homeClub.name}`, homeClub, `Torni al ${homeClub.name}.`),
    ],
  };
}

// ---------- Convocazione in nazionale ----------

/** Probabilità di convocazione per ciclo — soglia più generosa dell'originale (vedi piano). */
export function nationalCallupChance(ovr: number): number {
  if (ovr < 75) return 0;
  return clamp((ovr - 75) / 40, 0, 0.9);
}

export function rollNationalCallup(player: Player, rng: Rng = Math.random): boolean {
  if (player.nationalTeam.called) return false;
  return rng() < nationalCallupChance(player.ovr);
}

// ---------- Coppa continentale — rigore decisivo ----------

export function penaltyScoreChance(ovr: number): number {
  return clamp(0.55 + (ovr - 70) / 200, 0.4, 0.85);
}

export function generateContinentalFinalDecision(
  player: Player,
  competition: string,
): Decision {
  const scoreChance = Math.round(penaltyScoreChance(player.ovr) * 100);
  const outcomes = (): DecisionOutcome[] => [
    { ...outcome(scoreChance, `Gol! Vinci la finale di ${competition}.`), continentalWin: true },
    outcome(100 - scoreChance, `Il portiere para il rigore. Perdi la finale di ${competition}.`, -1),
  ];
  return {
    id: `continental-final-${player.age}`,
    category: "continental-final",
    title: "Rigore decisivo",
    description: `Devi decidere la finale di ${competition}.`,
    options: [
      { id: "left", label: "Sinistra", outcomes: outcomes() },
      { id: "right", label: "Destra", outcomes: outcomes() },
    ],
  };
}

// ---------- Sponsor/endorsement ----------

const SPONSOR_ELIGIBILITY_POPULARITY = 25;

export function isSponsorEligible(player: Pick<Player, "popularity">): boolean {
  return player.popularity >= SPONSOR_ELIGIBILITY_POPULARITY;
}

function economicOutcome(
  weight: number,
  resultText: string,
  effect: { savingsDelta?: number; popularityDelta?: number },
): DecisionOutcome {
  return { weight, effect, resultText };
}

interface SponsorDealTemplate {
  id: string;
  title: string;
  description: string;
  savingsGain: number;
}

const SPONSOR_DEAL_TEMPLATES: SponsorDealTemplate[] = [
  {
    id: "sportswear-brand",
    title: "Contratto con un brand sportivo",
    description: "Un marchio di scarpe sportive ti propone un contratto da testimonial.",
    savingsGain: 150_000,
  },
  {
    id: "energy-drink",
    title: "Testimonial di una bibita energetica",
    description: "Un'azienda di bevande energetiche vuole il tuo volto in campagna pubblicitaria.",
    savingsGain: 90_000,
  },
  {
    id: "watch-brand",
    title: "Ambasciatore di un marchio di orologi",
    description: "Un marchio di orologi di lusso ti propone di diventarne ambasciatore.",
    savingsGain: 220_000,
  },
];

export function generateSponsorDeal(player: Player, rng: Rng = Math.random): Decision {
  const template =
    SPONSOR_DEAL_TEMPLATES[Math.floor(rng() * SPONSOR_DEAL_TEMPLATES.length)] ??
    SPONSOR_DEAL_TEMPLATES[0];
  return {
    id: `sponsor-${template.id}-${player.age}`,
    category: "sponsor",
    title: template.title,
    description: template.description,
    options: [
      {
        id: "accept",
        label: "Accetta",
        outcomes: [
          economicOutcome(70, "L'accordo va in porto: incassi e popolarità in crescita.", {
            savingsDelta: template.savingsGain,
            popularityDelta: 4,
          }),
          economicOutcome(30, "Un dettaglio del contratto genera polemiche.", {
            savingsDelta: template.savingsGain,
            popularityDelta: -3,
          }),
        ],
      },
      {
        id: "decline",
        label: "Rifiuta",
        outcomes: [economicOutcome(100, "Rifiuti l'offerta, nulla cambia.", {})],
      },
    ],
  };
}

// ---------- Selezione pesata della categoria, con penalità anti-ripetizione ----------

const BASE_CATEGORY_WEIGHTS: Partial<Record<DecisionCategory, number>> = {
  transfer: 25,
  loan: 12,
  "loan-return": 8,
  "position-change": 8,
  "club-crisis": 12,
  "end-of-cycle": 10,
  lifestyle: 20,
  narrative: 5,
  sponsor: 10,
};

const DEFAULT_CATEGORY_WEIGHT = 5;
const REPEAT_PENALTY = 0.15;

export function pickDecisionCategory(
  availableCategories: DecisionCategory[],
  recentCategories: DecisionCategory[],
  rng: Rng = Math.random,
): DecisionCategory {
  if (availableCategories.length === 0) {
    throw new Error("Serve almeno una categoria disponibile per scegliere una decisione");
  }
  const weighted = availableCategories.map((category) => {
    const base = BASE_CATEGORY_WEIGHTS[category] ?? DEFAULT_CATEGORY_WEIGHT;
    const weight = recentCategories.includes(category) ? base * REPEAT_PENALTY : base;
    return { category, weight };
  });
  const total = weighted.reduce((sum, w) => sum + w.weight, 0);
  const roll = rng() * total;
  let cumulative = 0;
  for (const w of weighted) {
    cumulative += w.weight;
    if (roll < cumulative) return w.category;
  }
  return weighted[weighted.length - 1].category;
}
