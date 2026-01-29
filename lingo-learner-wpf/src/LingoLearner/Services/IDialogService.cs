// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using System.Windows;

namespace LingoLearner.Services;

/// <summary>
/// Dialog service for showing dialogs.
/// </summary>
public interface IDialogService
{
    /// <summary>
    /// Shows a message dialog with the specified caption and message.
    /// </summary>
    /// <param name="messageBoxText">Text to show in the message box</param>
    /// <param name="messageBoxCaption">Caption for the message box</param>s
    /// <param name="messageBoxButton">Buttons to show in the message box</param>
    /// <param name="messageBoxImage">Image to show in the message box</param>
    /// <returns>The result of the message box</returns>
    MessageBoxResult ShowMessageBox(string messageBoxText, string messageBoxCaption, MessageBoxButton messageBoxButton, MessageBoxImage messageBoxImage);

    /// <summary>
    /// Shows the About Window as a modal dialog.
    /// </summary>
    void ShowAboutWindow();
}
