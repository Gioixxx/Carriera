# Launcher desktop

Eseguibile Windows del gioco (`dist/Carriera.exe`), per chi vuole giocare senza clonare il
repo/installare Node. È un piccolo host WinForms + WebView2 che serve l'export statico del
gioco su `http://127.0.0.1:<porta libera>/` (via `HttpListener` su file incorporati
nell'assembly) e lo mostra in una finestra nativa, senza chrome del browser.

## Download

Modo più semplice: [GitHub Release](https://github.com/Gioixxx/Carriera/releases/latest) —
scarica `Carriera.exe` dagli asset e avvialo (repo privata: serve accesso al repo per vedere
la pagina della release). In alternativa `dist/Carriera.exe` è anche committato direttamente
nel repo, per chi preferisce/deve prenderlo da lì.

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
progetto .NET come singolo file self-contained per `win-x64`, copia il risultato in
`dist/Carriera.exe` (l'unico artefatto committato nel repo).

Richiede: Node/npm (già usati dal resto del progetto) e .NET SDK 10+ (`dotnet --version`).

## Note

- **WebView2 Runtime**: incluso di serie in Windows 11 (il target primario). Su Windows 10 va
  installato separatamente se non già presente (Edge lo installa spesso automaticamente).
- **Dimensione**: ~50 MB — dominato dal runtime .NET self-contained incluso nell'exe (l'export
  statico del gioco è ~1 MB); non si è usato un bundle Chromium proprio (Electron/Tauri con
  webview compilata) per tenere l'eseguibile più leggero, sfruttando invece il WebView2 già
  presente nel sistema operativo.
- Repo attualmente privata; se in futuro diventasse pubblica, rivalutare l'esposizione dell'exe
  in relazione ai nomi reali di club/competizioni usati nei dati (vedi `backlog.md`).
