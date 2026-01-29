// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using System.Windows;

namespace LingoLearner.Services;

/// <summary>
/// Simple default implementation of IDialogService.
/// </summary>
public class DialogService : IDialogService
{
    public MessageBoxResult ShowMessageBox(string messageBoxText, string messageBoxCaption, MessageBoxButton messageBoxButton, MessageBoxImage messageBoxImage)
    {
        return MessageBox.Show(
            messageBoxText: messageBoxText, 
            caption: messageBoxCaption,
            button: messageBoxButton,
            icon: MessageBoxImage.Information);
    }
}
