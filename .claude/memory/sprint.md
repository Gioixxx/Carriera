---
type: sprint
tags: [memory, sprint]
updated: [2026-08-06]
---
> Aggiornato da /sprint — sessione 2026-08-06: miglioria del motore di gioco su 4 assi (harness
> di simulazione statistica, meccaniche mancanti fedeli all'originale — trofei nazionali
> indipendenti/promozione-retrocessione/cambio nazionalità —, varietà e ritmo degli eventi,
> pulizia tecnica). Vedi voce dedicata più sotto e [[decisions]] per il dettaglio completo.

# Sprint Corrente
Stato lavoro in corso. Aggiornato con /sprint. Backlog in [[backlog]], debito in [[tech-debt]].

## Sprint attivo
- **Nome/Numero:** Simulatore di carriera calcistica — build iniziale
- **Periodo:** 2026-08-04 → (in corso)
- **Obiettivo:** completare le 8 fasi del piano in `C:\Users\Gioix\.claude\plans\piped-bouncing-cocke.md`, arrivare a una carriera giocabile end-to-end nel browser

## Task
- [x] Fase 1 — Scaffold Next.js 16 + TS + Tailwind v4, dark mode, cn(), design tokens
- [x] Fase 2 — Dominio puro: types/career.ts, engine.ts, progression.ts, market.ts (76 test)
- [x] Fase 3 — Dati: clubs.ts (84 club, 4 paesi/8 leghe), countries.ts (41 nazionalità)
- [x] Fase 4 — decisions.ts: pool completo decisioni, generatori club-dipendenti, eventi condizionati dal contesto
- [x] Fase 5 — UI creazione personaggio: IdentityForm, SpeedSelect, design "Cartellino del giocatore" (verde campo/pergamena/oro)
- [x] Fase 6 — UI loop di gioco: lib/career/loop.ts (orchestrazione ciclo, contesto prestiti), trophies.ts (trofei club/nazionale/award), hooks/useCareerGame.ts (stato + autosave/resume localStorage), PlayerCard/CareerTable/OfferPanel/DecisionPanel/PenaltyShootout — verificato end-to-end nel browser (academy offer → transfer → loan → loan-return → sign permanente → eventi lifestyle probabilistici → refresh con persistenza corretta)
- [x] Fase 7 — Fine carriera: `lib/career/summary.ts` (dominio puro: `summarizeClubHistory` accorpa `clubHistory` per club sommando le statistiche di cicli separati, `peakOvr`), `CareerSummary.tsx` vero al posto del placeholder (stats OVR max/presenze/gol/assist, tabella club aggregata, sezione nazionale, lista trofei+premi con label italiane per `AwardType`, bottone "Gioca ancora"), 6 nuovi test in `summary.test.ts` — verificato end-to-end nel browser (carriera giocata fino a "Ritirati" in end-of-cycle, riepilogo con aggregazione multi-club/multi-ciclo corretta, "Gioca ancora" resetta al passo 1)
- [x] Fase 8 — Polish: `ThemeToggle` (next-themes, Sun/Moon lucide, guard `mounted` per evitare mismatch di hydration) inserito in `CareerGame.tsx` su ogni schermata; focus-visible mancante aggiunto alle opzioni della dropdown `NationalitySelect`; empty state "vetrina vuota" (`EmptyShowcase`, box tratteggiato + icona trofeo attenuata) per le sezioni Nazionale/Trofei-premi mai raggiunte in `CareerSummary.tsx` — verificato end-to-end nel browser in light e dark mode (carriera giocata fino al ritiro automatico a 40 anni con 1 trofeo e nazionale mai convocata, per vedere sia lo stato pieno sia quello vuoto); `npm run build` di produzione verificata. Responsive non verificabile visivamente in questa sessione: `resize_window` del tool browser non altera il viewport di rendering effettivo in questo ambiente (limite già documentato nel piano, "Esplorazione aggiuntiva 3, punto 0") — verificato invece via audit delle classi Tailwind responsive già presenti in ogni componente (grid che si impila sotto i breakpoint, tabelle con scroll orizzontale)
- [x] Commit iniziale (60ce3b1) — fasi 1-5
- [x] Commit fase 6 (f73f0a1)
- [x] Redesign visivo del loop di gioco — su richiesta esplicita dell'utente ("tutto visibile e stilisticamente accattivante"): layout a due colonne su desktop (PlayerCard sticky + contenuto), PlayerCard ridisegnata in stile "cartellino" (perforato, JerseyBadge condiviso con la schermata di creazione, conteggio trofei/premi sempre visibile), stelle di prestigio come icone lucide invece di testo, hover/elevazione sulle card decisione, sfondo con atmosfera texture-campo (`field-atmosphere` in globals.css) per non lasciare vuoto lo spazio ai lati su schermi larghi

## Ricerca completata (agenti background)
- 3 sezioni "Esplorazione aggiuntiva" nel piano da carriere giocate sul sito originale (13+ carriere totali) — l'ultima (3) ha confermato ritiro automatico esattamente a 40 anni (3 osservazioni concordanti) e Express = 3 stagioni/ciclo (già implementato correttamente)
- Ricerca URL hotlink per stemmi club/competizioni completata in `.claude/research/team-crests.md` — nomi reali confermati, integrazione nella UI non ancora decisa (solo testuale per ora) → vedi [[backlog]]

- [x] **Integrazione immagini club/competizioni/premi** (2026-08-05, dopo che la repo è diventata pubblica): `Club.crestUrl` (84/84, TheSportsDB) + `data/competition-badges.ts` (`COMPETITION_BADGES`, 14 club + Mondiale/Europei) + `AwardBadge.tsx` (icona Twemoji generica per i 3 `AwardType`, non foto reale — vedi [[decisions]]). Componenti nuovi `ClubCrest`/`CompetitionBadge`/`AwardBadge` (stesso pattern `onError` → fallback), wired in `PlayerCard`/`OfferPanel`/`CareerTable`/`CareerSummary`. `next.config.ts` passato a `output: "export"` (già fatto per il launcher .exe, riusato qui). Verificato end-to-end nel browser: stemmi visibili su offerte/club corrente/storico, badge reali Serie A + Premier League nella lista trofei del summary, URL Twemoji verificato via rete (200, image/svg+xml). 129 test (era 124, +5 su `clubs.ts`/`competition-badges.ts`), lint/typecheck/build puliti. `dist/Carriera.exe` rigenerato con la nuova build.

- [x] **Bandiere nazionali via hotlink flagcdn.com** (2026-08-05): nuovo `CountryFlag.tsx` (stesso pattern `onError` di `ClubCrest`), sostituisce l'emoji diretta in `JerseyBadge`/`JerseyCard`/`NationalitySelect`/`IdentityForm`/`PlayerCard` (prop `flag?: string` → `country?: Country`) — vedi [[decisions]] per il perché (emoji bandiera inaffidabile su Windows, incluse le nazionali britanniche). Verificato end-to-end nel browser: dropdown nazionalità con bandiere reali (incluse Inghilterra/Scozia/Galles), bandiera sul cartellino in creazione personaggio e sulla PlayerCard in partita. 129 test invariati, typecheck/lint puliti sui file toccati.

- [x] **Momenti di carriera celebrativi + timeline + animazioni** (2026-08-05, 3 commit: ba0083c, 41b9a01, c882a44 — non registrati in memoria al momento del commit, recuperati in questa sessione): `MomentOverlay.tsx` (overlay modale con focus trap + confetti CSS per trofeo/premio/convocazione nazionale, coda di `buildCareerMoments` gestita da `CareerGame.tsx`), `CareerTimeline.tsx` (barra di progresso 16→40 anni con marker trofei/premi), `hooks/useMotion.ts` (`usePrefersReducedMotion` + `useCountUp`, usato per animare le statistiche in `PlayerCard`), `SetupStepDots` per la navigazione nella creazione personaggio, `lib/career/award-labels.ts` (label italiane `AwardType` estratte per riuso). Vedi [[decisions]] per il ragionamento su overlay modale vs toast e sul rispetto di `prefers-reduced-motion`. Non ancora verificato end-to-end nel browser in questa sessione di recupero — solo letto il codice per documentarlo.

- [x] **Auto-updater del launcher desktop** (2026-08-05, commit 0d56d8a): `UpdateChecker.cs`/`UpdateInstaller.cs` (nuovi) confrontano l'`AssemblyVersion` corrente con l'ultima release GitHub all'avvio (`MainForm.OnLoad`, fire-and-forget) e, su conferma dell'utente, scaricano+applicano l'update via script `.bat` self-replace (necessario perché l'exe è self-contained single-file, non può sovrascrivere se stesso in esecuzione). `scripts/build-launcher.ps1` ora stampa l'`AssemblyVersion` da `package.json.version` invece di duplicarla nel `.csproj`. Vedi [[decisions]] per il design completo. Verificato: `dotnet build` pulito (solo warning preesistente WebView2/WindowsBase), build completo via `build-launcher.ps1` con `dist/Carriera.exe` FileVersion=0.1.0.0 confermato, avvio dell'exe senza crash (5s). **Non verificato visivamente**: il dialog "aggiornamento disponibile" e il flusso download→self-replace→relaunch (richiede abbassare temporaneamente `package.json.version` per forzare il percorso positivo, vedi step 4 del piano — non ancora eseguito).

- [x] **4 nuove feature di gameplay** (2026-08-05, commit 4ddb366, piano approvato in
  `C:\Users\Gioix\.claude\plans\dobbiamo-trovare-delle-idee-cryptic-blossom.md`): **infortuni
  persistenti** (`lib/career/injuries.ts`, stato su `Player.injury`, badge in `PlayerCard`, righe
  dedicate nell'`OutcomeBanner`, outcome lifestyle "Doppie sedute"/"Ritiro speciale" ora
  infortunano davvero invece di essere solo testo); **asse economico-reputazionale**
  (`lib/career/wallet.ts`: stipendio/patrimonio/popolarità, nuova categoria di decisioni
  "sponsor", `PopularityMeter.tsx`, patrimonio/popolarità visibili su `PlayerCard`/
  `CareerSummary`); **hardening trofeo continentale** (`DecisionOutcome.continentalWin`
  esplicito al posto del match sulla stringa "Gol!" in `resultText` — la feature esisteva già,
  solo il rilevamento era fragile); **archivio multi-carriera** (`CareerArchive.tsx`, nuova
  schermata "Le mie carriere", chiave localStorage separata `carriera:archive` con cap FIFO 100
  voci, archiviazione al ritiro). Migrazione storage `STORAGE_VERSION` 1→2 che arricchisce i
  save v1 esistenti con i default dei nuovi campi invece di scartarli. 167 test (era 129),
  lint/typecheck/build puliti, verificato end-to-end nel browser (migrazione save v1, infortuni,
  stipendio/patrimonio/popolarità, trofeo continentale, archivio).

- [x] **Icona custom + sfondo di caricamento per il launcher** (2026-08-05, commit 52e70ac, su
  richiesta esplicita dell'utente con immagini fornite in `img/icona.png`/`img/sfondo.png`, poi
  rimossa dopo la copia — vedi sotto): `assets/app.ico` (multi-risoluzione, generato dall'icona
  fornita) impostato come `ApplicationIcon` nel `.csproj`; `MainForm.cs` lo estrae a runtime
  dall'exe (`Icon.ExtractAssociatedIcon`) per l'icona della finestra. `assets/sfondo.png`
  (embedded resource) mostrato a tutto schermo dietro al `WebView2` finché la pagina non ha
  finito di caricare.

- [x] **Finestra massimizzata all'avvio + durata minima sfondo caricamento** (2026-08-05, commit
  a60e456, su richiesta esplicita): `WindowState = Maximized` invece della dimensione fissa
  1280×860; sfondo di caricamento mostrato per almeno 1,5s prima di lasciare spazio al
  `WebView2` (il caricamento da server locale è troppo rapido perché si veda altrimenti). Rimossa
  la cartella `img/` con gli originali (duplicati in `launcher/CarrieraLauncher/assets/`).

- [x] **Prima release versionata pubblicata: v0.2.0** (2026-08-05, commit b308736 + tag v0.2.0,
  su richiesta esplicita dell'utente): bump `package.json`/`package-lock.json` 0.1.0→0.2.0
  (il vecchio tag `v0.1.0` puntava a un commit ormai superato — bump necessario perché
  l'auto-updater del launcher confronta le versioni), `dist/Carriera.exe` rigenerato
  (FileVersion 0.2.0.0 verificato) e allegato alla [release GitHub
  v0.2.0](https://github.com/Gioixxx/Carriera/releases/tag/v0.2.0) con note di rilascio.

- [x] **2 fix di tech-debt da confronto originale-vs-clone** (2026-08-05, non ancora committati a
  inizio di questa voce): **Champions vs Europa League** (`continentalCompetition` in
  `data/clubs.ts`, soglia `prestige >= 2`, badge Europa League nuovo) e **copertura club estesa a
  5 nuovi paesi** (Portogallo/Francia/Germania/Paesi Bassi/Argentina, 40 club reali, 84→124
  totali, crest TheSportsDB verificati uno per uno) — vedi [[decisions]] per il ragionamento
  completo, [[tech-debt]] per gli item ora archiviati. 170 test (era 168), `tsc`/eslint puliti sui
  file toccati. Non verificato manualmente nel browser il caso raro (finale continentale, 15% di
  probabilità); verificato invece via test dedicati (mappatura prestige→trofeo,
  `generateAcademyOffer`/`isReturnHomeEligible` per un giocatore portoghese). Restano in
  tech-debt.md 4 item dei 6 trovati dal confronto: eventi narrativi mancanti, percentuali su
  `DecisionPanel`, evento cambio-nazionalità, anti-ripetizione lifestyle.

- [x] **Sistema "satisfaction": Hall of Fame, record personali, milestone OVR, titoli di stagione**
  (2026-08-06, commit 46f180a): nuovo `lib/career/satisfaction.ts` (402 righe + 266 di test) —
  milestone OVR (60/70/80/85/90), record personali (`PersonalRecords`: miglior stagione
  gol/assist/presenze, picco valore di mercato, età prima convocazione), 8 titoli di stagione
  (`SeasonTitleId`, con rank di priorità e cap 12 in lista), Hall of Fame calcolata sull'archivio
  multi-carriera (OVR più alto/più trofei/più ricco/più popolare, badge "HoF" in
  `CareerArchive.tsx`). `CareerSummary` mostra il miglior titolo di carriera + eventuali vittorie
  Hall of Fame. Nuovo campo `DecisionOption.hint` (sottotitolo testuale sul trade-off, non un
  peso numerico) wired in `DecisionPanel`/`OfferPanel`/`PenaltyShootout`. Vedi [[decisions]] per
  il ragionamento completo. **Non ancora verificato end-to-end nel browser** — vedi [[tech-debt]].

- [x] **Record infranti spostati da overlay modale a banner persistente** (2026-08-06, commit
  b13fac9): rimosso `{ kind: "record" }` da `MomentOverlay`/`buildCareerMoments` (mostrava solo
  il primo record infranto del ciclo); `OutcomeBanner` in `CareerGame.tsx` ora mostra la lista
  completa di `outcome.brokenRecords` come righe di testo sempre visibili, non più nella coda di
  overlay modali. `PlayerCard` evidenzia con stile condizionale le statistiche che hanno appena
  battuto un record. Vedi [[decisions]] per il perché (un ciclo può rompere più record insieme,
  l'overlay "solo il primo" ne nascondeva altri).

## Ricerca completata (agenti background, 2026-08-05)
- **Esplorazione aggiuntiva 4** sul sito originale (scritta in `piped-bouncing-cocke.md`, fuori dal repo): catene di prestito ancora mai osservate (0/47 cicli aggiuntivi, conclusione: probabilmente non serve modellarle); esito di "Look for a way out" chiarito (trasferimento immediato deterministico, stesso pattern di un'offerta normale accettata); **correzione importante**: l'originale usa sempre nomi di trofeo reali (World Cup, Copa América, Champions League, Europa League, Copa Libertadores, Copa Argentina) mai un placeholder generico "Eurocup" come assunto prima — rilevante per [[backlog]] (nomi confederazione-specifici per trofei nazionale); awards individuali confermati vuoti in 14/14 carriere cumulative anche nel caso più estremo osservato finora (OVR 90, Mondiale + 3x Copa América, 9 trofei di club)
- **Ricerca immagini premi + coppe nazionali** (estende `.claude/research/team-crests.md`, sezioni 5-6): badge TheSportsDB per 6 tornei di confederazione (Mondiale/Europei/Copa América/Asian Cup/Africa Cup of Nations/Gold Cup) trovati e verificati, non ancora cablati in `COMPETITION_BADGES` (serve prima la logica di confederazione, vedi [[backlog]]); valutazione premi individuali con raccomandazione icona generica (Twemoji) invece di foto reale del trofeo Ballon d'Or — già implementata, vedi sopra e [[decisions]]

- [x] **Chiusura tech-debt "codificabile": statistiche portiere, percentuali decisione, eventi
  narrativi, trofei confederazione** (2026-08-06, non ancora committato a fine di questa voce):
  su richiesta esplicita dell'utente ("crea piano per i tech debt", scope limitato ai soli item
  con codice da scrivere, non verifiche browser). **Statistiche portiere**: `StatLine` guadagna
  `goalsAgainst?`/`cleanSheets?` opzionali (estensione additiva, non discriminated union — per
  non toccare le fixture di test esistenti), nuova formula `projectGoalkeeperExtras` in
  `progression.ts`, nuovo titolo di stagione "Muro invalicabile" (`ironWall`) e record
  `bestSeasonCleanSheets` in `satisfaction.ts`, UI `PlayerCard`/`CareerTable`/`CareerSummary`
  aggiornate per `player.position === "GK"`. **Percentuali decisione**: `favorableOutcomeWeight()`
  generalizza in `DecisionPanel`/`OfferPanel` il pattern già introdotto ad-hoc in
  `PenaltyShootout.tsx`. **6 eventi narrativi mancanti**: Club priority/Controversial post
  (`club-crisis`), Unexpected prospect/Triumphant return (`narrative`, età-gated), Finish high
  school/Honesty test (pool `lifestyle`). **Trofei di nazionale per confederazione**: nuovo campo
  `confederation` su `Country`, `rollNationalTrophy` sceglie il torneo reale in base alla
  confederazione invece del fisso Mondiale/Europei. Vedi [[decisions]] per il ragionamento
  completo. 222 test (era 170), lint/typecheck/build puliti (4 warning `react-hooks/set-state-in-
  effect` pre-esistenti in `CareerGame.tsx`/`useMotion.ts`, non toccati in questa sessione).
  **Non verificato manualmente nel browser** (fuori scope per scelta esplicita dell'utente,
  limitato al codice) — verificato invece via test dedicati in `decisions.test.ts`/
  `loop.test.ts`/`progression.test.ts`/`wallet.test.ts`/`satisfaction.test.ts`/`countries.test.ts`.

- [x] **Miglioria del motore di gioco su 4 assi** (2026-08-06): su richiesta esplicita dell'utente
  ("rendere il motore di gioco migliore sotto ogni aspetto possibile"), 4 aree scelte via
  `AskUserQuestion` tra quelle proposte dopo un'analisi con agenti di ricerca in background.
  **Harness di simulazione** (`lib/career/simulation.ts`, `scripts/simulate-careers.ts` →
  `npm run simulate`, `simulation.test.ts`): gira migliaia di carriere con RNG reale/seedato e
  misura le frequenze empiriche di trofei/award/callup/infortuni/ritiro — baseline catturato
  prima e dopo le modifiche (trofeo di club ~78→80%, convocazione ~1.8→1.5%, `narrative` come
  frequenza di categoria raddoppiata da ~4.3% a ~8.7% dopo il ribilanciamento pesi, nessuna
  frequenza crollata a zero). **Meccaniche mancanti**: Mondiale e coppa continentale ora trofei
  indipendenti (`rollNationalTrophies`, non più coin-flip alternativo); nuova promozione/
  retrocessione di campionato (`lib/career/club-progression.ts`, costruita da zero — verificato
  che non esisteva già nonostante un commento la desse per scontata); nuovo evento cambio
  nazionalità ("nonno di un altro paese"), eleggibile solo prima della prima convocazione
  (`STORAGE_VERSION` 3→4). **Varietà eventi**: 3 template per la finale continentale (prima solo
  il rigore), 2 nuovi contratti sponsor, anti-ripetizione anche a livello di singolo evento (non
  solo di categoria) dentro club-crisis/lifestyle/narrative. **Pulizia tecnica**: magic number
  centralizzati in costanti nominate, JSDoc duplicato e riferimenti a un `decisions.md` mai
  esistito sistemati, copertura test rinforzata su `market.ts`/`wallet.ts`/`injuries.ts`. Vedi
  [[decisions]] per il ragionamento completo. 269 test (era 250), `tsc`/eslint puliti sui file
  toccati. **Non verificato manualmente nel browser** (sessione focalizzata sul motore, coerente
  con le sessioni "codice puro" precedenti) — verificato invece via test dedicati e via
  `npm run simulate` prima/dopo per confermare che nessuna frequenza sia collassata a zero.

## Note tecniche emerse in fase 6
- jsdom 30 + Node 22+ non espone `window.localStorage` di default (ExperimentalWarning nativa) — polyfill minimale in `vitest.setup.ts`, non è un problema di codice applicativo
- `ClubStint` ora ha un campo `ovr` (OVR del giocatore alla fine di quel ciclo) — necessario per la CareerTable, che deve mostrare l'OVR storico per riga, non quello attuale

## Storico
- [sprint completati archiviati qui]
