---
type: tech-debt
tags: [memory, tech-debt]
updated: [2026-08-05]
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

### Champions League ed Europa League non distinte (un solo trofeo continentale UEFA)
- **Priorità:** Alta
- **Area:** `data/clubs.ts` (`CONTINENTAL_CUP`), `lib/career/trophies.ts` (`rollClubTrophies`)
- **Data:** 2026-08-05
- **Descrizione:** un agente ha giocato una carriera fresca sul sito originale e una equivalente sul clone (confrontate anche col codice sorgente): `CONTINENTAL_CUP` mappa **un solo** trofeo per confederazione (UEFA → sempre "Champions League" fisso, CONMEBOL → sempre "Copa Libertadores" fisso). L'originale tratta Champions League ed Europa League come due trofei europei distinti e non intercambiabili (confermato più volte anche nella ricerca precedente, Esplorazione 4, e nell'evento "Club priority" che a volte fa scegliere quale delle due inseguire).
- **Perché rimandato:** non emerso come gap fino a questo confronto diretto — la scelta di un trofeo continentale fisso per confederazione era stata presa senza verificare che l'originale ne distinguesse due per l'Europa.
- **Impatto:** un club di prestigio medio-alto in UEFA nel clone può vincere solo "Champions League", mai "Europa League" — meno fedele e meno varietà nei trofei di fine carriera.
- **Risoluzione suggerita:** introdurre un secondo tier di coppa continentale UEFA (Champions vs Europa League, probabilmente legato al prestigio del club) in `CONTINENTAL_CUP`/`rollClubTrophies`; basso costo, la logica di roll pesato esiste già. Badge TheSportsDB da verificare/aggiungere in `data/competition-badges.ts`.

### Copertura club/campionati limitata a 4 paesi nonostante 41 nazionalità in `countries.ts`
- **Priorità:** Media
- **Area:** `data/clubs.ts`, `data/countries.ts`, `lib/career/decisions.ts` (`generateAcademyOffer`, `clubsByCountry`)
- **Data:** 2026-08-05
- **Descrizione:** confermato giocando una carriera con un giocatore portoghese sul clone: ha ricevuto offerte da club italiani/spagnoli (Novara, Frosinone, Real Oviedo) perché `clubs.ts` copre solo Italia (Serie A/B/C), Inghilterra (Premier/Championship), Spagna (La Liga/LaLiga2) e Brasile (Série A/B) — 2 confederazioni. `countries.ts` ha invece 41 nazionalità, quasi tutte senza club corrispondenti. **La logica di filtro per nazionalità è già corretta** (`generateAcademyOffer` prova prima `clubsByCountry(identity.nationality)`, ripiega sul pool globale solo se <3 club) — è un gap di dati, non di logica.
- **Perché rimandato:** le 84 squadre attuali coprivano il minimo per far girare il loop di gioco end-to-end; estendere il dataset non era mai stato prioritario finché non si è osservato l'effetto pratico (offerte cross-country immotivate per nazionalità comuni).
- **Impatto:** qualunque giocatore con nazionalità fuori dai 4 paesi coperti riceve offerte "casuali" per nazionalità invece che dal proprio paese — rompe l'immersione per le nazionalità più probabili da scegliere (europee/sudamericane popolari).
- **Risoluzione suggerita:** estendere `clubs.ts` per le nazionalità più comuni già in `countries.ts`, in ordine di priorità: Portogallo, Francia, Germania, Paesi Bassi, Argentina (tutte osservate ripetutamente sia nell'originale che già presenti come nazionalità selezionabili nel clone).

### Eventi narrativi osservati nell'originale ma assenti in `decisions.ts`
- **Priorità:** Media
- **Area:** `lib/career/decisions.ts` (pool lifestyle/club-crisis)
- **Data:** 2026-08-05
- **Descrizione:** confronto diretto originale-vs-clone (più il piano di ricerca esterno) elenca eventi mai portati nel codice: **"Club priority"** (scegli se lottare per il campionato o la coppa internazionale, nome reale della coppa in card), **"Unexpected prospect"** (mentore vs "look for a way out", doppio effetto deterministico), **"Triumphant return"** (offerta di tornare al primo club a fine carriera), **"Finish high school"**, **"Honesty test"**, **"Controversial post"** (distinto da "Controversial statement", già implementato). Verificato via grep che nessuno di questi id/nomi esiste in `decisions.ts`.
- **Perché rimandato:** il pool di decisioni attuale copre già tutte le categorie principali (academy, prestito, competizione per il posto, lifestyle, club-crisis) e non ha bloccato le fasi 1-8; questi sono eventi aggiuntivi di varietà, non funzionalità core mancanti.
- **Impatto:** varietà ridotta rispetto all'originale — un giocatore che gioca molte carriere sul clone incontra un ventaglio di situazioni più stretto.
- **Risoluzione suggerita:** portare questi eventi in `decisions.ts` seguendo lo stesso pattern `resolveOutcome`/outcome pesati già usato per gli eventi esistenti; basso rischio architetturale, nessuna modifica al motore. "Triumphant return" richiede accesso al primo club della carriera (già disponibile in `clubHistory[0]`).

### Card di decisione probabilistica senza percentuali visibili (a differenza dell'originale)
- **Priorità:** Bassa
- **Area:** `components/features/career/DecisionPanel.tsx`
- **Data:** 2026-08-05
- **Descrizione:** l'originale mostra badge percentuale colorati direttamente sulla card prima della scelta (es. "Starter 50%" verde / "Low rotation 50%" rosso) per gli outcome pesati. Verificato via grep che `DecisionPanel.tsx` non stampa alcuna percentuale/peso — la scelta è "al buio" nel clone.
- **Perché rimandato:** non bloccante, differenza di trasparenza/tensione del gameplay più che di funzionalità; scoperta solo in questa sessione di confronto diretto.
- **Impatto:** basso — il clone resta giocabile, ma il giocatore ha meno informazione su cui basare la scelta rispetto all'originale.
- **Risoluzione suggerita:** esporre i pesi già presenti su `DecisionOption`/`DecisionOutcome` come badge percentuale sulla card in `DecisionPanel.tsx`; dato dominio già disponibile, tocca solo la UI.

### Evento "Grandfather from another country" (switch nazionalità) mai implementato
- **Priorità:** Bassa
- **Area:** `lib/career/decisions.ts`, `types/career.ts` (`Player.nationality`)
- **Data:** 2026-08-05
- **Descrizione:** durante il confronto è emerso per la prima volta (mai osservato nelle 14 carriere di ricerca precedenti) un evento sull'originale in cui si scopre un nonno di un altro paese, con scelta esplicita tra due nazionali per cui si diventa eleggibili. Il nostro dominio ha `Player.nationality` come campo immutabile per tutta la carriera — implementarlo richiede rendere la nazionalità mutabile e propagare l'effetto su nazionale/convocazioni/trofei nazionali già maturati.
- **Perché rimandato:** singola osservazione (1 carriera), impatto sul modello di dominio non banale (nazionalità oggi assunta fissa in più punti: `trophies.ts`, futuro `rollNationalTrophy` per confederazione — vedi [[backlog]]); da valutare a parte prima di decidere se vale la complessità.
- **Impatto:** basso nel breve termine (evento raro anche nell'originale, 1/15 carriere osservate finora) ma alto se implementato male, dato che tocca l'identità del giocatore in un punto usato in più moduli.
- **Risoluzione suggerita:** raccogliere altre osservazioni prima di procedere (frequenza reale, se l'effetto è retroattivo su trofei/convocazioni nazionali già ottenuti); solo dopo valutare se rendere `Player.nationality` mutabile.

### Possibile assenza di finestra anti-ripetizione per eventi lifestyle/club-crisis
- **Priorità:** Bassa
- **Area:** `lib/career/loop.ts` (`pickClubCrisisDecision` e pool lifestyle)
- **Data:** 2026-08-05
- **Descrizione:** in una carriera di confronto, "Dichiarazione controversa" è comparsa due volte in 3 cicli consecutivi (età 18 e 22) sul clone — singolo data point, non ancora confermato come pattern sistematico né confrontato con la frequenza di ripetizione osservata sull'originale.
- **Perché rimandato:** un solo campione non giustifica un intervento; serve più playtest prima di trattarlo come bug.
- **Impatto:** se confermato sistematico, minore varietà percepita — lo stesso evento che ricompare troppo presto rompe l'illusione di eventi diversi ad ogni ciclo.
- **Risoluzione suggerita:** in una sessione futura, loggare la sequenza di categorie/generatori scelti su più carriere simulate (RNG reale) e verificare se esiste già una finestra anti-ripetizione in `pickClubCrisisDecision`; se assente, valutare di aggiungerne una semplice (es. non ripetere lo stesso generatore per N cicli).

## Priorità
- **Alta:** Champions League/Europa League non distinte (vedi sopra)
- **Media:** statistiche portiere; probabilità trofei/award/nazionale non validate con playtest; momenti celebrativi/timeline non verificati end-to-end; copertura club/campionati limitata a 4 paesi; eventi narrativi mancanti rispetto all'originale (vedi sopra)
- **Bassa:** soglia di ritiro automatico; generatori club-crisis con probabilità uniforme; percentuali outcome non visibili in `DecisionPanel`; evento cambio-nazionalità mai implementato; possibile assenza di finestra anti-ripetizione eventi lifestyle (vedi sopra)

## Archiviato
- [item risolti]
