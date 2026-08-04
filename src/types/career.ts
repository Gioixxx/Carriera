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
}

export interface StatLine {
  apps: number;
  goals: number;
  assists: number;
}

export interface ClubStint {
  club: Club;
  ageFrom: number;
  ageTo: number;
  type: "permanent" | "loan";
  stats: StatLine;
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
}

/** Effetto applicabile al giocatore da un outcome di decisione. */
export interface PlayerDelta {
  ovrDelta?: number;
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
  | "narrative";

export interface DecisionOutcome {
  /** Peso relativo tra gli outcome della stessa opzione — i pesi di un'opzione sommano a 100. */
  weight: number;
  effect: PlayerDelta;
  resultText: string;
}

export interface DecisionOption {
  id: string;
  label: string;
  /** Se presente, selezionare questa opzione firma il giocatore per questo club (anche "resta"). */
  club?: Club;
  /** Se true, selezionare questa opzione termina la carriera (es. "Retire" in end-of-cycle). */
  retire?: boolean;
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
