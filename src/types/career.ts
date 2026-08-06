export type Position =
  | "GK"
  | "CB"
  | "LB"
  | "RB"
  | "CDM"
  | "CM"
  | "CAM"
  | "LM"
  | "RM"
  | "LW"
  | "RW"
  | "ST";

export type PreferredFoot = "left" | "right";

export type GameSpeed = "intense" | "normal" | "express";

export interface PlayerIdentity {
  lastName: string;
  number: number;
  foot: PreferredFoot;
  nationality: string;
  position: Position;
}

export interface ClubCompetitions {
  league: string;
  cup?: string;
  continental?: string;
}

export interface Club {
  id: string;
  name: string;
  country: string;
  /** 1 = massima divisione del paese, 2 = seconda, ecc. Mutabile (retrocessione/promozione). */
  tier: number;
  /** 0-3 stelle, come nell'originale — influenza probabilità di trofei e soglie di offerta. */
  prestige: 0 | 1 | 2 | 3;
  competitions: ClubCompetitions;
  /** Hotlink allo stemma ufficiale (TheSportsDB) — mai scaricato/salvato nel repo. */
  crestUrl: string;
}

export interface StatLine {
  apps: number;
  goals: number;
  assists: number;
  /** Valorizzato solo per i portieri (Position "GK"). */
  goalsAgainst?: number;
  /** Valorizzato solo per i portieri (Position "GK"). */
  cleanSheets?: number;
}

export interface ClubStint {
  club: Club;
  ageFrom: number;
  ageTo: number;
  type: "permanent" | "loan";
  stats: StatLine;
  /** OVR del giocatore alla fine di questo ciclo (per la riga storica della career table). */
  ovr: number;
}

export interface Trophy {
  competition: string;
  /** undefined se vinto con la nazionale */
  club?: Club;
  age: number;
}

export type AwardType = "player-of-the-season" | "ballon-dor" | "top-scorer";

export interface Award {
  type: AwardType;
  age: number;
  club?: Club;
}

export interface NationalTeamStats extends StatLine {
  called: boolean;
}

/** Infortunio attivo: tiene fuori il giocatore per N cicli con un malus OVR temporaneo. */
export interface Injury {
  label: string;
  turnsRemaining: number;
  ovrPenalty: number;
}

/** Portafoglio del giocatore: stipendio corrente e risparmi accumulati. */
export interface Wallet {
  salaryEurPerCycle: number;
  savingsEur: number;
}

/** Soglia OVR già celebrata, con età al momento del traguardo (per la timeline). */
export interface OvrMilestone {
  ovr: number;
  age: number;
}

/** Record personali aggiornati ciclo per ciclo. */
export interface PersonalRecords {
  bestSeasonGoals: number;
  bestSeasonAssists: number;
  bestSeasonApps: number;
  /** Valorizzato solo per i portieri (Position "GK"). */
  bestSeasonCleanSheets?: number;
  peakMarketValueEur: number;
  firstCallupAge: number | null;
}

export type SeasonTitleId =
  | "champion"
  | "ballondorSeason"
  | "nationalHero"
  | "ironWall"
  | "revelation"
  | "comeback"
  | "workhorse"
  | "toughYear"
  | "steady";

export interface SeasonTitleEntry {
  age: number;
  id: SeasonTitleId;
  label: string;
}

export type CycleObjectiveKind =
  | "goals"
  | "apps"
  | "trophy"
  | "no-injury"
  | "callup"
  | "ovr-gain";

/** Obiettivo del ciclo corrente, mostrato sul cartellino e valutato a fine ciclo. */
export interface CycleObjective {
  id: string;
  label: string;
  kind: CycleObjectiveKind;
  target: number;
}

export interface Player extends PlayerIdentity {
  age: number;
  ovr: number;
  marketValueEur: number;
  career: StatLine;
  club: Club | null;
  clubHistory: ClubStint[];
  nationalTeam: NationalTeamStats;
  trophies: Trophy[];
  awards: Award[];
  retired: boolean;
  injury: Injury | null;
  wallet: Wallet;
  /** Reputazione/popolarità continua, 0-100. */
  popularity: number;
  milestonesReached: OvrMilestone[];
  records: PersonalRecords;
  /** Ultimi titoli di stagione (cap applicato nel dominio). */
  seasonTitles: SeasonTitleEntry[];
  currentObjective: CycleObjective | null;
  /** true se il giocatore ha già cambiato nazionalità una volta (evento non ripetibile). */
  hasSwitchedNationality?: boolean;
}

/** Effetto applicabile al giocatore da un outcome di decisione. */
export interface PlayerDelta {
  ovrDelta?: number;
  popularityDelta?: number;
  savingsDelta?: number;
  /** undefined = nessuna modifica, null = guarigione esplicita, oggetto = nuovo infortunio. */
  injury?: Injury | null;
}

export type DecisionCategory =
  | "transfer"
  | "loan"
  | "loan-return"
  | "position-change"
  | "club-crisis"
  | "end-of-cycle"
  | "lifestyle"
  | "callup"
  | "continental-final"
  | "narrative"
  | "sponsor";

export interface DecisionOutcome {
  /** Peso relativo tra gli outcome della stessa opzione — i pesi di un'opzione sommano a 100. */
  weight: number;
  effect: PlayerDelta;
  resultText: string;
  /** true solo sull'outcome che rappresenta la vittoria di una finale continentale. */
  continentalWin?: boolean;
}

export interface DecisionOption {
  id: string;
  label: string;
  /** Hint soft sul trade-off (solo UI, senza pesi numerici). */
  hint?: string;
  /** Se presente, selezionare questa opzione firma il giocatore per questo club (anche "resta"). */
  club?: Club;
  /** Se true, selezionare questa opzione termina la carriera (es. "Retire" in end-of-cycle). */
  retire?: boolean;
  /** Se presente, selezionare questa opzione cambia la nazionalità del giocatore. */
  newNationality?: string;
  /** Un solo outcome (peso 100) = esito deterministico. Più outcome = esito probabilistico. */
  outcomes: DecisionOutcome[];
}

export interface Decision {
  id: string;
  category: DecisionCategory;
  title: string;
  description: string;
  options: DecisionOption[];
}

/** Riepilogo leggero di una carriera conclusa, per l'archivio multi-carriera. */
export interface ArchivedCareer {
  id: string;
  lastName: string;
  nationality: string;
  position: Position;
  peakOvr: number;
  trophyCount: number;
  awardCount: number;
  retiredAge: number;
  retiredAtIso: string;
  careerApps: number;
  careerGoals: number;
  careerAssists: number;
  finalSavingsEur: number;
  finalPopularity: number;
  /** Miglior titolo di stagione della carriera, o fallback narrativo. */
  careerTitle: string;
}
