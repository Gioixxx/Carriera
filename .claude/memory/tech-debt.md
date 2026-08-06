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

### Probabilità di trofei/award/nazionale nel nostro clone non validate con playtest
- **Priorità:** Media
- **Area:** `lib/career/trophies.ts`, `lib/career/loop.ts` (`nationalCallupChance`, `penaltyScoreChance`, `awardChance`, `clubTrophyChance`)
- **Data:** 2026-08-04
- **Descrizione:** le soglie di probabilità per trofei di club, trofeo con la nazionale e award individuali sono state tarate deliberatamente più generose dell'originale (per rispondere alla richiesta esplicita dell'utente di rendere queste situazioni davvero raggiungibili), ma senza un playtest esteso sul nostro clone che confermi che il bilanciamento risultante sia sensato (non troppo frequente da svuotare di significato, non troppo raro da restare comunque irraggiungibile come nell'originale).
- **Perché rimandato:** le fasi 6-8 avevano priorità sulla struttura del loop di gioco; il bilanciamento fine richiede giocare molte carriere complete, più adatto a una fase dedicata dopo che l'esperienza di gioco è completa (fase 7/8).
- **Impatto:** rischio diretto sull'obiettivo esplicito dato dall'utente ("dobbiamo prevedere tutte queste situazioni raggiungibili") — se le soglie risultassero comunque troppo rare in pratica, il clone erediterebbe lo stesso difetto osservato nell'originale che si voleva evitare.
- **Risoluzione suggerita:** dopo la fase 7 (CareerSummary), giocare/simulare un numero significativo di carriere complete nel nostro clone (anche via test statistici su `resolveCycle` con RNG reale) per verificare empiricamente le frequenze osservate di trofei/award/nazionale.
- **Aggiornamento 2026-08-06:** playtest dal vivo dell'utente sull'originale (carriera Rossi, Brasile, ST, fino a 38 anni/OVR 90) ha mostrato per la prima volta un award individuale **effettivamente vinto** (icona premio non vuota nel riepilogo finale) — diverso dalle 14+ carriere di ricerca precedenti documentate nel piano esterno, dove restavano sempre vuoti anche a OVR 90. Non risolve il dubbio sul bilanciamento, ma indebolisce l'assunzione che siano sistematicamente irraggiungibili nell'originale — un data point in più da tenere presente quando si affronterà la risoluzione suggerita sopra.
- **Aggiornamento 2026-08-06 (2):** costruito l'harness richiesto dalla risoluzione suggerita — `lib/career/simulation.ts` + `scripts/simulate-careers.ts` (`npm run simulate`), gira 2000 carriere con RNG reale e stampa le frequenze osservate. Baseline catturato: trofeo di club ~78-80%, trofeo nazionale ~0.1%, convocazione ~1.5%, infortunio ~84%, award 0% (mai osservato). **Limite noto dell'harness**: il giocatore simulato sceglie le opzioni uniformemente a caso (`pickUniformOption`), non ottimizza le decisioni come farebbe un giocatore reale — di conseguenza l'OVR medio resta basso e le frequenze di award/convocazione (che richiedono OVR 75-85+) sono probabilmente **sottostimate** rispetto a una carriera giocata con intento. L'harness resta quindi utile per intercettare regressioni a zero (il suo scopo primario, vedi [[decisions]]) ma non sostituisce un playtest umano reale per validare il bilanciamento fine — la risoluzione originale resta aperta.

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

## Priorità
- **Alta:** —
- **Media:** probabilità trofei/award/nazionale non validate con playtest umano reale (harness statistico costruito, vedi sopra); momenti celebrativi/timeline non verificati end-to-end; sistema "satisfaction" (Hall of Fame/record/milestone/titoli) non verificato end-to-end (vedi sopra); bottone "Chiudi" non verificato nell'exe (vedi sopra)
- **Bassa:** soglia di ritiro automatico; generatori club-crisis con pesi di base uniformi tra loro (vedi sopra)

## Archiviato
- **Evento "Grandfather from another country" (switch nazionalità) mai implementato** — risolto 2026-08-06: `isNationalitySwitchEligible`/`generateNationalitySwitch` in `decisions.ts`, `switchNationality` in `engine.ts`, eleggibile solo prima della prima convocazione (`!player.nationalTeam.called`, età 18-26) — scelta esplicita dell'utente che evita del tutto la domanda sulla retroattività di trofei/statistiche nazionali già accumulati, perché a quel punto non ce n'è ancora nessuno. `STORAGE_VERSION` 3→4 con migrazione. Vedi [[decisions]] per il ragionamento completo.
- **Possibile assenza di finestra anti-ripetizione per eventi lifestyle/club-crisis** — risolto 2026-08-06: nuova anti-ripetizione a livello di singolo evento (`LoopContext.recentDecisionIds?`, penalità di peso invece di esclusione, stesso principio di `recentCategories`/`REPEAT_PENALTY` già esistente a livello di categoria) in `loop.ts`, wired in `pickClubCrisisDecision`/`pickStaticDecision`/`pickNarrativeDecision`. Test statistico dedicato in `loop.test.ts` con PRNG seedato. Vedi [[decisions]].
- **Champions League ed Europa League non distinte** — risolto 2026-08-05: i club UEFA di tier 1 assegnano "Champions League" se prestige ≥2, "Europa League" altrimenti (`continentalCompetition` in `data/clubs.ts`), badge Europa League aggiunto in `data/competition-badges.ts`. Test dedicato in `clubs.test.ts`.
- **Copertura club/campionati limitata a 4 paesi** — risolto 2026-08-05: estesi `data/clubs.ts`/`leagues` con Portogallo (Primeira Liga), Francia (Ligue 1), Germania (Bundesliga), Paesi Bassi (Eredivisie), Argentina (Liga Profesional) — 40 nuovi club reali con crest TheSportsDB verificati, 84→124 totali. Badge campionato/coppa nazionale aggiunti in `competition-badges.ts`. Verificato con test dedicato che `generateAcademyOffer`/`isReturnHomeEligible` funzionino per un giocatore portoghese (prima ripiegavano su club italiani/spagnoli per mancanza di dati).
- **Statistiche portiere non differenziate** — risolto 2026-08-06: estensione additiva di `StatLine` (`goalsAgainst?`/`cleanSheets?`, valorizzati solo per `Position === "GK"`), formule dedicate in `progression.ts` (`projectGoalkeeperExtras`), propagate in `engine.ts`/`summary.ts` (`sumStats`), `wallet.ts` (`popularityDeltaForCycle` conta i clean sheet come prestazione), `satisfaction.ts` (nuovo titolo di stagione "Muro invalicabile"/`ironWall`, record `bestSeasonCleanSheets`), UI in `PlayerCard`/`CareerTable`/`CareerSummary` (branch su `player.position === "GK"`). Vedi [[decisions]] per il ragionamento sull'approccio additivo invece di un discriminated union.
- **Card di decisione probabilistica senza percentuali visibili** — risolto 2026-08-06: nuovo `favorableOutcomeWeight()` in `lib/career/decisions.ts` mostra il peso reale dell'outcome più favorevole di un'opzione (quando ce n'è più di uno) accanto all'`hint` testuale, in `DecisionPanel`/`OfferPanel` (generalizza il pattern già introdotto in `PenaltyShootout.tsx`, commit f509fc1). Vedi [[decisions]] per l'euristica di scelta dell'outcome "favorevole". **Nota 2026-08-06:** playtest dal vivo ha confermato che l'originale non mostra MAI percentuali sulle card decisione, solo icone qualitative (freccia verde/rossa) — la nostra scelta di mostrare il peso % resta quindi una divergenza voluta rispetto all'originale, non un allineamento; da tenere presente se in futuro si rivaluta la scelta.
- **Eventi narrativi mancanti rispetto all'originale** — risolto 2026-08-06: 6 nuovi generatori in `decisions.ts` — "Club priority"/"Controversial post" (categoria `club-crisis`, `pickClubCrisisDecision` ora filtra per eleggibilità), "Unexpected prospect"/"Triumphant return" (categoria `narrative`, età-gated), "Finish high school" (pool `lifestyle`, unico evento con gate d'età tramite `pickStaticDecision`)/"Honesty test" (pool `lifestyle`, nessun gate). Test dedicati in `decisions.test.ts`/`loop.test.ts`.
