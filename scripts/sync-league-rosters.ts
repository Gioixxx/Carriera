import { it } from "vitest";
import { leagues, clubsByTier } from "@/data/clubs";

/**
 * Strumento diagnostico di sola lettura (non un test, non scrive mai su data/clubs.ts):
 * confronta il roster reale corrente (TheSportsDB) con i club presenti in data/clubs.ts, una
 * lega alla volta, e stampa un report di differenze da rivedere a mano.
 *
 * Approccio in due passi per lega (non un'unica query per paese): interrogare
 * `search_all_teams.php?c=<paese>&s=Soccer` restituisce TUTTI i club (anche dilettantistici, a
 * migliaia) di quel paese in un'unica lista tronca — verificato in pratica: i grandi club noti
 * (Real Madrid, Flamengo, ecc.) restano fuori dalla risposta perché la lista è troppo lunga e si
 * ferma prima. Il metodo affidabile, lo stesso già usato dalla ricerca manuale in
 * .claude/research/team-crests.md, è invece: (1) `search_all_leagues.php?c=<paese>&s=Soccer` per
 * scoprire il nome esatto (`strLeague`) della lega su TheSportsDB — il `League.name` di questo
 * dominio (es. "Serie A") quasi mai coincide con lo strLeague ufficiale (es. "Italian Serie A");
 * (2) `search_all_teams.php?l=<strLeague risolto>` per il roster reale di quella sola lega.
 *
 * TheSportsDB riflette la stagione corrente (nomi abbreviati/non ufficiali, squadre
 * promosse/retrocesse di recente) — un mismatch qui è un candidato da verificare, non un fatto
 * accertato: falsi positivi attesi per naming diverso (es. "Roma" in clubs.ts vs "AS Roma" su
 * TheSportsDB, vedi .claude/research/team-crests.md). Eseguire con `npm run sync-rosters`.
 *
 * LIMITE CONFERMATO IN PRATICA: la chiave pubblica gratuita `123` limita `search_all_teams.php`
 * a **10 squadre per risposta**, anche per leghe reali da 18-20 club (verificato: "Italian Serie
 * A" restituisce sempre e solo 10 squadre). Di conseguenza la lista "in clubs.ts ma non nel
 * roster live" è strutturalmente rumorosa per qualunque lega con più di 10 squadre reali — un
 * club assente da quella lista NON è una prova che sia retrocesso/rinominato, può semplicemente
 * essere caduto fuori dal troncamento a 10. La lista "nel roster live ma non in clubs.ts" resta
 * comunque un segnale utile (le squadre che compaiono nei primi 10 sono comunque reali e attuali).
 */
const API_BASE = "https://www.thesportsdb.com/api/v1/json/123";

/**
 * Nomi lega esatti (strLeague) su TheSportsDB, verificati manualmente per `League.id` — servono
 * perché `search_all_leagues.php?c=<paese>` è **anch'esso troncato** dalla chiave gratuita (5
 * risultati circa) e spesso non include affatto la lega di massima serie tra quei pochi
 * risultati (verificato: per Inghilterra restituisce solo leghe dilettantistiche/regionali, mai
 * "English Premier League"; per Brasile solo campionati statali; per Paesi Bassi nessun
 * risultato, il paese va cercato come lega diretta comunque). Senza questa mappa la risoluzione
 * dinamica fallisce silenziosamente per queste leghe. Va estesa quando si aggiungono nuovi
 * campionati — se un id non è qui, lo script ripiega sulla scoperta dinamica (best effort).
 */
const TSDB_LEAGUE_NAME_OVERRIDES: Partial<Record<string, string>> = {
  "ita-serie-a": "Italian Serie A",
  "ita-serie-b": "Italian Serie B",
  "eng-premier-league": "English Premier League",
  "eng-championship": "English League Championship",
  "esp-la-liga": "Spanish La Liga",
  "esp-laliga2": "Spanish La Liga 2",
  "bra-serie-a": "Brazilian Serie A",
  "bra-serie-b": "Brazilian Serie B",
  "por-primeira-liga": "Portuguese Primeira Liga",
  "fra-ligue-1": "French Ligue 1",
  "ger-bundesliga": "German Bundesliga",
  "ned-eredivisie": "Dutch Eredivisie",
};

/**
 * Leghe senza un singolo nome lega TheSportsDB equivalente (es. la Serie C italiana è modellata
 * come 3 gironi separati, non un'unica lega — stesso caso già noto in competition-badges.ts) —
 * saltate esplicitamente invece di provare (e fallire) la risoluzione dinamica ad ogni run.
 */
const NO_SINGLE_TSDB_LEAGUE = new Set(["ita-serie-c"]);
/**
 * TheSportsDB applica un rate limit più severo di quanto documentato sotto carico (osservato:
 * errori Cloudflare 1015 con richieste ravvicinate, richiede ~1s di spaziatura) — vedi anche la
 * nota di volatilità in .claude/research/team-crests.md.
 */
const REQUEST_DELAY_MS = 1000;

const COMBINING_DIACRITICS = new RegExp("[\\u0300-\\u036f]", "g");

function normalize(name: string): string {
  return name
    .normalize("NFD")
    .replace(COMBINING_DIACRITICS, "")
    .toLowerCase()
    .replace(/\b(fc|cf|sc|afc|cd|ac|sk|fk|ca)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function fuzzyIncludes(haystack: string[], needle: string): boolean {
  const normalizedNeedle = normalize(needle);
  return haystack.some((candidate) => {
    const normalizedCandidate = normalize(candidate);
    return (
      normalizedCandidate === normalizedNeedle ||
      normalizedCandidate.includes(normalizedNeedle) ||
      normalizedNeedle.includes(normalizedCandidate)
    );
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJsonOnce<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Un retry dopo una pausa più lunga assorbe i rate-limit Cloudflare intermittenti osservati in pratica. */
async function fetchJson<T>(url: string): Promise<T | null> {
  const first = await fetchJsonOnce<T>(url);
  if (first !== null) return first;
  await sleep(REQUEST_DELAY_MS * 2);
  return fetchJsonOnce<T>(url);
}

/** Tutti i nomi lega (strLeague) di un paese su TheSportsDB, esclusi tornei femminili/coppe. */
async function fetchCountryLeagueNames(country: string): Promise<string[] | null> {
  const url = `${API_BASE}/search_all_leagues.php?c=${encodeURIComponent(country)}&s=Soccer`;
  const data = await fetchJson<{ countries: { strLeague: string }[] | null }>(url);
  if (!data?.countries) return null;
  return data.countries.map((l) => l.strLeague).filter((name) => !/women/i.test(name) && !/cup/i.test(name));
}

/** Trova il nome lega esatto (strLeague) su TheSportsDB per il nostro League.name interno. */
function resolveTsdbLeagueName(candidates: string[], ourLeagueName: string): string | null {
  const normalizedTarget = normalize(ourLeagueName);
  const matches = candidates.filter((name) => {
    const normalizedName = normalize(name);
    return normalizedName.includes(normalizedTarget) || normalizedTarget.includes(normalizedName);
  });
  if (matches.length === 0) return null;
  // Preferisci il nome più corto: tra più corrispondenze parziali è di solito la lega principale
  // (es. "Italian Serie A" invece di un'eventuale variante più lunga).
  return matches.sort((a, b) => a.length - b.length)[0]!;
}

async function fetchLeagueRoster(tsdbLeagueName: string): Promise<string[] | null> {
  const url = `${API_BASE}/search_all_teams.php?l=${encodeURIComponent(tsdbLeagueName)}`;
  const data = await fetchJson<{ teams: { strTeam: string }[] | null }>(url);
  return data?.teams?.map((t) => t.strTeam) ?? null;
}

it("confronta i roster reali (TheSportsDB) con data/clubs.ts e stampa un report", async () => {
  console.log("\n=== Sync roster campionati — report diagnostico (nessuna scrittura) ===\n");

  const countryLeagueNamesCache = new Map<string, string[] | null>();

  for (const league of leagues) {
    const localClubs = clubsByTier(league.country, league.tier);
    const localNames = localClubs.map((c) => c.name);

    if (NO_SINGLE_TSDB_LEAGUE.has(league.id)) {
      console.log(`[${league.name}] (${league.country}) Nessuna lega TheSportsDB singola per questo campionato (girone multiplo) — saltata.`);
      continue;
    }

    let tsdbLeagueName: string | null = TSDB_LEAGUE_NAME_OVERRIDES[league.id] ?? null;

    if (!tsdbLeagueName) {
      if (!countryLeagueNamesCache.has(league.country)) {
        const names = await fetchCountryLeagueNames(league.country);
        await sleep(REQUEST_DELAY_MS);
        countryLeagueNamesCache.set(league.country, names);
      }
      const countryLeagueNames = countryLeagueNamesCache.get(league.country);
      if (!countryLeagueNames) {
        console.log(`[${league.name}] (${league.country}) Nessuna lega restituita da TheSportsDB per questo paese — saltata (verificare a mano, o aggiungere un override).`);
        continue;
      }

      tsdbLeagueName = resolveTsdbLeagueName(countryLeagueNames, league.name);
      if (!tsdbLeagueName) {
        console.log(`[${league.name}] (${league.country}) Nessuna lega corrispondente trovata su TheSportsDB — saltata (verificare a mano, o aggiungere un override).`);
        continue;
      }
    }

    const liveRoster = await fetchLeagueRoster(tsdbLeagueName);
    await sleep(REQUEST_DELAY_MS);

    if (!liveRoster) {
      console.log(`[${league.name}] (${league.country}) → "${tsdbLeagueName}": nessun roster restituito — saltata (verificare a mano).`);
      continue;
    }

    const missingFromLocal = liveRoster.filter((liveName) => !fuzzyIncludes(localNames, liveName));
    const missingFromLive = localNames.filter((localName) => !fuzzyIncludes(liveRoster, localName));

    if (missingFromLocal.length === 0 && missingFromLive.length === 0) {
      console.log(`[${league.name}] (${league.country}) Nessuna differenza rilevata (${localNames.length} club).`);
      continue;
    }

    console.log(`\n[${league.name}] (${league.country}) → TheSportsDB "${tsdbLeagueName}"`);
    if (missingFromLocal.length > 0) {
      console.log(`  Nel roster live ma non in clubs.ts (candidate all'aggiunta o falso positivo di naming):`);
      for (const name of missingFromLocal) console.log(`    + ${name}`);
    }
    if (missingFromLive.length > 0) {
      console.log(`  In clubs.ts ma non nel roster live (da rivedere — retrocesso/rinominato/falso positivo nome):`);
      for (const name of missingFromLive) console.log(`    - ${name}`);
    }
  }

  console.log("\n=== Fine report — nessuna modifica applicata a data/clubs.ts ===\n");
});
