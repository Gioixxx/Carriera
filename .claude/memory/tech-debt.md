---
type: tech-debt
tags: [memory, tech-debt]
updated: [2026-08-04]
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

### Statistiche portiere non differenziate (APPS/GA/CS vs APPS/GOALS/AST)
- **Priorità:** Media
- **Area:** `types/career.ts` (StatLine), `lib/career/progression.ts`, futura UI di fase 6/7
- **Data:** 2026-08-04
- **Descrizione:** la ricerca sul gioco originale ha confermato che i portieri tracciano statistiche diverse (presenze / gol subiti / clean sheet) invece di presenze/gol/assist. Il nostro `StatLine` attuale ha un solo schema fisso (apps/goals/assists) usato per tutti i ruoli, portiere incluso (con goals sempre 0 via `ROLE_WEIGHTS.GK`).
- **Perché rimandato:** non blocca le fasi 1-5 (nessuna UI mostra ancora le statistiche in dettaglio); deciso di non introdurre un secondo schema statistico finché non serve davvero in fase 6/7.
- **Impatto:** se non risolto, un portiere in UI mostrerà "0 gol / 0 assist" invece di gol subiti/clean sheet — funzionalmente corretto ma meno fedele e meno interessante da giocare con quel ruolo.
- **Risoluzione suggerita:** union type discriminato per `StatLine` (`OutfieldStats | GoalkeeperStats`) oppure campi opzionali `goalsAgainst`/`cleanSheets` su un tipo esteso, valutare in fase 6 quando si costruisce `CareerTable`/`PlayerCard`.

## Priorità
- **Alta:** —
- **Media:** statistiche portiere (vedi sopra)
- **Bassa:** —

## Archiviato
- [item risolti]
