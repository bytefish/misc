using CommunityToolkit.Mvvm.DependencyInjection;
using LingoLearner.ViewModels;

namespace LingoLearner;

/// <summary>
/// Locator for view models.
/// </summary>
public class ViewModelLocator
{
    /// <summary>
    /// Resolves the MainWindowViewModel.
    /// </summary>
    public MainWindowViewModel MainWindow => Ioc.Default.GetRequiredService<MainWindowViewModel>();

    /// <summary>
    /// Resolves the AboutWindowViewModel.
    /// </summary>
    public AboutWindowViewModel AboutWindow => Ioc.Default.GetRequiredService<AboutWindowViewModel>();
}