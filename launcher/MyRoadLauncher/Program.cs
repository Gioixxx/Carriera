namespace MyRoadLauncher;

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
                "My Road - L'Ascesa",
                MessageBoxButtons.OK,
                MessageBoxIcon.Error);
            return;
        }

        Application.Run(new MainForm(server));
    }
}
