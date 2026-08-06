using System.Diagnostics;

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

        using (var http = new HttpClient { Timeout = TimeSpan.FromMinutes(5) })
        {
            http.DefaultRequestHeaders.UserAgent.ParseAdd("CarrieraLauncher");
            await using var fs = File.Create(newExePath);
            await using var download = await http.GetStreamAsync(update.DownloadUrl, ct);
            await download.CopyToAsync(fs, ct);
        }

        // Guardia minima: un download troncato/corrotto non deve mai sostituire un exe
        // funzionante. L'exe pubblicato è single-file self-contained, quindi è sempre
        // dell'ordine delle decine di MB — una soglia bassa (5 MB) intercetta troncamenti
        // grossolani senza dover conoscere la dimensione esatta del rilascio corrente.
        var downloadedSize = new FileInfo(newExePath).Length;
        if (downloadedSize < 5 * 1024 * 1024)
        {
            throw new InvalidOperationException(
                $"Download dell'aggiornamento sospetto: {downloadedSize} byte (atteso almeno 5 MB).");
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
