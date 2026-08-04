---
type: backlog
tags: [memory, backlog]
updated: [2026-08-04]
---

# Backlog
Funzionalità e idee a lungo termine. Prioritizzato pre-sprint → confluisce in [[sprint]].

## Template
### [Titolo breve]
- **Priorità:** Alta / Media / Bassa
- **Tipo:** Feature / Miglioramento / Refactor / Bug
- **Area:** [modulo/dominio]
- **Descrizione:** [valore atteso]
- **Criteri accettazione:** [come capire che è fatto]
- **Stima:** Piccola / Media / Grande

---

### Valutare integrazione stemmi club via hotlink
- **Priorità:** Bassa
- **Tipo:** Feature
- **Area:** UI (`components/features/career/`), dati (`data/clubs.ts`)
- **Descrizione:** un agente di ricerca ha raccolto URL hotlink a stemmi ufficiali per tutti gli 84 club e le competizioni del progetto, salvati in `.claude/research/team-crests.md` (fonte: TheSportsDB, nessuna immagine scaricata). Non ancora deciso se/come integrarli nella UI — il progetto resta per ora "solo testuale" com'era stato deciso a inizio progetto.
- **Criteri accettazione:** decisione esplicita presa con l'utente su se procedere; se sì, integrazione via `<img>` hotlink (mai download/salvataggio locale del file immagine, per il rischio copyright sui marchi registrati).
- **Nota importante:** i termini d'uso di TheSportsDB (citati in `team-crests.md`) vietano la pubblicazione su app store senza abbonamento a pagamento — non è chiaro se questo vincolo si applichi a un'app solo web; da rivalutare se in futuro cambia la piattaforma di distribuzione.
- **Stima:** Piccola (l'integrazione tecnica è semplice, il grosso è già stato fatto dalla ricerca)

## Priorità
- **Alta:** —
- **Media:** —
- **Bassa:** integrazione stemmi club via hotlink (vedi sopra)

## Archiviato
- [item in sprint o scartati]
