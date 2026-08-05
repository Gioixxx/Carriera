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

const UEFA_EUROPA_LEAGUE = "Europa League";
/** Prestige minimo per la Champions League — sotto questa soglia i club UEFA giocano l'Europa League. */
const UEFA_CHAMPIONS_LEAGUE_PRESTIGE_THRESHOLD = 2;

/** Coppa continentale per un club di tier 1: UEFA distingue Champions/Europa League in base al prestige. */
function continentalCompetition(league: League, prestige: Club["prestige"]): string | undefined {
  if (league.tier !== 1) return undefined;
  if (league.confederation === "UEFA") {
    return prestige >= UEFA_CHAMPIONS_LEAGUE_PRESTIGE_THRESHOLD
      ? CONTINENTAL_CUP.UEFA
      : UEFA_EUROPA_LEAGUE;
  }
  return CONTINENTAL_CUP[league.confederation];
}

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
  { id: "por-primeira-liga", name: "Primeira Liga", country: "Portugal", tier: 1, confederation: "UEFA", cup: "Taça de Portugal" },
  { id: "fra-ligue-1", name: "Ligue 1", country: "France", tier: 1, confederation: "UEFA", cup: "Coupe de France" },
  { id: "ger-bundesliga", name: "Bundesliga", country: "Germany", tier: 1, confederation: "UEFA", cup: "DFB-Pokal" },
  { id: "ned-eredivisie", name: "Eredivisie", country: "Netherlands", tier: 1, confederation: "UEFA", cup: "KNVB Beker" },
  { id: "arg-liga-profesional", name: "Liga Profesional", country: "Argentina", tier: 1, confederation: "CONMEBOL", cup: "Copa Argentina" },
];

const leagueById = new Map(leagues.map((league) => [league.id, league]));

function club(
  id: string,
  name: string,
  leagueId: string,
  prestige: Club["prestige"],
  crestUrl: string,
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
      continental: continentalCompetition(league, prestige),
    },
    crestUrl,
  };
}

// Stemmi: hotlink a TheSportsDB (chiave pubblica "123"), mai scaricati/salvati nel repo —
// vedi .claude/research/team-crests.md per la ricerca completa (termini d'uso, id squadra, note).
export const clubs: Club[] = [
  // --- Italia — Serie A ---
  club("juventus", "Juventus", "ita-serie-a", 3, "https://r2.thesportsdb.com/images/media/team/badge/uxf0gr1742983727.png"),
  club("inter", "Inter", "ita-serie-a", 3, "https://r2.thesportsdb.com/images/media/team/badge/ryhu6d1617113103.png"),
  club("ac-milan", "AC Milan", "ita-serie-a", 3, "https://r2.thesportsdb.com/images/media/team/badge/wvspur1448806617.png"),
  club("napoli", "Napoli", "ita-serie-a", 3, "https://r2.thesportsdb.com/images/media/team/badge/l8qyxv1742982541.png"),
  club("roma", "Roma", "ita-serie-a", 2, "https://r2.thesportsdb.com/images/media/team/badge/jwro2s1760820674.png"),
  club("atalanta", "Atalanta", "ita-serie-a", 2, "https://r2.thesportsdb.com/images/media/team/badge/qix5ku1780561327.png"),
  club("fiorentina", "Fiorentina", "ita-serie-a", 2, "https://r2.thesportsdb.com/images/media/team/badge/hc8nhu1656098030.png"),
  club("lazio", "Lazio", "ita-serie-a", 2, "https://r2.thesportsdb.com/images/media/team/badge/rwqyvs1448806608.png"),
  club("bologna", "Bologna", "ita-serie-a", 1, "https://r2.thesportsdb.com/images/media/team/badge/2qi1u31655592366.png"),
  club("torino", "Torino", "ita-serie-a", 1, "https://r2.thesportsdb.com/images/media/team/badge/xxprty1448806802.png"),

  // --- Italia — Serie B ---
  club("sampdoria", "Sampdoria", "ita-serie-b", 1, "https://r2.thesportsdb.com/images/media/team/badge/pr6co21655592769.png"),
  club("palermo", "Palermo", "ita-serie-b", 1, "https://r2.thesportsdb.com/images/media/team/badge/zi1tb01579708939.png"),
  club("bari", "Bari", "ita-serie-b", 1, "https://r2.thesportsdb.com/images/media/team/badge/isfrtg1579724972.png"),
  club("cesena", "Cesena", "ita-serie-b", 1, "https://r2.thesportsdb.com/images/media/team/badge/9l00zr1677256723.png"),
  club("modena", "Modena", "ita-serie-b", 0, "https://r2.thesportsdb.com/images/media/team/badge/93n2wm1656015823.png"),
  club("reggiana", "Reggiana", "ita-serie-b", 0, "https://r2.thesportsdb.com/images/media/team/badge/dffx6o1600266770.png"),
  club("cremonese", "Cremonese", "ita-serie-b", 1, "https://r2.thesportsdb.com/images/media/team/badge/6ng2vy1579708291.png"),
  club("catanzaro", "Catanzaro", "ita-serie-b", 0, "https://r2.thesportsdb.com/images/media/team/badge/byrc5e1691995858.png"),
  club("carrarese", "Carrarese", "ita-serie-b", 0, "https://r2.thesportsdb.com/images/media/team/badge/njh6tl1651779724.png"),
  club("frosinone", "Frosinone", "ita-serie-b", 0, "https://r2.thesportsdb.com/images/media/team/badge/a7xa151603170120.png"),

  // --- Italia — Serie C ---
  club("padova", "Padova", "ita-serie-c", 0, "https://r2.thesportsdb.com/images/media/team/badge/hklo0i1579724992.png"),
  club("pescara", "Pescara", "ita-serie-c", 0, "https://r2.thesportsdb.com/images/media/team/badge/uywyxr1426869511.png"),
  club("virtus-entella", "Virtus Entella", "ita-serie-c", 0, "https://r2.thesportsdb.com/images/media/team/badge/c7yb5u1693457662.png"),
  club("pisa-sc", "Pisa", "ita-serie-c", 0, "https://r2.thesportsdb.com/images/media/team/badge/2eso9w1579708309.png"),
  club("gubbio", "Gubbio", "ita-serie-c", 0, "https://r2.thesportsdb.com/images/media/team/badge/el7zx61680802664.png"),
  club("pontedera", "Pontedera", "ita-serie-c", 0, "https://r2.thesportsdb.com/images/media/team/badge/emkgc41651779179.png"),
  club("novara", "Novara", "ita-serie-c", 0, "https://r2.thesportsdb.com/images/media/team/badge/urbkrr1675352937.png"),
  club("triestina", "Triestina", "ita-serie-c", 0, "https://r2.thesportsdb.com/images/media/team/badge/13hyc21533752996.png"),

  // --- England — Premier League ---
  club("manchester-city", "Manchester City", "eng-premier-league", 3, "https://r2.thesportsdb.com/images/media/team/badge/vwpvry1467462651.png"),
  club("liverpool", "Liverpool", "eng-premier-league", 3, "https://r2.thesportsdb.com/images/media/team/badge/kfaher1737969724.png"),
  club("arsenal", "Arsenal", "eng-premier-league", 3, "https://r2.thesportsdb.com/images/media/team/badge/uyhbfe1612467038.png"),
  club("manchester-united", "Manchester United", "eng-premier-league", 3, "https://r2.thesportsdb.com/images/media/team/badge/xzqdr11517660252.png"),
  club("chelsea", "Chelsea", "eng-premier-league", 2, "https://www.thesportsdb.com/images/media/team/badge/pbf4ul1782638263.png"),
  club("tottenham", "Tottenham Hotspur", "eng-premier-league", 2, "https://r2.thesportsdb.com/images/media/team/badge/dfyfhl1604094109.png"),
  club("newcastle", "Newcastle United", "eng-premier-league", 2, "https://r2.thesportsdb.com/images/media/team/badge/lhwuiz1621593302.png"),
  club("aston-villa", "Aston Villa", "eng-premier-league", 1, "https://www.thesportsdb.com/images/media/team/badge/97mehy1784645865.png"),
  club("brighton", "Brighton & Hove Albion", "eng-premier-league", 1, "https://r2.thesportsdb.com/images/media/team/badge/ywypts1448810904.png"),
  club("west-ham", "West Ham United", "eng-premier-league", 1, "https://r2.thesportsdb.com/images/media/team/badge/yutyxs1467459956.png"),
  club("everton", "Everton", "eng-premier-league", 1, "https://r2.thesportsdb.com/images/media/team/badge/eqayrf1523184794.png"),
  club("wolves", "Wolverhampton Wanderers", "eng-premier-league", 1, "https://r2.thesportsdb.com/images/media/team/badge/u9qr031621593327.png"),

  // --- England — Championship ---
  club("sunderland", "Sunderland", "eng-championship", 1, "https://r2.thesportsdb.com/images/media/team/badge/tprtus1448813498.png"),
  club("southampton", "Southampton", "eng-championship", 1, "https://r2.thesportsdb.com/images/media/team/badge/ggqtd01621593274.png"),
  club("leeds-united", "Leeds United", "eng-championship", 1, "https://r2.thesportsdb.com/images/media/team/badge/jcgrml1756649030.png"),
  club("norwich-city", "Norwich City", "eng-championship", 0, "https://r2.thesportsdb.com/images/media/team/badge/pabczm1679951464.png"),
  club("west-brom", "West Bromwich Albion", "eng-championship", 0, "https://r2.thesportsdb.com/images/media/team/badge/rsvuxw1448813527.png"),
  club("preston", "Preston North End", "eng-championship", 0, "https://r2.thesportsdb.com/images/media/team/badge/wqtwvw1448811512.png"),
  club("middlesbrough", "Middlesbrough", "eng-championship", 0, "https://r2.thesportsdb.com/images/media/team/badge/advjg71780068902.png"),
  club("coventry-city", "Coventry City", "eng-championship", 0, "https://r2.thesportsdb.com/images/media/team/badge/uxyqys1424033798.png"),

  // --- Spagna — La Liga ---
  club("real-madrid", "Real Madrid", "esp-la-liga", 3, "https://r2.thesportsdb.com/images/media/team/badge/vwvwrw1473502969.png"),
  club("barcelona", "Barcelona", "esp-la-liga", 3, "https://r2.thesportsdb.com/images/media/team/badge/wq9sir1639406443.png"),
  club("atletico-madrid", "Atlético Madrid", "esp-la-liga", 3, "https://r2.thesportsdb.com/images/media/team/badge/0ulh3q1719984315.png"),
  club("sevilla", "Sevilla", "esp-la-liga", 2, "https://r2.thesportsdb.com/images/media/team/badge/vpsqqx1473502977.png"),
  club("real-sociedad", "Real Sociedad", "esp-la-liga", 2, "https://r2.thesportsdb.com/images/media/team/badge/vptvpr1473502986.png"),
  club("real-betis", "Real Betis", "esp-la-liga", 2, "https://r2.thesportsdb.com/images/media/team/badge/2oqulv1663245386.png"),
  club("villarreal", "Villarreal", "esp-la-liga", 2, "https://r2.thesportsdb.com/images/media/team/badge/vrypqy1473503073.png"),
  club("athletic-bilbao", "Athletic Bilbao", "esp-la-liga", 2, "https://r2.thesportsdb.com/images/media/team/badge/68w7fe1639408210.png"),
  club("valencia", "Valencia", "esp-la-liga", 1, "https://r2.thesportsdb.com/images/media/team/badge/dm8l6o1655594864.png"),
  club("girona", "Girona", "esp-la-liga", 1, "https://r2.thesportsdb.com/images/media/team/badge/kfu7zu1659897499.png"),

  // --- Spagna — LaLiga 2 ---
  club("las-palmas", "Las Palmas", "esp-laliga2", 0, "https://r2.thesportsdb.com/images/media/team/badge/mmhyb11616443601.png"),
  club("real-oviedo", "Real Oviedo", "esp-laliga2", 0, "https://r2.thesportsdb.com/images/media/team/badge/yuwqus1447590681.png"),
  club("racing-santander", "Racing Santander", "esp-laliga2", 0, "https://r2.thesportsdb.com/images/media/team/badge/97kkiq1536575158.png"),
  club("sporting-gijon", "Sporting Gijón", "esp-laliga2", 0, "https://r2.thesportsdb.com/images/media/team/badge/xxrtqx1473503054.png"),
  club("malaga", "Málaga", "esp-laliga2", 1, "https://r2.thesportsdb.com/images/media/team/badge/upqyvr1473502952.png"),
  club("eibar", "Eibar", "esp-laliga2", 0, "https://r2.thesportsdb.com/images/media/team/badge/hccive1680933599.png"),
  club("levante", "Levante", "esp-laliga2", 0, "https://r2.thesportsdb.com/images/media/team/badge/xwtxsx1473503739.png"),
  club("albacete", "Albacete", "esp-laliga2", 0, "https://r2.thesportsdb.com/images/media/team/badge/17oqja1616436316.png"),

  // --- Brasile — Série A ---
  club("flamengo", "Flamengo", "bra-serie-a", 3, "https://r2.thesportsdb.com/images/media/team/badge/syptwx1473538074.png"),
  club("palmeiras", "Palmeiras", "bra-serie-a", 3, "https://r2.thesportsdb.com/images/media/team/badge/vsqwqp1473538105.png"),
  club("sao-paulo", "São Paulo", "bra-serie-a", 2, "https://r2.thesportsdb.com/images/media/team/badge/sxpupx1473538135.png"),
  club("corinthians", "Corinthians", "bra-serie-a", 2, "https://r2.thesportsdb.com/images/media/team/badge/vvuvps1473538042.png"),
  club("gremio", "Grêmio", "bra-serie-a", 2, "https://r2.thesportsdb.com/images/media/team/badge/uvpwyt1473538089.png"),
  club("internacional", "Internacional", "bra-serie-a", 2, "https://r2.thesportsdb.com/images/media/team/badge/yprvxx1473538097.png"),
  club("fluminense", "Fluminense", "bra-serie-a", 2, "https://r2.thesportsdb.com/images/media/team/badge/stvvwp1473538082.png"),
  club("atletico-mineiro", "Atlético Mineiro", "bra-serie-a", 2, "https://r2.thesportsdb.com/images/media/team/badge/x5lixs1743742872.png"),
  club("cruzeiro", "Cruzeiro", "bra-serie-a", 1, "https://r2.thesportsdb.com/images/media/team/badge/upsvvu1473538059.png"),
  club("botafogo", "Botafogo", "bra-serie-a", 1, "https://r2.thesportsdb.com/images/media/team/badge/bs5mbw1733004596.png"),

  // --- Brasile — Série B ---
  club("remo", "Remo", "bra-serie-b", 0, "https://r2.thesportsdb.com/images/media/team/badge/u36jfy1579341655.png"),
  club("coritiba", "Coritiba", "bra-serie-b", 1, "https://r2.thesportsdb.com/images/media/team/badge/ywwsyu1473538050.png"),
  club("chapecoense", "Chapecoense", "bra-serie-b", 0, "https://r2.thesportsdb.com/images/media/team/badge/wy0e1i1765900601.png"),
  club("vila-nova", "Vila Nova", "bra-serie-b", 0, "https://r2.thesportsdb.com/images/media/team/badge/nwd4ns1740851638.png"),
  club("ponte-preta", "Ponte Preta", "bra-serie-b", 0, "https://r2.thesportsdb.com/images/media/team/badge/wbss4d1644929547.png"),
  club("nautico", "Náutico", "bra-serie-b", 0, "https://r2.thesportsdb.com/images/media/team/badge/wywuwv1464886832.png"),
  club("crb", "CRB", "bra-serie-b", 0, "https://r2.thesportsdb.com/images/media/team/badge/vpypuq1472069179.png"),
  club("avai", "Avaí", "bra-serie-b", 0, "https://r2.thesportsdb.com/images/media/team/badge/bblkat1766506007.png"),

  // --- Portogallo — Primeira Liga ---
  club("benfica", "Benfica", "por-primeira-liga", 3, "https://r2.thesportsdb.com/images/media/team/badge/hj4kyc1781152436.png"),
  club("porto", "FC Porto", "por-primeira-liga", 3, "https://r2.thesportsdb.com/images/media/team/badge/xu47rb1628855600.png"),
  club("sporting-cp", "Sporting CP", "por-primeira-liga", 2, "https://www.thesportsdb.com/images/media/team/badge/5hiuk71783137875.png"),
  club("braga", "Sporting Braga", "por-primeira-liga", 2, "https://www.thesportsdb.com/images/media/team/badge/skbiwo1785775946.png"),
  club("vitoria-guimaraes", "Vitória de Guimarães", "por-primeira-liga", 1, "https://r2.thesportsdb.com/images/media/team/badge/af52z61628855707.png"),
  club("boavista", "Boavista", "por-primeira-liga", 1, "https://r2.thesportsdb.com/images/media/team/badge/usi98v1628853974.png"),
  club("famalicao", "Famalicão", "por-primeira-liga", 0, "https://r2.thesportsdb.com/images/media/team/badge/a3f4er1563653256.png"),
  club("rio-ave", "Rio Ave", "por-primeira-liga", 0, "https://r2.thesportsdb.com/images/media/team/badge/ngbklq1628851239.png"),

  // --- Francia — Ligue 1 ---
  club("psg", "Paris Saint-Germain", "fra-ligue-1", 3, "https://r2.thesportsdb.com/images/media/team/badge/rwqrrq1473504808.png"),
  club("marseille", "Marseille", "fra-ligue-1", 3, "https://r2.thesportsdb.com/images/media/team/badge/c6bazh1779212287.png"),
  club("monaco", "Monaco", "fra-ligue-1", 2, "https://r2.thesportsdb.com/images/media/team/badge/exjf5l1678808044.png"),
  club("lyon", "Lyon", "fra-ligue-1", 2, "https://r2.thesportsdb.com/images/media/team/badge/blk9771656932845.png"),
  club("lille", "Lille", "fra-ligue-1", 1, "https://r2.thesportsdb.com/images/media/team/badge/2giize1534005340.png"),
  club("nice", "Nice", "fra-ligue-1", 1, "https://r2.thesportsdb.com/images/media/team/badge/msy7ly1621593859.png"),
  club("rennes", "Rennes", "fra-ligue-1", 0, "https://r2.thesportsdb.com/images/media/team/badge/ypturx1473504818.png"),
  club("lens", "Lens", "fra-ligue-1", 0, "https://r2.thesportsdb.com/images/media/team/badge/3pxoum1598797195.png"),

  // --- Germania — Bundesliga ---
  club("bayern-munich", "Bayern Munich", "ger-bundesliga", 3, "https://r2.thesportsdb.com/images/media/team/badge/01ogkh1716960412.png"),
  club("borussia-dortmund", "Borussia Dortmund", "ger-bundesliga", 3, "https://r2.thesportsdb.com/images/media/team/badge/tqo8ge1716960353.png"),
  club("rb-leipzig", "RB Leipzig", "ger-bundesliga", 2, "https://r2.thesportsdb.com/images/media/team/badge/zjgapo1594244951.png"),
  club("bayer-leverkusen", "Bayer Leverkusen", "ger-bundesliga", 2, "https://r2.thesportsdb.com/images/media/team/badge/3x9k851726760113.png"),
  club("eintracht-frankfurt", "Eintracht Frankfurt", "ger-bundesliga", 1, "https://r2.thesportsdb.com/images/media/team/badge/rurwpy1473453269.png"),
  club("vfb-stuttgart", "VfB Stuttgart", "ger-bundesliga", 1, "https://r2.thesportsdb.com/images/media/team/badge/yppyux1473454085.png"),
  club("borussia-monchengladbach", "Borussia Mönchengladbach", "ger-bundesliga", 0, "https://r2.thesportsdb.com/images/media/team/badge/sysurw1473453380.png"),
  club("werder-bremen", "Werder Bremen", "ger-bundesliga", 0, "https://r2.thesportsdb.com/images/media/team/badge/tkvqan1716960454.png"),

  // --- Paesi Bassi — Eredivisie ---
  club("ajax", "Ajax", "ned-eredivisie", 3, "https://r2.thesportsdb.com/images/media/team/badge/zg9tii1755495289.png"),
  club("psv", "PSV Eindhoven", "ned-eredivisie", 3, "https://r2.thesportsdb.com/images/media/team/badge/xfsz6i1721297428.png"),
  club("feyenoord", "Feyenoord", "ned-eredivisie", 2, "https://r2.thesportsdb.com/images/media/team/badge/uturtx1473534803.png"),
  club("az-alkmaar", "AZ Alkmaar", "ned-eredivisie", 2, "https://r2.thesportsdb.com/images/media/team/badge/wtqwvv1473534757.png"),
  club("fc-utrecht", "FC Utrecht", "ned-eredivisie", 1, "https://r2.thesportsdb.com/images/media/team/badge/yuhha71625167104.png"),
  club("fc-twente", "FC Twente", "ned-eredivisie", 1, "https://r2.thesportsdb.com/images/media/team/badge/rsrxrt1473534783.png"),
  club("vitesse", "Vitesse", "ned-eredivisie", 0, "https://r2.thesportsdb.com/images/media/team/badge/wrptxp1473534864.png"),
  club("willem-ii", "Willem II", "ned-eredivisie", 0, "https://r2.thesportsdb.com/images/media/team/badge/ushlnc1666107465.png"),

  // --- Argentina — Liga Profesional ---
  club("boca-juniors", "Boca Juniors", "arg-liga-profesional", 3, "https://r2.thesportsdb.com/images/media/team/badge/bm7krb1775741582.png"),
  club("river-plate", "River Plate", "arg-liga-profesional", 3, "https://r2.thesportsdb.com/images/media/team/badge/03dmi31645539717.png"),
  club("racing-club", "Racing Club", "arg-liga-profesional", 2, "https://r2.thesportsdb.com/images/media/team/badge/vi4mu41695734959.png"),
  club("independiente", "Independiente", "arg-liga-profesional", 2, "https://r2.thesportsdb.com/images/media/team/badge/eki4nd1580842605.png"),
  club("san-lorenzo", "San Lorenzo", "arg-liga-profesional", 1, "https://r2.thesportsdb.com/images/media/team/badge/jih7hv1582229717.png"),
  club("estudiantes", "Estudiantes de La Plata", "arg-liga-profesional", 1, "https://r2.thesportsdb.com/images/media/team/badge/pf08dq1760634366.png"),
  club("velez-sarsfield", "Vélez Sarsfield", "arg-liga-profesional", 0, "https://r2.thesportsdb.com/images/media/team/badge/jo98m71517769587.png"),
  club("newells-old-boys", "Newell's Old Boys", "arg-liga-profesional", 0, "https://r2.thesportsdb.com/images/media/team/badge/23aftf1580842633.png"),
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
