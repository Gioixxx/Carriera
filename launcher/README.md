# Launcher desktop

Eseguibile Windows del gioco (`dist/Carriera.exe`), per chi vuole giocare senza clonare il
repo/installare Node. È un piccolo host WinForms + WebView2 che serve l'export statico del
gioco su `http://127.0.0.1:<porta libera>/` (via `HttpListener` su file incorporati
nell'assembly) e lo mostra in una finestra nativa, senza chrome del browser.

## Download

[GitHub Release](https://github.com/Gioixxx/Carriera/releases/latest) — scarica `Carriera.exe`
dagli asset e avvialo. Non è più committato nel repo (vedi `.gitignore`): l'unico modo per
ottenerlo senza buildarlo localmente è la Release.

## Come funziona

- `EmbeddedStaticServer.cs` — legge l'export statico (`npm run build`, `output: "export"` in
  `next.config.ts`) incorporato come embedded resource e lo serve su loopback.
- `MainForm.cs` — finestra WinForms con un controllo `WebView2` a tutto schermo, naviga verso
  il server locale.
- Il gioco resta interamente client-side (nessuna API route): l'export statico non richiede un
  runtime Node lato server.

## Rigenerare `dist/Carriera.exe`

```powershell
powershell -File scripts/build-launcher.ps1
```

Lo script: builda l'export statico (`npm run build`), lo copia in
`launcher/CarrieraLauncher/wwwroot/` (rigenerato ad ogni run, non versionato), pubblica il
progetto .NET come singolo file self-contained per `win-x64` con l'`AssemblyVersion` presa da
`package.json.version` (nessun numero di versione duplicato nel `.csproj`), copia il risultato in
`dist/Carriera.exe` (non versionato — vedi `.gitignore` — va allegato a mano a una GitHub
Release dopo la build).

Richiede: Node/npm (già usati dal resto del progetto) e .NET SDK 10+ (`dotnet --version`).

## Aggiornamento automatico

All'avvio, il launcher controlla in background `api.github.com/repos/Gioixxx/Carriera/releases/latest`
e confronta il tag (`vX.Y.Z`) con la propria `AssemblyVersion`. Se trova una versione più recente
con un asset `Carriera.exe` allegato, chiede conferma e — su "Sì" — la scarica, sostituisce
l'eseguibile in uso e si riavvia da solo (`UpdateChecker.cs`/`UpdateInstaller.cs`). Qualsiasi
errore (nessuna connessione, rate limit, ecc.) viene ignorato in silenzio: l'avvio del gioco non
dipende mai dall'esito del controllo.

Per questo, chi taglia una nuova release deve **far combaciare il tag git con
`package.json.version`**: bump della versione in `package.json` → rebuild (`build-launcher.ps1`,
che stampa la versione usata) → `git tag vX.Y.Z` → `gh release create` con `dist/Carriera.exe`
allegato.

## Note

- **WebView2 Runtime**: incluso di serie in Windows 11 (il target primario). Su Windows 10 va
  installato separatamente se non già presente (Edge lo installa spesso automaticamente).
- **Dimensione**: ~50 MB — dominato dal runtime .NET self-contained incluso nell'exe (l'export
  statico del gioco è ~1 MB); non si è usato un bundle Chromium proprio (Electron/Tauri con
  webview compilata) per tenere l'eseguibile più leggero, sfruttando invece il WebView2 già
  presente nel sistema operativo.
- Repo pubblica dal 2026-08-05 — l'exe non è più committato proprio per questo (vedi
  `.claude/memory/decisions.md`), resta distribuito solo via GitHub Release.
