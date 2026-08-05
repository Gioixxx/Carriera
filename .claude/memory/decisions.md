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

### Immagini club/competizioni via hotlink reale, ma icona generica (non foto reale) per i premi individuali
- **Data:** 2026-08-05
- **Decisione:** stemmi club (`Club.crestUrl`, 84/84) e badge di campionati/coppe/coppe continentali/Mondiale/Europei (`data/competition-badges.ts`, `COMPETITION_BADGES`) usano hotlink a TheSportsDB, dati sportivi fattuali coperti dai termini d'uso per progetti hobbistici (vedi `.claude/research/team-crests.md`). I 3 `AwardType` individuali (Pallone d'Oro/Giocatore della stagione/Capocannoniere) invece usano un'icona trofeo generica stilizzata (Twemoji via CDN jsdelivr, licenza CC BY 4.0) invece di una foto/icona del vero trofeo Ballon d'Or.
- **Perché:** il nostro `"ballon-dor"` ha soglie/meccaniche tutte nostre (deliberatamente più generose, vedi voce sopra su "Soglie award...irraggiungibili"), non è il vero premio su licenza di France Football/L'Équipe — un'immagine che imita il trofeo reale rischierebbe di implicare un'associazione che non esiste. A differenza degli stemmi club (TheSportsDB dichiara esplicitamente badge "as is" per marchi registrati, quindi il rischio è documentato/mitigato dalla fonte), nessuna fonte controllata per il Ballon d'Or offriva un disclaimer di trademark equivalente — il rischio lì non è mitigato dalla fonte stessa, va evitato a monte con un'icona generica.
- **Alternative:** foto reali del trofeo Ballon d'Or con licenza CC0/CC-BY-SA su Wikimedia Commons (trovate e verificate, es. `Ballon_d'Or.png` CC0) — scartate: la licenza copre la foto/illustrazione in sé, non il diritto di rappresentare con quel design un premio proprio con meccaniche diverse dall'originale.
- **Impatto:** `types/career.ts` (`Club.crestUrl` obbligatorio), `data/clubs.ts`, `data/competition-badges.ts` (nuovo), `components/features/career/ClubCrest.tsx`/`CompetitionBadge.tsx`/`AwardBadge.tsx` (nuovi, stesso pattern: `<img>` con `onError` che nasconde/ripiega su icona lucide invece di lasciare un buco), wired in `PlayerCard`/`OfferPanel`/`CareerTable`/`CareerSummary`. Copertura confederazione-specifica per i trofei di nazionale (Copa América, Asian Cup, ecc.) rimandata — vedi [[backlog]].

### Launcher desktop: export statico Next.js + host .NET/WebView2, non Electron/Tauri
- **Data:** 2026-08-05
- **Decisione:** per l'eseguibile `.exe` richiesto dall'utente (vedi [[backlog]]), `next.config.ts` ora usa `output: "export"` (il gioco è interamente client-side, nessuna API route) e un piccolo progetto .NET WinForms (`launcher/CarrieraLauncher/`) incorpora l'export statico come embedded resource, lo serve su `127.0.0.1` via `HttpListener` e lo mostra in una finestra `WebView2` nativa. Pubblicato come singolo file self-contained per `win-x64` (~50 MB) e committato in `dist/Carriera.exe`.
- **Perché:** Windows 11 (target primario dell'utente) include già il runtime WebView2 di serie, quindi non serve imbarcare un intero Chromium come farebbe Electron (~150-250 MB) — il costo residuo è solo il runtime .NET self-contained. `.NET SDK` era già installato sulla macchina, mentre Tauri avrebbe richiesto l'installazione di Rust+toolchain MSVC assente. La build è riproducibile con uno script (`scripts/build-launcher.ps1`), non un artefatto costruito a mano.
- **Alternative:** Electron (scartato: troppo pesante da committare in git permanentemente); Tauri (scartato: nessun toolchain Rust disponibile su questa macchina); Node.js Single Executable Application (scartato: il solo `node.exe` da imbarcare è grande quanto/superiore al runtime .NET, nessun vantaggio di dimensione).
- **Impatto:** `next.config.ts`, `launcher/CarrieraLauncher/**`, `scripts/build-launcher.ps1`, `dist/Carriera.exe` (unico artefatto binario committato — `wwwroot`/`bin`/`obj`/`publish` sono gitignored, rigenerati ad ogni build). Nota tecnica: WebView2 salva profilo/cache in `%LOCALAPPDATA%\Carriera\WebView2` (esplicitamente configurato in `MainForm.cs`) e non accanto all'exe, per non sporcare la cartella del repo.

### Piano di implementazione vive fuori dal repo
- **Data:** 2026-08-04
- **Decisione:** il piano dettagliato (meccaniche osservate, modello dati, fasi) è in `C:\Users\Gioix\.claude\plans\piped-bouncing-cocke.md`, non in un file dentro il repo del progetto.
- **Perché:** conseguenza del workflow standard di planning di Claude Code (EnterPlanMode scrive lì di default), non una scelta deliberata di design del progetto — da tenere a mente perché non è discoverable solo esplorando il repo.
- **Impatto:** chiunque riprenda lo sviluppo deve sapere di leggere quel file esterno per il contesto completo delle meccaniche di gioco originali.
