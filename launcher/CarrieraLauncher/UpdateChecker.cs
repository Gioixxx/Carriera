using System.Reflection;
using System.Text.Json;

namespace CarrieraLauncher;

internal sealed record UpdateInfo(Version Version, string DownloadUrl);

internal static class UpdateChecker
{
    private const string ReleasesApiUrl = "https://api.github.com/repos/Gioixxx/Carriera/releases/latest";

    public static async Task<UpdateInfo?> CheckAsync(CancellationToken ct = default)
    {
        try
        {
            using var http = new HttpClient { Timeout = TimeSpan.FromSeconds(5) };
            http.DefaultRequestHeaders.UserAgent.ParseAdd("CarrieraLauncher");

            using var response = await http.GetAsync(ReleasesApiUrl, ct);
            if (!response.IsSuccessStatusCode) return null;

            using var stream = await response.Content.ReadAsStreamAsync(ct);
            using var doc = await JsonDocument.ParseAsync(stream, cancellationToken: ct);
            var root = doc.RootElement;

            var tag = root.GetProperty("tag_name").GetString();
            if (tag is null || !Version.TryParse(tag.TrimStart('v'), out var latest)) return null;

            var current = Assembly.GetExecutingAssembly().GetName().Version ?? new Version(0, 0, 0);
            if (latest <= current) return null;

            var asset = root.GetProperty("assets").EnumerateArray()
                .FirstOrDefault(a => a.GetProperty("name").GetString() == "Carriera.exe");
            if (asset.ValueKind != JsonValueKind.Object) return null;

            var url = asset.GetProperty("browser_download_url").GetString();
            return url is null ? null : new UpdateInfo(latest, url);
        }
        catch
        {
            return null;
        }
    }
}
