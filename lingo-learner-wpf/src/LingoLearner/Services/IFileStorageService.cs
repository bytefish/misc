// Licensed under the MIT license. See LICENSE file in the project root for full license information.

namespace LingoLearner.Services;

public interface IFileStorageService<TDocument>
        where TDocument : class, new()
{
    /// <summary>
    /// Saves the label document to the specified file path.
    /// </summary>
    /// <param name="filePath">The File Path to save the label document to</param>
    /// <param name="document">The document to save to disk</param>
    void Save(string filePath, TDocument document);

    /// <summary>
    /// Loads the label document from the specified file path.
    /// </summary>
    /// <param name="filePath">The file path to load the label document from</param>
    /// <returns>The loaded document</returns>
    TDocument? Load(string filePath);
}
