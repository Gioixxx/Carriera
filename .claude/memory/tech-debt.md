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
- **Area:** `types/career.ts` (StatLine), `lib/career/progression.ts`, `PlayerCard`/`CareerTable` (fase 6, già costruiti con lo schema unico)
- **Data:** 2026-08-04
- **Descrizione:** la ricerca sul gioco originale ha confermato che i portieri tracciano statistiche diverse (presenze / gol subiti / clean sheet) invece di presenze/gol/assist. Il nostro `StatLine` attuale ha un solo schema fisso (apps/goals/assists) usato per tutti i ruoli, portiere incluso (con goals sempre 0 via `ROLE_WEIGHTS.GK`).
- **Perché rimandato:** non ha bloccato le fasi 1-6; `PlayerCard`/`CareerTable` sono ormai costruiti sullo schema unico, quindi la risoluzione ora tocca anche UI già scritta, non solo il dominio.
- **Impatto:** un portiere in UI mostra "0 gol / 0 assist" invece di gol subiti/clean sheet — funzionalmente corretto ma meno fedele e meno interessante da giocare con quel ruolo.
- **Risoluzione suggerita:** union type discriminato per `StatLine` (`OutfieldStats | GoalkeeperStats`) oppure campi opzionali `goalsAgainst`/`cleanSheets` su un tipo esteso; valutare in fase 7/8, comporta ora anche una modifica a `PlayerCard`/`CareerTable`.

### Soglia di ritiro automatico (40 anni) basata su pochi campioni
- **Priorità:** Bassa
- **Area:** `lib/career/engine.ts` (`checkRetirement`)
- **Data:** 2026-08-04
- **Descrizione:** la soglia di ritiro automatico è stata spostata da 41 a 40 anni sulla base di 3 osservazioni concordanti raccolte da un agente di ricerca sul gioco originale — un campione ridotto per una costante che definisce la durata massima di ogni carriera.
- **Perché rimandato:** 3 osservazioni concordanti sono un segnale ragionevole per procedere, non giustificano da sole una ricerca dedicata aggiuntiva in questa fase.
- **Impatto:** basso — se la soglia reale fosse leggermente diversa, l'effetto sarebbe solo qualche carriera che finisce 1 anno prima/dopo il previsto, nessun rischio funzionale.
- **Risoluzione suggerita:** se emergono altre osservazioni (nuove sessioni di ricerca o playtest), verificare che 40 resti coerente; altrimenti considerare la questione chiusa.

### Probabilità di trofei/award/nazionale nel nostro clone non validate con playtest
- **Priorità:** Media
- **Area:** `lib/career/trophies.ts`, `lib/career/loop.ts` (`nationalCallupChance`, `penaltyScoreChance`, `awardChance`, `clubTrophyChance`)
- **Data:** 2026-08-04
- **Descrizione:** le soglie di probabilità per trofei di club, trofeo con la nazionale e award individuali sono state tarate deliberatamente più generose dell'originale (per rispondere alla richiesta esplicita dell'utente di rendere queste situazioni davvero raggiungibili), ma senza un playtest esteso sul nostro clone che confermi che il bilanciamento risultante sia sensato (non troppo frequente da svuotare di significato, non troppo raro da restare comunque irraggiungibile come nell'originale).
- **Perché rimandato:** le fasi 6-8 avevano priorità sulla struttura del loop di gioco; il bilanciamento fine richiede giocare molte carriere complete, più adatto a una fase dedicata dopo che l'esperienza di gioco è completa (fase 7/8).
- **Impatto:** rischio diretto sull'obiettivo esplicito dato dall'utente ("dobbiamo prevedere tutte queste situazioni raggiungibili") — se le soglie risultassero comunque troppo rare in pratica, il clone erediterebbe lo stesso difetto osservato nell'originale che si voleva evitare.
- **Risoluzione suggerita:** dopo la fase 7 (CareerSummary), giocare/simulare un numero significativo di carriere complete nel nostro clone (anche via test statistici su `resolveCycle` con RNG reale) per verificare empiricamente le frequenze osservate di trofei/award/nazionale.

### Generatori club-crisis scelti con probabilità uniforme, non pesata
- **Priorità:** Bassa
- **Area:** `lib/career/loop.ts` (`pickClubCrisisDecision`, `CLUB_CRISIS_GENERATORS`)
- **Data:** 2026-08-04
- **Descrizione:** i tre generatori della categoria `club-crisis` (`generateClubCrisis`, `generateCompetitionForSpot`, `generateControversialStatement`) sono scelti con probabilità uniforme (1/3 ciascuno) in `pickClubCrisisDecision`. La ricerca sul gioco originale non ha misurato se questi tre eventi abbiano frequenza relativa uguale o diversa tra loro.
- **Perché rimandato:** informazione non disponibile dalla ricerca; una scelta uniforme è un default ragionevole in assenza di dati.
- **Impatto:** minimo — al più una leggera differenza di "sapore" nella varietà degli eventi rispetto all'originale, nessun impatto funzionale.
- **Risoluzione suggerita:** nessuna azione necessaria a meno che una ricerca futura non fornisca dati sulla frequenza relativa osservata nell'originale.

### Momenti celebrativi/timeline/animazioni non verificati end-to-end nel browser
- **Priorità:** Media
- **Area:** `MomentOverlay.tsx`, `CareerTimeline.tsx`, `hooks/useMotion.ts`, `CareerGame.tsx`
- **Data:** 2026-08-05
- **Descrizione:** i 3 commit che hanno introdotto overlay celebrativi, confetti, timeline di carriera e count-up statistiche (ba0083c, 41b9a01, c882a44) non erano stati registrati in memoria al momento del commit; questa sessione li ha documentati leggendo il codice, ma non ha rigiocato una carriera nel browser per confermare che overlay/focus-trap/coda dei momenti/rispetto di `prefers-reduced-motion` funzionino davvero come da codice.
- **Perché rimandato:** sessione dedicata al recupero della memoria disallineata, non a un giro di test funzionale.
- **Impatto:** rischio medio — è UI nuova e non banale (focus trap, coda di overlay multipli, animazioni condizionate), un bug qui sarebbe visibile all'utente ad ogni trofeo/premio vinto.
- **Risoluzione suggerita:** prima della prossima release, giocare una carriera fino a ottenere almeno un trofeo, un premio e una convocazione in nazionale nella stessa sessione per vedere la coda di overlay in sequenza; testare anche con `prefers-reduced-motion: reduce` attivo nel sistema.

## Priorità
- **Alta:** —
- **Media:** statistiche portiere; probabilità trofei/award/nazionale non validate con playtest; momenti celebrativi/timeline non verificati end-to-end (vedi sopra)
- **Bassa:** soglia di ritiro automatico; generatori club-crisis con probabilità uniforme (vedi sopra)

## Archiviato
- [item risolti]
