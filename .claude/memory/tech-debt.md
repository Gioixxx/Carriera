---
type: tech-debt
tags: [memory, tech-debt]
updated: [2026-08-06]
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

### Trofeo di club forse troppo comune dopo la ricalibrazione OVR (~91%)
- **Priorità:** Bassa
- **Area:** `lib/career/trophies.ts` (`clubTrophyChance`)
- **Data:** 2026-08-06
- **Descrizione:** la ricalibrazione della curva OVR (vedi [[decisions]], "Ricalibrata la curva OVR e le soglie...") ha alzato il tetto OVR medio raggiungibile, e come effetto collaterale non richiesto `clubTrophyChance` (formula invariata) ora produce "almeno un trofeo di club" nel ~91% delle carriere simulate (era ~78-80%). L'utente non ha segnalato i trofei di club come un problema (li vinceva già) e la formula è stata esplicitamente lasciata fuori scope in questa sessione.
- **Perché rimandato:** non è il problema che l'utente ha chiesto di risolvere; 91% non è ancora ~100% (letteralmente garantito), quindi non blocca nulla nell'immediato.
- **Impatto:** rischio basso — se il trofeo di club diventa quasi scontato, perde parzialmente la sensazione di "traguardo", ma resta comunque il trofeo "minore" nella gerarchia (club < nazionale < award), quindi meno critico se comune.
- **Risoluzione suggerita:** se in futuro emerge che vincere il campionato/coppa ogni carriera risulta poco soddisfacente, ridurre leggermente `CLUB_TROPHY_PRESTIGE_WEIGHT`/`CLUB_TROPHY_OVR_DIVISOR` e riverificare con `npm run simulate`.

### Ricalibrazione OVR/soglie "grande momento" non verificata end-to-end nel browser
- **Priorità:** Media
- **Area:** `lib/career/progression.ts`, `lib/career/decisions.ts`, `lib/career/trophies.ts`
- **Data:** 2026-08-06
- **Descrizione:** la ricalibrazione (vedi [[decisions]]) è stata verificata via test unitari (274 verdi) e via l'harness statistico (`npm run simulate`, scelte casuali uniformi su 2000 carriere) ma non è stata rigiocata manualmente una carriera nel browser per confermare che la sensazione "in gioco" corrisponda ai numeri misurati (OVR che sale visibilmente oltre 80, un'offerta da un top club, una convocazione, un trofeo di nazionale).
- **Perché rimandato:** sessione focalizzata sul bilanciamento numerico; l'harness sceglie le opzioni in modo uniforme/casuale quindi sottostima leggermente un giocatore reale che sceglie con criterio (le fasce osservate sono quindi un pavimento conservativo, non un tetto).
- **Impatto:** rischio medio — se qualche interazione UI (es. `targetPrestige`/offerte, badge convocazione) leggesse i valori vecchi da qualche altra parte non aggiornata, il problema resterebbe invisibile finché qualcuno non gioca davvero.
- **Risoluzione suggerita:** giocare/simulare (o usare l'harness con `pickOption` che favorisce esiti OVR-positivi, se mai costruito) qualche carriera fino al ritiro per osservare almeno un'offerta da club di prestigio alto e, se possibile, una convocazione.

### Generatori club-crisis scelti con probabilità uniforme tra loro, non pesata
- **Priorità:** Bassa
- **Area:** `lib/career/loop.ts` (`pickClubCrisisDecision`)
- **Data:** 2026-08-04
- **Descrizione:** i generatori della categoria `club-crisis` sono scelti con probabilità uniforme tra loro (a parità di "recenza") in `pickClubCrisisDecision`. La ricerca sul gioco originale non ha misurato se questi eventi abbiano frequenza relativa uguale o diversa tra loro.
- **Perché rimandato:** informazione non disponibile dalla ricerca; una scelta uniforme resta un default ragionevole in assenza di dati.
- **Impatto:** minimo — al più una leggera differenza di "sapore" nella varietà degli eventi rispetto all'originale, nessun impatto funzionale.
- **Risoluzione suggerita:** nessuna azione necessaria a meno che una ricerca futura non fornisca dati sulla frequenza relativa osservata nell'originale.
- **Aggiornamento 2026-08-06:** aggiunta anti-ripetizione **a livello di singolo evento** (non solo di categoria) in `loop.ts`/`decisions.ts` — vedi [[decisions]] e l'item "Possibile assenza di finestra anti-ripetizione" ora archiviato. Risolve un problema adiacente (evitare ripetizioni ravvicinate dello stesso evento) ma **non** questo item: i pesi di base tra i diversi generatori `club-crisis` restano uguali tra loro in assenza di dati sulla frequenza relativa reale.

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

### Bottone "Chiudi" del menu principale non verificato nell'eseguibile desktop
- **Priorità:** Media
- **Area:** `launcher/CarrieraLauncher/MainForm.cs`, `components/features/career/MainMenu.tsx`
- **Data:** 2026-08-06
- **Descrizione:** il bottone "Chiudi" del nuovo menu principale chiama `window.close()` lato JS; `MainForm.cs` è stato modificato per sottoscrivere `CoreWebView2.WindowCloseRequested` (l'evento che WebView2 espone apposta per questo caso) e chiamare `Close()` sulla finestra. La modifica compila (verificato solo staticamente, non è stata rifatta la build .NET) ma **non è stata verificata eseguendo l'exe rigenerato** — il flusso completo (click "Chiudi" → evento intercettato → finestra chiusa) è verificato solo lato browser (dove `window.close()` è correttamente un no-op silenzioso, comportamento atteso).
- **Perché rimandato:** questa sessione ha lavorato solo sull'export Next.js via dev server (`npm run dev`), senza rigenerare `dist/Carriera.exe` con `scripts/build-launcher.ps1` né lanciare l'eseguibile.
- **Impatto:** rischio medio — se l'evento non si comporta come documentato (es. differenze di versione del runtime WebView2), il bottone "Chiudi" risulterebbe silenziosamente rotto solo nella build desktop, l'unico posto dove ha un effetto reale.
- **Risoluzione suggerita:** prima della prossima release, rigenerare l'exe con `scripts/build-launcher.ps1` e verificare manualmente che il bottone "Chiudi" chiuda davvero la finestra dell'app.

### Retry automatico del download update (v0.3.4) non riverificato con un aggiornamento reale
- **Priorità:** Media
- **Area:** `launcher/CarrieraLauncher/UpdateInstaller.cs`
- **Data:** 2026-08-06
- **Descrizione:** dopo che il fix HTTP/1.1 (v0.3.2) non ha risolto il problema per l'utente (download troncato al 63.7% invece che 8%, punto diverso ad ogni tentativo), è stato aggiunto un retry automatico dell'intero download (fino a 5 tentativi con backoff). Verificato solo con `dotnet build` (compila) — **non è stato osservato un aggiornamento reale con questo fix** che effettivamente completi dopo uno o più retry su questa stessa rete/macchina dove il problema si manifesta.
- **Perché rimandato:** rilasciato rapidamente per sbloccare l'utente; per la macchina di sviluppo il blocco immediato è stato aggirato consegnando `dist/Carriera.exe` per esecuzione diretta (bypassa il download).
- **Impatto:** rischio medio — se l'interferenza di rete blocca *sistematicamente* ogni tentativo (non solo in modo intermittente), 5 retry con backoff non basterebbero e l'utente vedrebbe comunque fallire l'update, solo dopo un'attesa più lunga; inoltre nessuna installazione precedente alla v0.3.4 beneficia del fix finché non viene aggiornata manualmente una volta (limite noto, vedi [[decisions]]).
- **Risoluzione suggerita:** alla prossima occasione, forzare un check aggiornamenti da una v0.3.4 già installata e osservare `%TEMP%\CarrieraUpdate\update-log.txt` per contare quanti tentativi servono realmente prima del successo (o se falliscono tutti e 5); se il pattern persiste, valutare di aumentare `MaxDownloadAttempts` o investigare più a fondo la causa dell'interferenza di rete (es. disabilitare temporaneamente l'antivirus per isolare la causa).

## Priorità
- **Alta:** —
- **Media:** momenti celebrativi/timeline non verificati end-to-end; sistema "satisfaction" (Hall of Fame/record/milestone/titoli) non verificato end-to-end; bottone "Chiudi" non verificato nell'exe; ricalibrazione OVR/soglie "grande momento" non verificata end-to-end; retry automatico download update (v0.3.4) non riverificato con un aggiornamento reale (vedi sopra)
- **Bassa:** soglia di ritiro automatico; generatori club-crisis con pesi di base uniformi tra loro; trofeo di club forse troppo comune dopo la ricalibrazione OVR (vedi sopra)

## Archiviato
- **Auto-updater del launcher non funzionava (v0.3.1/v0.3.2)** — risolto 2026-08-06 dopo segnalazione diretta dell'utente ("spunta l'alert ma anche confermando si avvia la vecchia versione, nemmeno riavviandolo"). Diagnosi in due tempi: (1) `UpdateInstaller.cs` generava uno script `.bat` con un `move /y` senza retry/log — fix v0.3.1 (retry ~15s + log in `%TEMP%\CarrieraUpdate\update-log.txt`); (2) causa reale trovata ispezionando il log della macchina dell'utente: un download da ~58 MB troncato a ~4.9 MB senza eccezione lato .NET — la CDN dei release GitHub parla HTTP/2 e `HttpClient` lo negoziava, con lo stream interrotto a metà su questa configurazione di rete. Fix v0.3.2: download forzato su HTTP/1.1 (`HttpVersion.Version11` + `RequestVersionExact`), controllo integrità confrontato col `Content-Length` dichiarato dal server invece della sola soglia minima. **Verificato dall'utente**: exe di test pinnato a v0.1.0, rilevato v0.3.2, scaricato e applicato con successo (FileVersion confermato 0.3.2.0 post-update). Vedi [[decisions]] per il dettaglio completo.
- **Evento "Grandfather from another country" (switch nazionalità) mai implementato** — risolto 2026-08-06: `isNationalitySwitchEligible`/`generateNationalitySwitch` in `decisions.ts`, `switchNationality` in `engine.ts`, eleggibile solo prima della prima convocazione (`!player.nationalTeam.called`, età 18-26) — scelta esplicita dell'utente che evita del tutto la domanda sulla retroattività di trofei/statistiche nazionali già accumulati, perché a quel punto non ce n'è ancora nessuno. `STORAGE_VERSION` 3→4 con migrazione. Vedi [[decisions]] per il ragionamento completo.
- **Possibile assenza di finestra anti-ripetizione per eventi lifestyle/club-crisis** — risolto 2026-08-06: nuova anti-ripetizione a livello di singolo evento (`LoopContext.recentDecisionIds?`, penalità di peso invece di esclusione, stesso principio di `recentCategories`/`REPEAT_PENALTY` già esistente a livello di categoria) in `loop.ts`, wired in `pickClubCrisisDecision`/`pickStaticDecision`/`pickNarrativeDecision`. Test statistico dedicato in `loop.test.ts` con PRNG seedato. Vedi [[decisions]].
- **Champions League ed Europa League non distinte** — risolto 2026-08-05: i club UEFA di tier 1 assegnano "Champions League" se prestige ≥2, "Europa League" altrimenti (`continentalCompetition` in `data/clubs.ts`), badge Europa League aggiunto in `data/competition-badges.ts`. Test dedicato in `clubs.test.ts`.
- **Copertura club/campionati limitata a 4 paesi** — risolto 2026-08-05: estesi `data/clubs.ts`/`leagues` con Portogallo (Primeira Liga), Francia (Ligue 1), Germania (Bundesliga), Paesi Bassi (Eredivisie), Argentina (Liga Profesional) — 40 nuovi club reali con crest TheSportsDB verificati, 84→124 totali. Badge campionato/coppa nazionale aggiunti in `competition-badges.ts`. Verificato con test dedicato che `generateAcademyOffer`/`isReturnHomeEligible` funzionino per un giocatore portoghese (prima ripiegavano su club italiani/spagnoli per mancanza di dati).
- **Statistiche portiere non differenziate** — risolto 2026-08-06: estensione additiva di `StatLine` (`goalsAgainst?`/`cleanSheets?`, valorizzati solo per `Position === "GK"`), formule dedicate in `progression.ts` (`projectGoalkeeperExtras`), propagate in `engine.ts`/`summary.ts` (`sumStats`), `wallet.ts` (`popularityDeltaForCycle` conta i clean sheet come prestazione), `satisfaction.ts` (nuovo titolo di stagione "Muro invalicabile"/`ironWall`, record `bestSeasonCleanSheets`), UI in `PlayerCard`/`CareerTable`/`CareerSummary` (branch su `player.position === "GK"`). Vedi [[decisions]] per il ragionamento sull'approccio additivo invece di un discriminated union.
- **Card di decisione probabilistica senza percentuali visibili** — risolto 2026-08-06: nuovo `favorableOutcomeWeight()` in `lib/career/decisions.ts` mostra il peso reale dell'outcome più favorevole di un'opzione (quando ce n'è più di uno) accanto all'`hint` testuale, in `DecisionPanel`/`OfferPanel` (generalizza il pattern già introdotto in `PenaltyShootout.tsx`, commit f509fc1). Vedi [[decisions]] per l'euristica di scelta dell'outcome "favorevole". **Nota 2026-08-06:** playtest dal vivo ha confermato che l'originale non mostra MAI percentuali sulle card decisione, solo icone qualitative (freccia verde/rossa) — la nostra scelta di mostrare il peso % resta quindi una divergenza voluta rispetto all'originale, non un allineamento; da tenere presente se in futuro si rivaluta la scelta.
- **Eventi narrativi mancanti rispetto all'originale** — risolto 2026-08-06: 6 nuovi generatori in `decisions.ts` — "Club priority"/"Controversial post" (categoria `club-crisis`, `pickClubCrisisDecision` ora filtra per eleggibilità), "Unexpected prospect"/"Triumphant return" (categoria `narrative`, età-gated), "Finish high school" (pool `lifestyle`, unico evento con gate d'età tramite `pickStaticDecision`)/"Honesty test" (pool `lifestyle`, nessun gate). Test dedicati in `decisions.test.ts`/`loop.test.ts`.
- **Probabilità di trofei/award/nazionale nel nostro clone non validate con playtest** — risolto 2026-08-06 dopo segnalazione diretta dell'utente ("OVR quasi mai sopra 80, mai in nazionale, mai vinto un trofeo"): curva OVR ricalibrata + soglie di `nationalCallupChance`/`nationalTournamentWinChance`/`awardChance`/`targetPrestige` ritarate in 2-3 giri di misurazione con `npm run simulate` (non a tavolino). Risultato: convocazione 1.5%→~22%, trofeo nazionale 0.1%→~5%, award 0%→~7% (Ballon d'Or ~0.3%, resta il più raro). Vedi [[decisions]] per il dettaglio completo dei numeri e del ragionamento. Effetto collaterale non richiesto (trofeo di club salito a ~91%) registrato come nuovo item separato sopra, a priorità bassa.
