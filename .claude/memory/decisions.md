---
type: decisions
tags: [memory, architecture]
updated: [2026-08-05]
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

### Bandiere nazionali via hotlink flagcdn.com, non solo emoji
- **Data:** 2026-08-05
- **Decisione:** nuovo componente `CountryFlag.tsx` (stesso pattern `onError` di `ClubCrest`/`CompetitionBadge`) che mostra la bandiera reale in hotlink da `https://flagcdn.com/{code}.svg` (SVG, per codice ISO 3166-1 alpha-2 — inclusi i codici regione `gb-eng`/`gb-sct`/`gb-wls` per le nazionali britanniche, verificati 200 su flagcdn). Ripiega sull'emoji bandiera già presente in `Country.flag` solo se l'host esterno non risponde. Sostituisce l'uso diretto dell'emoji in `JerseyBadge`/`NationalitySelect` (che ora passano un `Country` invece di una stringa emoji).
- **Perché:** Windows non ha supporto nativo affidabile per le emoji bandiera — mostra il codice ISO in un riquadro invece del vessillo, e le sequenze tag delle nazionali britanniche (Inghilterra/Scozia/Galles) non renderizzano quasi ovunque tranne Apple. Dato che l'app gira anche come `.exe` Windows via WebView2/Edge (vedi launcher sotto), l'emoji da sola non era affidabile per l'utente target.
- **Alternative:** libreria di bandiere SVG locali (es. `flag-icons` via npm) — scartata per coerenza con il pattern già stabilito nel progetto (hotlink, mai asset scaricati/committati, vedi stemmi club/badge competizioni).
- **Impatto:** `src/components/features/career/CountryFlag.tsx` (nuovo), `JerseyBadge.tsx`/`JerseyCard.tsx`/`NationalitySelect.tsx`/`IdentityForm.tsx`/`PlayerCard.tsx` (prop `flag?: string` → `country?: Country`). `Country.flag` (emoji) resta nel dominio solo come fallback.

### Piano di implementazione vive fuori dal repo
- **Data:** 2026-08-04
- **Decisione:** il piano dettagliato (meccaniche osservate, modello dati, fasi) è in `C:\Users\Gioix\.claude\plans\piped-bouncing-cocke.md`, non in un file dentro il repo del progetto.
- **Perché:** conseguenza del workflow standard di planning di Claude Code (EnterPlanMode scrive lì di default), non una scelta deliberata di design del progetto — da tenere a mente perché non è discoverable solo esplorando il repo.
- **Impatto:** chiunque riprenda lo sviluppo deve sapere di leggere quel file esterno per il contesto completo delle meccaniche di gioco originali.

### `dist/Carriera.exe` non più committato — solo GitHub Release
- **Data:** 2026-08-05
- **Decisione:** rimosso `dist/Carriera.exe` dal tracking git (`git rm --cached`, file locale conservato) e aggiunto `/dist/*.exe` a `.gitignore`. Sostituisce la parte "committato in `dist/Carriera.exe`" della decisione sul launcher desktop sopra — il resto di quella decisione (host .NET/WebView2, `output: "export"`, script di build) resta valido invariato.
- **Perché:** richiesta esplicita dell'utente. Un binario da ~50 MB che cambia ad ogni rigenerazione gonfia la history git indefinitamente (ogni rebuild è un nuovo blob completo, nessun delta utile su un eseguibile compilato); la GitHub Release resta l'unico canale di distribuzione, già documentata come modo "più semplice" in `launcher/README.md`.
- **Alternative:** Git LFS per l'exe — non valutata, scartata implicitamente a favore della soluzione più semplice (solo Release, nessun tracking).
- **Impatto:** `.gitignore` (nuova riga `/dist/*.exe`), `launcher/README.md` (rimossi i riferimenti a "committato nel repo" e alla repo privata, ormai pubblica dal 2026-08-05). Chi rigenera l'exe con `scripts/build-launcher.ps1` deve allegarlo a mano a una GitHub Release — non basta più un commit.

### Momenti di carriera celebrativi (trofei/premi/convocazione) come overlay modale animato
- **Data:** 2026-08-05
- **Decisione:** nuovo `MomentOverlay.tsx` mostra un overlay modale (focus trap, `Escape`/click "Continua" per chiudere, `aria-modal`) con confetti CSS e badge/icona quando il giocatore vince un trofeo, un premio individuale o riceve la convocazione in nazionale (`buildCareerMoments` in `CareerGame.tsx` costruisce la coda di momenti da mostrare in sequenza dopo ogni ciclo). Accanto, `CareerTimeline.tsx` visualizza l'intera carriera (16→40 anni) come barra di progresso con marker per ogni trofeo/premio. Tutte le animazioni (confetti, count-up delle statistiche in `PlayerCard` via `useCountUp`, transizioni) rispettano `prefers-reduced-motion` tramite l'hook condiviso `usePrefersReducedMotion` (`hooks/useMotion.ts`), disabilitandosi invece di degradare.
- **Perché:** richiesta implicita di rendere tangibili i momenti salienti della carriera invece di lasciarli annegati in una tabella/riepilogo — coerente con l'obiettivo già registrato di rendere trofei/premi/nazionale "raggiungibili e sentiti", non solo statisticamente più probabili (vedi soglie generose sopra). Il rispetto di `prefers-reduced-motion` è stato incluso da subito per accessibilità, non aggiunto dopo.
- **Alternative:** toast/notifica non bloccante invece di overlay modale — scartata implicitamente: un trofeo/premio è un momento raro e va celebrato con un'interruzione intenzionale, non un badge che scompare in un angolo.
- **Impatto:** `MomentOverlay.tsx`, `CareerTimeline.tsx`, `hooks/useMotion.ts` (nuovi), `CareerGame.tsx` (+251/+244/+133 righe nette sui tre commit di questa sessione: gestione stato dei momenti in coda, `SetupStepDots` per la navigazione nella creazione personaggio), `PlayerCard.tsx` (count-up sulle statistiche), `globals.css` (keyframe `confetti-fall`, `moment-in`, `step-in`), `lib/career/award-labels.ts` (nuovo, estrae le label italiane di `AwardType` già inline in `CareerSummary` per riuso in `MomentOverlay`).

### Auto-updater del launcher desktop: self-replace via script .bat, versione da package.json
- **Data:** 2026-08-05
- **Decisione:** `MainForm.OnLoad` lancia in background `UpdateChecker.CheckAsync()` (nuovo), che confronta l'`AssemblyVersion` corrente con il tag (`vX.Y.Z`) dell'ultima release su `api.github.com/repos/Gioixxx/Carriera/releases/latest`. Se c'è una versione più recente con asset `Carriera.exe` allegato, un `MessageBox` Sì/No propone l'update; su conferma, `UpdateInstaller.DownloadAndApplyAsync()` (nuovo) scarica il nuovo exe, scrive uno script `.bat` che aspetta la chiusura del processo corrente (poll `tasklist` sul PID), sposta il nuovo exe sopra quello vecchio e lo rilancia, poi la app chiama `Application.Exit()`. `scripts/build-launcher.ps1` passa `-p:Version=$(package.json.version)` a `dotnet publish` invece di duplicare il numero nel `.csproj`, così l'`AssemblyVersion` embeddata segue sempre `package.json.version` senza un secondo numero da tenere sincronizzato a mano.
- **Perché:** un exe self-contained single-file (vedi decisione sul launcher sopra) non può sovrascrivere se stesso mentre è in esecuzione — lo script esterno con poll sul PID è il pattern standard per aggirarlo su Windows senza un secondo processo "updater" permanente da distribuire e mantenere a parte. Qualsiasi errore nel check/download (nessuna connessione, rate limit GitHub, asset mancante) viene inghiottito in silenzio: l'aggiornamento è best-effort e non deve mai bloccare l'avvio del gioco.
- **Alternative:** un eseguibile "updater" separato distribuito insieme al gioco — scartato: più pezzi da costruire/mantenere per lo stesso risultato che uno script `.bat` generato al volo ottiene in poche righe. Automazione CI (GitHub Actions) per pubblicare le release — non affrontata in questo giro: il taglio di una release resta manuale (bump `package.json.version` → `build-launcher.ps1` → `git tag vX.Y.Z` → `gh release create` con l'exe allegato), il tag deve combaciare con la versione buildata perché è quello che il client confronta.
- **Impatto:** `launcher/CarrieraLauncher/UpdateChecker.cs`, `UpdateInstaller.cs` (nuovi), `MainForm.cs` (chiamata fire-and-forget dopo la `Navigate` esistente), `scripts/build-launcher.ps1` (stampa la versione letta da `package.json`), `launcher/README.md` (sezione "Aggiornamento automatico" + checklist di release aggiornata). Nessun controllo manuale a menu — solo check automatico all'avvio.
