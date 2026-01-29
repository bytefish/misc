// Licensed under the MIT license. See LICENSE file in the project root for full license information.

namespace LingoLearner.Misc;

/// <summary>
/// Environment-related utility methods.
/// </summary>
public static class EnvironmentUtils
{
    /// <summary>
    /// Checks if the current environment matches the specified environment name.
    /// </summary>
    /// <param name="environmentName">Environment to check</param>
    /// <returns>true, if the environment matches; else false</returns>
    public static bool IsEnvironment(string environmentName)
    {
        string? dotnetEnvironment = Environment.GetEnvironmentVariable("DOTNET_ENVIRONMENT");

        if (dotnetEnvironment == null)
        {
            return false;
        }

        return string.Equals(dotnetEnvironment, environmentName, StringComparison.OrdinalIgnoreCase);
    }

    /// <summary>
    /// Checks if the current environment is Development.
    /// </summary>
    /// <returns>true, if the environment is Development; else false</returns>
    public static bool IsDevelopment()
    {
        return IsEnvironment("Development");
    }

    /// <summary>
    /// Checks if the current environment is Production.
    /// </summary>
    /// <returns>true, if the environment is Production; else false</returns>
    public static bool IsProduction()
    {
        return IsEnvironment("Production");
    }
}
