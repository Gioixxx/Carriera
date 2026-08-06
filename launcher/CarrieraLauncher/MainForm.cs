using System.Reflection;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

namespace CarrieraLauncher;

internal sealed class MainForm : Form
{
    // Il caricamento da server locale è quasi istantaneo: senza un minimo forzato lo sfondo
    // sparirebbe troppo in fretta per essere visto.
    private static readonly TimeSpan MinSplashDuration = TimeSpan.FromSeconds(1.5);

    private readonly EmbeddedStaticServer _server;
    private readonly WebView2 _webView = new() { Dock = DockStyle.Fill, Visible = false };
    private readonly PictureBox _splash = new()
    {
        Dock = DockStyle.Fill,
        SizeMode = PictureBoxSizeMode.Zoom,
        BackColor = Color.Black,
    };

    public MainForm(EmbeddedStaticServer server)
    {
        _server = server;

        Text = "Carriera";
        Width = 1280;
        Height = 860;
        StartPosition = FormStartPosition.CenterScreen;
        WindowState = FormWindowState.Maximized;

        // L'icona applicativa (ApplicationIcon nel csproj) finisce già nella risorsa nativa
        // dell'exe pubblicato: estrarla da lì evita di incorporarla una seconda volta.
        try
        {
            Icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath);
        }
        catch
        {
            // Best-effort: se l'estrazione fallisce resta l'icona di default di Windows.
        }

        _splash.Image = LoadEmbeddedImage("assets/sfondo.png");

        Controls.Add(_webView);
        Controls.Add(_splash); // aggiunta per ultima: resta sopra il WebView2 finché non si nasconde
        Load += OnLoad;
        FormClosed += (_, _) => _server.Dispose();
    }

    /// <summary>
    /// Cerca la risorsa incorporata per nome logico, tollerando sia "cartella/file.ext" sia
    /// "cartella.file.ext" (il toolchain .NET normalizza il separatore in modo diverso a seconda
    /// dei casi — stesso problema già gestito in EmbeddedStaticServer per wwwroot/).
    /// </summary>
    private static Image? LoadEmbeddedImage(string logicalName)
    {
        var assembly = Assembly.GetExecutingAssembly();
        var dottedName = logicalName.Replace('/', '.');
        var resourceName = assembly.GetManifestResourceNames().FirstOrDefault(n =>
            string.Equals(n, logicalName, StringComparison.OrdinalIgnoreCase)
            || string.Equals(n, dottedName, StringComparison.OrdinalIgnoreCase));
        if (resourceName is null) return null;

        using var stream = assembly.GetManifestResourceStream(resourceName);
        return stream is null ? null : Image.FromStream(stream);
    }

    private async void OnLoad(object? sender, EventArgs e)
    {
        try
        {
            // Profilo/cache di WebView2 in %LOCALAPPDATA%, non accanto all'exe: di default
            // WebView2 crea una cartella "<exe>.WebView2" nella working directory dell'app,
            // che qui coinciderebbe con la cartella del repo git.
            var userDataFolder = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "Carriera",
                "WebView2");
            // Il browser normale richiede un gesto dell'utente prima di permettere audio con
            // autoplay: in questo host, senza il flag, la musica di sottofondo restava silenziosa
            // finché l'utente non cliccava una voce del menu. Qui non è una pagina web pubblica ma
            // il nostro stesso gioco eseguito nella sua unica finestra dedicata, quindi disabilitare
            // la policy è sicuro e intenzionale (non applicabile al browser normale dell'utente).
            var options = new CoreWebView2EnvironmentOptions
            {
                AdditionalBrowserArguments = "--autoplay-policy=no-user-gesture-required",
            };
            var environment = await CoreWebView2Environment.CreateAsync(
                options: options,
                userDataFolder: userDataFolder);

            var splashShownAt = DateTime.UtcNow;
            await _webView.EnsureCoreWebView2Async(environment);

            // Il bottone "Chiudi" del menu principale chiama window.close() lato JS: nei browser
            // normali viene ignorato (nessun window.open() da script), ma WebView2 espone questo
            // evento apposta per lasciare all'host la decisione — qui coincide con chiudere la
            // finestra dell'app.
            _webView.CoreWebView2.WindowCloseRequested += (_, _) => Close();
            // Lo sfondo resta visibile finché la pagina non ha finito di caricare, con un minimo
            // forzato (MinSplashDuration) perché il caricamento da server locale è troppo rapido
            // per farlo notare altrimenti; poi lascia spazio al gioco vero e proprio.
            _webView.CoreWebView2.NavigationCompleted += async (_, _) =>
            {
                var elapsed = DateTime.UtcNow - splashShownAt;
                var remaining = MinSplashDuration - elapsed;
                if (remaining > TimeSpan.Zero) await Task.Delay(remaining);

                _webView.Visible = true;
                _splash.Visible = false;
            };
            _webView.CoreWebView2.Navigate($"http://127.0.0.1:{_server.Port}/index.html");
        }
        catch (Exception ex)
        {
            MessageBox.Show(
                "WebView2 Runtime non trovato o non avviabile. Su Windows 11 è incluso di serie; "
                    + "su Windows 10 installalo da https://developer.microsoft.com/microsoft-edge/webview2/ "
                    + $"e riprova.\n\nDettagli: {ex.Message}",
                "Carriera",
                MessageBoxButtons.OK,
                MessageBoxIcon.Error);
            Close();
            return;
        }

        _ = CheckForUpdatesAsync();
    }

    private async Task CheckForUpdatesAsync()
    {
        try
        {
            var update = await UpdateChecker.CheckAsync();
            if (update is null) return;

            var result = MessageBox.Show(
                $"È disponibile una nuova versione di Carriera ({update.Version}). Aggiornare ora?",
                "Aggiornamento disponibile",
                MessageBoxButtons.YesNo,
                MessageBoxIcon.Information);

            if (result == DialogResult.Yes)
            {
                // Prima di questo fix non c'era alcun feedback tra il click su "Sì" e la
                // chiusura/riapertura dell'app: con i retry automatici (vedi UpdateInstaller) il
                // download può richiedere anche un paio di minuti su rete instabile, e sembrava
                // che l'aggiornamento "non facesse nulla". Il form si chiude da solo insieme al
                // resto dell'app quando l'update ha successo (Application.Exit() dentro
                // UpdateInstaller), altrimenti viene chiuso esplicitamente nel catch sotto.
                // MainForm viene disabilitato per la durata dell'update: senza questo, il menu
                // sotto (WebView2) resta cliccabile mentre il file in uso sta per essere
                // sostituito da sotto i piedi dell'utente.
                using var progressForm = new UpdateProgressForm();
                Enabled = false;
                progressForm.Show(this);
                var progress = new Progress<UpdateProgress>(progressForm.Report);
                try
                {
                    await UpdateInstaller.DownloadAndApplyAsync(update, progress);
                }
                catch (Exception ex)
                {
                    progressForm.Close();
                    // A differenza del controllo di versione (silenzioso, best-effort: non deve
                    // mai impedire di giocare), qui l'utente ha esplicitamente chiesto di
                    // aggiornare — un fallimento del download va segnalato, altrimenti sembra che
                    // l'aggiornamento non abbia fatto nulla senza lasciare alcuna traccia.
                    MessageBox.Show(
                        "Download dell'aggiornamento non riuscito nonostante alcuni tentativi automatici, "
                            + "la versione attuale resta invariata. Riprova più tardi: potrebbe essere una "
                            + "connessione instabile.\n\nDettagli: "
                            + $"{ex.Message}\n\nLog completo in %TEMP%\\CarrieraUpdate\\update-log.txt",
                        "Aggiornamento non riuscito",
                        MessageBoxButtons.OK,
                        MessageBoxIcon.Warning);
                }
                finally
                {
                    // Se l'update ha successo il processo esce del tutto (Application.Exit()
                    // dentro UpdateInstaller) prima di arrivare qui, quindi questo riguarda solo
                    // il percorso di fallimento — ma va comunque in "finally" per sicurezza, non
                    // solo nel catch, in caso l'eccezione venga rilanciata o il flusso cambi.
                    Enabled = true;
                }
            }
        }
        catch
        {
            // Best-effort: un controllo aggiornamenti fallito (rete assente, rate limit
            // GitHub, ecc.) non deve mai impedire di giocare.
        }
    }
}
