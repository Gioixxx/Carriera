function ageValueMultiplier(age: number): number {
  if (age <= 21) return 0.8 + (age - 16) * 0.08;
  if (age <= 27) return 1.2;
  if (age <= 30) return 1.0;
  if (age <= 33) return 0.7;
  if (age <= 36) return 0.4;
  return 0.15;
}

function roundToNiceValue(value: number): number {
  if (value < 1_000_000) return Math.round(value / 10_000) * 10_000;
  if (value < 10_000_000) return Math.round(value / 100_000) * 100_000;
  return Math.round(value / 500_000) * 500_000;
}

/** Valore di mercato in EUR da OVR ed età — cresce in modo super-lineare con l'OVR, si riduce con l'età. */
export function computeMarketValue(ovr: number, age: number): number {
  const ovrFactor = Math.pow(Math.max(ovr - 45, 1) / 10, 2.8);
  const raw = 50_000 + ovrFactor * 700_000 * ageValueMultiplier(age);
  return roundToNiceValue(raw);
}
