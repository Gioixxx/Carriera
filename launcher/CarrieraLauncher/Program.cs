namespace CarrieraLauncher;

internal static class Program
{
    [STAThread]
    private static void Main()
    {
        ApplicationConfiguration.Initialize();

        var server = new EmbeddedStaticServer();
        try
        {
            server.Start();
        }
        catch (Exception ex)
        {
            MessageBox.Show(
                $"Impossibile avviare il server locale del gioco:\n{ex.Message}",
                "Carriera",
                MessageBoxButtons.OK,
                MessageBoxIcon.Error);
            return;
        }

        Application.Run(new MainForm(server));
    }
}
