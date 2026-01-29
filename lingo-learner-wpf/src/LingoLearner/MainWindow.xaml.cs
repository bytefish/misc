// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using CommunityToolkit.Mvvm.DependencyInjection;
using LingoLearner.Opts;
using LingoLearner.Services;
using Microsoft.Extensions.Options;
using Microsoft.Web.WebView2.Core;
using NLog;
using System.ComponentModel;
using System.IO;
using System.Text.Json;
using System.Windows;

namespace LingoLearner;

/// <summary>
/// Interaction logic for MainWindow.xaml
/// The code-behind is kept minimal, handling only View-specific tasks like printing.
/// </summary>
public partial class MainWindow : Window
{
    private static readonly ILogger _logger = LogManager.GetCurrentClassLogger();

    public MainWindow()
    {
        InitializeComponent();
        InitializeAsync();
    }

    /// <summary>
    /// Options for LingoLearner
    /// </summary>
    public AppOptions Options => Ioc.Default.GetRequiredService<IOptions<AppOptions>>().Value;

    /// <summary>
    /// Options for LingoLearner
    /// </summary>
    public IDialogService DialogService => Ioc.Default.GetRequiredService<IDialogService>();

    async void InitializeAsync()
    {
        await webView.EnsureCoreWebView2Async();

        string distPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "wwwroot");

        webView.CoreWebView2.SetVirtualHostNameToFolderMapping(
            Options.VirtualHostName, distPath, CoreWebView2HostResourceAccessKind.Allow);

        webView.CoreWebView2.Navigate($"https://{Options.VirtualHostName}/index.html");

        // Let's wait until WebView2 is ready (or hope so...)
        await webView.EnsureCoreWebView2Async();

        // Listen for "Save" commands from Angular
        webView.CoreWebView2.WebMessageReceived += OnWebMessageReceived;
    }

    // Event handler for Window.Closing (triggered by X button, Alt+F4, or Close())
    private void Window_Closing(object sender, CancelEventArgs e)
    {
        // Clean up WebView2 resources
        webView.CoreWebView2.WebMessageReceived -= OnWebMessageReceived;
    }

    private void LoadLessonsFromFolder()
    {
        try
        {
            string[] files = Directory.GetFiles(Options.LessonsPath, "*.json");

            if(files.Length == 0)
            {
                string defaultLessonsPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "wwwroot", "assets");

                files = Directory.GetFiles(defaultLessonsPath, "*.json")
                    .Where(x => !x.EndsWith("appsettings.json"))
                    .ToArray();
            }

            var allLessons = new List<object>();
            foreach (var file in files)
            {
                var content = File.ReadAllText(file).Trim();

                try
                {
                    using var doc = JsonDocument.Parse(content);

                    if (doc.RootElement.ValueKind == JsonValueKind.Array)
                    {
                        var list = JsonSerializer.Deserialize<List<object>>(content);

                        if (list != null)
                        {
                            allLessons.AddRange(list);
                        }
                    }
                    else
                    {
                        var item = JsonSerializer.Deserialize<object>(content);
                        if (item != null)
                        {
                            allLessons.Add(item);
                        }
                    }
                }
                catch(Exception e) 
                {  
                    _logger.Error(e, $"Error parsing lesson file: {file}");
                }
            }

            var message = new { type = "LOAD_LESSONS", payload = allLessons };

            string payload = JsonSerializer.Serialize(message);

            webView.CoreWebView2.PostWebMessageAsJson(payload);
        }
        catch (Exception ex)
        {
            _logger.Error(ex, "Error loading lessons from folder.");

            DialogService.ShowMessageBox(
                messageBoxCaption: "Error",
                messageBoxText: $"An error occurred while loading lessons: {ex.Message}",
                messageBoxButton: MessageBoxButton.OK,
                messageBoxImage: MessageBoxImage.Error);
        }
    }

    private void OnWebMessageReceived(object? sender, CoreWebView2WebMessageReceivedEventArgs e)
    {
        try
        {
            string json = e.WebMessageAsJson;
            using JsonDocument doc = JsonDocument.Parse(json);
            var type = doc.RootElement.GetProperty("type").GetString();

            if (type == "UI_READY")
            {
                LoadLessonsFromFolder();
            }

            if (type == "SAVE_LESSON")
            {
                JsonElement lesson = doc.RootElement.GetProperty("payload");

                string fileName = $"{Guid.NewGuid().ToString("N")}-{lesson.GetProperty("title").GetString() ?? "lesson"}.json";

                File.WriteAllText(Path.Combine(Options.LessonsPath, fileName), lesson.GetRawText());

                // Refresh the list after saving
                LoadLessonsFromFolder();
            }
        }
        catch (Exception ex)
        {
            _logger.Error(ex, "Error processing web message received from WebView2.");

            DialogService.ShowMessageBox(
                messageBoxCaption: "Error",
                messageBoxText: $"An error occurred while processing the message: {ex.Message}",
                messageBoxButton: MessageBoxButton.OK,
                messageBoxImage: MessageBoxImage.Error);
        }
    }
}