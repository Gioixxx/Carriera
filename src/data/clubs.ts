import type { Club } from "@/types/career";

export type Confederation = "UEFA" | "CONMEBOL";

export interface League {
  id: string;
  name: string;
  country: string;
  /** 1 = massima divisione, 2 = seconda, 3 = terza. */
  tier: number;
  confederation: Confederation;
  cup: string;
}

/** Nome reale della coppa continentale per confederazione — assegnata ai club di tier 1. */
export const CONTINENTAL_CUP: Record<Confederation, string> = {
  UEFA: "Champions League",
  CONMEBOL: "Copa Libertadores",
};

export const leagues: League[] = [
  { id: "ita-serie-a", name: "Serie A", country: "Italy", tier: 1, confederation: "UEFA", cup: "Coppa Italia" },
  { id: "ita-serie-b", name: "Serie B", country: "Italy", tier: 2, confederation: "UEFA", cup: "Coppa Italia" },
  { id: "ita-serie-c", name: "Serie C", country: "Italy", tier: 3, confederation: "UEFA", cup: "Coppa Italia" },
  { id: "eng-premier-league", name: "Premier League", country: "England", tier: 1, confederation: "UEFA", cup: "FA Cup" },
  { id: "eng-championship", name: "Championship", country: "England", tier: 2, confederation: "UEFA", cup: "FA Cup" },
  { id: "esp-la-liga", name: "La Liga", country: "Spain", tier: 1, confederation: "UEFA", cup: "Copa del Rey" },
  { id: "esp-laliga2", name: "LaLiga 2", country: "Spain", tier: 2, confederation: "UEFA", cup: "Copa del Rey" },
  { id: "bra-serie-a", name: "Brasileirão Série A", country: "Brazil", tier: 1, confederation: "CONMEBOL", cup: "Copa do Brasil" },
  { id: "bra-serie-b", name: "Brasileirão Série B", country: "Brazil", tier: 2, confederation: "CONMEBOL", cup: "Copa do Brasil" },
];

const leagueById = new Map(leagues.map((league) => [league.id, league]));

function club(
  id: string,
  name: string,
  leagueId: string,
  prestige: Club["prestige"],
): Club {
  const league = leagueById.get(leagueId);
  if (!league) {
    throw new Error(`Lega sconosciuta: ${leagueId}`);
  }
  return {
    id,
    name,
    country: league.country,
    tier: league.tier,
    prestige,
    competitions: {
      league: league.name,
      cup: league.cup,
      continental: league.tier === 1 ? CONTINENTAL_CUP[league.confederation] : undefined,
    },
  };
}

export const clubs: Club[] = [
  // --- Italia — Serie A ---
  club("juventus", "Juventus", "ita-serie-a", 3),
  club("inter", "Inter", "ita-serie-a", 3),
  club("ac-milan", "AC Milan", "ita-serie-a", 3),
  club("napoli", "Napoli", "ita-serie-a", 3),
  club("roma", "Roma", "ita-serie-a", 2),
  club("atalanta", "Atalanta", "ita-serie-a", 2),
  club("fiorentina", "Fiorentina", "ita-serie-a", 2),
  club("lazio", "Lazio", "ita-serie-a", 2),
  club("bologna", "Bologna", "ita-serie-a", 1),
  club("torino", "Torino", "ita-serie-a", 1),

  // --- Italia — Serie B ---
  club("sampdoria", "Sampdoria", "ita-serie-b", 1),
  club("palermo", "Palermo", "ita-serie-b", 1),
  club("bari", "Bari", "ita-serie-b", 1),
  club("cesena", "Cesena", "ita-serie-b", 1),
  club("modena", "Modena", "ita-serie-b", 0),
  club("reggiana", "Reggiana", "ita-serie-b", 0),
  club("cremonese", "Cremonese", "ita-serie-b", 1),
  club("catanzaro", "Catanzaro", "ita-serie-b", 0),
  club("carrarese", "Carrarese", "ita-serie-b", 0),
  club("frosinone", "Frosinone", "ita-serie-b", 0),

  // --- Italia — Serie C ---
  club("padova", "Padova", "ita-serie-c", 0),
  club("pescara", "Pescara", "ita-serie-c", 0),
  club("virtus-entella", "Virtus Entella", "ita-serie-c", 0),
  club("pisa-sc", "Pisa", "ita-serie-c", 0),
  club("gubbio", "Gubbio", "ita-serie-c", 0),
  club("pontedera", "Pontedera", "ita-serie-c", 0),
  club("novara", "Novara", "ita-serie-c", 0),
  club("triestina", "Triestina", "ita-serie-c", 0),

  // --- England — Premier League ---
  club("manchester-city", "Manchester City", "eng-premier-league", 3),
  club("liverpool", "Liverpool", "eng-premier-league", 3),
  club("arsenal", "Arsenal", "eng-premier-league", 3),
  club("manchester-united", "Manchester United", "eng-premier-league", 3),
  club("chelsea", "Chelsea", "eng-premier-league", 2),
  club("tottenham", "Tottenham Hotspur", "eng-premier-league", 2),
  club("newcastle", "Newcastle United", "eng-premier-league", 2),
  club("aston-villa", "Aston Villa", "eng-premier-league", 1),
  club("brighton", "Brighton & Hove Albion", "eng-premier-league", 1),
  club("west-ham", "West Ham United", "eng-premier-league", 1),
  club("everton", "Everton", "eng-premier-league", 1),
  club("wolves", "Wolverhampton Wanderers", "eng-premier-league", 1),

  // --- England — Championship ---
  club("sunderland", "Sunderland", "eng-championship", 1),
  club("southampton", "Southampton", "eng-championship", 1),
  club("leeds-united", "Leeds United", "eng-championship", 1),
  club("norwich-city", "Norwich City", "eng-championship", 0),
  club("west-brom", "West Bromwich Albion", "eng-championship", 0),
  club("preston", "Preston North End", "eng-championship", 0),
  club("middlesbrough", "Middlesbrough", "eng-championship", 0),
  club("coventry-city", "Coventry City", "eng-championship", 0),

  // --- Spagna — La Liga ---
  club("real-madrid", "Real Madrid", "esp-la-liga", 3),
  club("barcelona", "Barcelona", "esp-la-liga", 3),
  club("atletico-madrid", "Atlético Madrid", "esp-la-liga", 3),
  club("sevilla", "Sevilla", "esp-la-liga", 2),
  club("real-sociedad", "Real Sociedad", "esp-la-liga", 2),
  club("real-betis", "Real Betis", "esp-la-liga", 2),
  club("villarreal", "Villarreal", "esp-la-liga", 2),
  club("athletic-bilbao", "Athletic Bilbao", "esp-la-liga", 2),
  club("valencia", "Valencia", "esp-la-liga", 1),
  club("girona", "Girona", "esp-la-liga", 1),

  // --- Spagna — LaLiga 2 ---
  club("las-palmas", "Las Palmas", "esp-laliga2", 0),
  club("real-oviedo", "Real Oviedo", "esp-laliga2", 0),
  club("racing-santander", "Racing Santander", "esp-laliga2", 0),
  club("sporting-gijon", "Sporting Gijón", "esp-laliga2", 0),
  club("malaga", "Málaga", "esp-laliga2", 1),
  club("eibar", "Eibar", "esp-laliga2", 0),
  club("levante", "Levante", "esp-laliga2", 0),
  club("albacete", "Albacete", "esp-laliga2", 0),

  // --- Brasile — Série A ---
  club("flamengo", "Flamengo", "bra-serie-a", 3),
  club("palmeiras", "Palmeiras", "bra-serie-a", 3),
  club("sao-paulo", "São Paulo", "bra-serie-a", 2),
  club("corinthians", "Corinthians", "bra-serie-a", 2),
  club("gremio", "Grêmio", "bra-serie-a", 2),
  club("internacional", "Internacional", "bra-serie-a", 2),
  club("fluminense", "Fluminense", "bra-serie-a", 2),
  club("atletico-mineiro", "Atlético Mineiro", "bra-serie-a", 2),
  club("cruzeiro", "Cruzeiro", "bra-serie-a", 1),
  club("botafogo", "Botafogo", "bra-serie-a", 1),

  // --- Brasile — Série B ---
  club("remo", "Remo", "bra-serie-b", 0),
  club("coritiba", "Coritiba", "bra-serie-b", 1),
  club("chapecoense", "Chapecoense", "bra-serie-b", 0),
  club("vila-nova", "Vila Nova", "bra-serie-b", 0),
  club("ponte-preta", "Ponte Preta", "bra-serie-b", 0),
  club("nautico", "Náutico", "bra-serie-b", 0),
  club("crb", "CRB", "bra-serie-b", 0),
  club("avai", "Avaí", "bra-serie-b", 0),
];

export function getLeague(id: string): League | undefined {
  return leagueById.get(id);
}

export function getClub(id: string): Club | undefined {
  return clubs.find((c) => c.id === id);
}

export function clubsByCountry(country: string): Club[] {
  return clubs.filter((c) => c.country === country);
}

export function clubsByTier(country: string, tier: number): Club[] {
  return clubs.filter((c) => c.country === country && c.tier === tier);
}
