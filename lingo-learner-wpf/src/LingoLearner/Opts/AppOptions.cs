namespace LingoLearner.Opts;

public class AppOptions
{
    /// <summary>
    /// Lessons folder path
    /// </summary>
    public string LessonsPath { get; set; } = "Lessons";

    /// <summary>
    /// Virtual host name to map the local resources to
    /// </summary>
    public string VirtualHostName { get; set; } = "app.internal";

    /// <summary>
    /// Developer tools enabled
    /// </summary>
    public bool EnableDeveloperTools { get; set; } = false;
}
