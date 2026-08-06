/**
 * Moltiplicatore del valore di mercato per età — stesso pattern a tabella di GROWTH_STAGES in
 * progression.ts. Sotto YOUNG_PLAYER_MAX_AGE il moltiplicatore cresce linearmente (un prospetto
 * vale di più quanto più si avvicina al picco), poi segue la tabella a scalini.
 */
const YOUNG_PLAYER_BASE_MULTIPLIER = 0.8;
const YOUNG_PLAYER_MULTIPLIER_PER_AGE = 0.08;
const YOUNG_PLAYER_MAX_AGE = 21;

const AGE_VALUE_STAGES: { maxAge: number; multiplier: number }[] = [
  { maxAge: 27, multiplier: 1.2 },
  { maxAge: 30, multiplier: 1.0 },
  { maxAge: 33, multiplier: 0.7 },
  { maxAge: 36, multiplier: 0.4 },
  { maxAge: Infinity, multiplier: 0.15 },
];

function ageValueMultiplier(age: number): number {
  if (age <= YOUNG_PLAYER_MAX_AGE) {
    return YOUNG_PLAYER_BASE_MULTIPLIER + (age - 16) * YOUNG_PLAYER_MULTIPLIER_PER_AGE;
  }
  const stage = AGE_VALUE_STAGES.find((s) => age <= s.maxAge) ?? AGE_VALUE_STAGES[AGE_VALUE_STAGES.length - 1];
  return stage.multiplier;
}

const ROUNDING_TIER_1M = 1_000_000;
const ROUNDING_TIER_10M = 10_000_000;
const ROUNDING_STEP_SMALL = 10_000;
const ROUNDING_STEP_MEDIUM = 100_000;
const ROUNDING_STEP_LARGE = 500_000;

function roundToNiceValue(value: number): number {
  if (value < ROUNDING_TIER_1M) return Math.round(value / ROUNDING_STEP_SMALL) * ROUNDING_STEP_SMALL;
  if (value < ROUNDING_TIER_10M) return Math.round(value / ROUNDING_STEP_MEDIUM) * ROUNDING_STEP_MEDIUM;
  return Math.round(value / ROUNDING_STEP_LARGE) * ROUNDING_STEP_LARGE;
}

const MARKET_VALUE_BASE_EUR = 50_000;
const MARKET_VALUE_OVR_SCALAR = 700_000;
const MARKET_VALUE_OVR_BASELINE = 45;
const MARKET_VALUE_OVR_DIVISOR = 10;
const MARKET_VALUE_OVR_EXPONENT = 2.8;

/** Valore di mercato in EUR da OVR ed età — cresce in modo super-lineare con l'OVR, si riduce con l'età. */
export function computeMarketValue(ovr: number, age: number): number {
  const ovrFactor = Math.pow(
    Math.max(ovr - MARKET_VALUE_OVR_BASELINE, 1) / MARKET_VALUE_OVR_DIVISOR,
    MARKET_VALUE_OVR_EXPONENT,
  );
  const raw = MARKET_VALUE_BASE_EUR + ovrFactor * MARKET_VALUE_OVR_SCALAR * ageValueMultiplier(age);
  return roundToNiceValue(raw);
}
