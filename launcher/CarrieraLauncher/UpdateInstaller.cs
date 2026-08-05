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

        // Un exe self-contained single-file non può sovrascrivere se stesso mentre è in
        // esecuzione: uno script esterno aspetta la chiusura del processo (poll sul PID),
        // poi sposta il nuovo exe al posto del vecchio e lo rilancia.
        var pid = Environment.ProcessId;
        var script = $"""
            @echo off
            :wait
            tasklist /FI "PID eq {pid}" 2>NUL | find "{pid}" >NUL
            if not errorlevel 1 (
                timeout /t 1 /nobreak >NUL
                goto wait
            )
            timeout /t 1 /nobreak >NUL
            move /y "{newExePath}" "{currentExe}" >NUL
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
