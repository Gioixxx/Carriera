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
- [ ] Fase 8 — Polish: dark mode toggle in UI, responsive, accessibilità
- [x] Commit iniziale (60ce3b1) — fasi 1-5
- [x] Commit fase 6 (f73f0a1)
- [x] Redesign visivo del loop di gioco — su richiesta esplicita dell'utente ("tutto visibile e stilisticamente accattivante"): layout a due colonne su desktop (PlayerCard sticky + contenuto), PlayerCard ridisegnata in stile "cartellino" (perforato, JerseyBadge condiviso con la schermata di creazione, conteggio trofei/premi sempre visibile), stelle di prestigio come icone lucide invece di testo, hover/elevazione sulle card decisione, sfondo con atmosfera texture-campo (`field-atmosphere` in globals.css) per non lasciare vuoto lo spazio ai lati su schermi larghi

## Ricerca completata (agenti background)
- 4 sezioni "Esplorazione aggiuntiva" nel piano da carriere giocate sul sito originale (13+ carriere totali) — l'ultima (3) ha confermato ritiro automatico esattamente a 40 anni (3 osservazioni concordanti) e Express = 3 stagioni/ciclo (già implementato correttamente)
- Ricerca URL hotlink per stemmi club/competizioni completata in `.claude/research/team-crests.md` — nomi reali confermati, integrazione nella UI non ancora decisa (solo testuale per ora) → vedi [[backlog]]

## Note tecniche emerse in fase 6
- jsdom 30 + Node 22+ non espone `window.localStorage` di default (ExperimentalWarning nativa) — polyfill minimale in `vitest.setup.ts`, non è un problema di codice applicativo
- `ClubStint` ora ha un campo `ovr` (OVR del giocatore alla fine di quel ciclo) — necessario per la CareerTable, che deve mostrare l'OVR storico per riga, non quello attuale

## Storico
- [sprint completati archiviati qui]
