using CommunityToolkit.Mvvm.DependencyInjection;
using LingoLearner.Misc;
using LingoLearner.Opts;
using LingoLearner.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NLog;
using NLog.Extensions.Logging;
using System.IO;
using System.Windows;

namespace LingoLearner
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        /// <summary>
        /// At startup, we need to configure our IoC container and services.
        /// </summary>
        /// <param name="e">Event passed in by WPF</param>
        protected override void OnStartup(StartupEventArgs e)
        {
            // Create Configuration based on appsettings.json and environment-specific settings
            string? currentEnvironment = Environment.GetEnvironmentVariable("DOTNET_ENV");

            // Before anything, we need to setup NLog
            SetupNLog(currentEnvironment);

            // Build Configuration
            IConfigurationBuilder configurationBuilder = new ConfigurationBuilder()
                .SetBasePath(AppContext.BaseDirectory)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{currentEnvironment}.json", optional: true, reloadOnChange: true);

            // Only add User Secrets in Development environment
            if (EnvironmentUtils.IsDevelopment())
            {
                configurationBuilder.AddUserSecrets<App>(optional: true);
            }
            
            IConfigurationRoot configuration = configurationBuilder.Build();

            // Register Services to the IoC container
            Ioc.Default.ConfigureServices(
                new ServiceCollection()
                    // Add all Application Services
                    .AddApplicationServices(configuration)
                    // Build the Service Provider
                    .BuildServiceProvider());
        }

        private void Application_DispatcherUnhandledException(object sender, System.Windows.Threading.DispatcherUnhandledExceptionEventArgs e)
        {
            Ioc.Default.GetService<ILogger<App>>()?
                .LogError(e.Exception, "An unhandled exception occurred.");

            Ioc.Default.GetService<IDialogService>()?
                .ShowMessageBox(
                    messageBoxCaption: "An unexpected error occurred.", 
                    messageBoxText: e.Exception.Message,
                    messageBoxButton: MessageBoxButton.OK,
                    messageBoxImage: MessageBoxImage.Error);
        }

        /// <summary>
        /// A helper to setup NLog based on the current environment.
        /// </summary>
        /// <param name="currentEnvironment">Environment we are running in</param>
        private static void SetupNLog(string? currentEnvironment)
        {
            string nlogFileName = GetNLogFileName(currentEnvironment);

            // Configure NLog from configuration
            LogManager.Configuration = LogManager.Setup()
                .LoadConfigurationFromFile(nlogFileName, optional: false)
                .GetCurrentClassLogger()
                .Factory.Configuration;

            // Helper to safely resolve the nlog.config filename
            string GetNLogFileName(string? currentEnvironment)
            {
                string resolvedFileName = Path.Combine(AppContext.BaseDirectory, $"nlog.{currentEnvironment}.config");

                if(!File.Exists(resolvedFileName))
                {
                    return "nlog.config";
                }

                return $"nlog.{currentEnvironment}.config";
            }
        }
    }

    /// <summary>
    /// Extensions for IServiceCollection to register application services.
    /// </summary>
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Registers application services to the IServiceCollection.
        /// </summary>
        /// <param name="services">Service Collection to populate</param>
        /// <param name="configuration">Configuration to use</param>
        /// <returns>A service collection with all services registered</returns>
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Bind the JSON section to the class
            services.Configure<AppOptions>(configuration.GetSection(nameof(AppOptions)));

            // Logging
            services.AddLogging(loggingBuilder =>
            {
                loggingBuilder.ClearProviders();

                loggingBuilder.AddNLog(configuration);
            });

            // Application Services
            services.AddSingleton<IDialogService, DialogService>();
            
            return services;
        }
    }
}
