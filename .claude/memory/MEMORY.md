---
type: memory
tags: [memory, index]
updated: [2026-08-05]
---

# Carriera — Next.js
> Contesto persistente. Aggiornato da /remember. Vault Obsidian: vedi workflows/obsidian-vault.md.

**Stack:** Next.js 16 (App Router) · TypeScript strict · Tailwind v4 · Vitest  **Sprint:** 8/8 fasi complete (build iniziale conclusa)  **Aggiornamento:** 2026-08-05

## Contesto
Clone testuale di "Copero — Simulador de carrera" (https://copero.com.ar/juegos/simulador-carrera):
simulatore della carriera di un calciatore, tutto in italiano, nomi reali di club/leghe/nazionali,
solo locale (localStorage, no backend). Piano completo con 4 sezioni di ricerca sul gioco originale
in `C:\Users\Gioix\.claude\plans\piped-bouncing-cocke.md`. Tutte le 8 fasi della build iniziale
completate: scaffold, dominio puro, dati (84 club/41 paesi), decisioni, UI creazione personaggio,
loop di gioco, fine carriera (CareerSummary), polish (dark mode toggle, empty state, a11y).

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
- Eseguibile Windows: `dist/Carriera.exe`, distribuito anche via GitHub Release — vedi [[decisions]] per la scelta tecnica (.NET/WebView2) e `launcher/README.md`.
