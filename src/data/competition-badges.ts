/**
 * Hotlink ai badge delle competizioni reali (TheSportsDB, chiave pubblica "123") — mai
 * scaricati/salvati nel repo. Copre solo le stringhe che il dominio produce davvero oggi
 * (Club.competitions.*, "Mondiale"/"Europei" da rollNationalTrophy in lib/career/trophies.ts).
 * Serie C non ha un badge unico su TheSportsDB (solo 3 gironi separati): lasciata senza badge,
 * la UI mostra comunque il nome testuale. Vedi .claude/research/team-crests.md per la ricerca.
 */
export const COMPETITION_BADGES: Record<string, string> = {
  "Serie A": "https://r2.thesportsdb.com/images/media/league/badge/67q3q21679951383.png",
  "Serie B": "https://r2.thesportsdb.com/images/media/league/badge/uf5kph1598011132.png",
  "Coppa Italia": "https://r2.thesportsdb.com/images/media/league/badge/hrm1vo1692679408.png",
  "Premier League": "https://r2.thesportsdb.com/images/media/league/badge/gasy9d1737743125.png",
  Championship: "https://r2.thesportsdb.com/images/media/league/badge/ty5a681688770169.png",
  "FA Cup": "https://r2.thesportsdb.com/images/media/league/badge/vk7isd1598802862.png",
  "La Liga": "https://r2.thesportsdb.com/images/media/league/badge/ja4it51687628717.png",
  "LaLiga 2": "https://r2.thesportsdb.com/images/media/league/badge/r7u6821688425700.png",
  "Copa del Rey": "https://r2.thesportsdb.com/images/media/league/badge/2ikh3a1671782958.png",
  "Brasileirão Série A": "https://r2.thesportsdb.com/images/media/league/badge/lywv7t1766787179.png",
  "Brasileirão Série B": "https://r2.thesportsdb.com/images/media/league/badge/iiz0gf1778446845.png",
  "Copa do Brasil": "https://r2.thesportsdb.com/images/media/league/badge/h38dax1582151151.png",
  "Champions League": "https://r2.thesportsdb.com/images/media/league/badge/facv1u1742998896.png",
  "Copa Libertadores": "https://r2.thesportsdb.com/images/media/league/badge/9shr931685425181.png",
  Mondiale: "https://r2.thesportsdb.com/images/media/league/badge/e7er5g1696521789.png",
  Europei: "https://r2.thesportsdb.com/images/media/league/badge/bivzlu1635869135.png",
};

export function getCompetitionBadge(competition: string): string | undefined {
  return COMPETITION_BADGES[competition];
}
