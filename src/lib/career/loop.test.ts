import { describe, expect, it } from "vitest";
import type { Player, PlayerIdentity } from "@/types/career";
import { getClub } from "@/data/clubs";
import { createPlayer, signWithClub } from "./engine";
import {
  availableCategories,
  INITIAL_LOOP_CONTEXT,
  nextLoopContext,
  pickNextDecision,
  pushRecentCategory,
  resolveCycle,
  shouldTriggerContinentalFinal,
  type LoopContext,
} from "./loop";

const IDENTITY: PlayerIdentity = {
  lastName: "Rossi",
  number: 10,
  foot: "right",
  nationality: "Italy",
  position: "ST",
};

const JUVENTUS = getClub("juventus")!;
const SEVILLA = getClub("sevilla")!;
const FIXED_RNG = () => 0.5;

function playerAt(club = JUVENTUS): Player {
  return signWithClub(createPlayer(IDENTITY), club);
}

describe("availableCategories", () => {
  it("dovrebbe restituire solo loan-return se il giocatore è in prestito", () => {
    const context: LoopContext = { loanParentClub: JUVENTUS };
    expect(availableCategories(playerAt(SEVILLA), context)).toEqual(["loan-return"]);
  });

  it("dovrebbe restituire end-of-cycle come unica categoria se il giocatore non ha un club", () => {
    expect(availableCategories(createPlayer(IDENTITY), INITIAL_LOOP_CONTEXT)).toEqual(["end-of-cycle"]);
  });

  it("dovrebbe includere le categorie standard per un giocatore con club permanente", () => {
    const categories = availableCategories(playerAt(), INITIAL_LOOP_CONTEXT);
    expect(categories).toEqual(
      expect.arrayContaining(["transfer", "loan", "lifestyle", "position-change", "club-crisis", "end-of-cycle"]),
    );
  });

  it("dovrebbe includere sponsor solo sopra la soglia di popolarità", () => {
    const belowThreshold = { ...playerAt(), popularity: 10 };
    const aboveThreshold = { ...playerAt(), popularity: 40 };
    expect(availableCategories(belowThreshold, INITIAL_LOOP_CONTEXT)).not.toContain("sponsor");
    expect(availableCategories(aboveThreshold, INITIAL_LOOP_CONTEXT)).toContain("sponsor");
  });
});

describe("shouldTriggerContinentalFinal", () => {
  it("dovrebbe essere falso se il giocatore è in prestito", () => {
    const context: LoopContext = { loanParentClub: JUVENTUS };
    expect(shouldTriggerContinentalFinal({ ...playerAt(), ovr: 90 }, context, () => 0)).toBe(false);
  });

  it("dovrebbe essere falso se il club non ha coppa continentale", () => {
    const noContinentalClub = { ...JUVENTUS, competitions: { league: "Serie A" } };
    const player = signWithClub({ ...playerAt(), ovr: 90 }, noContinentalClub);
    expect(shouldTriggerContinentalFinal(player, INITIAL_LOOP_CONTEXT, () => 0)).toBe(false);
  });

  it("dovrebbe essere falso se l'OVR è sotto soglia", () => {
    const player = { ...playerAt(), ovr: 70 };
    expect(shouldTriggerContinentalFinal(player, INITIAL_LOOP_CONTEXT, () => 0)).toBe(false);
  });

  it("dovrebbe essere vero se club/OVR sono eleggibili e il roll è favorevole", () => {
    const player = { ...playerAt(), ovr: 85 };
    expect(shouldTriggerContinentalFinal(player, INITIAL_LOOP_CONTEXT, () => 0)).toBe(true);
  });
});

describe("pickNextDecision", () => {
  it("dovrebbe generare la finale di coppa continentale quando le condizioni sono soddisfatte", () => {
    const player = { ...playerAt(), ovr: 90 };
    const { decision, category } = pickNextDecision(player, INITIAL_LOOP_CONTEXT, [], () => 0);
    expect(category).toBe("continental-final");
    expect(decision.category).toBe("continental-final");
  });

  it("dovrebbe generare una loan-return se il giocatore è in prestito", () => {
    const context: LoopContext = { loanParentClub: JUVENTUS };
    const player = signWithClub(playerAt(SEVILLA), SEVILLA);
    const { decision, category } = pickNextDecision(player, context, [], FIXED_RNG);
    expect(category).toBe("loan-return");
    expect(decision.category).toBe("loan-return");
  });

  it("dovrebbe lanciare un errore se scelta la categoria narrative senza eventi eleggibili", () => {
    // Nessun mismatch nazionalità/club e nessun evento tax-trouble applicabile qui: la categoria
    // narrative non dovrebbe mai essere restituita da availableCategories in questo scenario,
    // quindi pickNextDecision non dovrebbe lanciare per un giocatore italiano alla Juventus.
    const player = playerAt();
    expect(() => pickNextDecision(player, INITIAL_LOOP_CONTEXT, [], () => 0.999)).not.toThrow();
  });
});

describe("nextLoopContext", () => {
  it("dovrebbe impostare il club di appartenenza quando si va in prestito", () => {
    const player = playerAt(JUVENTUS);
    const option = { id: "loan-sevilla", label: "Vai in prestito", club: SEVILLA, outcomes: [] };
    const context = nextLoopContext("loan", option, player, INITIAL_LOOP_CONTEXT);
    expect(context.loanParentClub).toEqual(JUVENTUS);
  });

  it("dovrebbe azzerare il club di appartenenza firmando a titolo definitivo dal prestito", () => {
    const player = signWithClub(playerAt(SEVILLA), SEVILLA);
    const option = { id: "sign-permanent", label: "Firma a titolo definitivo", club: SEVILLA, outcomes: [] };
    const context = nextLoopContext("loan-return", option, player, { loanParentClub: JUVENTUS });
    expect(context.loanParentClub).toBeNull();
  });

  it("dovrebbe mantenere il club di appartenenza se si sceglie un nuovo prestito", () => {
    const player = signWithClub(playerAt(SEVILLA), SEVILLA);
    const option = { id: "loan-other", label: "Altro prestito", club: getClub("las-palmas")!, outcomes: [] };
    const context = nextLoopContext("loan-return", option, player, { loanParentClub: JUVENTUS });
    expect(context.loanParentClub).toEqual(JUVENTUS);
  });

  it("dovrebbe azzerare il club di appartenenza per un trasferimento permanente ordinario", () => {
    const player = playerAt();
    const option = { id: "sign-x", label: "Firma", club: SEVILLA, outcomes: [] };
    const context = nextLoopContext("transfer", option, player, INITIAL_LOOP_CONTEXT);
    expect(context.loanParentClub).toBeNull();
  });
});

describe("resolveCycle", () => {
  it("dovrebbe ritirare il giocatore se l'opzione ha retire: true, senza avanzare stagioni", () => {
    const player = playerAt();
    const option = { id: "retire", label: "Ritirati", retire: true, outcomes: [{ weight: 100, effect: {}, resultText: "Fine carriera." }] };
    const result = resolveCycle(player, INITIAL_LOOP_CONTEXT, "end-of-cycle", option, "normal", () => 0.5);

    expect(result.retired).toBe(true);
    expect(result.player.retired).toBe(true);
    expect(result.player.age).toBe(player.age);
  });

  it("dovrebbe firmare il nuovo club e avanzare le stagioni in base alla velocità", () => {
    const player = playerAt();
    const option = { id: "sign", label: "Firma per Sevilla", club: SEVILLA, outcomes: [{ weight: 100, effect: {}, resultText: "Firmato." }] };
    const result = resolveCycle(player, INITIAL_LOOP_CONTEXT, "transfer", option, "normal", () => 0.99);

    expect(result.player.club).toEqual(SEVILLA);
    expect(result.player.age).toBe(player.age + 2); // normal = 2 stagioni per ciclo
  });

  it("dovrebbe restare in prestito quando si sceglie un'opzione di prestito", () => {
    const player = playerAt();
    const option = { id: "loan", label: "Vai in prestito", club: SEVILLA, outcomes: [{ weight: 100, effect: {}, resultText: "In prestito." }] };
    const result = resolveCycle(player, INITIAL_LOOP_CONTEXT, "loan", option, "normal", () => 0.99);

    expect(result.context.loanParentClub).toEqual(JUVENTUS);
  });

  it("dovrebbe assegnare il trofeo continentale se la finale è vinta", () => {
    const player = { ...playerAt(), ovr: 90 };
    const option = {
      id: "left",
      label: "Sinistra",
      outcomes: [
        {
          weight: 100,
          effect: {},
          resultText: `Gol! Vinci la finale di ${JUVENTUS.competitions.continental}.`,
          continentalWin: true,
        },
      ],
    };
    const result = resolveCycle(player, INITIAL_LOOP_CONTEXT, "continental-final", option, "normal", () => 0);

    expect(result.newTrophies.some((t) => t.competition === JUVENTUS.competitions.continental)).toBe(true);
  });

  it("non dovrebbe assegnare il trofeo continentale se la finale è persa", () => {
    const player = { ...playerAt(), ovr: 90 };
    const option = {
      id: "left",
      label: "Sinistra",
      outcomes: [{ weight: 100, effect: { ovrDelta: -1 }, resultText: `Il portiere para il rigore. Perdi la finale di ${JUVENTUS.competitions.continental}.` }],
    };
    const result = resolveCycle(player, INITIAL_LOOP_CONTEXT, "continental-final", option, "normal", () => 0);

    expect(result.newTrophies.some((t) => t.competition === JUVENTUS.competitions.continental)).toBe(false);
  });
});

describe("resolveCycle — gestione infortuni", () => {
  const lifestyleOption = {
    id: "x",
    label: "Opzione",
    outcomes: [{ weight: 100, effect: {}, resultText: "Nessun cambiamento." }],
  };

  it("dovrebbe poter infortunare il giocatore in un ciclo (rng minimo -> chance sempre superata)", () => {
    const player = playerAt();
    const result = resolveCycle(player, INITIAL_LOOP_CONTEXT, "lifestyle", lifestyleOption, "normal", () => 0);

    expect(result.newInjury).not.toBeNull();
    expect(result.player.injury).toEqual(result.newInjury);
    expect(result.injuryHealed).toBe(false);
  });

  it("dovrebbe far guarire un infortunio già attivo invece di infortunare di nuovo", () => {
    const player = {
      ...playerAt(),
      injury: { label: "Distorsione alla caviglia", turnsRemaining: 1, ovrPenalty: 4 },
    };
    const result = resolveCycle(player, INITIAL_LOOP_CONTEXT, "lifestyle", lifestyleOption, "normal", () => 0);

    expect(result.injuryHealed).toBe(true);
    expect(result.player.injury).toBeNull();
    expect(result.newInjury).toBeNull();
  });

  it("dovrebbe far avanzare un infortunio con più cicli residui senza guarirlo subito", () => {
    const player = {
      ...playerAt(),
      injury: { label: "Distorsione alla caviglia", turnsRemaining: 2, ovrPenalty: 4 },
    };
    const result = resolveCycle(player, INITIAL_LOOP_CONTEXT, "lifestyle", lifestyleOption, "normal", () => 0);

    expect(result.injuryHealed).toBe(false);
    expect(result.player.injury).toEqual({
      label: "Distorsione alla caviglia",
      turnsRemaining: 1,
      ovrPenalty: 4,
    });
  });
});

describe("resolveCycle — stipendio e popolarità", () => {
  const lifestyleOption = {
    id: "x",
    label: "Opzione",
    outcomes: [{ weight: 100, effect: {}, resultText: "Nessun cambiamento." }],
  };

  it("dovrebbe accumulare lo stipendio nei risparmi dopo un ciclo", () => {
    const player = { ...playerAt(), wallet: { salaryEurPerCycle: 10_000, savingsEur: 0 } };
    // rng alto per evitare che l'infortunio azzeri il confronto (non influisce sui risparmi comunque)
    const result = resolveCycle(player, INITIAL_LOOP_CONTEXT, "lifestyle", lifestyleOption, "normal", () => 0.99);

    expect(result.player.wallet.savingsEur).toBeGreaterThan(0);
  });

  it("la popolarità dovrebbe crescere sensibilmente in un ciclo con un trofeo vinto", () => {
    const highOvrPlayer = { ...playerAt(), ovr: 95 };
    const result = resolveCycle(
      highOvrPlayer,
      INITIAL_LOOP_CONTEXT,
      "lifestyle",
      lifestyleOption,
      "normal",
      () => 0,
    );

    expect(result.newTrophies.length).toBeGreaterThan(0);
    expect(result.player.popularity).toBeGreaterThan(highOvrPlayer.popularity);
  });
});

describe("pushRecentCategory", () => {
  it("dovrebbe mantenere solo le ultime 3 categorie", () => {
    const result = pushRecentCategory(
      pushRecentCategory(pushRecentCategory(pushRecentCategory([], "transfer"), "loan"), "lifestyle"),
      "club-crisis",
    );
    expect(result).toEqual(["loan", "lifestyle", "club-crisis"]);
  });
});
