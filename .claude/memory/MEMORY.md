---
type: memory
tags: [memory, index]
updated: [2026-08-06]
---

# Carriera — Next.js
> Contesto persistente. Aggiornato da /remember. Vault Obsidian: vedi workflows/obsidian-vault.md.

**Stack:** Next.js 16 (App Router) · TypeScript strict · Tailwind v4 · Vitest  **Sprint:** 8/8 fasi complete (build iniziale conclusa) + feature post-build in corso  **Aggiornamento:** 2026-08-06

## Contesto
Clone testuale di "Copero — Simulador de carrera" (https://copero.com.ar/juegos/simulador-carrera):
simulatore della carriera di un calciatore, tutto in italiano, nomi reali di club/leghe/nazionali,
solo locale (localStorage, no backend). Piano completo con 4 sezioni di ricerca sul gioco originale
in `C:\Users\Gioix\.claude\plans\piped-bouncing-cocke.md`. Tutte le 8 fasi della build iniziale
completate: scaffold, dominio puro, dati (84 club/41 paesi), decisioni, UI creazione personaggio,
loop di gioco, fine carriera (CareerSummary), polish (dark mode toggle, empty state, a11y).
Dopo la build iniziale: immagini reali via hotlink (stemmi club, badge competizioni, bandiere
nazionali), packaging `.exe` desktop, un giro di polish su animazioni/momenti celebrativi
(overlay trofeo/premio/convocazione, timeline di carriera), estensione a 124 club/9 paesi, un
sistema "satisfaction" (Hall of Fame, record personali, milestone OVR, titoli di stagione), e
(2026-08-06) una miglioria del motore di gioco su 4 assi — harness di simulazione statistica,
meccaniche mancanti fedeli all'originale (trofei nazionali indipendenti, promozione/
retrocessione, cambio nazionalità), varietà/ritmo degli eventi, pulizia tecnica — e (2026-08-06,
stessa giornata, sessione successiva) un'espansione mondo a 220 club/12 nuovi paesi (CONCACAF/
CAF/AFC) con una nuova meccanica "Giant Killer" (sorpresa di coppa), e (2026-08-06, sessione
successiva ancora) un sistema di **Traits/archetipo di carriera + Shadow (debito morale)** —
vettori di personalità nascosti che derivano uno stile ("Bandiera"/"Mercenario"/"Showman"/
"Professionista"/"Leader"/"Problema"), un meter privato che accumula scelte rischiose fino a
scatenare uno scandalo forzato — vedi [[sprint]].

## File memoria (carica su richiesta)
> `@file.md` = import Claude · `[[file]]` = wikilink Obsidian (graph). Tieni entrambi.
- @decisions.md — [[decisions]] — scelte tecniche con motivazioni
- @domain.md — [[domain]] — glossario, entità, regole di business
- @sprint.md — [[sprint]] — task correnti e obiettivi
- @conventions.md — [[conventions]] — pattern specifici del progetto
- @tech-debt.md — [[tech-debt]] — debito tecnico con priorità
- @backlog.md — [[backlog]] — funzionalità e idee lungo termine
- @adr.md — [[adr]] — ADR formali

## Segnalibri critici
- **Repo pubblica dal 2026-08-05** (era privata) — da qui in poi ogni nuovo asset/scelta (immagini, exe in `dist/`, licenze) va valutato assumendo visibilità pubblica, non più "solo io la vedo".
- Il piano di implementazione dettagliato vive FUORI dal repo, in `C:\Users\Gioix\.claude\plans\piped-bouncing-cocke.md` — leggerlo prima di riprendere lo sviluppo, contiene le meccaniche osservate su 10+ carriere giocate sul sito originale.
- Nell'originale gli award individuali (Pallone d'Oro) e le probabilità di nazionale/coppa continentale sono praticamente irraggiungibili anche in carriere-record — il clone li implementa con soglie deliberatamente più generose (vedi [[decisions]]).
- Stemmi club/competizioni: hotlink TheSportsDB (mai download), integrati nella UI (`Club.crestUrl`, `COMPETITION_BADGES`) — vedi [[decisions]]. Premi individuali (Pallone d'Oro ecc.): icona generica Twemoji, deliberatamente NON una foto del trofeo reale (rischio trademark diverso dagli stemmi club, vedi [[decisions]]).
- Eseguibile Windows: `dist/Carriera.exe`, **non più committato nel repo** dal 2026-08-05 (solo `.gitignore`d, distribuito via GitHub Release) — vedi [[decisions]] per la scelta tecnica (.NET/WebView2) e per la decisione di rimuoverlo dal tracking git, e `launcher/README.md` per come rigenerarlo.
- Momenti celebrativi (trofeo/premio/convocazione nazionale) mostrati come overlay modale animato (`MomentOverlay.tsx`) con confetti, rispettando sempre `prefers-reduced-motion` — vedi [[decisions]].
- Il launcher desktop ha un auto-updater (`UpdateChecker.cs`/`UpdateInstaller.cs`): controlla GitHub Releases all'avvio e si autosostituisce su conferma. **Chi taglia una release deve far combaciare il tag git (`vX.Y.Z`) con `package.json.version`**, altrimenti il check non funziona — vedi [[decisions]] e `launcher/README.md`.
- Sistema "satisfaction" (`lib/career/satisfaction.ts`, 2026-08-06): Hall of Fame sull'archivio multi-carriera, record personali, milestone OVR, titoli di stagione — **non ancora verificato end-to-end nel browser**, vedi [[tech-debt]].
- Campi per-ruolo su `StatLine`/`PersonalRecords` (es. `goalsAgainst`/`cleanSheets` per i portieri, 2026-08-06): **sempre opzionali e additivi**, mai un discriminated union — per non rompere le fixture di test esistenti che costruiscono oggetti letterali. Seguire lo stesso pattern per qualunque futura statistica specifica di ruolo. Vedi [[decisions]].
- `Country` (`data/countries.ts`) ha ora un campo `confederation` (UEFA/CONMEBOL/CONCACAF/CAF/AFC) usato da `rollNationalTrophies` (plurale dal 2026-08-06, era `rollNationalTrophy`) per il nome reale del trofeo continentale — usare `getCountry(name)` per il lookup invece di un `.find()` inline.
- Harness di simulazione statistica (`lib/career/simulation.ts`, 2026-08-06): `npm run simulate` gira migliaia di carriere con RNG reale e stampa le frequenze osservate di trofei/award/callup/infortuni/ritiro/categoria — usarlo per ritarare qualunque formula di probabilità prima/dopo, non fissarne una alla cieca. Gira su una config vitest separata (`vitest.simulate.config.mts`) perché non è un file `*.test.ts` — vedi [[decisions]]. Il giocatore simulato sceglie a caso tra le opzioni (`pickUniformOption`), quindi sottostima le frequenze che richiedono OVR alto (award, convocazione) o scelte direzionalmente consistenti (archetipo) rispetto a un giocatore reale — vedi [[tech-debt]].
- Anti-ripetizione ora esiste su due livelli in `lib/career/loop.ts` (2026-08-06): categoria (`recentCategories`, preesistente) e singolo evento dentro club-crisis/lifestyle/narrative (`LoopContext.recentDecisionIds?`, nuovo) — `pickNextDecision` ora ritorna anche il `context` aggiornato, i call site in `useCareerGame.ts`/`simulation.ts` devono salvarlo per far persistere la finestra tra un ciclo e l'altro.
- `STORAGE_VERSION` è 5 dal 2026-08-06 (era 4) — `Player.traits`/`shadow`/`shadowFlags` (Traits/archetipo + Shadow, vedi sotto), migrati da `migratePlayerV4`.
- Traits/archetipo + Shadow (`lib/career/traits.ts`/`shadow.ts`, 2026-08-06): `Player.traits` (5 vettori 0-100) deriva un `ArchetypeId | null` a runtime (`deriveArchetype`, mai salvato), `Player.shadow` (debito morale 0-100) scatena scandalo forzato (categoria `"scandal"`) sopra soglia 50 e blocca la convocazione in nazionale sopra 75 — **soglie/formule di `shadow.ts` sono valori espliciti dati dall'utente, non tarati**, a differenza delle soglie archetipo in `traits.ts` che sono state tarate con l'harness. Solo la parte "scrittura" (scelte→delta) è implementata; la parte "lettura" (offerte/eventi pesati per archetipo) è backlog — vedi [[decisions]] e [[backlog]]. **Non ancora verificato end-to-end nel browser**, vedi [[tech-debt]].
- `data/clubs.ts` copre ora 24 paesi/220 club (2026-08-06, era 10 paesi/124 club) — `Confederation` unificato a 5 valori (import da `@/data/countries`), `League.cup` **ora opzionale** (il Messico non ha coppa nazionale attiva). Arabia Saudita e Qatar restano senza club (ricerca interrotta su richiesta esplicita — vedi [[backlog]]). Nuovo `npm run sync-rosters` (`scripts/sync-league-rosters.ts`) per diagnosticare scostamenti dai roster reali nel tempo — vedi [[decisions]] per i limiti noti dell'API gratuita TheSportsDB scoperti costruendolo.
- Nuova categoria di decisione `"cup-upset"` ("Giant Killer", 2026-08-06): un club di prestigio ≤1 sfida una corazzata in coppa nazionale, stesso mini-gioco `PenaltyShootout` della finale continentale — vedi [[decisions]].
