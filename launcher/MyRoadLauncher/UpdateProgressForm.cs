namespace MyRoadLauncher;

/// <summary>
/// Finestra non modale mostrata durante il download/applicazione di un aggiornamento: prima non
/// c'era alcun feedback visivo tra il click su "Sì" e la chiusura/riapertura dell'app, e un
/// download che impiega uno o più minuti (per via dei retry automatici su rete instabile, vedi
/// UpdateInstaller) sembrava "non fare nulla". Senza pulsante di chiusura: l'utente ha già
/// confermato di voler aggiornare, annullare a metà lascerebbe un file temporaneo parziale senza
/// alcun beneficio.
/// </summary>
internal sealed class UpdateProgressForm : Form
{
    private readonly Label _status = new()
    {
        Dock = DockStyle.Top,
        Height = 56,
        TextAlign = ContentAlignment.MiddleCenter,
        Font = new Font("Segoe UI", 11f),
    };

    private readonly ProgressBar _bar = new()
    {
        Dock = DockStyle.Top,
        Height = 28,
        Minimum = 0,
        Maximum = 100,
        Style = ProgressBarStyle.Marquee,
        MarqueeAnimationSpeed = 30,
    };

    public UpdateProgressForm()
    {
        Text = "Aggiornamento My Road - L'Ascesa";
        FormBorderStyle = FormBorderStyle.FixedDialog;
        ControlBox = false;
        MinimizeBox = false;
        MaximizeBox = false;
        ShowInTaskbar = false;
        // CenterScreen invece di CenterParent: il proprietario (MainForm) è a schermo intero, ma
        // vogliamo il centro dello schermo fisico, non ricalcolato sui bound della finestra
        // proprietaria in un momento in cui potrebbe non essere ancora stabile.
        StartPosition = FormStartPosition.CenterScreen;
        Padding = new Padding(24);
        ClientSize = new Size(460, 140);
        TopMost = true;

        _status.Text = "Download aggiornamento in corso...";

        Controls.Add(_bar);
        Controls.Add(_status);
    }

    public void Report(UpdateProgress p)
    {
        if (IsDisposed) return;

        if (p.Phase == UpdatePhase.Finalizing)
        {
            _bar.Style = ProgressBarStyle.Marquee;
            _status.Text = "Applico l'aggiornamento, il gioco si riavvia tra poco...";
            return;
        }

        var attemptSuffix = p.MaxAttempts > 1 ? $" (tentativo {p.Attempt}/{p.MaxAttempts})" : string.Empty;
        if (p.TotalBytes is long total && total > 0)
        {
            var percent = (int)Math.Clamp(100.0 * p.BytesReceived / total, 0, 100);
            _bar.Style = ProgressBarStyle.Continuous;
            _bar.Value = percent;
            var mbReceived = p.BytesReceived / 1024.0 / 1024.0;
            var mbTotal = total / 1024.0 / 1024.0;
            _status.Text = $"Download aggiornamento: {percent}% ({mbReceived:0.#}/{mbTotal:0.#} MB){attemptSuffix}";
        }
        else
        {
            _bar.Style = ProgressBarStyle.Marquee;
            _status.Text = $"Download aggiornamento in corso...{attemptSuffix}";
        }
    }
}
