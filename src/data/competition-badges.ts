/**
 * Hotlink ai badge delle competizioni reali (TheSportsDB, chiave pubblica "123") — mai
 * scaricati/salvati nel repo. Copre solo le stringhe che il dominio produce davvero oggi
 * (Club.competitions.*, i nomi torneo confederazione-specifici da rollNationalTrophies in
 * lib/career/trophies.ts).
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
  "Europa League": "https://r2.thesportsdb.com/images/media/league/badge/mlsr7d1718774547.png",
  "Copa Libertadores": "https://r2.thesportsdb.com/images/media/league/badge/9shr931685425181.png",
  Mondiale: "https://r2.thesportsdb.com/images/media/league/badge/e7er5g1696521789.png",
  Europei: "https://r2.thesportsdb.com/images/media/league/badge/bivzlu1635869135.png",
  "Copa América": "https://r2.thesportsdb.com/images/media/league/badge/n78hen1718080720.png",
  "AFC Asian Cup": "https://r2.thesportsdb.com/images/media/league/badge/0a86rp1710997941.png",
  "Africa Cup of Nations": "https://r2.thesportsdb.com/images/media/league/badge/rhu61x1738628727.png",
  "CONCACAF Gold Cup": "https://r2.thesportsdb.com/images/media/league/badge/pfx34h1621878481.png",
  "Primeira Liga": "https://www.thesportsdb.com/images/media/league/badge/3tgdke1782689102.png",
  "Taça de Portugal": "https://r2.thesportsdb.com/images/media/league/badge/hyy7lq1593011553.png",
  "Ligue 1": "https://r2.thesportsdb.com/images/media/league/badge/9f7z9d1742983155.png",
  "Coupe de France": "https://r2.thesportsdb.com/images/media/league/badge/l6fitb1546469041.png",
  Bundesliga: "https://r2.thesportsdb.com/images/media/league/badge/teqh1b1679952008.png",
  "DFB-Pokal": "https://r2.thesportsdb.com/images/media/league/badge/tlczpm1780941454.png",
  Eredivisie: "https://r2.thesportsdb.com/images/media/league/badge/5cdsu21725984946.png",
  "KNVB Beker": "https://r2.thesportsdb.com/images/media/league/badge/to8dpt1757803973.png",
  "Liga Profesional": "https://r2.thesportsdb.com/images/media/league/badge/rk9xhx1768238251.png",
  "Copa Argentina": "https://r2.thesportsdb.com/images/media/league/badge/welbig1655924428.png",
  "CONCACAF Champions Cup": "https://r2.thesportsdb.com/images/media/league/badge/njx38y1691129615.png",
  "CAF Champions League": "https://r2.thesportsdb.com/images/media/league/badge/nxb5g41762186344.png",
  "AFC Champions League Elite": "https://r2.thesportsdb.com/images/media/league/badge/gsbq4k1719686780.png",
  "Liga MX": "https://r2.thesportsdb.com/images/media/league/badge/mav5rx1686157960.png",
  MLS: "https://r2.thesportsdb.com/images/media/league/badge/dqo6r91549878326.png",
  "US Open Cup": "https://r2.thesportsdb.com/images/media/league/badge/nda9e31726722125.png",
  "Canadian Premier League": "https://r2.thesportsdb.com/images/media/league/badge/oxb08k1769615518.png",
  "Canadian Championship": "https://www.thesportsdb.com/images/media/league/badge/mux94s1784004460.png",
  "Botola Pro": "https://r2.thesportsdb.com/images/media/league/badge/bhuork1638558615.png",
  "Ligue 1 Sénégalaise": "https://r2.thesportsdb.com/images/media/league/badge/r2m5o11583947531.png",
  NPFL: "https://r2.thesportsdb.com/images/media/league/badge/k4hgin1590183498.png",
  "Ghana Premier League": "https://r2.thesportsdb.com/images/media/league/badge/fk51ll1691567032.png",
  "Egyptian Premier League": "https://r2.thesportsdb.com/images/media/league/badge/air7qk1715766146.png",
  "Ligue 1 Côte d'Ivoire": "https://r2.thesportsdb.com/images/media/league/badge/fhrsyb1645300539.png",
  "J1 League": "https://r2.thesportsdb.com/images/media/league/badge/3j8bni1675170553.png",
  "Emperor's Cup": "https://r2.thesportsdb.com/images/media/league/badge/nd13o11750442580.png",
  "K League 1": "https://r2.thesportsdb.com/images/media/league/badge/zaw2cj1628430843.png",
  "Korea Cup": "https://www.thesportsdb.com/images/media/league/badge/lu5cbf1782691118.png",
  "A-League Men": "https://r2.thesportsdb.com/images/media/league/badge/2u78lm1638459575.png",
  "Australia Cup": "https://r2.thesportsdb.com/images/media/league/badge/bjqd291645454828.png",
};

/**
 * Coppe nazionali con nome reale verificato ma senza badge TheSportsDB trovato (ricerca 2026-08-06
 * — vedi .claude/research/team-crests.md, sezione CAF): la copertura badge di TheSportsDB per le
 * coppe domestiche africane è debole. Usato da competition-badges.test.ts per non trattare questi
 * casi come un gap involontario.
 */
export const CUP_BADGES_KNOWN_GAP: readonly string[] = [
  "Coupe du Trône",
  "Coupe du Sénégal",
  "Nigeria Federation Cup",
  "Ghana FA Cup",
  "Egypt Cup",
  "Coupe de Côte d'Ivoire",
];

export function getCompetitionBadge(competition: string): string | undefined {
  return COMPETITION_BADGES[competition];
}
