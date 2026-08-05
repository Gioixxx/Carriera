---
type: sprint
tags: [memory, sprint]
updated: [2026-08-04]
---

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

## Ricerca completata (agenti background, 2026-08-05)
- **Esplorazione aggiuntiva 4** sul sito originale (scritta in `piped-bouncing-cocke.md`, fuori dal repo): catene di prestito ancora mai osservate (0/47 cicli aggiuntivi, conclusione: probabilmente non serve modellarle); esito di "Look for a way out" chiarito (trasferimento immediato deterministico, stesso pattern di un'offerta normale accettata); **correzione importante**: l'originale usa sempre nomi di trofeo reali (World Cup, Copa América, Champions League, Europa League, Copa Libertadores, Copa Argentina) mai un placeholder generico "Eurocup" come assunto prima — rilevante per [[backlog]] (nomi confederazione-specifici per trofei nazionale); awards individuali confermati vuoti in 14/14 carriere cumulative anche nel caso più estremo osservato finora (OVR 90, Mondiale + 3x Copa América, 9 trofei di club)
- **Ricerca immagini premi + coppe nazionali** (estende `.claude/research/team-crests.md`, sezioni 5-6): badge TheSportsDB per 6 tornei di confederazione (Mondiale/Europei/Copa América/Asian Cup/Africa Cup of Nations/Gold Cup) trovati e verificati, non ancora cablati in `COMPETITION_BADGES` (serve prima la logica di confederazione, vedi [[backlog]]); valutazione premi individuali con raccomandazione icona generica (Twemoji) invece di foto reale del trofeo Ballon d'Or — già implementata, vedi sopra e [[decisions]]

## Note tecniche emerse in fase 6
- jsdom 30 + Node 22+ non espone `window.localStorage` di default (ExperimentalWarning nativa) — polyfill minimale in `vitest.setup.ts`, non è un problema di codice applicativo
- `ClubStint` ora ha un campo `ovr` (OVR del giocatore alla fine di quel ciclo) — necessario per la CareerTable, che deve mostrare l'OVR storico per riga, non quello attuale

## Storico
- [sprint completati archiviati qui]
