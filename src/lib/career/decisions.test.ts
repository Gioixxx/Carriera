import { describe, expect, it } from "vitest";
import type { DecisionCategory, Player, PlayerIdentity } from "@/types/career";
import { getClub } from "@/data/clubs";
import { createPlayer, signWithClub } from "./engine";
import {
  generateAcademyOffer,
  generateClubCrisis,
  generateCompetitionForSpot,
  generateContinentalFinalDecision,
  generateControversialStatement,
  generateEndOfCycle,
  generateLoanOffer,
  generateLoanReturn,
  generateReturnHome,
  generateSponsorDeal,
  generateTaxTrouble,
  generateTransferWindow,
  isReturnHomeEligible,
  isSponsorEligible,
  isTaxTroubleEligible,
  LIFESTYLE_DECISIONS,
  nationalCallupChance,
  penaltyScoreChance,
  pickDecisionCategory,
  rollNationalCallup,
} from "./decisions";

const IDENTITY: PlayerIdentity = {
  lastName: "Rossi",
  number: 10,
  foot: "right",
  nationality: "Italy",
  position: "ST",
};

const FIXED_RNG = () => 0.5;

function playerAt(club = getClub("juventus")!): Player {
  return signWithClub(createPlayer(IDENTITY), club);
}

describe("LIFESTYLE_DECISIONS", () => {
  it("dovrebbe avere id univoci tra tutte le decisioni del pool", () => {
    const ids = LIFESTYLE_DECISIONS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ogni opzione dovrebbe avere outcome i cui pesi sommano a 100", () => {
    for (const decision of LIFESTYLE_DECISIONS) {
      for (const option of decision.options) {
        const totalWeight = option.outcomes.reduce((sum, o) => sum + o.weight, 0);
        expect(totalWeight).toBe(100);
      }
    }
  });

  it("ogni decisione dovrebbe avere almeno due opzioni", () => {
    for (const decision of LIFESTYLE_DECISIONS) {
      expect(decision.options.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("gli outcome negativi di 'Doppie sedute' e 'Ritiro speciale' dovrebbero infortunare il giocatore", () => {
    const doubleSessions = LIFESTYLE_DECISIONS.find((d) => d.id === "double-sessions")!;
    const injuryOutcome = doubleSessions.options[0].outcomes.find((o) => o.effect.injury);
    expect(injuryOutcome?.effect.injury).toMatchObject({
      turnsRemaining: expect.any(Number),
      ovrPenalty: expect.any(Number),
    });

    const extraCamp = LIFESTYLE_DECISIONS.find((d) => d.id === "extra-camp")!;
    const campInjuryOutcome = extraCamp.options[0].outcomes.find((o) => o.effect.injury);
    expect(campInjuryOutcome?.effect.injury).toMatchObject({
      turnsRemaining: expect.any(Number),
      ovrPenalty: expect.any(Number),
    });
  });
});

describe("generateAcademyOffer", () => {
  it("dovrebbe restituire tre opzioni, tutte con un club a basso prestigio", () => {
    const decision = generateAcademyOffer({ nationality: "Italy" }, FIXED_RNG);
    expect(decision.options).toHaveLength(3);
    for (const option of decision.options) {
      expect(option.club).toBeDefined();
      expect(option.club!.prestige).toBeLessThanOrEqual(1);
    }
  });

  it("dovrebbe preferire club del paese del giocatore quando disponibili", () => {
    const decision = generateAcademyOffer({ nationality: "Italy" }, FIXED_RNG);
    expect(decision.options.every((o) => o.club!.country === "Italy")).toBe(true);
  });
});

describe("generateTransferWindow", () => {
  it("dovrebbe lanciare un errore se il giocatore non ha un club", () => {
    expect(() => generateTransferWindow(createPlayer(IDENTITY), FIXED_RNG)).toThrow();
  });

  it("dovrebbe includere l'opzione 'resta' con il club corrente", () => {
    const player = playerAt();
    const decision = generateTransferWindow(player, FIXED_RNG);
    const stayOption = decision.options.find((o) => o.id === "stay");
    expect(stayOption?.club?.id).toBe(player.club!.id);
  });

  it("le offerte diverse da 'resta' non dovrebbero mai coincidere con il club corrente", () => {
    const player = playerAt();
    const decision = generateTransferWindow(player, FIXED_RNG);
    const offers = decision.options.filter((o) => o.id !== "stay");
    expect(offers.every((o) => o.club!.id !== player.club!.id)).toBe(true);
  });
});

describe("generateLoanOffer", () => {
  it("dovrebbe lanciare un errore se il giocatore non ha un club", () => {
    expect(() => generateLoanOffer(createPlayer(IDENTITY), FIXED_RNG)).toThrow();
  });

  it("non dovrebbe mai includere un'opzione per restare al club corrente", () => {
    const player = playerAt();
    const decision = generateLoanOffer(player, FIXED_RNG);
    expect(decision.options.some((o) => o.id === "stay")).toBe(false);
  });
});

describe("generateLoanReturn", () => {
  it("dovrebbe includere la firma a titolo definitivo per il club dove si è in prestito", () => {
    const loanClub = getClub("las-palmas")!;
    const player = playerAt(loanClub);
    const parentClub = getClub("sevilla")!;
    const decision = generateLoanReturn(player, parentClub, FIXED_RNG);
    const permanentOption = decision.options.find((o) => o.id === "sign-permanent");
    expect(permanentOption?.club?.id).toBe(loanClub.id);
  });
});

describe("generateClubCrisis", () => {
  it("dovrebbe proporre resta (con malus OVR) o vai in un altro club", () => {
    const player = playerAt();
    const decision = generateClubCrisis(player, FIXED_RNG);
    const stay = decision.options.find((o) => o.id === "stay-and-fight");
    const leave = decision.options.find((o) => o.id === "leave");

    expect(stay?.club?.id).toBe(player.club!.id);
    expect(stay?.outcomes[0].effect.ovrDelta).toBeLessThan(0);
    expect(leave?.club?.id).not.toBe(player.club!.id);
  });
});

describe("generateCompetitionForSpot e generateControversialStatement", () => {
  it("generateCompetitionForSpot dovrebbe offrire fatti valere (probabilistico) o firma altrove", () => {
    const player = playerAt();
    const decision = generateCompetitionForSpot(player, FIXED_RNG);
    const compete = decision.options.find((o) => o.id === "compete");
    expect(compete?.outcomes.length).toBeGreaterThanOrEqual(2);
  });

  it("generateControversialStatement dovrebbe offrire scuse (minutaggio ridotto) o firma per un club più debole", () => {
    const player = playerAt(); // Juventus, prestige 3
    const decision = generateControversialStatement(player, FIXED_RNG);
    const leave = decision.options.find((o) => o.id === "leave");
    expect(leave?.club?.prestige).toBeLessThan(player.club!.prestige);
  });
});

describe("generateEndOfCycle", () => {
  it("dovrebbe includere sempre l'opzione di ritiro esplicito", () => {
    const player = playerAt();
    const decision = generateEndOfCycle(player, FIXED_RNG);
    const retireOption = decision.options.find((o) => o.id === "retire");
    expect(retireOption?.retire).toBe(true);
    expect(retireOption?.club).toBeUndefined();
  });
});

describe("eventi condizionati dal contesto", () => {
  it("isTaxTroubleEligible dovrebbe essere vero quando il giocatore ha un club", () => {
    expect(isTaxTroubleEligible(playerAt())).toBe(true);
    expect(isTaxTroubleEligible(createPlayer(IDENTITY))).toBe(false);
  });

  it("generateTaxTrouble dovrebbe proporre un club estero come alternativa", () => {
    const player = playerAt();
    const decision = generateTaxTrouble(player, FIXED_RNG);
    const leave = decision.options.find((o) => o.id === "leave");
    expect(leave?.club?.country).not.toBe(player.club!.country);
  });

  it("isReturnHomeEligible dovrebbe essere falso se il club è già nel paese di nazionalità", () => {
    const player = playerAt(getClub("juventus")!); // Italy, nazionalità Italy
    expect(isReturnHomeEligible(player)).toBe(false);
  });

  it("isReturnHomeEligible dovrebbe essere vero se c'è mismatch e club disponibili in patria", () => {
    const brazilianAbroad: Player = {
      ...playerAt(getClub("juventus")!),
      nationality: "Brazil",
    };
    expect(isReturnHomeEligible(brazilianAbroad)).toBe(true);
  });

  it("generateReturnHome dovrebbe proporre un club del paese di nazionalità", () => {
    const brazilianAbroad: Player = {
      ...playerAt(getClub("juventus")!),
      nationality: "Brazil",
    };
    const decision = generateReturnHome(brazilianAbroad, FIXED_RNG);
    const returnOption = decision.options.find((o) => o.id === "return");
    expect(returnOption?.club?.country).toBe("Brazil");
  });
});

describe("nationalCallupChance e rollNationalCallup", () => {
  it("dovrebbe essere zero sotto la soglia minima", () => {
    expect(nationalCallupChance(70)).toBe(0);
  });

  it("dovrebbe crescere con l'OVR e restare limitata a 0.9", () => {
    expect(nationalCallupChance(115)).toBe(0.9);
    expect(nationalCallupChance(95)).toBeGreaterThan(nationalCallupChance(80));
  });

  it("rollNationalCallup dovrebbe restituire false se il giocatore è già stato convocato", () => {
    const player = { ...playerAt(), ovr: 90, nationalTeam: { called: true, apps: 5, goals: 1, assists: 1 } };
    expect(rollNationalCallup(player, () => 0)).toBe(false);
  });

  it("rollNationalCallup dovrebbe rispettare la probabilità calcolata", () => {
    const player = { ...playerAt(), ovr: 90 }; // chance = 0.375
    expect(rollNationalCallup(player, () => 0.1)).toBe(true);
    expect(rollNationalCallup(player, () => 0.9)).toBe(false);
  });
});

describe("penaltyScoreChance", () => {
  it("dovrebbe restare entro i limiti [0.4, 0.85]", () => {
    expect(penaltyScoreChance(30)).toBe(0.4);
    expect(penaltyScoreChance(200)).toBe(0.85);
  });

  it("dovrebbe crescere con l'OVR", () => {
    expect(penaltyScoreChance(90)).toBeGreaterThan(penaltyScoreChance(70));
  });
});

describe("generateContinentalFinalDecision", () => {
  it("dovrebbe avere due opzioni (sinistra/destra) con outcome che sommano a 100", () => {
    const player = playerAt();
    const decision = generateContinentalFinalDecision(player, "Champions League");
    expect(decision.options).toHaveLength(2);
    for (const option of decision.options) {
      const totalWeight = option.outcomes.reduce((sum, o) => sum + o.weight, 0);
      expect(totalWeight).toBe(100);
    }
  });

  it("il testo dell'esito dovrebbe citare la competizione passata", () => {
    const player = playerAt();
    const decision = generateContinentalFinalDecision(player, "Copa Libertadores");
    expect(decision.description).toContain("Copa Libertadores");
  });

  it("solo l'outcome vincente dovrebbe avere continentalWin: true", () => {
    const player = playerAt();
    const decision = generateContinentalFinalDecision(player, "Champions League");
    for (const option of decision.options) {
      const [winOutcome, loseOutcome] = option.outcomes;
      expect(winOutcome.continentalWin).toBe(true);
      expect(loseOutcome.continentalWin).toBeUndefined();
    }
  });
});

describe("isSponsorEligible", () => {
  it("dovrebbe essere falso sotto la soglia di popolarità", () => {
    expect(isSponsorEligible({ popularity: 10 })).toBe(false);
  });

  it("dovrebbe essere vero alla soglia di popolarità o sopra", () => {
    expect(isSponsorEligible({ popularity: 25 })).toBe(true);
    expect(isSponsorEligible({ popularity: 80 })).toBe(true);
  });
});

describe("generateSponsorDeal", () => {
  it("ogni opzione dovrebbe avere outcome i cui pesi sommano a 100", () => {
    const player = { ...playerAt(), popularity: 40 };
    const decision = generateSponsorDeal(player, FIXED_RNG);
    for (const option of decision.options) {
      const totalWeight = option.outcomes.reduce((sum, o) => sum + o.weight, 0);
      expect(totalWeight).toBe(100);
    }
  });

  it("dovrebbe avere categoria sponsor e opzioni accetta/rifiuta", () => {
    const player = { ...playerAt(), popularity: 40 };
    const decision = generateSponsorDeal(player, FIXED_RNG);
    expect(decision.category).toBe("sponsor");
    expect(decision.options.map((o) => o.id)).toEqual(["accept", "decline"]);
  });
});

describe("pickDecisionCategory", () => {
  it("dovrebbe lanciare un errore se non ci sono categorie disponibili", () => {
    expect(() => pickDecisionCategory([], [], FIXED_RNG)).toThrow();
  });

  it("dovrebbe rispettare i confini cumulativi dei pesi tra categorie", () => {
    const categories: DecisionCategory[] = ["transfer", "lifestyle"]; // pesi base 25 e 20 -> totale 45
    expect(pickDecisionCategory(categories, [], () => 0)).toBe("transfer");
    expect(pickDecisionCategory(categories, [], () => 0.99)).toBe("lifestyle");
  });

  it("dovrebbe penalizzare una categoria comparsa di recente", () => {
    const categories: DecisionCategory[] = ["transfer", "lifestyle"];
    // Senza ripetizione: soglia transfer/lifestyle a 25/45 = 0.5555
    // Con "transfer" penalizzato (25*0.15=3.75) su totale 23.75: soglia a 3.75/23.75 = 0.158
    const roll = 0.3; // sopra la soglia penalizzata, sotto quella non penalizzata
    expect(pickDecisionCategory(categories, [], () => roll)).toBe("transfer");
    expect(pickDecisionCategory(categories, ["transfer"], () => roll)).toBe("lifestyle");
  });
});
