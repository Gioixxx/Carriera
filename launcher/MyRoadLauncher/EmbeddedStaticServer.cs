using System.Net;
using System.Net.Sockets;
using System.Reflection;

namespace MyRoadLauncher;

/// <summary>
/// Serve l'export statico del gioco (incorporato come embedded resource nell'assembly)
/// via HTTP su loopback. Necessario perché il caricamento diretto da file:// rompe il
/// routing dei chunk JS di Next.js; un server locale replica invece un hosting statico
/// normale senza bisogno di installare nulla sulla macchina di destinazione.
/// </summary>
internal sealed class EmbeddedStaticServer : IDisposable
{
    private static readonly Dictionary<string, string> ContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        [".html"] = "text/html; charset=utf-8",
        [".js"] = "text/javascript; charset=utf-8",
        [".css"] = "text/css; charset=utf-8",
        [".json"] = "application/json; charset=utf-8",
        [".txt"] = "text/plain; charset=utf-8",
        [".ico"] = "image/x-icon",
        [".svg"] = "image/svg+xml",
        [".png"] = "image/png",
        [".woff2"] = "font/woff2",
    };

    private readonly HttpListener _listener;
    private readonly Assembly _assembly;
    private readonly Dictionary<string, string> _resourcesByPath;
    private readonly CancellationTokenSource _cts = new();

    public int Port { get; }

    public EmbeddedStaticServer()
    {
        _assembly = Assembly.GetExecutingAssembly();
        _resourcesByPath = _assembly.GetManifestResourceNames()
            .Where(name => name.StartsWith("wwwroot/", StringComparison.Ordinal)
                || name.StartsWith("wwwroot.", StringComparison.Ordinal))
            .ToDictionary(NormalizeResourceName, name => name, StringComparer.OrdinalIgnoreCase);

        Port = GetFreeLoopbackPort();
        _listener = new HttpListener();
        _listener.Prefixes.Add($"http://127.0.0.1:{Port}/");
    }

    // csproj LogicalName può produrre "wwwroot/percorso/file.ext" (RecursiveDir con "/")
    // oppure, a seconda del toolchain, "wwwroot.percorso.file.ext" — normalizziamo entrambi
    // nella stessa chiave "/percorso/file.ext" usata per il lookup dalle richieste HTTP.
    private static string NormalizeResourceName(string resourceName)
    {
        var withoutPrefix = resourceName.StartsWith("wwwroot/", StringComparison.Ordinal)
            ? resourceName["wwwroot/".Length..]
            : resourceName.StartsWith("wwwroot.", StringComparison.Ordinal)
                ? resourceName["wwwroot.".Length..]
                : resourceName;

        return "/" + withoutPrefix.Replace('\\', '/');
    }

    private static int GetFreeLoopbackPort()
    {
        var tcpListener = new TcpListener(IPAddress.Loopback, 0);
        tcpListener.Start();
        var port = ((IPEndPoint)tcpListener.LocalEndpoint).Port;
        tcpListener.Stop();
        return port;
    }

    public void Start()
    {
        _listener.Start();
        _ = Task.Run(() => AcceptLoopAsync(_cts.Token));
    }

    private async Task AcceptLoopAsync(CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested && _listener.IsListening)
        {
            HttpListenerContext context;
            try
            {
                context = await _listener.GetContextAsync().ConfigureAwait(false);
            }
            catch (Exception) when (cancellationToken.IsCancellationRequested || !_listener.IsListening)
            {
                return;
            }

            _ = Task.Run(() => HandleRequest(context), cancellationToken);
        }
    }

    private void HandleRequest(HttpListenerContext context)
    {
        try
        {
            var path = context.Request.Url?.AbsolutePath ?? "/";
            if (path == "/") path = "/index.html";

            if (!_resourcesByPath.TryGetValue(path, out var resourceName))
            {
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                context.Response.Close();
                return;
            }

            var extension = Path.GetExtension(path);
            context.Response.ContentType = ContentTypes.GetValueOrDefault(extension, "application/octet-stream");

            using var resourceStream = _assembly.GetManifestResourceStream(resourceName)
                ?? throw new InvalidOperationException($"Risorsa mancante: {resourceName}");
            context.Response.ContentLength64 = resourceStream.Length;
            resourceStream.CopyTo(context.Response.OutputStream);
            context.Response.Close();
        }
        catch (Exception)
        {
            try
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.Close();
            }
            catch
            {
                // La risposta potrebbe essere già stata chiusa dal client — nulla da fare.
            }
        }
    }

    public void Dispose()
    {
        _cts.Cancel();
        _listener.Stop();
        _listener.Close();
        _cts.Dispose();
    }
}
