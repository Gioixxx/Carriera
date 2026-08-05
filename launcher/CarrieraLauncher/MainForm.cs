using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

namespace CarrieraLauncher;

internal sealed class MainForm : Form
{
    private readonly EmbeddedStaticServer _server;
    private readonly WebView2 _webView = new() { Dock = DockStyle.Fill };

    public MainForm(EmbeddedStaticServer server)
    {
        _server = server;

        Text = "Carriera";
        Width = 1280;
        Height = 860;
        StartPosition = FormStartPosition.CenterScreen;

        Controls.Add(_webView);
        Load += OnLoad;
        FormClosed += (_, _) => _server.Dispose();
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
            var environment = await CoreWebView2Environment.CreateAsync(userDataFolder: userDataFolder);

            await _webView.EnsureCoreWebView2Async(environment);
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
        }
    }
}
