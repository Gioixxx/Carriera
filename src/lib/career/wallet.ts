import type { Wallet } from "@/types/career";
import { clamp } from "./progression";

/** Stipendio per ciclo in EUR, in base a OVR e prestigio del club — cresce super-lineare con l'OVR. */
export function computeSalaryEur(ovr: number, prestige: number): number {
  const base = 30_000 + Math.pow(Math.max(ovr - 45, 1), 2.4) * 40;
  return Math.round((base * (1 + prestige * 0.6)) / 1000) * 1000;
}

/** Accumula lo stipendio maturato in N stagioni nei risparmi del portafoglio. */
export function accrueSalary(wallet: Wallet, seasons: number): Wallet {
  return { ...wallet, savingsEur: wallet.savingsEur + wallet.salaryEurPerCycle * seasons };
}

/** Ricalcola lo stipendio per ciclo alla firma di un nuovo contratto. */
export function resignSalary(wallet: Wallet, ovr: number, prestige: number): Wallet {
  return { ...wallet, salaryEurPerCycle: computeSalaryEur(ovr, prestige) };
}

/** Variazione di popolarità per un ciclo, in base a prestazioni e successi ottenuti. */
export function popularityDeltaForCycle(input: {
  goals: number;
  trophiesWon: number;
  awardsWon: number;
}): number {
  const performance = input.goals * 0.3;
  const glory = input.trophiesWon * 5 + input.awardsWon * 8;
  const decay = -0.5;
  return performance + glory + decay;
}

export function applyPopularityDelta(current: number, delta: number): number {
  return clamp(Math.round(current + delta), 0, 100);
}
