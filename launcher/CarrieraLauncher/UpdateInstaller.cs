using System.Diagnostics;
using System.Net;

namespace CarrieraLauncher;

internal static class UpdateInstaller
{
    public static async Task DownloadAndApplyAsync(UpdateInfo update, CancellationToken ct = default)
    {
        var currentExe = Environment.ProcessPath ?? Application.ExecutablePath;
        var tempDir = Path.Combine(Path.GetTempPath(), "CarrieraUpdate");
        Directory.CreateDirectory(tempDir);
        var newExePath = Path.Combine(tempDir, "Carriera.new.exe");
        var scriptPath = Path.Combine(tempDir, "apply-update.bat");

        // La CDN dei release asset di GitHub parla HTTP/2; HttpClient puo' negoziarlo
        // automaticamente e, su alcune combinazioni di rete/software di sicurezza, lo stream
        // HTTP/2 viene interrotto a meta' di un download binario grande senza sollevare
        // un'eccezione dal lato .NET (osservato: un download da ~58 MB troncato a ~5 MB, nessuna
        // eccezione, nessun log). Un download diretto con lo stesso URL via un client HTTP/1.1
        // (es. Invoke-WebRequest) completa invece regolarmente — per questo qui la versione
        // HTTP viene fissata esplicitamente a 1.1 invece di lasciarla negoziare.
        long? expectedSize;
        using (var http = new HttpClient { Timeout = TimeSpan.FromMinutes(5) })
        {
            http.DefaultRequestHeaders.UserAgent.ParseAdd("CarrieraLauncher");
            using var request = new HttpRequestMessage(HttpMethod.Get, update.DownloadUrl)
            {
                Version = HttpVersion.Version11,
                VersionPolicy = HttpVersionPolicy.RequestVersionExact,
            };
            using var response = await http.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, ct);
            response.EnsureSuccessStatusCode();
            expectedSize = response.Content.Headers.ContentLength;
            await using var fs = File.Create(newExePath);
            await using var download = await response.Content.ReadAsStreamAsync(ct);
            await download.CopyToAsync(fs, ct);
        }

        // Guardia contro un download troncato/corrotto che sostituirebbe un exe funzionante:
        // se il server ha dichiarato un Content-Length, deve combaciare esattamente col file
        // scritto su disco (un CopyToAsync che si interrompe a meta' stream, come osservato con
        // HTTP/2 su questa CDN, non solleva sempre un'eccezione dal lato .NET). Se il server non
        // dichiara la dimensione, resta la soglia minima (l'exe pubblicato e' sempre dell'ordine
        // delle decine di MB) come rete di sicurezza meno precisa ma comunque utile.
        var downloadedSize = new FileInfo(newExePath).Length;
        if (expectedSize is long size ? downloadedSize != size : downloadedSize < 5 * 1024 * 1024)
        {
            throw new InvalidOperationException(
                $"Download dell'aggiornamento incompleto: {downloadedSize} byte scaricati"
                    + (expectedSize is long s ? $", attesi {s}." : " (dimensione attesa sconosciuta, atteso almeno 5 MB)."));
        }

        // Un exe self-contained single-file non può sovrascrivere se stesso mentre è in
        // esecuzione: uno script esterno aspetta la chiusura del processo (poll sul PID),
        // poi sposta il nuovo exe al posto del vecchio e lo rilancia. "move" può fallire in
        // modo transitorio (Defender/antivirus che scansiona ancora il file appena scaricato,
        // Controlled Folder Access, indicizzazione) — prima di questo fix un singolo
        // fallimento veniva ignorato in silenzio (nessun log, nessun retry) e lo script
        // rilanciava l'exe vecchio invariato: sembrava che l'update non facesse nulla, senza
        // alcuna traccia del perché. Ora riprova per ~15s e logga ogni esito in un file
        // ispezionabile accanto allo script.
        var pid = Environment.ProcessId;
        var logPath = Path.Combine(tempDir, "update-log.txt");
        var script = $"""
            @echo off
            setlocal
            echo [%date% %time%] Attesa chiusura processo {pid}... > "{logPath}"
            :wait
            tasklist /FI "PID eq {pid}" 2>NUL | find "{pid}" >NUL
            if not errorlevel 1 (
                timeout /t 1 /nobreak >NUL
                goto wait
            )
            timeout /t 1 /nobreak >NUL
            echo [%date% %time%] Processo chiuso, applico l'aggiornamento... >> "{logPath}"
            set RETRIES=0
            :move
            move /y "{newExePath}" "{currentExe}" >> "{logPath}" 2>&1
            if errorlevel 1 (
                set /a RETRIES+=1
                if %RETRIES% GEQ 15 (
                    echo [%date% %time%] ERRORE: move fallito dopo %RETRIES% tentativi, avvio la versione precedente invariata. >> "{logPath}"
                    goto launch
                )
                timeout /t 1 /nobreak >NUL
                goto move
            )
            echo [%date% %time%] Aggiornamento applicato con successo. >> "{logPath}"
            :launch
            start "" "{currentExe}"
            del "%~f0"
            """;
        await File.WriteAllTextAsync(scriptPath, script, ct);

        Process.Start(new ProcessStartInfo
        {
            FileName = scriptPath,
            UseShellExecute = true,
            WindowStyle = ProcessWindowStyle.Hidden,
            CreateNoWindow = true,
        });

        Application.Exit();
    }
}
