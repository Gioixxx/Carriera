---
type: memory
tags: [memory, index]
updated: [2026-08-05]
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
(overlay trofeo/premio/convocazione, timeline di carriera), estensione a 124 club/9 paesi, e un
sistema "satisfaction" (Hall of Fame, record personali, milestone OVR, titoli di stagione) — vedi
[[sprint]].

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
- `Country` (`data/countries.ts`) ha ora un campo `confederation` (UEFA/CONMEBOL/CONCACAF/CAF/AFC) usato da `rollNationalTrophy` per il nome reale del trofeo continentale — usare `getCountry(name)` per il lookup invece di un `.find()` inline.
