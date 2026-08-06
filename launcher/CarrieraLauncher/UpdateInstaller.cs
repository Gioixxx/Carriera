using System.Diagnostics;
using System.Net;

namespace CarrieraLauncher;

internal enum UpdatePhase
{
    Downloading,
    Finalizing,
}

internal readonly record struct UpdateProgress(UpdatePhase Phase, int Attempt, int MaxAttempts, long BytesReceived, long? TotalBytes);

internal static class UpdateInstaller
{
    private const int MaxDownloadAttempts = 5;

    public static async Task DownloadAndApplyAsync(
        UpdateInfo update,
        IProgress<UpdateProgress>? progress = null,
        CancellationToken ct = default)
    {
        var currentExe = Environment.ProcessPath ?? Application.ExecutablePath;
        var tempDir = Path.Combine(Path.GetTempPath(), "CarrieraUpdate");
        Directory.CreateDirectory(tempDir);
        var newExePath = Path.Combine(tempDir, "Carriera.new.exe");
        var scriptPath = Path.Combine(tempDir, "apply-update.bat");
        var logPath = Path.Combine(tempDir, "update-log.txt");

        // Osservato su rete reale: il download si tronca a punti diversi e imprevedibili a
        // seconda del tentativo (una volta ~8% del file, un'altra ~64%), senza che HttpClient
        // sollevi sempre un'eccezione — sintomo di un'interferenza di rete/sicurezza che
        // interrompe lo stream in modo non deterministico, non di un bug di protocollo fisso.
        // Un client basato su WinHTTP (Invoke-WebRequest) sulla stessa rete completa invece
        // regolarmente, probabilmente per la resilienza/retry integrata in WinHTTP che
        // SocketsHttpHandler non ha di default. Qui quindi il download intero (non solo il
        // "move" finale) viene ritentato automaticamente invece di arrendersi al primo esito
        // negativo — l'utente non deve accorgersi di un tentativo fallito né rifare nulla a mano.
        await LogAsync(logPath, "Avvio download aggiornamento...", ct);
        Exception? lastError = null;
        for (var attempt = 1; attempt <= MaxDownloadAttempts; attempt++)
        {
            progress?.Report(new UpdateProgress(UpdatePhase.Downloading, attempt, MaxDownloadAttempts, 0, null));
            try
            {
                await DownloadOnceAsync(update.DownloadUrl, newExePath, attempt, progress, ct);
                await LogAsync(logPath, $"Download completato al tentativo {attempt}/{MaxDownloadAttempts}.", ct);
                lastError = null;
                break;
            }
            catch (Exception ex)
            {
                lastError = ex;
                await LogAsync(logPath, $"Tentativo {attempt}/{MaxDownloadAttempts} fallito: {ex.Message}", ct);
                if (attempt < MaxDownloadAttempts)
                {
                    await Task.Delay(TimeSpan.FromSeconds(2 * attempt), ct);
                }
            }
        }

        if (lastError is not null)
        {
            await LogAsync(logPath, $"Download definitivamente fallito dopo {MaxDownloadAttempts} tentativi.", ct);
            throw new InvalidOperationException(
                $"Download dell'aggiornamento fallito dopo {MaxDownloadAttempts} tentativi: {lastError.Message}",
                lastError);
        }

        progress?.Report(new UpdateProgress(UpdatePhase.Finalizing, MaxDownloadAttempts, MaxDownloadAttempts, 0, null));

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
        var script = $"""
            @echo off
            setlocal
            echo [%date% %time%] Attesa chiusura processo {pid}... >> "{logPath}"
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

    // Un singolo tentativo di download. Fissa la versione HTTP a 1.1 (invece di lasciare che
    // HttpClient negozi HTTP/2 con la CDN dei release GitHub, dove uno stream interrotto a
    // meta' non solleva sempre un'eccezione) e verifica la dimensione scaricata contro il
    // Content-Length dichiarato dal server, cosi' un download troncato viene sempre rilevato
    // anche quando lo stream si chiude "pulito" senza errori lato .NET.
    private static async Task DownloadOnceAsync(
        string url,
        string destinationPath,
        int attempt,
        IProgress<UpdateProgress>? progress,
        CancellationToken ct)
    {
        long? expectedSize;
        using (var http = new HttpClient { Timeout = TimeSpan.FromMinutes(5) })
        {
            http.DefaultRequestHeaders.UserAgent.ParseAdd("CarrieraLauncher");
            using var request = new HttpRequestMessage(HttpMethod.Get, url)
            {
                Version = HttpVersion.Version11,
                VersionPolicy = HttpVersionPolicy.RequestVersionExact,
            };
            using var response = await http.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, ct);
            response.EnsureSuccessStatusCode();
            expectedSize = response.Content.Headers.ContentLength;
            progress?.Report(new UpdateProgress(UpdatePhase.Downloading, attempt, MaxDownloadAttempts, 0, expectedSize));

            await using var fs = File.Create(destinationPath);
            await using var download = await response.Content.ReadAsStreamAsync(ct);

            // Lettura a blocchi invece di CopyToAsync in un colpo solo: e' l'unico modo per
            // sapere quanti byte sono arrivati finora e riportarlo alla UI (barra di progresso).
            var buffer = new byte[81920];
            long totalRead = 0;
            int read;
            while ((read = await download.ReadAsync(buffer, ct)) > 0)
            {
                await fs.WriteAsync(buffer.AsMemory(0, read), ct);
                totalRead += read;
                progress?.Report(new UpdateProgress(UpdatePhase.Downloading, attempt, MaxDownloadAttempts, totalRead, expectedSize));
            }
        }

        var downloadedSize = new FileInfo(destinationPath).Length;
        if (expectedSize is long size ? downloadedSize != size : downloadedSize < 5 * 1024 * 1024)
        {
            throw new InvalidOperationException(
                $"{downloadedSize} byte scaricati"
                    + (expectedSize is long s ? $", attesi {s}." : " (dimensione attesa sconosciuta, atteso almeno 5 MB)."));
        }
    }

    private static async Task LogAsync(string logPath, string message, CancellationToken ct)
    {
        try
        {
            await File.AppendAllTextAsync(logPath, $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] {message}{Environment.NewLine}", ct);
        }
        catch
        {
            // Il log e' solo diagnostico: un fallimento nello scriverlo non deve mai interrompere
            // il flusso di aggiornamento vero e proprio.
        }
    }
}
