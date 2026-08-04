/**
 * Palette "Cartellino del giocatore" — verde campo, pergamena, oro (medaglia), inchiostro.
 * 6 colori nominati, deliberatamente distanti dai default (niente cream+serif+terracotta,
 * niente near-black+neon): il tema è il tesseramento ufficiale di un calciatore.
 */
const primitives = {
  pitchGreen: "#14352b",
  pitchGreenLight: "#3f8f5f",
  parchment: "#f3eedd",
  sage: "#edf0e6",
  ink: "#1b2320",
  gold: "#c9a24b",
  goldBright: "#d4b268",
  crimson: "#b23a3a",
  crimsonLight: "#d9645f",
  skyNight: "#0b1210",
  cardNight: "#132019",
  silver: "#8b95a0",
  bronze: "#9c6b3e",
  white: "#ffffff",
} as const;

export const tokens = {
  light: {
    colorPrimary: primitives.pitchGreen,
    colorPrimaryHover: primitives.pitchGreenLight,
    colorBackground: primitives.sage,
    colorSurface: primitives.white,
    colorSurfaceRaised: primitives.parchment,
    colorBorder: "#d8d2bd",
    colorText: primitives.ink,
    colorTextMuted: "#5b6660",
    colorAccent: primitives.gold,
    /** Verde campo — sempre questo, non segue il tema (un campo da calcio è sempre verde). */
    colorPitch: primitives.pitchGreen,
    colorSuccess: primitives.pitchGreenLight,
    colorWarning: primitives.gold,
    colorError: primitives.crimson,
    colorOvrBronze: primitives.bronze,
    colorOvrSilver: "#5b6a75",
    colorOvrGold: primitives.gold,
  },
  dark: {
    colorPrimary: primitives.goldBright,
    colorPrimaryHover: primitives.gold,
    colorBackground: primitives.skyNight,
    colorSurface: primitives.cardNight,
    colorSurfaceRaised: "#1a2921",
    colorBorder: "#28382f",
    colorText: primitives.parchment,
    colorTextMuted: "#93a39a",
    colorAccent: primitives.goldBright,
    colorPitch: primitives.pitchGreen,
    colorSuccess: primitives.pitchGreenLight,
    colorWarning: primitives.goldBright,
    colorError: primitives.crimsonLight,
    colorOvrBronze: "#b48653",
    colorOvrSilver: primitives.silver,
    colorOvrGold: primitives.goldBright,
  },
} as const;

export type ThemeTokens = typeof tokens.light;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
} as const;

export const typography = {
  fontSizeXs: 12,
  fontSizeSm: 14,
  fontSizeMd: 16,
  fontSizeLg: 18,
  fontSizeXl: 20,
  fontSize2xl: 24,
  fontSize3xl: 30,
  fontSize4xl: 36,
  fontSize5xl: 48,
  fontWeightRegular: "400",
  fontWeightMedium: "500",
  fontWeightSemibold: "600",
  fontWeightBold: "700",
} as const;

export const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;
