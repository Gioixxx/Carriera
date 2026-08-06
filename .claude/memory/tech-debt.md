---
type: tech-debt
tags: [memory, tech-debt]
updated: [2026-08-05]
---

# Tech Debt
Registro debito tecnico con priorità. Aggiornato da /session-end. Origine spesso in [[conventions]].

## Template
### [Titolo breve]
- **Priorità:** Alta / Media / Bassa
- **Area:** [modulo/layer/feature]
- **Data:** [YYYY-MM-DD]
- **Descrizione:** [problema: duplicazione, workaround, ecc.]
- **Perché rimandato:** [motivo]
- **Impatto:** [rallenta sviluppo / rischio bug]
- **Risoluzione:** [piano suggerito]

---

### Soglia di ritiro automatico (40 anni) basata su pochi campioni
- **Priorità:** Bassa
- **Area:** `lib/career/engine.ts` (`checkRetirement`)
- **Data:** 2026-08-04
- **Descrizione:** la soglia di ritiro automatico è stata spostata da 41 a 40 anni sulla base di 3 osservazioni concordanti raccolte da un agente di ricerca sul gioco originale — un campione ridotto per una costante che definisce la durata massima di ogni carriera.
- **Perché rimandato:** 3 osservazioni concordanti sono un segnale ragionevole per procedere, non giustificano da sole una ricerca dedicata aggiuntiva in questa fase.
- **Impatto:** basso — se la soglia reale fosse leggermente diversa, l'effetto sarebbe solo qualche carriera che finisce 1 anno prima/dopo il previsto, nessun rischio funzionale.
- **Risoluzione suggerita:** se emergono altre osservazioni (nuove sessioni di ricerca o playtest), verificare che 40 resti coerente; altrimenti considerare la questione chiusa.

### Probabilità di trofei/award/nazionale nel nostro clone non validate con playtest
- **Priorità:** Media
- **Area:** `lib/career/trophies.ts`, `lib/career/loop.ts` (`nationalCallupChance`, `penaltyScoreChance`, `awardChance`, `clubTrophyChance`)
- **Data:** 2026-08-04
- **Descrizione:** le soglie di probabilità per trofei di club, trofeo con la nazionale e award individuali sono state tarate deliberatamente più generose dell'originale (per rispondere alla richiesta esplicita dell'utente di rendere queste situazioni davvero raggiungibili), ma senza un playtest esteso sul nostro clone che confermi che il bilanciamento risultante sia sensato (non troppo frequente da svuotare di significato, non troppo raro da restare comunque irraggiungibile come nell'originale).
- **Perché rimandato:** le fasi 6-8 avevano priorità sulla struttura del loop di gioco; il bilanciamento fine richiede giocare molte carriere complete, più adatto a una fase dedicata dopo che l'esperienza di gioco è completa (fase 7/8).
- **Impatto:** rischio diretto sull'obiettivo esplicito dato dall'utente ("dobbiamo prevedere tutte queste situazioni raggiungibili") — se le soglie risultassero comunque troppo rare in pratica, il clone erediterebbe lo stesso difetto osservato nell'originale che si voleva evitare.
- **Risoluzione suggerita:** dopo la fase 7 (CareerSummary), giocare/simulare un numero significativo di carriere complete nel nostro clone (anche via test statistici su `resolveCycle` con RNG reale) per verificare empiricamente le frequenze osservate di trofei/award/nazionale.

### Generatori club-crisis scelti con probabilità uniforme, non pesata
- **Priorità:** Bassa
- **Area:** `lib/career/loop.ts` (`pickClubCrisisDecision`, `CLUB_CRISIS_GENERATORS`)
- **Data:** 2026-08-04
- **Descrizione:** i tre generatori della categoria `club-crisis` (`generateClubCrisis`, `generateCompetitionForSpot`, `generateControversialStatement`) sono scelti con probabilità uniforme (1/3 ciascuno) in `pickClubCrisisDecision`. La ricerca sul gioco originale non ha misurato se questi tre eventi abbiano frequenza relativa uguale o diversa tra loro.
- **Perché rimandato:** informazione non disponibile dalla ricerca; una scelta uniforme è un default ragionevole in assenza di dati.
- **Impatto:** minimo — al più una leggera differenza di "sapore" nella varietà degli eventi rispetto all'originale, nessun impatto funzionale.
- **Risoluzione suggerita:** nessuna azione necessaria a meno che una ricerca futura non fornisca dati sulla frequenza relativa osservata nell'originale.

### Momenti celebrativi/timeline/animazioni non verificati end-to-end nel browser
- **Priorità:** Media
- **Area:** `MomentOverlay.tsx`, `CareerTimeline.tsx`, `hooks/useMotion.ts`, `CareerGame.tsx`
- **Data:** 2026-08-05
- **Descrizione:** i 3 commit che hanno introdotto overlay celebrativi, confetti, timeline di carriera e count-up statistiche (ba0083c, 41b9a01, c882a44) non erano stati registrati in memoria al momento del commit; questa sessione li ha documentati leggendo il codice, ma non ha rigiocato una carriera nel browser per confermare che overlay/focus-trap/coda dei momenti/rispetto di `prefers-reduced-motion` funzionino davvero come da codice.
- **Perché rimandato:** sessione dedicata al recupero della memoria disallineata, non a un giro di test funzionale.
- **Impatto:** rischio medio — è UI nuova e non banale (focus trap, coda di overlay multipli, animazioni condizionate), un bug qui sarebbe visibile all'utente ad ogni trofeo/premio vinto.
- **Risoluzione suggerita:** prima della prossima release, giocare una carriera fino a ottenere almeno un trofeo, un premio e una convocazione in nazionale nella stessa sessione per vedere la coda di overlay in sequenza; testare anche con `prefers-reduced-motion: reduce` attivo nel sistema.

### Sistema "satisfaction" (Hall of Fame, record personali, milestone OVR, titoli di stagione) non verificato end-to-end nel browser
- **Priorità:** Media
- **Area:** `lib/career/satisfaction.ts`, `CareerArchive.tsx`, `CareerSummary.tsx`, `PlayerCard.tsx`, `OutcomeBanner` in `CareerGame.tsx`
- **Data:** 2026-08-06
- **Descrizione:** i commit 46f180a (Hall of Fame + satisfaction) e b13fac9 (record infranti spostati in banner) sono stati documentati in memoria leggendo diff e codice, ma non è stata rigiocata una carriera nel browser per verificare: la sezione Hall of Fame in `CareerArchive` con più carriere archiviate, il "miglior titolo" mostrato in `CareerSummary`, il banner dei record infranti con più record nello stesso ciclo, lo stile condizionale delle statistiche-record in `PlayerCard`.
- **Perché rimandato:** sessione di aggiornamento memoria, non di test funzionale — stesso pattern già visto con i momenti celebrativi (vedi voce sopra, ancora aperta).
- **Impatto:** rischio medio — logica di selezione (rank titoli, Hall of Fame su 4 categorie, cap 12 titoli) non banale, un bug qui sarebbe visibile solo dopo diverse carriere giocate/archiviate, quindi difficile da notare per caso.
- **Risoluzione suggerita:** giocare/archiviare almeno 2-3 carriere con profili diversi (una con OVR alto, una con tanti trofei, una con alta popolarità) per vedere la Hall of Fame popolarsi correttamente in `CareerArchive`; forzare un ciclo con più record infranti insieme per verificare la lista nel banner.

### Evento "Grandfather from another country" (switch nazionalità) mai implementato
- **Priorità:** Bassa
- **Area:** `lib/career/decisions.ts`, `types/career.ts` (`Player.nationality`)
- **Data:** 2026-08-05
- **Descrizione:** durante il confronto è emerso per la prima volta (mai osservato nelle 14 carriere di ricerca precedenti) un evento sull'originale in cui si scopre un nonno di un altro paese, con scelta esplicita tra due nazionali per cui si diventa eleggibili. Il nostro dominio ha `Player.nationality` come campo immutabile per tutta la carriera — implementarlo richiede rendere la nazionalità mutabile e propagare l'effetto su nazionale/convocazioni/trofei nazionali già maturati.
- **Perché rimandato:** singola osservazione (1 carriera), impatto sul modello di dominio non banale (nazionalità oggi assunta fissa in più punti: `trophies.ts`, futuro `rollNationalTrophy` per confederazione — vedi [[backlog]]); da valutare a parte prima di decidere se vale la complessità.
- **Impatto:** basso nel breve termine (evento raro anche nell'originale, 1/15 carriere osservate finora) ma alto se implementato male, dato che tocca l'identità del giocatore in un punto usato in più moduli.
- **Risoluzione suggerita:** raccogliere altre osservazioni prima di procedere (frequenza reale, se l'effetto è retroattivo su trofei/convocazioni nazionali già ottenuti); solo dopo valutare se rendere `Player.nationality` mutabile.

### Possibile assenza di finestra anti-ripetizione per eventi lifestyle/club-crisis
- **Priorità:** Bassa
- **Area:** `lib/career/loop.ts` (`pickClubCrisisDecision` e pool lifestyle)
- **Data:** 2026-08-05
- **Descrizione:** in una carriera di confronto, "Dichiarazione controversa" è comparsa due volte in 3 cicli consecutivi (età 18 e 22) sul clone — singolo data point, non ancora confermato come pattern sistematico né confrontato con la frequenza di ripetizione osservata sull'originale.
- **Perché rimandato:** un solo campione non giustifica un intervento; serve più playtest prima di trattarlo come bug.
- **Impatto:** se confermato sistematico, minore varietà percepita — lo stesso evento che ricompare troppo presto rompe l'illusione di eventi diversi ad ogni ciclo.
- **Risoluzione suggerita:** in una sessione futura, loggare la sequenza di categorie/generatori scelti su più carriere simulate (RNG reale) e verificare se esiste già una finestra anti-ripetizione in `pickClubCrisisDecision`; se assente, valutare di aggiungerne una semplice (es. non ripetere lo stesso generatore per N cicli).

## Priorità
- **Alta:** —
- **Media:** probabilità trofei/award/nazionale non validate con playtest; momenti celebrativi/timeline non verificati end-to-end; sistema "satisfaction" (Hall of Fame/record/milestone/titoli) non verificato end-to-end (vedi sopra)
- **Bassa:** soglia di ritiro automatico; generatori club-crisis con probabilità uniforme; evento cambio-nazionalità mai implementato; possibile assenza di finestra anti-ripetizione eventi lifestyle (vedi sopra)

## Archiviato
- **Champions League ed Europa League non distinte** — risolto 2026-08-05: i club UEFA di tier 1 assegnano "Champions League" se prestige ≥2, "Europa League" altrimenti (`continentalCompetition` in `data/clubs.ts`), badge Europa League aggiunto in `data/competition-badges.ts`. Test dedicato in `clubs.test.ts`.
- **Copertura club/campionati limitata a 4 paesi** — risolto 2026-08-05: estesi `data/clubs.ts`/`leagues` con Portogallo (Primeira Liga), Francia (Ligue 1), Germania (Bundesliga), Paesi Bassi (Eredivisie), Argentina (Liga Profesional) — 40 nuovi club reali con crest TheSportsDB verificati, 84→124 totali. Badge campionato/coppa nazionale aggiunti in `competition-badges.ts`. Verificato con test dedicato che `generateAcademyOffer`/`isReturnHomeEligible` funzionino per un giocatore portoghese (prima ripiegavano su club italiani/spagnoli per mancanza di dati).
- **Statistiche portiere non differenziate** — risolto 2026-08-06: estensione additiva di `StatLine` (`goalsAgainst?`/`cleanSheets?`, valorizzati solo per `Position === "GK"`), formule dedicate in `progression.ts` (`projectGoalkeeperExtras`), propagate in `engine.ts`/`summary.ts` (`sumStats`), `wallet.ts` (`popularityDeltaForCycle` conta i clean sheet come prestazione), `satisfaction.ts` (nuovo titolo di stagione "Muro invalicabile"/`ironWall`, record `bestSeasonCleanSheets`), UI in `PlayerCard`/`CareerTable`/`CareerSummary` (branch su `player.position === "GK"`). Vedi [[decisions]] per il ragionamento sull'approccio additivo invece di un discriminated union.
- **Card di decisione probabilistica senza percentuali visibili** — risolto 2026-08-06: nuovo `favorableOutcomeWeight()` in `lib/career/decisions.ts` mostra il peso reale dell'outcome più favorevole di un'opzione (quando ce n'è più di uno) accanto all'`hint` testuale, in `DecisionPanel`/`OfferPanel` (generalizza il pattern già introdotto in `PenaltyShootout.tsx`, commit f509fc1). Vedi [[decisions]] per l'euristica di scelta dell'outcome "favorevole".
- **Eventi narrativi mancanti rispetto all'originale** — risolto 2026-08-06: 6 nuovi generatori in `decisions.ts` — "Club priority"/"Controversial post" (categoria `club-crisis`, `pickClubCrisisDecision` ora filtra per eleggibilità), "Unexpected prospect"/"Triumphant return" (categoria `narrative`, età-gated), "Finish high school" (pool `lifestyle`, unico evento con gate d'età tramite `pickStaticDecision`)/"Honesty test" (pool `lifestyle`, nessun gate). Test dedicati in `decisions.test.ts`/`loop.test.ts`.
