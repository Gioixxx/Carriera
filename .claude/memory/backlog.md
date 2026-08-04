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

### Packaging come eseguibile .exe scaricabile dal repo
- **Priorità:** Bassa
- **Tipo:** Feature
- **Area:** build/distribuzione
- **Descrizione:** creare un eseguibile Windows (.exe) del gioco da caricare sul repo (es. come asset di una GitHub Release) in modo che sia scaricabile direttamente, senza dover clonare/buildare il progetto. Richiede probabilmente un wrapper (Electron/Tauri o simile) attorno all'app Next.js, dato che quest'ultima è web-first.
- **Criteri accettazione:** eseguibile generato e caricato come asset scaricabile dal repo GitHub, funzionante standalone su Windows.
- **Nota importante:** la repo è attualmente **privata**; l'utente prevede di renderla **pubblica in futuro** — se/quando questo accade, va rivalutato se pubblicare l'exe come release pubblica cambi considerazioni (es. nomi reali di club/loghi, vedi [[decisions]] su copyright).
- **Stima:** da valutare — dipende dalla tecnologia di packaging scelta (Electron/Tauri vs. altro)

## Priorità
- **Alta:** —
- **Media:** —
- **Bassa:** integrazione stemmi club via hotlink; packaging eseguibile .exe scaricabile (vedi sopra)

## Archiviato
- [item in sprint o scartati]
