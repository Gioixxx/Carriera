---
type: domain
tags: [memory, domain]
updated: [2026-08-04]
---

# Dominio e Glossario
Termini, entità, regole di business del progetto. Decisioni correlate in [[decisions]].

## Entità principali
- **Player** (`types/career.ts`): identità (cognome, numero, piede, nazionalità, ruolo), età, OVR, valore di mercato, statistiche di carriera cumulative, club corrente, `clubHistory`, statistiche nazionale, trofei, awards, flag ritirato.
- **Club** (`data/clubs.ts`): id, nome, paese, tier (livello di lega), prestige (0-3 stelle), competizioni associate (campionato/coppa nazionale/coppa continentale se tier 1), `crestUrl` (hotlink stemma TheSportsDB, mai scaricato — vedi [[decisions]]).
- **ClubStint**: una riga di `clubHistory` — un club per un intervallo di età, con statistiche del periodo. **Una riga per ciclo**, non accorpata per club (replica il comportamento osservato nell'originale: restare 3 cicli nello stesso club produce 3 righe distinte).
- **Decision / DecisionOption / DecisionOutcome**: un bivio con opzioni; ogni opzione ha uno o più outcome pesati (i pesi di un'opzione sommano a 100). Un solo outcome = esito deterministico.
- **Trophy / Award**: trofei di club/nazionale (nome reale competizione) vs premi individuali (Pallone d'Oro, capocannoniere, ecc.).
- **PersonalRecords / OvrMilestone / SeasonTitleEntry** (`types/career.ts`, logica in `lib/career/satisfaction.ts`): record personali del giocatore (miglior stagione per gol/assist/presenze, picco valore di mercato, età prima convocazione), soglie OVR celebrate (60/70/80/85/90) e titoli di stagione assegnati a fine ciclo (8 varianti, es. "Campione"/"Rivelazione"/"Anno difficile") — vedi [[decisions]].
- **ArchivedCareer / Hall of Fame**: ogni carriera ritirata viene archiviata (`carriera:archive`, cap FIFO 100); `computeHallOfFame` seleziona su tutto l'archivio la carriera con OVR più alto, più trofei, più ricca e più popolare — mostrate con badge "HoF" in `CareerArchive.tsx`.

## Glossario
| Termine | Definizione nel progetto |
|---------|--------------------------|
| OVR | Overall rating del giocatore, 30-99, cresce/decresce per fasce di età (vedi `progression.ts`) |
| Ciclo | Intervallo tra una decisione e l'altra: 1 stagione (Intense), 2 (Normal), 3 (Express) |
| Prestige | 0-3 stelle di un club, influenza probabilità di trofei e soglie di offerta |
| Tier | Livello della lega di un club (1 = massima divisione), mutabile per retrocessione/promozione |
| Outcome pesato | Estrazione probabilistica tra più esiti di una scelta, testabile con RNG iniettato |

## Regole di business
- Un giocatore parte a 16 anni, OVR 50, free agent, riceve un'offerta dal settore giovanile tra 3 club a basso prestigio.
- L'OVR cresce fino a metà carriera (picco ~27 anni), plateau, poi declina dopo i 31-34 anni.
- Il ritiro è probabilistico tra 34 e 41 anni (crescente), automatico da 41 in su, oppure scelta esplicita del giocatore ("Retire" solo dentro l'evento "end-of-cycle").
- Le statistiche offscreen (presenze/gol/assist) dipendono da OVR, ruolo e livello del club.
- Nell'originale (Copero) awards individuali/nazionale/coppa continentale sono quasi irraggiungibili — nel clone le probabilità sono deliberatamente più generose (vedi [[decisions]]).

## Flussi principali
- **Creazione personaggio:** selezione ritmo (Intense/Normal/Express) → form identità (cognome, numero, piede, nazionalità, ruolo) → `createPlayer` → offerta settore giovanile.
- **Loop di gioco:** ad ogni ciclo, `pickDecisionCategory` sceglie il tipo di evento, un generatore produce la `Decision`, l'utente sceglie un'opzione, `resolveOutcome` estrae l'esito, `advanceSeasons` + `applyDelta` aggiornano il giocatore.
- **Fine carriera:** `checkRetirement` o scelta esplicita → `retire` → `CareerSummary` con breakdown per club/nazionale/trofei/awards.
