// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using Microsoft.Extensions.Logging;
using System.IO;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace LingoLearner.Services;

/// <summary>
/// The service responsible for saving and loading documents to and from JSON files.
/// </summary>
public class JsonFileStorageService<TDocument> : IFileStorageService<TDocument>
    where TDocument : class, new()
{
    /// <summary>
    /// Logger instance for logging operations.
    /// </summary>
    private readonly ILogger<TDocument> _logger;
    
    /// <summary>
    /// JSON serialization options
    /// </summary>
    private readonly JsonSerializerOptions _jsonOptions;

    /// <summary>
    /// Creates a new instance of the JsonFileStorageService.
    /// </summary>
    public JsonFileStorageService(ILogger<TDocument> logger, JsonSerializerOptions? jsonSerializerOptions = null)
    {
        _logger = logger;
        _jsonOptions = jsonSerializerOptions ?? new JsonSerializerOptions
        {
            WriteIndented = true,
            Converters = { new JsonStringEnumConverter() }
        };
    }

    /// <inheritdoc/>
    public void Save(string filePath, TDocument document)
    {
        _logger.LogInformation("Saving document to {FilePath}", filePath);

        string jsonString = JsonSerializer.Serialize(document);

        File.WriteAllText(filePath, jsonString);
    }

    /// <inheritdoc/>
    public TDocument? Load(string filePath)
    {
        _logger.LogInformation("Loading document from {FilePath}", filePath);

        if (!File.Exists(filePath))
        {
            _logger.LogWarning("File {FilePath} does not exist. Returning default document.", filePath);

            return null;
        }

        string jsonString = File.ReadAllText(filePath);

        return JsonSerializer.Deserialize<TDocument>(jsonString, _jsonOptions); ;
    }
}