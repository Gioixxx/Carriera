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
- [ ] Fase 6 — UI loop di gioco: PlayerCard, CareerTable, OfferPanel, DecisionPanel, PenaltyShootout, orchestratore CareerGame con reducer + persistenza localStorage
- [ ] Fase 7 — Fine carriera: retirement automatico, CareerSummary (breakdown per club, nazionale, awards, trofei), "Play again"
- [ ] Fase 8 — Polish: dark mode toggle in UI, responsive, accessibilità
- [x] Commit iniziale (60ce3b1) — fasi 1-5

## Ricerca in corso (agenti background)
- 4 sezioni "Esplorazione aggiuntiva" nel piano da carriere giocate sul sito originale (10+ carriere totali)
- Ricerca URL hotlink per stemmi club/competizioni in `.claude/research/team-crests.md` (in corso)

## Storico
- [sprint completati archiviati qui]
