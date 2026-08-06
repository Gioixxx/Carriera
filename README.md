# Carriera

**Simulatore testuale della carriera di un calciatore** · v0.2.0

[Repository](https://github.com/Gioixxx/Carriera) · [Download Windows](https://github.com/Gioixxx/Carriera/releases/latest)

---

## Italiano

### Cos'è Carriera

Carriera è un gioco browser/desktop in cui guidi la carriera di un calciatore attraverso scelte narrative, statistiche, trasferimenti, trofei e convocazioni in nazionale. Tutto in italiano, con nomi reali di club, leghe e competizioni. Nessun backend: i salvataggi restano nel browser o nell'eseguibile locale.

### Come giocare

| Percorso | Istruzioni |
|----------|------------|
| **Giocatore** | Scarica [`Carriera.exe`](https://github.com/Gioixxx/Carriera/releases/latest) dalla GitHub Release — nessuna installazione di Node richiesta |
| **Browser / sviluppo** | `npm install` → `npm run dev` → apri [http://localhost:3000](http://localhost:3000) |

L'eseguibile **non** è committato nel repository (vedi `.gitignore`): si distribuisce solo tramite GitHub Release.

### Caratteristiche

- Creazione personaggio: ruolo, nazionalità, numero, piede e ritmo di gioco (Intense / Normal / Express)
- Loop decisionale con eventi probabilistici: offerte di mercato, infortuni, crisi di club, lifestyle, nazionale
- 124 club in 9 paesi, con stemmi e badge competizioni via hotlink
- Archivio multi-carriera, Hall of Fame, record personali e titoli di stagione
- Overlay celebrativi per trofei, premi individuali e convocazioni
- Dark mode, musica di sottofondo e salvataggio locale (localStorage)

### Stack tecnologico

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS v4
- Vitest · Testing Library
- Export statico (`output: "export"`) — nessuna API route né backend
- Launcher Windows: .NET 10 + WebView2 (dettagli in [`launcher/README.md`](launcher/README.md))

### Sviluppo locale

**Requisiti:** Node.js 20+, npm.

```bash
git clone https://github.com/Gioixxx/Carriera.git
cd Carriera
npm install
npm run dev      # dev server
npm run build    # export statico in out/
npm test         # unit test
npm run simulate # taratura probabilità del motore (2000 carriere)
```

### Struttura del progetto

```
src/
├── app/              # layout, pagina unica
├── components/       # UI gioco (career/, ui/)
├── data/             # club, paesi, badge competizioni
├── hooks/            # useCareerGame, audio, motion
├── lib/career/       # motore puro (engine, loop, decisions, simulation…)
└── types/            # modelli di dominio
launcher/             # host WinForms + WebView2
scripts/              # build-launcher.ps1, simulate-careers.ts
```

Il motore di gioco in `src/lib/career/` è puro e testabile, separato dalla UI React.

### Build eseguibile Windows

Per rigenerare `dist/Carriera.exe`:

```powershell
powershell -File scripts/build-launcher.ps1
```

Requisiti aggiuntivi: .NET SDK 10+ (`dotnet --version`).

Checklist per una release: bump di `package.json.version` → build con lo script sopra → tag git `vX.Y.Z` → allegare `dist/Carriera.exe` alla GitHub Release (necessario per l'auto-updater del launcher).

Documentazione completa su packaging, WebView2 e aggiornamenti automatici: [`launcher/README.md`](launcher/README.md).

### Test e simulazione

- `npm test` — suite Vitest (dominio + componenti)
- `npm run simulate` — harness statistico ([`scripts/simulate-careers.ts`](scripts/simulate-careers.ts)) che simula migliaia di carriere e stampa le frequenze osservate di trofei, award, convocazioni e infortuni; usa la config separata `vitest.simulate.config.mts`

---

## English

### What is Carriera

Carriera is a browser/desktop game where you guide a footballer's career through narrative choices, stats, transfers, trophies, and national team call-ups. Fully in Italian, with real club, league, and competition names. No backend: saves stay in the browser or local executable.

### How to play

| Path | Instructions |
|------|--------------|
| **Player** | Download [`Carriera.exe`](https://github.com/Gioixxx/Carriera/releases/latest) from the GitHub Release — no Node installation required |
| **Browser / development** | `npm install` → `npm run dev` → open [http://localhost:3000](http://localhost:3000) |

The executable is **not** committed to the repository (see `.gitignore`): it is distributed only via GitHub Release.

### Features

- Character creation: position, nationality, shirt number, preferred foot, and game pace (Intense / Normal / Express)
- Decision loop with probabilistic events: transfer offers, injuries, club crises, lifestyle, national team
- 124 clubs across 9 countries, with crests and competition badges via hotlink
- Multi-career archive, Hall of Fame, personal records, and season titles
- Celebratory overlays for trophies, individual awards, and national call-ups
- Dark mode, background music, and local save (localStorage)

### Tech stack

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS v4
- Vitest · Testing Library
- Static export (`output: "export"`) — no API routes or backend
- Windows launcher: .NET 10 + WebView2 (details in [`launcher/README.md`](launcher/README.md))

### Local development

**Requirements:** Node.js 20+, npm.

```bash
git clone https://github.com/Gioixxx/Carriera.git
cd Carriera
npm install
npm run dev      # dev server
npm run build    # static export to out/
npm test         # unit tests
npm run simulate # engine probability tuning (2000 careers)
```

### Project structure

```
src/
├── app/              # layout, single page
├── components/       # game UI (career/, ui/)
├── data/             # clubs, countries, competition badges
├── hooks/            # useCareerGame, audio, motion
├── lib/career/       # pure engine (engine, loop, decisions, simulation…)
└── types/            # domain models
launcher/             # WinForms + WebView2 host
scripts/              # build-launcher.ps1, simulate-careers.ts
```

The game engine in `src/lib/career/` is pure and testable, separate from the React UI.

### Windows executable build

To regenerate `dist/Carriera.exe`:

```powershell
powershell -File scripts/build-launcher.ps1
```

Additional requirements: .NET SDK 10+ (`dotnet --version`).

Release checklist: bump `package.json.version` → build with the script above → git tag `vX.Y.Z` → attach `dist/Carriera.exe` to the GitHub Release (required for the launcher's auto-updater).

Full documentation on packaging, WebView2, and automatic updates: [`launcher/README.md`](launcher/README.md).

### Tests and simulation

- `npm test` — Vitest suite (domain + components)
- `npm run simulate` — statistical harness ([`scripts/simulate-careers.ts`](scripts/simulate-careers.ts)) that simulates thousands of careers and prints observed frequencies for trophies, awards, call-ups, and injuries; uses separate config `vitest.simulate.config.mts`
