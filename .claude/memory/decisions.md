---
type: decisions
tags: [memory, architecture]
updated: [2026-08-04]
---

# Decisioni Architetturali
Registro scelte tecniche con motivazioni.

## Template
### [Titolo breve]
- **Data:** [YYYY-MM-DD]
- **Decisione:** [scelta fatta]
- **Perché:** [motivazione e trade-off]
- **Alternative:** [scartate e perché]
- **Impatto:** [moduli coinvolti] — entità in [[domain]], se formalizzata vedi [[adr]]

---

### Nomi reali di club/leghe/nazionali, no dataset fittizio
- **Data:** 2026-08-04
- **Decisione:** usare nomi reali di club, campionati, coppe e nazionalità (84 club su 4 paesi/8 leghe in `data/clubs.ts`), invece di un mondo fittizio inventato.
- **Perché:** richiesta esplicita dell'utente. Mitigazione del rischio: solo testo, nessun logo/stemma incorporato nel repo — gli stemmi (se usati) sono hotlink a URL esterni, mai file scaricati.
- **Alternative:** mondo fittizio (nomi inventati) — scartato per preferenza utente.
- **Impatto:** `data/clubs.ts`, `data/countries.ts`, tutta la UI mostra nomi reali.

### Solo locale, nessun backend
- **Data:** 2026-08-04
- **Decisione:** nessun account/autenticazione/DB — salvataggio su `localStorage` del browser.
- **Perché:** richiesta esplicita dell'utente, riduce drasticamente la complessità (niente auth, niente hosting DB, niente API).
- **Impatto:** `lib/career/storage.ts` (fase 6, non ancora scritto), nessuna route API prevista.

### Soglie award/nazionale/coppa continentale deliberatamente più generose dell'originale
- **Data:** 2026-08-04
- **Decisione:** nel gioco originale (Copero), Pallone d'Oro e simili sono risultati **irraggiungibili in 10+ carriere complete** anche a OVR 88 con carriera leggendaria; convocazione in nazionale e coppa continentale sono scattate solo 1-2 volte su altrettanti tentativi. Nel nostro clone queste meccaniche sono implementate con soglie di probabilità **volutamente più generose** (es. `nationalCallupChance` parte da OVR 75 invece che restare praticamente muta fino a OVR 85+).
- **Perché:** richiesta esplicita dell'utente ("dobbiamo prevedere tutte queste situazioni che possono accadere") — una feature visibile solo nell'interfaccia ma mai raggiungibile in pratica è un difetto, non fedeltà all'originale.
- **Alternative:** replicare esattamente le probabilità osservate — scartata perché produrrebbe lo stesso difetto nel clone.
- **Impatto:** `lib/career/decisions.ts` (`nationalCallupChance`, `penaltyScoreChance`), award individuali ancora da implementare in fase 6/7.

### Palette "Cartellino del giocatore" — verde campo fisso, non legato al tema
- **Data:** 2026-08-04
- **Decisione:** design distintivo ispirato al tesseramento ufficiale di un calciatore (verde campo, pergamena, oro/medaglia, font condensato Bebas Neue per i titoli), invece del solito dark-mode-con-accento-neon. Il verde del campo da calcio (`--color-pitch`) è un token **separato** da `--color-primary`: resta sempre verde sia in light che dark mode, mentre `--color-primary` cambia (verde in light, oro in dark) per bottoni/accenti.
- **Perché:** un campo da calcio che diventa color oro in dark mode (bug riscontrato e corretto durante lo sviluppo) rompe la metafora visiva — un campo è sempre verde indipendentemente dal tema.
- **Impatto:** `constants/design-tokens.ts`, `app/globals.css`, `JerseyCard.tsx`, `PositionPicker.tsx`.

### Piano di implementazione vive fuori dal repo
- **Data:** 2026-08-04
- **Decisione:** il piano dettagliato (meccaniche osservate, modello dati, fasi) è in `C:\Users\Gioix\.claude\plans\piped-bouncing-cocke.md`, non in un file dentro il repo del progetto.
- **Perché:** conseguenza del workflow standard di planning di Claude Code (EnterPlanMode scrive lì di default), non una scelta deliberata di design del progetto — da tenere a mente perché non è discoverable solo esplorando il repo.
- **Impatto:** chiunque riprenda lo sviluppo deve sapere di leggere quel file esterno per il contesto completo delle meccaniche di gioco originali.
