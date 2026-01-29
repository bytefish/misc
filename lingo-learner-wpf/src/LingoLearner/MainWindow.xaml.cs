// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using Microsoft.Web.WebView2.Core;
using System.Collections.Specialized;
using System.ComponentModel;
using System.IO;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Input;

namespace LingoLearner;

/// <summary>
/// Interaction logic for MainWindow.xaml
/// The code-behind is kept minimal, handling only View-specific tasks like printing.
/// </summary>
public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();
        _ = InitializeAsync(); // Run 
    }

    async void InitializeAsync()
    {
        // 1. Warte auf die Initialisierung des Browsers
        await webView.EnsureCoreWebView2Async();

        // 2. Pfad zu deinem Angular 'dist' Ordner festlegen
        // Tipp: Im Debug-Modus kannst du hier den absoluten Pfad zu deinem Angular-Projekt angeben
        string distPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "wwwroot");

        // 3. Mapping: Die Webseite denkt, sie läuft auf einer echten Domain.
        // Das verhindert CORS-Probleme und kaputte Pfade.
        webView.CoreWebView2.SetVirtualHostNameToFolderMapping(
            "app.local", distPath, CoreWebView2HostResourceAccessKind.Allow);

        // 4. Jetzt die Seite laden
        webView.CoreWebView2.Navigate("https://app.local/index.html");
    }

    // Event handler for Window.Closing (triggered by X button, Alt+F4, or Close())
    private void Window_Closing(object sender, CancelEventArgs e)
    {
        // TODO
    }
}